<?php

namespace App\Repository;

use App\Entity\RunGroup;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method RunGroup|null find($id, $lockMode = null, $lockVersion = null)
 * @method RunGroup|null findOneBy(array $criteria, array $orderBy = null)
 * @method RunGroup[]    findAll()
 * @method RunGroup[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class RunGroupRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, RunGroup::class);
    }

    // /**
    //  * @return RunGroup[] Returns an array of RunGroup objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('r')
            ->andWhere('r.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('r.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?RunGroup
    {
        return $this->createQueryBuilder('r')
            ->andWhere('r.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
