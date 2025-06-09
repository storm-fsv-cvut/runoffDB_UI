<?php

namespace App\Security;

use App\Entity\User;
use App\Repository\UserRepository;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class SecurityService
{
    private UserPasswordHasherInterface $hasher;
    private UserRepository $userRepository;

    public function __construct(
        UserPasswordHasherInterface $hasher,
        UserRepository              $userRepository
    ) {
        $this->hasher = $hasher;
        $this->userRepository = $userRepository;
    }

    public function changePass(User $user, string $newpass): void
    {
        $user->setPassword($this->hasher->hashPassword($user, $newpass));
        $this->userRepository->store($user);
    }
}
