<?php

declare(strict_types=1);

namespace App\Entity;

abstract class BaseEntity implements LocalisableInterface
{
    /** @var string */
    protected string $locale;

    /**
     * @param string $locale
     */
    public function setLocale(string $locale): void
    {
        $this->locale = $locale;
    }

    /**
     * @return string
     */
    public function getLocale(): string
    {
        return $this->locale ?? 'cs';
    }
}
