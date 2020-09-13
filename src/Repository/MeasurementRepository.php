<?php

namespace App\Repository;

use App\Entity\Measurement;
use App\Entity\Phenomenon;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method Measurement|null find($id, $lockMode = null, $lockVersion = null)
 * @method Measurement|null findOneBy(array $criteria, array $orderBy = null)
 * @method Measurement[]    findAll()
 * @method Measurement[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class MeasurementRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, Measurement::class);
    }

     /**
      * @return Measurement[] Returns an array of Measurement objects
      */
    public function findByPhenomenon(Phenomenon $phenomenon)
    {
        return $this->createQueryBuilder('m')
            ->andWhere('m.phenomenon = :val')
            ->setParameter('val', $phenomenon)
            ->orderBy('m.id', 'ASC')
            ->getQuery()
            ->getResult();
    }

}
