<?php

use App\Controller\Complaint\ComplaintController;
use Symfony\Component\Routing\Loader\Configurator\RoutingConfigurator;

return function (RoutingConfigurator $routes) {
    $complaintDomains = [
        'cz' => 'reklamace.4camping.cz',
        'sk' => 'reklamacie.4camping.sk',
        'hu' => 'reklamacio.4camping.hu',
        'ro' => 'reclamatie.4camping.ro',
        'hr' => 'reklamacije.4camping.hr',
        'bg' => 'reklamatsia.4camping.bg',
        'pl' => 'reklamacje.4camping.pl',
        'it' => 'reclami.4camping.it',
        'es' => 'reclamaciones.4camping.es',
        'fr' => 'reclamations.4camping.fr',
        'at' => 'reklamationen.4camping.at',
        'de' => 'reklamationen.4campingshop.de',
    ];

    foreach ($complaintDomains as $countryCode => $domain) {
        $routes->add('complaint_add_' . $countryCode, '/')
            ->controller([ComplaintController::class, 'complaintAddAction'])
            ->host($domain);
        $routes->add('complaint_detail_' . $countryCode, '/detail/{ident}')
            ->controller([ComplaintController::class, 'complaintDetailAction'])
            ->host($domain);
        $routes->add('return_order_' . $countryCode, '/return/{ident}')
            ->controller([ComplaintController::class, 'returnOrderAction'])
            ->host($domain);
        $routes->add('return_' . $countryCode, '/return')
            ->controller([ComplaintController::class, 'returnAction'])
            ->host($domain);
        $routes->add('duplicity_return_order_' . $countryCode, '/return-order')
            ->controller([ComplaintController::class, 'duplicityReturnAction'])
            ->host($domain);
        $routes->add('complaint_add_order_' . $countryCode, '/{ident}')
            ->controller([ComplaintController::class, 'complaintOrderAction'])
            ->host($domain);
    }
};
