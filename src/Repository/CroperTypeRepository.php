<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\CropErType;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<CropErType>
 * @method CropErType|null find($id, $lockMode = null, $lockVersion = null)
 * @method CropErType|null findOneBy(array $criteria, array $orderBy = null)
 * @method array<CropErType> findAll()
 * @method array<CropErType> findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class CroperTypeRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, CropErType::class);
    }
}
