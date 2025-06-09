<?php

namespace App\Twig;

use App\Entity\BaseEntity;
use App\Entity\DefinitionEntityInterface;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Contracts\Translation\TranslatorInterface;
use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;

class PrintEntityExtension extends AbstractExtension {

    /**
     * @var EntityManagerInterface
     */
    private $em;
    /**
     * @var TranslatorInterface
     */
    private $translator;

    public function __construct(EntityManagerInterface $em, TranslatorInterface $translator) {
        $this->em = $em;
        $this->translator = $translator;
    }

    public function getFunctions(): array {
        return [
            new TwigFunction('printEntity', [$this, 'printEntity']),
        ];
    }

    function printEntity(BaseEntity $entity): string {
        $html = "<dl class='dl-vertical'>";
        $metadata = $this->em->getMetadataFactory()->getMetadataFor(get_class($entity));

        foreach ($metadata->getFieldNames() as $field) {
            $var = call_user_func_array([$entity, 'get' . ucfirst($field)], []);
            if ($var!==null) {
                $html .= "<dt>{$this->translator->trans($field)}</dt>";
                if ($var instanceof \DateTimeInterface) {
                    $html .= "<dd>" . $var->format("d.m.Y") . "</dd>";
                } else {
                    $html .= "<dd>" . $var . "</dd>";
                }

            }

        }

        foreach ($metadata->getAssociationNames() as $associationName) {
            if (strpos((string) $metadata->getReflectionClass()->getProperty($associationName)->getDocComment(), "mappedBy")!==false) {
                $var = call_user_func_array([$entity, 'get' . ucfirst($associationName)], []);
            }
        }


        $html .= "</dl>";
        return $html;
    }

}
