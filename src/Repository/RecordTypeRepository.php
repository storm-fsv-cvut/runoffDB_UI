<?php

namespace App\Repository;

use App\Entity\RecordType;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method RecordType|null find($id, $lockMode = null, $lockVersion = null)
 * @method RecordType|null findOneBy(array $criteria, array $orderBy = null)
 * @method RecordType[]    findAll()
 * @method RecordType[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class RecordTypeRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, RecordType::class);
    }

    // /**
    //  * @return RecordType[] Returns an array of RecordType objects
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
    public function findOneBySomeField($value): ?RecordType
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
