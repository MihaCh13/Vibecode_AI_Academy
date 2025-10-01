<?php

declare(strict_types=1);

namespace Laravel\Breeze\Services;

use Illuminate\Filesystem\Filesystem;
use Illuminate\Support\Facades\File;

final class NodePackageService
{
    private const LOCK_FILES = [
        'pnpm-lock.yaml',
        'yarn.lock',
        'bun.lock',
        'bun.lockb',
        'deno.lock',
        'package-lock.json',
    ];

    private readonly string $packageJsonPath;

    public function __construct()
    {
        $this->packageJsonPath = base_path('package.json');
    }

    public function updatePackages(callable $callback, bool $dev = true): void
    {
        if (!$this->exists()) {
            return;
        }

        $configKey = $dev ? 'devDependencies' : 'dependencies';
        $packageJson = $this->read();

        $packageJson[$configKey] = $callback(
            $packageJson[$configKey] ?? [],
            $configKey
        );

        ksort($packageJson[$configKey]);

        $this->write($packageJson);
    }

    public function updateScripts(callable $callback): void
    {
        if (!$this->exists()) {
            return;
        }

        $packageJson = $this->read();

        $packageJson['scripts'] = $callback(
            $packageJson['scripts'] ?? []
        );

        $this->write($packageJson);
    }

    public function flushModules(): void
    {
        $filesystem = new Filesystem();

        // Delete node_modules
        $nodeModules = base_path('node_modules');
        if (File::isDirectory($nodeModules)) {
            $filesystem->deleteDirectory($nodeModules);
        }

        // Delete lock files
        foreach (self::LOCK_FILES as $lockFile) {
            $path = base_path($lockFile);
            if (File::exists($path)) {
                $filesystem->delete($path);
            }
        }
    }

    public function detectPackageManager(): string
    {
        return match (true) {
            File::exists(base_path('pnpm-lock.yaml')) => 'pnpm',
            File::exists(base_path('yarn.lock')) => 'yarn',
            File::exists(base_path('bun.lock')), 
            File::exists(base_path('bun.lockb')) => 'bun',
            File::exists(base_path('deno.lock')) => 'deno',
            default => 'npm',
        };
    }

    public function getInstallCommand(): string
    {
        $manager = $this->detectPackageManager();

        return match ($manager) {
            'deno' => 'deno install',
            default => "$manager install",
        };
    }

    public function getBuildCommand(): string
    {
        $manager = $this->detectPackageManager();

        return match ($manager) {
            'deno' => 'deno task build',
            default => "$manager run build",
        };
    }

    public function addPackage(string $package, string $version, bool $dev = true): void
    {
        $this->updatePackages(
            function (array $packages) use ($package, $version) {
                $packages[$package] = $version;
                return $packages;
            },
            $dev
        );
    }

    public function removePackage(string $package, bool $dev = true): void
    {
        $this->updatePackages(
            function (array $packages) use ($package) {
                unset($packages[$package]);
                return $packages;
            },
            $dev
        );
    }

    public function hasPackage(string $package): bool
    {
        if (!$this->exists()) {
            return false;
        }

        $packageJson = $this->read();

        return isset($packageJson['dependencies'][$package])
            || isset($packageJson['devDependencies'][$package]);
    }

    private function exists(): bool
    {
        return File::exists($this->packageJsonPath);
    }

    private function read(): array
    {
        $content = File::get($this->packageJsonPath);
        $decoded = json_decode($content, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new \RuntimeException(
                'Invalid package.json: ' . json_last_error_msg()
            );
        }

        return $decoded;
    }

    private function write(array $data): void
    {
        $json = json_encode($data, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
        File::put($this->packageJsonPath, $json . PHP_EOL);
    }

    public function getPackages(bool $dev = true): array
    {
        if (!$this->exists()) {
            return [];
        }

        $packageJson = $this->read();
        $key = $dev ? 'devDependencies' : 'dependencies';

        return $packageJson[$key] ?? [];
    }
}