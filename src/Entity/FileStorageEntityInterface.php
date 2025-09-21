<?php

declare(strict_types=1);

namespace App\Entity;

interface FileStorageEntityInterface
{
    public function getId(): int;

    public function getFiles(): array;

    public function removeFile(string $filename): void;

    public function getFilesPath(): string;
}
