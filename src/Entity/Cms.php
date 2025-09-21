<?php

declare(strict_types=1);

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\CmsRepository")
 */
class Cms extends BaseEntity
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private int $id;

    /** @ORM\Column(type="string", length=255, nullable=false) */
    private string $slug;

    /** @ORM\Column(type="text") */
    private string $content;

    /** @ORM\Column(type="string", length=255) */
    private string $language;

    /** @ORM\Column(type="string", length=255, nullable=true) */
    private ?string $title;

    /** @ORM\Column(type="string", length=255, nullable=true) */
    private ?string $type;

    /** @ORM\Column(type="string", length=255, nullable=true) */
    private ?string $status;

    /** @ORM\Column(type="integer", nullable=false, options={"default" : 0}) */
    private int $menuOrder;

    public function __construct()
    {
        $this->title = null;
        $this->type = null;
        $this->status = null;
        $this->slug = '';
        $this->language = 'cs';
        $this->content = '';
    }

    public function __toString()
    {
        return $this->getSlug() ?? '';
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getSlug(): ?string
    {
        return $this->slug;
    }

    public function setSlug(string $slug): self
    {
        $this->slug = $slug;

        return $this;
    }

    public function getContent(): ?string
    {
        return $this->content;
    }

    public function setContent(string $content): self
    {
        $this->content = $content;

        return $this;
    }

    public function getLanguage(): ?string
    {
        return $this->language;
    }

    public function setLanguage(string $language): self
    {
        $this->language = $language;

        return $this;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): self
    {
        $this->title = $title;

        return $this;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(string $type): self
    {
        $this->type = $type;

        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): self
    {
        $this->status = $status;

        return $this;
    }

    public function getMenuOrder(): int
    {
        return $this->menuOrder;
    }

    public function setMenuOrder(int $menuOrder): void
    {
        $this->menuOrder = $menuOrder;
    }
}
