<?php

namespace App\EventSubscriber;

use Doctrine\Common\EventSubscriber;
use Doctrine\ORM\Event\LifecycleEventArgs;
use Doctrine\ORM\Events;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\RequestStack;

class EntitySubscriber implements EventSubscriber {

    /**
     * @var RequestStack
     */
    private $requestStack;

    public function __construct(RequestStack $requestStack) {
        $this->requestStack = $requestStack;
    }

    public function postLoad(LifecycleEventArgs $args) {
        $locale = $this->requestStack->getCurrentRequest()->getLocale() ? $this->requestStack->getCurrentRequest()->getLocale() : $this->requestStack->getCurrentRequest()->getDefaultLocale();
        $args->getEntity()->setLocale($locale);
    }

    public function getSubscribedEvents() {
        return [
            Events::postLoad => [['onEntityLoad', 20]],
        ];
    }
}
