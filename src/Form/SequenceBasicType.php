<?php

namespace App\Form;

use App\Entity\Locality;
use App\Entity\Organization;
use App\Entity\Sequence;
use App\Entity\Simulator;
use App\Repository\OrganizationRepository;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Form;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Contracts\Translation\TranslatorInterface;

class SequenceBasicType extends AbstractType
{
    /**
     * @var TranslatorInterface
     */
    private $translator;
    /**
     * @var OrganizationRepository
     */
    private $organizationRepository;

    public function __construct(TranslatorInterface $translator, OrganizationRepository $organizationRepository) {
        $this->translator = $translator;
        $this->organizationRepository = $organizationRepository;
    }

    public function buildForm(FormBuilderInterface $builder, array $options)
    {

    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => Sequence::class,
        ]);
    }
}
