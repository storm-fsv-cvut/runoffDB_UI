<?php

declare(strict_types=1);

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\CroperTypeRepository")
 */
class CropErType extends BaseEntity implements DefinitionEntityInterface
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private int $id;

    /** @ORM\Column(type="string", length=255, nullable=true) */
    private ?string $nameCZ;

    /** @ORM\Column(type="string", length=255, nullable=true) */
    private ?string $nameEN;

    public function __construct()
    {
        $this->nameCZ = null;
        $this->nameEN = null;
    }

    public function __toString(): string
    {
        return $this->getName() ?? '#' . $this->getId();
    }

    public function getName(): ?string
    {
        return $this->getLocale() === 'en' ? $this->getNameEN() : $this->getNameCZ();
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getNameEN(): ?string
    {
        return $this->nameEN;
    }

    public function setNameEN(?string $nameEN): self
    {
        $this->nameEN = $nameEN;

        return $this;
    }

    public function getNameCZ(): ?string
    {
        return $this->nameCZ;
    }

    public function setNameCZ(?string $nameCZ): self
    {
        $this->nameCZ = $nameCZ;

        return $this;
    }
}
