<?php


namespace App\Entity;


interface LocalisableInterface {
    public function setLocale(string $locale);
    public function getLocale();
}
