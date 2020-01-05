<?php

namespace App\Repository;

use App\Entity\Phenomenon;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method Phenomenon|null find($id, $lockMode = null, $lockVersion = null)
 * @method Phenomenon|null findOneBy(array $criteria, array $orderBy = null)
 * @method Phenomenon[]    findAll()
 * @method Phenomenon[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class PhenomenonRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, Phenomenon::class);
    }

    // /**
    //  * @return Phenomenon[] Returns an array of Phenomenon objects
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
    public function findOneBySomeField($value): ?Phenomenon
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
