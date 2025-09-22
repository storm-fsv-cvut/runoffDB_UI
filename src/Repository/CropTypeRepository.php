<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\CropType;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<CropType>
 * @method CropType|null find($id, $lockMode = null, $lockVersion = null)
 * @method CropType|null findOneBy(array $criteria, array $orderBy = null)
 * @method array<CropType> findAll()
 * @method array<CropType> findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class CropTypeRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, CropType::class);
    }
}
