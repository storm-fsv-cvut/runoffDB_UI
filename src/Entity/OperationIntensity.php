<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\OperationIntensityRepository")
 */
class OperationIntensity implements DefinitionEntityInterface {
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $descriptionCZ;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $descriptionEN;

    public function __toString() {
        return $this->getDescriptionCZ();
    }

    public function getId(): ?int {
        return $this->id;
    }

    public function getDescriptionCZ(): ?string {
        return $this->descriptionCZ;
    }

    public function setDescriptionCZ(?string $descriptionCZ): self {
        $this->descriptionCZ = $descriptionCZ;

        return $this;
    }

    public function getDescriptionEN(): ?string {
        return $this->descriptionEN;
    }

    public function setDescriptionEN(?string $descriptionEN): self {
        $this->descriptionEN = $descriptionEN;

        return $this;
    }

    public function getLabel(): string {
        return $this->descriptionCZ;
    }
}
