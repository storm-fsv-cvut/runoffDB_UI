<?php

declare(strict_types=1);

namespace App\EventSubscriber;

use Doctrine\Common\EventSubscriber;
use Doctrine\ORM\Event\PostLoadEventArgs;
use Doctrine\ORM\Events;
use Symfony\Component\HttpFoundation\RequestStack;

final class EntitySubscriber implements EventSubscriber
{
    public function __construct(
        private readonly RequestStack $requestStack,
        private readonly string $defaultLocale = 'en', // injektuj z %kernel.default_locale%
    ) {
    }

    public function getSubscribedEvents(): array
    {
        return [Events::postLoad];
    }

    public function postLoad(PostLoadEventArgs $args): void
    {
        $request = $this->requestStack->getCurrentRequest();
        $locale = $request?->getLocale()
            ?? $request?->getDefaultLocale()
            ?? $this->defaultLocale;

        $entity = $args->getObject(); // už není deprecated

        if (\method_exists($entity, 'setLocale')) {
            $entity->setLocale($locale);
        }
    }
}
