<?php

namespace App\Repository;

use _HumbugBoxcbe25c660cef\Nette\Neon\Exception;
use App\Entity\SoilSample;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\QueryBuilder;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method SoilSample|null find($id, $lockMode = null, $lockVersion = null)
 * @method SoilSample|null findOneBy(array $criteria, array $orderBy = null)
 * @method SoilSample[]    findAll()
 * @method SoilSample[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class SoilSampleRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, SoilSample::class);
    }

    public function getPaginatorQuery(?array $filter, string $order, string $direction):QueryBuilder {
        $queryBuilder = $this->createQueryBuilder('soilSample');
        $queryBuilder->leftJoin('soilSample.locality', 'l', 'WITH', 'soilSample.locality = l.id');
        $queryBuilder->andWhere($queryBuilder->expr()->isNull('soilSample.deleted'));
        if (isset($filter['dateSampledFrom']) && $filter['dateSampledFrom']) {
            $queryBuilder->andWhere($queryBuilder->expr()->gte('soilSample.dateSampled',"'".$filter['dateSampledFrom']->format("Y-m-d")."'"));
        }
        if (isset($filter['dateSampledTo']) && $filter['dateSampledTo']) {
            $queryBuilder->andWhere($queryBuilder->expr()->lte('soilSample.dateSampled',"'".$filter['dateSampledTo']->format("Y-m-d")."'"));
        }
        if (isset($filter['locality']) && $filter['locality']) {
            $queryBuilder->andWhere($queryBuilder->expr()->eq('soilSample.locality',$filter['locality']->getId()));
        }
        return $queryBuilder;
    }

    public function setDeleted(int $id): void {
        $soilSample = $this->find($id);
        if ($soilSample===null) {
            throw new Exception("Soil sample doesnt exists");
        }
        $soilSample->setDeleted(true);
        $this->getEntityManager()->persist($soilSample);
        $this->getEntityManager()->flush();
    }
}
