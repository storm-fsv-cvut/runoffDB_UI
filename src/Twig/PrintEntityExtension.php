<?php

declare(strict_types=1);

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
        private UrlGeneratorInterface $urlGenerator,
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

        // Skalární pole
        foreach ($metadata->getFieldNames() as $field) {
            $val = $metadata->getFieldValue($entity, $field);
            if ($val === null) {
                continue;
            }

            $html .= sprintf('<dt>%s</dt>', $this->translator->trans($field));

            if ($val instanceof \DateTimeInterface) {
                $html .= sprintf('<dd>%s</dd>', $val->format('d.m.Y'));
            } elseif ($val instanceof \BackedEnum) {
                $safe = htmlspecialchars((string) $val->value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
                $html .= sprintf('<dd>%s</dd>', $safe);
            } elseif (is_bool($val)) {
                $html .= sprintf('<dd>%s</dd>', $val ? 'Ano' : 'Ne');
            } elseif (is_array($val)) {
                $safe = htmlspecialchars(
                    json_encode($val, JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE),
                    ENT_QUOTES | ENT_SUBSTITUTE,
                    'UTF-8',
                );
                $html .= sprintf('<dd>%s</dd>', $safe);
            } elseif (is_scalar($val) || (is_object($val) && method_exists($val, '__toString'))) {
                $safe = htmlspecialchars((string) $val, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
                $html .= sprintf('<dd>%s</dd>', $safe);
            }
        }

        // Speciál pro Methodics: ProcessingSteps
        if ($entity instanceof Methodics) {
            $links = $entity->getMethodicsProcessingSteps();
            if (\count($links) > 0) {
                $html .= sprintf('<dt>%s</dt>', $this->translator->trans('processingSteps'));
                foreach ($links as $link) {
                    /** @var MethodicsProcessingStep $link */
                    $stepName = htmlspecialchars((string) $link->getProcessingStep(), ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
                    $html .= sprintf(
                        '<dd>%s <small class="text-muted">(#%d)</small></dd>',
                        $stepName,
                        $link->getSort(),
                    );
                }
            }
        }

        // Asociace
        foreach ($metadata->getAssociationNames() as $assocName) {
            if ($entity instanceof Methodics && $assocName === 'methodicsProcessingSteps') {
                continue;
            }

            $assocVal = $metadata->getFieldValue($entity, $assocName);
            if ($assocVal === null) {
                continue;
            }

            $label = $this->translator->trans($assocName);

            if ($assocVal instanceof Collection || $assocVal instanceof \Traversable) {
                $items = [];
                foreach ($assocVal as $item) {
                    $items[] = htmlspecialchars((string) $item, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
                }
                if (\count($items) > 0) {
                    $html .= sprintf('<dt>%s</dt>', $label);
                    foreach ($items as $txt) {
                        $html .= sprintf('<dd>%s</dd>', $txt);
                    }
                }
                continue;
            }

            $txt = htmlspecialchars((string) $assocVal, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
            $html .= sprintf('<dt>%s</dt><dd>%s</dd>', $label, $txt);
        }

        // Soubory
        if ($entity instanceof FileStorageEntityInterface) {
            $files = $entity->getFiles();
            if (\count($files) > 0) {
                $html .= sprintf('<dt>%s</dt>', $this->translator->trans('files'));
                foreach ($files as $file) {
                    $safeFile = htmlspecialchars($file, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
                    $downloadLink = $this->urlGenerator->generate(
                        'downloadSettingsFile',
                        ['id' => $entity->getId(), 'filename' => $file],
                        UrlGeneratorInterface::ABSOLUTE_URL,
                    );
                    // pro URL použij htmlspecialchars s ENT_QUOTES kvůli atributu
                    $safeHref = htmlspecialchars($downloadLink, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
                    $html .= sprintf('<dd><a href="%s">%s</a></dd>', $safeHref, $safeFile);
                }
            }
        }

        return $html . '</dl>';
    }
}
