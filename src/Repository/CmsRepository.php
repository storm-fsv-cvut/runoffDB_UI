<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\Cms;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\QueryBuilder;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Cms>
 * @method Cms|null find($id, $lockMode = null, $lockVersion = null)
 * @method Cms|null findOneBy(array $criteria, array $orderBy = null)
 * @method array<Cms> findAll()
 * @method array<Cms> findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class CmsRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Cms::class);
    }

    public function findBySlug(string $slug, string $language): ?Cms
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.slug = :slug')
            ->setParameter('slug', $slug)
            ->andWhere('c.language = :language')
            ->setParameter('language', $language)
            ->setMaxResults(1)
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function findAllByType(string $type = 'tooltip', string $language = 'cz', ?string $status = 'published'): array
    {
        $qb = $this->createQueryBuilder('c')
            ->andWhere('c.type = :type')->setParameter('type', $type)
            ->andWhere('c.language = :language')->setParameter('language', $language);
        if ($status !== null) {
            $qb->andWhere('c.status = :status')->setParameter('status', $status);
        }
            $qb->orderBy('c.menuOrder', 'ASC');
            return $qb->getQuery()->getArrayResult();
    }

    public function getPaginatorQuery(?array $filter, string $order, string $direction): QueryBuilder
    {
        $queryBuilder = $this->createQueryBuilder('cms');
        $queryBuilder->select('cms');
        if (isset($filter['type']) && $filter['type']) {
            $queryBuilder->andWhere($queryBuilder->expr()->like('cms.type', "'" . $filter['type'] . "'"));
        }
        return $queryBuilder;
    }
}
