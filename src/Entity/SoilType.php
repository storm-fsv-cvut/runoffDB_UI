<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Dtc\GridBundle\Annotation as Grid;

/**
 * @Grid\Grid(actions={@Grid\ShowAction(), @Grid\DeleteAction()})
 * @ORM\Entity(repositoryClass="App\Repository\SoilTypeRepository")
 */
class SoilType implements DefinitionEntityInterface
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $soilType;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getSoilType(): ?string
    {
        return $this->soilType;
    }

    public function setSoilType(string $soilType): self
    {
        $this->soilType = $soilType;

        return $this;
    }

    public function getLabel(): string {
        return $this->soilType;
    }
}
