<?php


namespace App\Security;

use App\Entity\User;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

class EntityVoter extends Voter {

    const VIEW_ALL = 'viewall';
    const EDIT = 'edit';
    const VIEW = 'view';
    const ADMIN = 'admin';
    const EDITUSER = 'edituser';


    protected function supports($attribute, $subject): bool {
        if (!in_array($attribute, [self::ADMIN,self::VIEW, self::EDIT, self::VIEW_ALL, self::EDITUSER], false)) {
            return false;
        }
        return true;
    }


    protected function voteOnAttribute($attribute, $subject, TokenInterface $token): bool {
        $user = $token->getUser();
        if ($user instanceof User) {
            if ($user->isInRole([
                UserRole::ROLE_ADMIN,
            ])) {
                return true;
            }

            if ($attribute == self::VIEW) {
                return true;
            } else if ($attribute == self::EDIT) {
                if ($user->isInRole([
                    UserRole::ROLE_EDITOR
                ])) {
                    return true;
                }

                if ($user->isInRole([
                    UserRole::ROLE_INSTITUTION_EDITOR
                ])) {
                    if ($subject!=null) {
                        return $subject->getUser()->getOrganization()->getId() == $user->getOrganization()->getId();
                    }
                }
            } else if ($attribute == self::VIEW_ALL) {
                if ($user->isInRole([
                    UserRole::ROLE_EDITOR,
                    UserRole::ROLE_READER
                ])) {
                    return true;
                }
            } else if ($attribute == self::EDITUSER) {
                if ($user->getId() === $subject->getId()) {
                    return true;
                }
            }
        } else {
            if ($attribute == self::VIEW) {
                return true;
            }
        }
        return false;
    }
}
