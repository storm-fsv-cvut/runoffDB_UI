<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\TextureRepository")
 */
class Texture extends BaseEntity implements DefinitionEntityInterface
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
     * @ORM\OneToMany(targetEntity="App\Entity\TextureData", mappedBy="texture", cascade={"persist","remove"}, orphanRemoval=true)
     */
    private $textureDatas;

    /**
     * @ORM\Column(type="string", length=512, nullable=true)
     */
    private $descriptionCZ;

    /**
     * @ORM\Column(type="string", length=512, nullable=true)
     */
    private $descriptionEN;

    public function __toString() {
        return "#".$this->getId()." ".$this->getDescriptionCZ()."";
    }

    public function getDescription():string {
        return $this->getLocale() == 'en' ? $this->getDescriptionEN() : $this->getDescriptionCZ();
    }

    public function __construct()
    {
        $this->textureDatas = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDateProcessed(): ?\DateTimeInterface
    {
        return $this->dateProcessed;
    }

    public function setDateProcessed(?\DateTimeInterface $dateProcessed): self
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
    public function getTextureDatas(): Collection
    {
        return $this->textureDatas;
    }

    public function addTextureData(TextureData $textureData): self
    {
        if (!$this->textureDatas->contains($textureData)) {
            $textureData->setTexture($this);
            $this->textureDatas[] = $textureData;
        }

        return $this;
    }

    public function removeTextureData(TextureData $textureData): self
    {
        if ($this->textureDatas->contains($textureData)) {
            $this->textureDatas->removeElement($textureData);
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
