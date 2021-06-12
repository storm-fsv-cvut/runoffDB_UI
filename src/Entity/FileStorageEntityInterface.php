<?php


namespace App\Entity;


interface FileStorageEntityInterface
{
    public function getFiles(): array;

    public function removeFile(string $filename): void;

    public function getFilesPath(): string;
}
