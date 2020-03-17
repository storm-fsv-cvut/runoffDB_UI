<?php
namespace App\EventSubscriber;

use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\GetResponseEvent;
use Symfony\Component\HttpKernel\Event\FinishRequestEvent;
use Symfony\Component\HttpKernel\KernelEvents;

class LocaleSubscriber implements EventSubscriberInterface
{
    private $defaultLocale;
    /**
     * @var ContainerInterface
     */
    public $container;

    public function __construct(ContainerInterface $container, string $defaultLocale = 'cs')
    {
        $this->defaultLocale = $defaultLocale;
        $this->container = $container;
    }

    public function onKernelRequest(GetResponseEvent $event)
    {
        $request = $event->getRequest();
        if (!$request->hasPreviousSession()) {
            return;
        }
        if ($request->get("_locale")) {
            $request->setLocale($request->get("_locale"));
        }
        if ($request->getLocale()!=null) {
            $request->getSession()->set('_locale', $request->attributes->get('_locale'));
        } else {
            $request->setLocale($request->getSession()->get('_locale', $this->defaultLocale));
        }
    }

    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::REQUEST => [['onKernelRequest', 20]],
        ];
    }
}
