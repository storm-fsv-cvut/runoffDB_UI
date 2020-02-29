<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
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
     * @ORM\OneToMany(targetEntity="App\Entity\TextureData", mappedBy="texture")
     */
    private $textureData;

    /**
     * @ORM\Column(type="string", length=512, nullable=true)
     */
    private $descriptionCZ;

    /**
     * @ORM\Column(type="string", length=512, nullable=true)
     */
    private $descriptionEN;

    public function __toString() {
        return $this->getDescriptionCZ()."";
    }

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

    public function getDescriptionCZ(): ?string
    {
        return $this->descriptionCZ;
    }

    public function setDescriptionCZ(?string $descriptionCZ): self
    {
        $this->descriptionCZ = $descriptionCZ;

        return $this;
    }

    public function getDescriptionEN(): ?string
    {
        return $this->descriptionEN;
    }

    public function setDescriptionEN(?string $descriptionEN): self
    {
        $this->descriptionEN = $descriptionEN;

        return $this;
    }
}
