<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use DateTimeInterface;

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
    private int $id;

    /**
     * @ORM\Column(type="time", nullable=true)
     */
    private ?DateTimeInterface $time;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private string $value;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Record", inversedBy="datas")
     * @ORM\JoinColumn(nullable=false, referencedColumnName="id", onDelete="CASCADE")
     */
    private Record $record;

    /**
     * @ORM\Column(type="float", nullable=true)
     */
    private ?float $relatedValueX;

    /**
     * @ORM\Column(type="float", nullable=true)
     */
    private ?float $relatedValueY;

    /**
     * @ORM\Column(type="float", nullable=true)
     */
    private ?float $relatedValueZ;

    public function __construct() {
        $this->time = null;
        $this->relatedValueX = null;
        $this->relatedValueY = null;
        $this->relatedValueZ = null;
    }


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
        return $this->getTime()!==null ? $this->getTime()->format("H:i:s") : " - ";
    }

    public function setTime(?DateTimeInterface $time): self
    {
        $this->time = $time;

        return $this;
    }

    public function getValue(): ?string
    {
        return $this->value;
    }

    public function getValueRounded(): string
    {
        return number_format( (float) $this->value, $this->getRecord()->getUnit()!==null ? $this->getRecord()->getUnit()->getDecimals() : 10, ".", "" );
    }

    public function setValue(string $value): self
    {
        $this->value = $value;
        return $this;
    }

    public function getRecord(): Record
    {
        return $this->record;
    }

    public function setRecord(Record $record): self
    {
        $this->record = $record;
        return $this;
    }

    public function getRelatedValueX(): ?float
    {
        return $this->relatedValueX;
    }

    public function getRelatedValueXRounded(): string
    {
        return number_format( (float) $this->relatedValueX, $this->getRecord()->getRelatedValueXUnit()!==null ? $this->getRecord()->getRelatedValueXUnit()->getDecimals() : 10, ".", "" );
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

    public function getRelatedValueYRounded(): string
    {
        return number_format( (float) $this->relatedValueY,  $this->getRecord()->getRelatedValueYUnit()!==null ? $this->getRecord()->getRelatedValueYUnit()->getDecimals() : 10, ".", "" );
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

    public function getRelatedValueZRounded(): string
    {
        return number_format( (float) $this->relatedValueZ,  $this->getRecord()->getRelatedValueZUnit()!==null ? $this->getRecord()->getRelatedValueZUnit()->getDecimals() : 10, ".", "" );
    }

    public function setRelatedValueZ(?float $relatedValueZ): self
    {
        $this->relatedValueZ = $relatedValueZ;

        return $this;
    }
}
