<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\Crop;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\QueryBuilder;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Crop>
 * @method Crop|null find($id, $lockMode = null, $lockVersion = null)
 * @method Crop|null findOneBy(array $criteria, array $orderBy = null)
 * @method array<Crop> findAll()
 * @method array<Crop> findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class CropRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Crop::class);
    }

    public function getPaginatorQuery(?array $filter, string $order, string $direction): QueryBuilder
    {
        $queryBuilder = $this->createQueryBuilder('crop');
        $queryBuilder->leftJoin('crop.cropType', 'ct', 'WITH', 'crop.cropType = ct.id');

        if (isset($filter['cropType'])) {
            $queryBuilder->andWhere($queryBuilder->expr()->eq('crop.cropType', ':cropType'))->setParameter('cropType', $filter['cropType']);
        }
        if (isset($filter['name'])) {
            $queryBuilder->andWhere($queryBuilder->expr()->like('crop.nameCZ', ':name'))
                         ->orWhere($queryBuilder->expr()->like('crop.nameEN', ':name'))
                         ->setParameter('name', '%' . $filter['name'] . '%');
        }
        return $queryBuilder;
    }
}
