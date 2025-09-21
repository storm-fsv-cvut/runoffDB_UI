<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\RecordType;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<RecordType>
 * @method RecordType|null find($id, $lockMode = null, $lockVersion = null)
 * @method RecordType|null findOneBy(array $criteria, array $orderBy = null)
 * @method array<RecordType> findAll()
 * @method array<RecordType> findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class RecordTypeRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, RecordType::class);
    }
}
