<?php

declare(strict_types=1);

namespace App\Form\Type;

use Doctrine\ORM\EntityRepository;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\OptionsResolver\OptionsResolver;

class DescendingIdEntityType extends AbstractType
{
    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
                                   'query_builder' => function (EntityRepository $er) {
                                       return $er->createQueryBuilder('e')
                                                 ->orderBy('e.id', 'DESC');
                                   },
                               ]);
    }

    public function getParent(): string
    {
        return EntityType::class;
    }
}
