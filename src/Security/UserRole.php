<?php


namespace App\Security;


use Exception;
use ReflectionClass;

class UserRole
{
    public const ROLE_ADMIN = 'admin';
    public const ROLE_EDITOR = 'editor';
    public const ROLE_INSTITUTION_EDITOR = 'ieditor';
    public const ROLE_READER = 'reader';
    public const ROLE_GUEST = 'guest';



    /**
     * @var string
     */
    private $role;

    public function __construct(string $role)
    {
        if (!in_array($role, self::getEnumRoles(), true)) {
            throw new Exception('Role not found ' . $role);
        }

        $this->role = $role;
    }

    public function getRole(): string
    {
        return $this->role;
    }

    private static function getEnumRoles(): array
    {
        $enums = self::getEnum();
        $enumArray = [];

        foreach ($enums as $enum) {
            $enumArray[] = $enum;
        }

        return $enumArray;
    }

    private static function getEnum(): array
    {
        try {
            $class = new ReflectionClass(__CLASS__);
            $const = $class->getConstants();
            $constArray = [];

            foreach ($const as $constName => $value) {
                if (strpos($constName, 'ROLE_') == 0) {
                    $constArray[$constName] = $value;
                }
            }

            return $constArray;
        } catch (Exception $e) {
            return [];
        }
    }
}
