<?php

namespace App\Repository;

use App\Entity\CropErType;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method CropErType|null find($id, $lockMode = null, $lockVersion = null)
 * @method CropErType|null findOneBy(array $criteria, array $orderBy = null)
 * @method CropErType[]    findAll()
 * @method CropErType[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class CroperTypeRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, CropErType::class);
    }

    // /**
    //  * @return CropErType[] Returns an array of CropErType objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('c.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?CropErType
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
