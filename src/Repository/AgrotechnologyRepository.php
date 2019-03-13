<?php

namespace App\Repository;

use App\Entity\Agrotechnology;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method Agrotechnology|null find($id, $lockMode = null, $lockVersion = null)
 * @method Agrotechnology|null findOneBy(array $criteria, array $orderBy = null)
 * @method Agrotechnology[]    findAll()
 * @method Agrotechnology[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class AgrotechnologyRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, Agrotechnology::class);
    }

    // /**
    //  * @return Agrotechnology[] Returns an array of Agrotechnology objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('a')
            ->andWhere('a.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('a.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?Agrotechnology
    {
        return $this->createQueryBuilder('a')
            ->andWhere('a.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
