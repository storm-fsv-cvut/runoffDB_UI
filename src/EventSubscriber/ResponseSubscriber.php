<?php
namespace App\EventSubscriber;

use App\Repository\CmsRepository;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpKernel\Event\FilterResponseEvent;
use Symfony\Component\HttpKernel\Event\ResponseEvent;
use Symfony\Component\HttpKernel\KernelEvents;

class ResponseSubscriber implements EventSubscriberInterface
{
    private string $defaultLocale;
    private CmsRepository $cmsRepository;

    public function __construct(CmsRepository $cmsRepository, string $defaultLocale = 'cs')
    {
        $this->defaultLocale = $defaultLocale;
        $this->cmsRepository = $cmsRepository;
    }


    public function onKernelResponse(ResponseEvent $event):void
    {
        $request = $event->getRequest();
        $response = $event->getResponse();
        if (!($response instanceof BinaryFileResponse)) {
            $locale = $request->attributes->get('_locale') ?? $this->defaultLocale;

            $tooltips = $this->cmsRepository->findAllByType('tooltip', $locale);

            $content = $response->getContent();

            foreach ($tooltips as $tooltip) {
                $content = preg_replace("/([\s.,>])(" . $tooltip['slug'] . ")([\s.,<])/", '$1<span data-toggle="tooltip" class="tip" data-placement="top" title="' . $tooltip['content'] . '">' . $tooltip['slug'] . '</span>$3', $content);
            }
            $response->setContent($content);
            $event->setResponse($response);
        }
    }

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::RESPONSE => [['onKernelResponse', 20]],
        ];
    }
}
