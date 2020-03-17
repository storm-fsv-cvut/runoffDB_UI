<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\TextureDataRepository")
 */
class TextureData
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Texture", inversedBy="textureDatas")
     * @ORM\JoinColumn(nullable=false)
     */
    private $texture;

    /**
     * @ORM\Column(type="float")
     */
    private $upClassLimit;

    /**
     * @ORM\Column(type="float")
     */
    private $mass;

    /**
     * @ORM\Column(type="float")
     */
    private $cumulMass;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTexture(): ?Texture
    {
        return $this->texture;
    }

    public function setTexture(?Texture $texture): self
    {
        $this->texture = $texture;

        return $this;
    }

    public function getUpClassLimit(): ?float
    {
        return number_format( $this->upClassLimit, 3, ".", "" );
    }

    public function setUpClassLimit(?float $upClassLimit): self
    {
        $this->upClassLimit = $upClassLimit;

        return $this;
    }

    public function getMass(): ?float
    {
        return number_format( $this->mass, 3, ".", "" );
    }

    public function setMass(?float $mass): self
    {
        $this->mass = $mass;

        return $this;
    }

    public function getCumulMass(): ?float
    {
        return number_format( $this->cumulMass, 3, ".", "" );
    }

    public function setCumulMass(?float $cumulMass): self
    {
        $this->cumulMass = $cumulMass;

        return $this;
    }
}
