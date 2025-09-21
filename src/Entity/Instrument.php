<?php

declare(strict_types=1);

namespace App\Entity;

use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Finder\Finder;

/**
 * @ORM\Entity
 */
class Instrument extends BaseEntity implements DefinitionEntityInterface, FileStorageEntityInterface
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private int $id;

    /** @ORM\Column(type="string", length=255) */
    private string $nameCZ;

    /** @ORM\Column(type="string", length=255) */
    private string $nameEN;

    /** @ORM\Column(type="text", nullable=true) */
    private ?string $descriptionCZ = null;

    /** @ORM\Column(type="text", nullable=true) */
    private ?string $descriptionEN = null;

    /** @ORM\Column(type="string", length=512, nullable=true) */
    private ?string $link = null;

    /** @ORM\ManyToMany(targetEntity="App\Entity\ProcessingStep", mappedBy="instruments") */
    private Collection $processingSteps;

    public function __construct()
    {
    }

    public function __toString(): string
    {
        return $this->getName() . '#' . $this->getId();
    }

    public function setNameCZ(string $nameCZ): void
    {
        $this->nameCZ = $nameCZ;
    }

    public function setNameEN(string $nameEN): void
    {
        $this->nameEN = $nameEN;
    }

    public function setDescriptionCZ(?string $descriptionCZ): void
    {
        $this->descriptionCZ = $descriptionCZ;
    }

    public function setDescriptionEN(?string $descriptionEN): void
    {
        $this->descriptionEN = $descriptionEN;
    }

    public function setLink(?string $link): void
    {
        $this->link = $link;
    }

    public function setProcessingSteps(Collection $processingSteps): void
    {
        $this->processingSteps = $processingSteps;
    }

    public function getNameCZ(): string
    {
        return $this->nameCZ;
    }

    public function getNameEN(): string
    {
        return $this->nameEN;
    }

    public function getDescriptionCZ(): ?string
    {
        return $this->descriptionCZ;
    }

    public function getDescriptionEN(): ?string
    {
        return $this->descriptionEN;
    }

    public function getLink(): ?string
    {
        return $this->link;
    }

    public function getProcessingSteps(): Collection
    {
        return $this->processingSteps;
    }

    public function getName(): string
    {
        return $this->getLocale() === 'en' ? $this->nameEN : $this->nameCZ;
    }

    public function getDescription(): ?string
    {
        return $this->getLocale() === 'en' ? $this->descriptionEN : $this->descriptionCZ;
    }

    public function getFiles(): array
    {
        $files = [];
        $filesystem = new Filesystem();
        $dir = $this->getFilesPath();
        if ($filesystem->exists($dir)) {
            $finder = new Finder();
            $finder->files()->in($dir);
            foreach ($finder as $file) {
                $files[] = $file->getRelativePathname();
            }
        }
        return $files;
    }

    public function getFilesPath(): string
    {
        return 'data/instrument/' . $this->getId();
    }

    public function removeFile(string $filename): void
    {
        $filesystem = new Filesystem();
        $path = $this->getFilesPath() . '/' . $filename;
        if ($filesystem->exists($path)) {
            $filesystem->remove($path);
        }
    }

    public function getId(): int
    {
        return $this->id;
    }
}
