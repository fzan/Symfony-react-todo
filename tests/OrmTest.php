<?php

namespace App\Tests;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use App\Tests\Utils\LoggedUserTrait;
use App\Entity\Todo;
use App\Application\Sonata\UserBundle\Entity\User;


class PostControllerTest extends WebTestCase
{
    use LoggedUserTrait;

    private $todo;
    private $user;

    protected function setUp()
    {
        self::bootKernel();

        $this->em = static::$kernel->getContainer()
            ->get('doctrine')
            ->getManager();
        $user = new User();
        $user->setUserName('TestUserName');
        $user->setFirstName('TestAdmin');
        $user->setLastname('TestSurname');
        $user->setUsername('testadmin');
        $user->setEmail('email@tests.com');
        $user->setPlainPassword('testadmin');
        $user->setEnabled(true);
        $user->setRoles(array('ROLE_SONATA_ADMIN', 'ROLE_SUPER_ADMIN'));

        $this->em->persist($user);
        $this->user = $user;

        $todo = new Todo();
        $todo->setTitle('Test title');
        $todo->setOwner($user);
        $todo->setCompleted(false);

        $this->em->persist($todo);
        $this->em->flush();
        $this->todo = $todo;

    }

    protected function tearDown()
    {
        //Cleaning things :)
        $this->em->remove($this->em->getRepository('ApplicationSonataUserBundle:User')
            ->find($this->user->getId()));
        $this->em->remove($this->em->getRepository('App:Todo')
            ->find($this->todo->getId()));
        $this->em->flush();
        $this->em = null;
    }

    /*
     * Verify that a not authenticated user cannot see the API
     */
    public function testRedirectNotAuthenticated()
    {
        $client = static::createClient();

        $client->request('GET', '/api/doc');

        $this->assertEquals(302, $client->getResponse()->getStatusCode());
    }

    /*
     * Verify that home is reachable
     */
    public function testHome()
    {
        $client = static::createClient();

        $client->request('GET', '/');
        $this->assertEquals(302, $client->getResponse()->getStatusCode());
    }

    /*
     * Verify that the login page contains the login action
     */
    public function testLogin()
    {
        $client = static::createClient();

        $crawler = $client->request('GET', '/admin/login');
        $this->assertGreaterThan(
            0,
            $crawler->filter('html:contains("Login")')->count()
        );
    }
    /*
     * Verify that, once logged, admin can see his dashboard
     */
    public function testAdminAuthenticatedIndexAction()
    {
        $client = $this->getLoggedClient('admin', 'ROLE_SUPER_ADMIN', 'user');
        $crawler = $client->request('GET', '/admin/dashboard');
        $this->assertEquals(200, $client->getResponse()->getStatusCode());

    }
    /*
     * Verify that a todo has an ID (it's saved in database)
     */
    public function testTodoHasId()
    {
        $this->assertGreaterThan(0,$this->todo->getId());
    }

}