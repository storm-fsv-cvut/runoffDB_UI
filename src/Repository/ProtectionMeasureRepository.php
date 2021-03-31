<?php

namespace App\Repository;

use App\Entity\ProtectionMeasure;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method ProtectionMeasure|null find($id, $lockMode = null, $lockVersion = null)
 * @method ProtectionMeasure|null findOneBy(array $criteria, array $orderBy = null)
 * @method ProtectionMeasure[]    findAll()
 * @method ProtectionMeasure[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ProtectionMeasureRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ProtectionMeasure::class);
    }

    // /**
    //  * @return ProtectionMeasures[] Returns an array of ProtectionMeasures objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('p.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?ProtectionMeasures
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
