<?php

namespace App\Repository;

use App\Entity\Plot;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\QueryBuilder;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method Plot|null find($id, $lockMode = null, $lockVersion = null)
 * @method Plot|null findOneBy(array $criteria, array $orderBy = null)
 * @method Plot[]    findAll()
 * @method Plot[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class PlotRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Plot::class);
    }


    public function getPaginatorQuery(?array $filter, string $order, string $direction):QueryBuilder {
        $queryBuilder = $this->createQueryBuilder('plot');
        $queryBuilder->leftJoin('plot.locality', 'l', 'WITH', 'plot.locality = l.id');
        $queryBuilder->leftJoin('plot.crop', 'c', 'WITH', 'plot.crop = c.id');
        $queryBuilder->leftJoin('plot.protectionMeasure', 'pm', 'WITH', 'plot.protectionMeasure = pm.id');

        if(isset($filter['locality'])) {
            $queryBuilder->andWhere($queryBuilder->expr()->eq('plot.locality',':locality'))->setParameter('locality',$filter['locality']);
        }

        if(isset($filter['name'])) {
            $queryBuilder->andWhere($queryBuilder->expr()->like('plot.name',':name'))
                         ->setParameter('name','%'.$filter['name'].'%');
        }

        if(isset($filter['crop'])) {
            $queryBuilder->andWhere($queryBuilder->expr()->eq('plot.crop',':crop'))->setParameter('crop',$filter['crop']);
        }

        if(isset($filter['protectionMeasure'])) {
            $queryBuilder->andWhere($queryBuilder->expr()->eq('plot.protectionMeasure',':protectionMeasure'))->setParameter('protectionMeasure',$filter['protectionMeasure']);
        }

        if(isset($filter['dateFrom'])) {
            $queryBuilder->andWhere($queryBuilder->expr()->gte('plot.established',':establishedFrom'))->setParameter('establishedFrom',$filter['dateFrom']);
        }

        if(isset($filter['dateTo'])) {
            $queryBuilder->andWhere($queryBuilder->expr()->lte('plot.established',':establishedTo'))->setParameter('establishedTo',$filter['dateTo']);
        }

        return $queryBuilder;
    }
}
