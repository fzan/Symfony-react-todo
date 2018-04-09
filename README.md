Travis [![Build Status](https://travis-ci.org/fzan/Symfony-react-todo.svg?branch=master)](https://travis-ci.org/fzan/Symfony-react-todo)

###Symfony 4 TODO-app boilerplate

1) Sonata admin integration with custom admin classes
2) FOS REST API with NELMIO apidoc on /api/doc 
3) React-create-app dashboard
4) Some Phpunit backend + Sonata admin tests
   - Missing React tests (for now 3:-D ) 
5) Integrated travis-ci 
6) Heroku-ready configuration
7) Optional docker script (to check)

### HowTo
To be ready, for now just run 

> composer install

From the command line.

Use

> phpunit .

For unit testing.

if you want to rebuild the frontend app, go to:

> cd frontend/todo

and

> npm install && npm run build

If you encounter an error like:

>events.js:165
>      throw er; // Unhandled 'error' event

Try to 
> brew install watchman

Have fun and leave me a message :]