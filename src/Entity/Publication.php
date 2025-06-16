<?php

namespace App\Entity;

use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\PublicationRepository")
 */
class Publication extends BaseEntity implements DefinitionEntityInterface
{
    public function setTitleCZ(string $titleCZ): void
    {
        $this->titleCZ = $titleCZ;
    }

    public function setTitleEN(?string $titleEN): void
    {
        $this->titleEN = $titleEN;
    }

    public function setAuthors(?string $authors): void
    {
        $this->authors = $authors;
    }

    public function setDOI(?string $DOI): void
    {
        $this->DOI = $DOI;
    }

    public function setJournalName(?string $journalName): void
    {
        $this->journalName = $journalName;
    }

    public function setPublicationYear(?int $publicationYear): void
    {
        $this->publicationYear = $publicationYear;
    }

    public function setProjects(Collection $projects): void
    {
        $this->projects = $projects;
    }

    public function setSimulators(Collection $simulators): void
    {
        $this->simulators = $simulators;
    }
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private int $id;

    /**
     * @ORM\Column(type="string", length=512, nullable=false)
     */
    private string $titleCZ;

    /**
     * @ORM\Column(type="string", length=512, nullable=true)
     */
    private ?string $titleEN;

    /**
     * @ORM\Column(type="string", length=512, nullable=true)
     */
    private ?string $authors;

    /**
     * @ORM\Column(type="string", length=512, nullable=true)
     */
    private ?string $DOI;

    /**
     * @ORM\Column(type="string", length=512, nullable=true)
     */
    private ?string $journalName;

    /**
     * @ORM\Column(type="string", length=512, nullable=true)
     */
    private ?int $publicationYear;

    /**
     * @ORM\ManyToMany(targetEntity="App\Entity\Project", mappedBy="publications")
     */
    private Collection $projects;

    /**
     * @ORM\ManyToMany(targetEntity="App\Entity\Simulator", mappedBy="publications")
     */
    private Collection $simulators;

    public function getId(): int
    {
        return $this->id;
    }

    public function getTitleCZ(): string
    {
        return $this->titleCZ;
    }

    public function getTitleEN(): ?string
    {
        return $this->titleEN;
    }

    public function getAuthors(): ?string
    {
        return $this->authors;
    }

    public function getDOI(): ?string
    {
        return $this->DOI;
    }

    public function getJournalName(): ?string
    {
        return $this->journalName;
    }

    public function getPublicationYear(): ?int
    {
        return $this->publicationYear;
    }

    public function getProjects(): Collection
    {
        return $this->projects;
    }

    public function __toString(): String
    {
        return $this->getTitle() !== null ? $this->getTitle() : '#' . $this->getId();
    }

    public function getTitle():?string {
        return $this->getLocale() == 'en' ? $this->getTitleEN() : $this->getTitleCZ();
    }
}
