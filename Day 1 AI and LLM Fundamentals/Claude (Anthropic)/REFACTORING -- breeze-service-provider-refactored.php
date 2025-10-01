<?php

declare(strict_types=1);

namespace Laravel\Breeze;

use Illuminate\Contracts\Support\DeferrableProvider;
use Illuminate\Filesystem\Filesystem;
use Illuminate\Support\ServiceProvider;
use Laravel\Breeze\Console\InstallCommand;
use Laravel\Breeze\Services\{
    ComposerService,
    FileOperationService,
    MiddlewareInstaller,
    NodePackageService,
    TestInstaller
};

final class BreezeServiceProvider extends ServiceProvider implements DeferrableProvider
{
    private const SERVICES = [
        ComposerService::class,
        FileOperationService::class,
        MiddlewareInstaller::class,
        NodePackageService::class,
        TestInstaller::class,
    ];

    public function register(): void
    {
        $this->registerServices();
    }

    public function boot(): void
    {
        if (!$this->app->runningInConsole()) {
            return;
        }

        $this->commands([
            InstallCommand::class,
        ]);
    }

    private function registerServices(): void
    {
        // Register Filesystem as singleton
        $this->app->singleton(Filesystem::class);

        // Register all Breeze services
        foreach (self::SERVICES as $service) {
            $this->app->singleton($service);
        }

        // Register ComposerService with composer path from config if needed
        $this->app->when(ComposerService::class)
            ->needs('$composerPath')
            ->giveConfig('breeze.composer_path', 'global');
    }

    public function provides(): array
    {
        return array_merge(
            [InstallCommand::class],
            self::SERVICES
        );
    }
}
