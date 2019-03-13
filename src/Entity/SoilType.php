<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\SoilTypeRepository")
 */
class SoilType
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $soilType;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getSoilType(): ?string
    {
        return $this->soilType;
    }

    public function setSoilType(string $soilType): self
    {
        $this->soilType = $soilType;

        return $this;
    }
}
