'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', 'PostController.home');

// Route.on('/signup').render('auth.signup');
// Route.post('/signup', 'UserController.create').validator('CreateUser');

Route.get('/login', 'UserController.checkAdmin');
Route.post('/login', 'UserController.login').validator('LoginUser');

Route.get('/logout', async ({ auth, response }) => {
    await auth.logout();
    return response.redirect('/');
});

// Route.get('/post-a-job', 'JobController.userIndex');
// Route.post('/post-a-job', 'JobController.create').validator('CreateJob');

// Route.group(() => {
//     Route.get('/delete/:id', 'JobController.delete').middleware('FindJob');
//     Route.get('/edit/:id', 'JobController.edit').middleware('FindJob');
//     Route.post('/update/:id', 'JobController.update').validator('CreateJob').middleware('FindJob');
// }).prefix('/post-a-job');


Route.get('/admin', 'AdminController.userIndex');

Route.get('/admin/home', 'AdminController.home');

//file
Route.get('/files', 'AdminController.files')
//upload
Route.post('/upload', 'AdminController.upload')
Route.get('/upload_token', 'AdminController.upload_token')
//creat folder
Route.post('/creat_folder', 'AdminController.creat_folder')
//edit folder
Route.post('/edit_folder', 'AdminController.edit_folder')
//delete folder
Route.post('/delete_folder', 'AdminController.delete_folder')
//delete files
Route.post('/delete_file', 'AdminController.delete_file')


//Route.post('/admin', 'PostController.create');

Route.on('/post/create').render('admin.post.create').middleware(['auth']);
Route.post('/post/create', 'PostController.create');

Route.group(() => {
    Route.get('/:id', 'PostController.view').middleware(['FindPost']);
    Route.get('/delete/:id', 'PostController.delete').middleware(['FindPost', 'auth']);
    Route.get('/edit/:id', 'PostController.edit').middleware(['FindPost', 'auth']);
    Route.post('/update/:id', 'PostController.update').validator('CreatePost').middleware(['FindPost', 'auth']);
}).prefix('/post');


Route.on('/post/:id').render('post');
