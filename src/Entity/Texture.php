<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\TextureRepository")
 */
class Texture
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="date")
     */
    private $dateProcessed;

    /**
     * @ORM\Column(type="string", length=50)
     */
    private $classKA4;

    /**
     * @ORM\Column(type="string", length=50)
     */
    private $classWRB;

    /**
     * @ORM\Column(type="string", length=50)
     */
    private $classNovak;

    /**
     * @ORM\Column(type="string", length=50)
     */
    private $textureRecord;

    /**
     * @ORM\Column(type="string", length=500, nullable=true)
     */
    private $note;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDateProcessed(): ?\DateTimeInterface
    {
        return $this->dateProcessed;
    }

    public function setDateProcessed(\DateTimeInterface $dateProcessed): self
    {
        $this->dateProcessed = $dateProcessed;

        return $this;
    }

    public function getClassKA4(): ?string
    {
        return $this->classKA4;
    }

    public function setClassKA4(string $classKA4): self
    {
        $this->classKA4 = $classKA4;

        return $this;
    }

    public function getClassWRB(): ?string
    {
        return $this->classWRB;
    }

    public function setClassWRB(string $classWRB): self
    {
        $this->classWRB = $classWRB;

        return $this;
    }

    public function getClassNovak(): ?string
    {
        return $this->classNovak;
    }

    public function setClassNovak(string $classNovak): self
    {
        $this->classNovak = $classNovak;

        return $this;
    }

    public function getTextureRecord(): ?string
    {
        return $this->textureRecord;
    }

    public function setTextureRecord(string $textureRecord): self
    {
        $this->textureRecord = $textureRecord;

        return $this;
    }

    public function getNote(): ?string
    {
        return $this->note;
    }

    public function setNote(?string $note): self
    {
        $this->note = $note;

        return $this;
    }
}
