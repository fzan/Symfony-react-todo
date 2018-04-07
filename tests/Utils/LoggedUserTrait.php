<?php
namespace App\Tests\Utils;

use Symfony\Component\BrowserKit\Cookie;
use Symfony\Component\Security\Core\Authentication\Token\UsernamePasswordToken;

trait LoggedUserTrait {

    private function getLoggedClient($user, $role = 'ROLE_USER', $firewall = 'main')
    {
        $client = static::createClient();
        $session = $client->getContainer()->get('session');

        $token = new UsernamePasswordToken($user, null, $firewall, array($role));
        $session->set('_security_'.$firewall, serialize($token));
        $session->save();

        $cookie = new Cookie($session->getName(), $session->getId());
        $client->getCookieJar()->set($cookie);

        return $client;
    }
}