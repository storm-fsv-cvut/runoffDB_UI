<?php

namespace App\Repository;

use App\Entity\TillageSequence;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method TillageSequence|null find($id, $lockMode = null, $lockVersion = null)
 * @method TillageSequence|null findOneBy(array $criteria, array $orderBy = null)
 * @method TillageSequence[]    findAll()
 * @method TillageSequence[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class TillageSequenceRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, TillageSequence::class);
    }

    // /**
    //  * @return TillageSequence[] Returns an array of TillageSequence objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('t')
            ->andWhere('t.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('t.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?TillageSequence
    {
        return $this->createQueryBuilder('t')
            ->andWhere('t.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
