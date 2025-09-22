<?php

declare(strict_types=1);

namespace App\Entity;

interface LocalisableInterface
{
    public function __toString();

    public function setLocale(string $locale): void;

    public function getLocale(): string;
}
