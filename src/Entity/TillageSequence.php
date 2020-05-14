<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
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
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Agrotechnology", inversedBy="tillageSequences")
     * @ORM\JoinColumn(nullable=false)
     */
    private $agrotechnology;

    /**
     * @ORM\Column(type="date")
     */
    private $date;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Operation")
     * @ORM\JoinColumn(nullable=false)
     */
    private $operation;

    public function getId(): ?int
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

    public function getDate(): ?\DateTimeInterface
    {
        return $this->date;
    }

    public function setDate(?\DateTimeInterface $date): self
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
