<?php

declare(strict_types=1);

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\OperationIntensityRepository")
 */
class OperationIntensity extends BaseEntity implements DefinitionEntityInterface
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private int $id;

    /** @ORM\Column(type="string", length=255) */
    private string $descriptionCZ;

    /** @ORM\Column(type="string", length=255) */
    private string $descriptionEN;

    public function __construct()
    {
    }

    public function __toString(): string
    {
        return $this->getDescription() ?? '#' . $this->getId();
    }

    public function getDescription(): ?string
    {
        return $this->getLocale() === 'en' ? $this->getDescriptionEN() : $this->getDescriptionCZ();
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getDescriptionCZ(): string
    {
        return $this->descriptionCZ;
    }

    public function setDescriptionCZ(string $descriptionCZ): self
    {
        $this->descriptionCZ = $descriptionCZ;

        return $this;
    }

    public function getDescriptionEN(): string
    {
        return $this->descriptionEN;
    }

    public function setDescriptionEN(string $descriptionEN): self
    {
        $this->descriptionEN = $descriptionEN;

        return $this;
    }

    public function getLabel(): string
    {
        return $this->descriptionCZ;
    }
}
