<?php

namespace App\Twig;

use App\Entity\BaseEntity;
use App\Entity\FileStorageEntityInterface;
use App\Entity\Methodics;
use App\Entity\MethodicsProcessingStep;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Mapping\ClassMetadata;
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
            new TwigFunction('printEntity', [$this, 'printEntity'], ['is_safe' => ['html']]),
        ];
    }

    public function printEntity(BaseEntity $entity): string
    {
        $html = "<dl class='dl-vertical'>";
        /** @var ClassMetadata $metadata */
        $metadata = $this->em->getMetadataFactory()->getMetadataFor(get_class($entity));

        foreach ($metadata->getFieldNames() as $field) {
            $getter = 'get' . ucfirst($field);
            if (!\is_callable([$entity, $getter])) {
                continue;
            }
            $val = $entity->$getter();
            if ($val === null) {
                continue;
            }
            $html .= "<dt>{$this->translator->trans($field)}</dt>";
            if ($val instanceof \DateTimeInterface) {
                $html .= "<dd>" . $val->format("d.m.Y") . "</dd>";
            } else {
                $safe = htmlspecialchars((string) $val, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
                $html .= "<dd>{$safe}</dd>";
            }
        }

        if ($entity instanceof Methodics) {
            $links = $entity->getMethodicsProcessingSteps();
            if (\count($links) > 0) {
                $html .= "<dt>{$this->translator->trans('processingSteps')}</dt>";
                foreach ($links as $link) {
                    /** @var MethodicsProcessingStep $link */
                    $stepName = htmlspecialchars((string) $link->getProcessingStep(), ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
                    $html    .= "<dd>{$stepName} <small class='text-muted'>(#{$link->getSort()})</small></dd>";
                }
            }
        }

        foreach ($metadata->getAssociationMappings() as $assocName => $map) {
            if ($entity instanceof Methodics && $assocName === 'methodicsProcessingSteps') {
                continue;
            }
            $getter = 'get' . ucfirst($assocName);
            if (!\is_callable([$entity, $getter])) {
                continue;
            }
            $assocVal = $entity->$getter();
            if ($assocVal === null) {
                continue;
            }
            $label = $this->translator->trans($assocName);

            if ($assocVal instanceof \Traversable || $assocVal instanceof Collection) {
                $items = [];
                foreach ($assocVal as $item) {
                    $items[] = htmlspecialchars((string) $item, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
                }
                if (\count($items) > 0) {
                    $html .= "<dt>{$label}</dt>";
                    foreach ($items as $txt) {
                        $html .= "<dd>{$txt}</dd>";
                    }
                }
                continue;
            }

            $txt = htmlspecialchars((string) $assocVal, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
            $html .= "<dt>{$label}</dt><dd>{$txt}</dd>";
        }

        if ($entity instanceof FileStorageEntityInterface) {
            $files = $entity->getFiles();
            if (\count($files) > 0) {
                $html .= "<dt>{$this->translator->trans('files')}</dt>";
                foreach ($files as $file) {
                    $safeFile = htmlspecialchars($file, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
                    $downloadLink = $this->urlGenerator->generate(
                        'downloadSettingsFile',
                        ['id' => $entity->getId(), 'filename' => $file],
                        UrlGeneratorInterface::ABSOLUTE_URL
                    );
                    $html .= "<dd><a href='{$downloadLink}'>{$safeFile}</a></dd>";
                }
            }
        }

        $html .= "</dl>";
        return $html;
    }
}
