<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use App\Security\UserRole;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * @ORM\Entity(repositoryClass="App\Repository\UserRepository")
 */
class User extends BaseEntity implements PasswordAuthenticatedUserInterface, UserInterface {
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private int $id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private string $username;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private string $password;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private string $email;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private string $fullname;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private string $role;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Organization", inversedBy="users")
     */
    private ?Organization $organization;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\SoilSample", mappedBy="user")
     */
    private Collection $soilSamples;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Measurement", mappedBy="user")
     */
    private Collection $measurements;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Sequence", mappedBy="user")
     */
    private Collection $sequences;

    public function __construct() {
        $this->soilSamples = new ArrayCollection();
        $this->measurements = new ArrayCollection();
        $this->sequences = new ArrayCollection();
        $this->organization = null;
    }

    public function __toString(): string {
        return $this->getFullname();
    }

    public function getId(): ?int {
        return $this->id;
    }

    public function getUsername(): string {
        return $this->username;
    }

    public function setUsername(string $username): self {
        $this->username = $username;

        return $this;
    }

    public function getPassword(): string {
        return $this->password;
    }

    public function setPassword(string $password): self {
        $this->password = $password;

        return $this;
    }

    public function getEmail(): ?string {
        return $this->email;
    }

    public function setEmail(string $email): self {
        $this->email = $email;

        return $this;
    }

    public function getFullname(): string {
        return $this->fullname;
    }

    public function setFullname(string $fullname): self {
        $this->fullname = $fullname;

        return $this;
    }

    public function getRoles(): array {
        return [$this->getRole()];
    }

    public function getRole(): string {
        return $this->role;
    }

    public function isInRole(array $roles): bool {
        if (in_array($this->getRole(), $roles, true)) {
            return true;
        }
        return false;
    }

    /**
     * @return string|null The salt
     */
    public function getSalt(): ?string {
        return null;
    }

    /**
     * Removes sensitive data from the user.
     */
    public function eraseCredentials(): void {
    }

    public function getOrganization(): ?Organization {
        return $this->organization;
    }

    public function setOrganization(?Organization $organization): self {
        $this->organization = $organization;

        return $this;
    }

    /**
     * @return Collection|SoilSample[]
     */
    public function getSoilSamples(): Collection {
        return $this->soilSamples;
    }

    public function addSoilSample(SoilSample $soilSample): self {
        if (!$this->soilSamples->contains($soilSample)) {
            $this->soilSamples[] = $soilSample;
            $soilSample->setUser($this);
        }

        return $this;
    }

    public function removeSoilSample(SoilSample $soilSample): self {
        if ($this->soilSamples->contains($soilSample)) {
            $this->soilSamples->removeElement($soilSample);
            // set the owning side to null (unless already changed)
            if ($soilSample->getUser() === $this) {
                $soilSample->setUser(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|Measurement[]
     */
    public function getMeasurements(): Collection {
        return $this->measurements;
    }

    public function addMeasurement(Measurement $measurement): self {
        if (!$this->measurements->contains($measurement)) {
            $this->measurements[] = $measurement;
            $measurement->setUser($this);
        }

        return $this;
    }

    public function removeMeasurement(Measurement $measurement): self {
        if ($this->measurements->contains($measurement)) {
            $this->measurements->removeElement($measurement);
            // set the owning side to null (unless already changed)
            if ($measurement->getUser() === $this) {
                $measurement->setUser(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|Sequence[]
     */
    public function getSequences(): Collection {
        return $this->sequences;
    }

    public function addSequence(Sequence $sequence): self {
        if (!$this->sequences->contains($sequence)) {
            $this->sequences[] = $sequence;
            $sequence->setUser($this);
        }

        return $this;
    }

    public function removeSequence(Sequence $sequence): self {
        if ($this->sequences->contains($sequence)) {
            $this->sequences->removeElement($sequence);
            // set the owning side to null (unless already changed)
            if ($sequence->getUser() === $this) {
                $sequence->setUser(null);
            }
        }

        return $this;
    }

    public function setRole(string $role): void
    {
        $this->role = $role;
    }

    public function getUserIdentifier(): string
    {
        return $this->username;
    }
}
