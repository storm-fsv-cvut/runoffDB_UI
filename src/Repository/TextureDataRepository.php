<?php

namespace App\Repository;

use App\Entity\TextureData;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method TextureData|null find($id, $lockMode = null, $lockVersion = null)
 * @method TextureData|null findOneBy(array $criteria, array $orderBy = null)
 * @method TextureData[]    findAll()
 * @method TextureData[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class TextureDataRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, TextureData::class);
    }

    // /**
    //  * @return TextureData[] Returns an array of TextureData objects
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
    public function findOneBySomeField($value): ?TextureData
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
