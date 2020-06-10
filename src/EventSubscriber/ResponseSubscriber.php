<?php
namespace App\EventSubscriber;

use App\Repository\CmsRepository;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\FilterResponseEvent;
use Symfony\Component\HttpKernel\KernelEvents;

class ResponseSubscriber implements EventSubscriberInterface
{
    private $defaultLocale;
    /**
     * @var CmsRepository
     */
    private $cmsRepository;

    public function __construct(CmsRepository $cmsRepository, string $defaultLocale = 'cs')
    {
        $this->defaultLocale = $defaultLocale;
        $this->cmsRepository = $cmsRepository;
    }


    public function onKernelResponse(FilterResponseEvent $event)
    {
        $request = $event->getRequest();
        $response = $event->getResponse();

        $locale = $request->attributes->get('_locale') ?? $this->defaultLocale;

        $tooltips = $this->cmsRepository->findAllByType('tooltip',$locale);

        $content = $response->getContent();

        foreach ($tooltips as $tooltip) {
            $content = preg_replace("/([\s.,>])(".$tooltip['slug'].")([\s.,<])/", '$1<span data-toggle="tooltip" class="tip" data-placement="top" title="'.$tooltip['content'].'">'.$tooltip['slug'].'</span>$3',$content);
        }
        $response->setContent($content);
        $event->setResponse($response);
    }

    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::RESPONSE => [['onKernelResponse', 20]],
        ];
    }
}
