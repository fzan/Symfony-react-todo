<?php
namespace App\DataFixtures\ORM;

use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use Symfony\Component\DependencyInjection\ContainerAwareInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

class LoadUserData implements FixtureInterface, ContainerAwareInterface
{
    /**
     * @var ContainerInterface
     */
    private $container;

    public function setContainer(ContainerInterface $container = null)
    {
        $this->container = $container;
    }

    public function load(ObjectManager $manager)
    {
        $userManager = $this->container->get('fos_user.user_manager');

        // Create our user and set details
        $user = $userManager->createUser();
        $user->setFirstName('TestAdmin');
        $user->setLastname('TestSurname');
        //$user->setPlace('place');
        //$user->setBirthdate(new \DateTime('1990-02-01'));
        $user->setUsername('admin');
        $user->setEmail('email@domain.com');
        $user->setPlainPassword('admin');

        $user->setEnabled(true);
        $user->setRoles(array('ROLE_SONATA_ADMIN','ROLE_SUPER_ADMIN'));

        // Update the user
        $userManager->updateUser($user, true);


        $user = $userManager->createUser();
        $user->setFirstName('TestUser');
        $user->setLastname('TestUserSurname');
        //$user->setPlace('place');
        //$user->setBirthdate(new \DateTime('1990-02-01'));
        $user->setUsername('user');
        $user->setEmail('email@user.com');
        $user->setPlainPassword('user');

        $user->setEnabled(true);
        $user->setRoles(array('ROLE_SONATA_ADMIN','ROLE_APP_ADMIN_TODO_LIST','ROLE_APP_ADMIN_TODO_CREATE','ROLE_APP_ADMIN_TODO_DELETE'));

        // Update the user
        $userManager->updateUser($user, true);


    }
}