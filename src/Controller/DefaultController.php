<?php

namespace App\Controller;

use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class DefaultController extends Controller
{
    /**
     * @Route("/", name="def")
     */
    public function index()
    {
        return $this->redirectToRoute('sonata_admin_dashboard');
    }
}
