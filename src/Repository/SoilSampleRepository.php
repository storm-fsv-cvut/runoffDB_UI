<?php

namespace App\Repository;

use App\Entity\SoilSample;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\QueryBuilder;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method SoilSample|null find($id, $lockMode = null, $lockVersion = null)
 * @method SoilSample|null findOneBy(array $criteria, array $orderBy = null)
 * @method SoilSample[]    findAll()
 * @method SoilSample[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class SoilSampleRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, SoilSample::class);
    }

    public function getPaginatorQuery():QueryBuilder {
        $queryBuilder = $this->createQueryBuilder('soilSample');
        $queryBuilder->andWhere($queryBuilder->expr()->isNull('soilSample.deleted'));
        return $queryBuilder;
    }

    public function setDeleted(int $id) {
        $soilSample = $this->find($id);
        $soilSample->setDeleted(true);
        $this->getEntityManager()->persist($soilSample);
        $this->getEntityManager()->flush();
    }
}
