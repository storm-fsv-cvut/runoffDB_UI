<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\DataRepository")
 */
class Data extends BaseEntity
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="time", nullable=true)
     */
    private $time;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $value;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Record", inversedBy="datas")
     * @ORM\JoinColumn(nullable=true, referencedColumnName="id", onDelete="CASCADE")
     */
    private $record;

    /**
     * @ORM\Column(type="float", nullable=true)
     */
    private $relatedValueX;

    /**
     * @ORM\Column(type="float", nullable=true)
     */
    private $relatedValueY;

    /**
     * @ORM\Column(type="float", nullable=true)
     */
    private $relatedValueZ;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTime(): ?\DateTimeInterface
    {
        return $this->time;
    }

    public function getFormatedTime(): string
    {
        return $this->time ? $this->getTime()->format("H:i:s") : " - ";
    }

    public function setTime(?\DateTimeInterface $time): self
    {
        $this->time = $time;

        return $this;
    }

    public function getValue(): ?string
    {
        return $this->value;
    }

    public function getValueRounded(): ?string
    {
        return number_format( $this->value,   $this->getRecord()->getUnit()->getDecimals(), ".", "" );
    }

    public function setValue(string $value): self
    {
        $this->value = $value;
        return $this;
    }

    public function getRecord(): ?Record
    {
        return $this->record;
    }

    public function setRecord(?Record $record): self
    {
        $this->record = $record;
        return $this;
    }

    public function getRelatedValueX(): ?float
    {
        return $this->relatedValueX;
    }

    public function getRelatedValueXRounded(): ?float
    {
        return number_format( $this->relatedValueX, $this->getRecord()->getRelatedValueXUnit()->getDecimals(), ".", "" );
    }

    public function setRelatedValueX(?float $relatedValueX): self
    {
        $this->relatedValueX = $relatedValueX;

        return $this;
    }

    public function getRelatedValueY(): ?float
    {
        return $this->relatedValueY;
    }

    public function getRelatedValueYRounded(): ?float
    {
        return number_format( $this->relatedValueY,  $this->getRecord()->getRelatedValueYUnit()->getDecimals(), ".", "" );
    }

    public function setRelatedValueY(?float $relatedValueY): self
    {
        $this->relatedValueY = $relatedValueY;

        return $this;
    }

    public function getRelatedValueZ(): ?float
    {
        return $this->relatedValueZ;
    }

    public function getRelatedValueZRounded(): ?float
    {
        return number_format( $this->relatedValueZ,  $this->getRecord()->getRelatedValueZUnit()->getDecimals(), ".", "" );
    }

    public function setRelatedValueZ(?float $relatedValueZ): self
    {
        $this->relatedValueZ = $relatedValueZ;

        return $this;
    }
}
