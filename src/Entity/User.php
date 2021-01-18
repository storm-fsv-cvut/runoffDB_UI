<?php

namespace App\Entity;

use _HumbugBox01d8f9a04075\Nette\Utils\Strings;
use App\Security\UserRole;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * @ORM\Entity(repositoryClass="App\Repository\UserRepository")
 */
class User extends BaseEntity implements UserInterface
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
    private $username;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $password;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $email;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $fullname;

    /**
     * @ORM\Column(type="json_array")
     */
    private $roles;

    public function __toString() {
        return $this->getFullname();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUsername(): ?string
    {
        return $this->username;
    }

    public function setUsername(string $username): self
    {
        $this->username = $username;

        return $this;
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    public function getFullname(): ?string
    {
        return $this->fullname;
    }

    public function setFullname(string $fullname): self
    {
        $this->fullname = $fullname;

        return $this;
    }

    /**
     * Returns the roles granted to the user.
     * @return (Role|string)[] The user roles
     */
    public function getRoles():array {
        return $this->roles;
    }

    public function isInRole(array $roles):bool {
        foreach ($this->getRoles() as $role) {
            if (in_array($role,$roles)) {
                return true;
            }
        }
        return false;
    }

    /**
     * @return string|null The salt
     */
    public function getSalt():?string {
        return null;
    }

    /**
     * Removes sensitive data from the user.
     */
    public function eraseCredentials():void {
    }

    public function setRoles($roles): self
    {
        $this->roles = $roles;

        return $this;
    }
}
