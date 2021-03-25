<?php


namespace App\Entity;


interface LocalisableInterface {
    public function setLocale(string $locale): void;
    public function getLocale(): string;
    public function __toString();
}
