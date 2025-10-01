<?php

declare(strict_types=1);

namespace Laravel\Breeze\Exceptions;

use RuntimeException;

class BreezeException extends RuntimeException
{
    public static function invalidStack(string $stack): self
    {
        return new self(
            "Invalid stack '$stack'. Supported stacks are: blade, livewire, livewire-functional, react, vue, api"
        );
    }

    public static function fileNotFound(string $path): self
    {
        return new self("File not found: $path");
    }

    public static function directoryNotFound(string $path): self
    {
        return new self("Directory not found: $path");
    }

    public static function invalidJson(string $file, string $error): self
    {
        return new self("Invalid JSON in $file: $error");
    }

    public static function pathTraversalDetected(string $path): self
    {
        return new self(
            "Path traversal detected. File must be within project directory: $path"
        );
    }

    public static function commandFailed(string $command, string $error): self
    {
        return new self("Command failed: $command\nError: $error");
    }

    public static function packageInstallationFailed(array $packages): self
    {
        $packageList = implode(', ', $packages);
        return new self("Failed to install packages: $packageList");
    }

    public static function unsupportedFeature(string $feature, string $stack): self
    {
        return new self("Feature '$feature' is not supported for '$stack' stack");
    }
}

// Specific exception types for better error handling

class InvalidStackException extends BreezeException
{
    //
}

class FileOperationException extends BreezeException
{
    //
}

class PackageInstallationException extends BreezeException
{
    //
}

class InvalidConfigurationException extends BreezeException
{
    //
}
