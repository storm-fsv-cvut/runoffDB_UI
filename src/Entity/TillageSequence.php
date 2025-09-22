<?php

declare(strict_types=1);

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\TillageSequenceRepository")
 */
class TillageSequence extends BaseEntity
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private int $id;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Agrotechnology", inversedBy="tillageSequences")
     * @ORM\JoinColumn(nullable=true, referencedColumnName="id", onDelete="SET NULL")
     */
    private ?Agrotechnology $agrotechnology;

    /** @ORM\Column(type="date") */
    private \DateTimeInterface $date;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Operation")
     * @ORM\JoinColumn(nullable=true, referencedColumnName="id", onDelete="SET NULL")
     */
    private ?Operation $operation;

    public function __construct()
    {
        $this->agrotechnology = null;
        $this->operation = null;
    }

    public function __toString(): string
    {
        return (string) $this->getId();
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getAgrotechnology(): ?Agrotechnology
    {
        return $this->agrotechnology;
    }

    public function setAgrotechnology(?Agrotechnology $agrotechnology): self
    {
        $this->agrotechnology = $agrotechnology;

        return $this;
    }

    public function getDate(): \DateTimeInterface
    {
        return $this->date;
    }

    public function setDate(\DateTimeInterface $date): self
    {
        $this->date = $date;

        return $this;
    }

    public function getOperation(): ?Operation
    {
        return $this->operation;
    }

    public function setOperation(?Operation $operation): self
    {
        $this->operation = $operation;

        return $this;
    }
}
