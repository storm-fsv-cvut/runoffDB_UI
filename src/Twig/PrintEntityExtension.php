<?php

namespace App\Twig;

use App\Entity\BaseEntity;
use App\Entity\DefinitionEntityInterface;
use App\Entity\FileStorageEntityInterface;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Contracts\Translation\TranslatorInterface;
use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;

class PrintEntityExtension extends AbstractExtension
{


    public function __construct(
        private EntityManagerInterface $em,
        private TranslatorInterface $translator,
        private UrlGeneratorInterface $urlGenerator
    ) {
    }

    public function getFunctions(): array
    {
        return [
            new TwigFunction('printEntity', [$this, 'printEntity']),
        ];
    }

    function printEntity(BaseEntity $entity): string
    {
        $html = "<dl class='dl-vertical'>";
        $metadata = $this->em->getMetadataFactory()->getMetadataFor(get_class($entity));

        foreach ($metadata->getFieldNames() as $field) {
            $var = call_user_func_array([$entity, 'get' . ucfirst($field)], []);
            if ($var !== null) {
                $html .= "<dt>{$this->translator->trans($field)}</dt>";
                if ($var instanceof \DateTimeInterface) {
                    $html .= "<dd>" . $var->format("d.m.Y") . "</dd>";
                } else {
                    $html .= "<dd>" . $var . "</dd>";
                }

            }

        }

        foreach ($metadata->getAssociationNames() as $associationName) {
            if (strpos(
                    (string)$metadata->getReflectionClass()->getProperty($associationName)->getDocComment(),
                    "mappedBy"
                ) !== false) {
                $var = call_user_func_array([$entity, 'get' . ucfirst($associationName)], []);
            }
        }

        if ($entity instanceof FileStorageEntityInterface) {
            $files = $entity->getFiles();
            if (sizeof($files) > 0) {
                $html .= "<dt>{$this->translator->trans("files")}</dt>";
                foreach ($files as $file) {
                    $downloadLink = $this->urlGenerator->generate(
                        'downloadSettingsFile',
                        ['id' => $entity->getId(), 'filename'=>$file],
                        UrlGeneratorInterface::ABSOLUTE_URL
                    );
                    $html .= "<dd><a href='$downloadLink'>$file</dd>";
                }
            }
        }


        $html .= "</dl>";
        return $html;
    }

}
