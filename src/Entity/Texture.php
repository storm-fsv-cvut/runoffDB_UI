<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Dtc\GridBundle\Annotation as Grid;

/**
 * @Grid\Grid(actions={@Grid\ShowAction(), @Grid\DeleteAction()})
 * @ORM\Entity(repositoryClass="App\Repository\TextureRepository")
 */
class Texture implements DefinitionEntityInterface
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

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\TextureData", mappedBy="texture")
     */
    private $textureData;

    public function __construct()
    {
        $this->textureData = new ArrayCollection();
    }

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

    public function getLabel(): string {
        return $this->textureRecord;
    }

    /**
     * @return Collection|TextureData[]
     */
    public function getTextureData(): Collection
    {
        return $this->textureData;
    }

    public function addTextureData(TextureData $textureData): self
    {
        if (!$this->textureData->contains($textureData)) {
            $this->textureData[] = $textureData;
            $textureData->setTexture($this);
        }

        return $this;
    }

    public function removeTextureData(TextureData $textureData): self
    {
        if ($this->textureData->contains($textureData)) {
            $this->textureData->removeElement($textureData);
            // set the owning side to null (unless already changed)
            if ($textureData->getTexture() === $this) {
                $textureData->setTexture(null);
            }
        }

        return $this;
    }
}
