<?php

namespace App\Form;

use App\Entity\Cms;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\IntegerType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Contracts\Translation\TranslatorInterface;

class CmsType extends AbstractType
{

    /**
     * @var TranslatorInterface
     */
    private $translator;

    public function __construct(TranslatorInterface $translator) {
        $this->translator = $translator;
    }

    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('status', ChoiceType::class, [
                'choices'=>['draft'=>'draft','published'=>'published'],
                'label'=>$this->translator->trans('status')
            ])
            ->add('slug')
            ->add('menuOrder', IntegerType::class, [
                'empty_data' => 0
            ])
            ->add('language', ChoiceType::class, [
                'choices'=>['cs'=>'cs','en'=>'en'],
                'label'=>$this->translator->trans('language')
            ])
            ->add('title', TextType::class ,[
                'label'=>'title',
                'empty_data' => '',
                'required'=>false
            ])
            ->add('content');


        $builder->add('save', SubmitType::class, [
            'attr' => ['class' => 'btn btn-success'],
            'label' => 'save'
        ]);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Cms::class,
        ]);
    }
}
