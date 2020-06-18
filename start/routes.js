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
| http://adonisjs.com/guides/routing
|
*/

const Route = use('Route')

Route
    .resource('/api/user', 'UserController')
    .apiOnly()
    .validator(new Map([
    [['users.store'], ['StoreUser']],
    [['users.update'], ['UpdateUser']]
    ]))
    .middleware(['auth'])

Route.post('api/auth/login', 'UserController.login')
Route
    .get('api/auth/logout', 'UserController.logout')
    .middleware(['auth'])
Route
    .get('api/auth/me', 'UserController.me')
    .middleware(['auth'])

Route
    .get('api/monitor', 'MonitorController.index')
    .middleware(['auth'])

Route.group(() => {
    Route.get('/', 'ConfigController.index')
    Route.post('/', 'ConfigController.update')
})
    .prefix('/api/config')
    .middleware('auth')

Route.group(() => {
    Route
        .resource('profile', 'ProfileController')
        .only(['index', 'store', 'update', 'show', 'destroy'])

    Route
        .resource('mission', 'MissionController')
        .only(['index', 'store', 'destroy'])
    Route.get('mission/detect', 'MissionController.detect')
    Route.post('mission/workshop', 'MissionController.storeWorkshop')

    Route.get('logs', 'LogController.index')
    Route.get('logs/current', 'LogController.current')
    Route.get('logs/:profileName/:filename', 'LogController.show')
    Route.get('/logs/download/:profileName/:filename', 'LogController.download')
    Route.delete('logs/:profileName/:filename', 'LogController.destroy')

    Route.put('params/:id', 'ParamController.update')
    Route.delete('params/:id', 'ParamController.reset')

    Route.get('config/:name', 'ConfigController.show')
    Route.put('config/:name', 'ConfigController.update')
    Route.delete('config/:name', 'ConfigController.reset')

    Route.get('difficulty/:name', 'DifficultyController.show')
    Route.put('difficulty/:name', 'DifficultyController.update')
    Route.delete('difficulty/:name', 'DifficultyController.reset')

    Route.get('basic/:name', 'BasicController.show')
    Route.put('basic/:name', 'BasicController.update')
    Route.delete('basic/:name', 'BasicController.reset')

    Route.get('workshop/file/:id', 'WorkshopController.getFileDetails')
    Route.get('workshop/collection/:id', 'WorkshopController.getCollectionDetails')

    Route.get('mod', 'ModController.index')
    Route.post('mod', 'ModController.upload')
    Route.delete('mod/:id', 'ModController.destroy')
    Route.get('mod/detect', 'ModController.detectWorkshopMods')
    Route.get('mod/local', 'ModController.indexLocal')
    Route.post('mod/local', 'ModController.addLocalMod')
    Route.delete('mod/local/:id', 'ModController.destroyLocal')

    Route.post('download/workshop', 'DownloadController.downloadWorskhop')
    Route.post('download/update', 'DownloadController.updateServer')
    Route.get('download/cancel', 'DownloadController.cancel')
})
    .prefix('api/server')
    .namespace('A3Server')
    .middleware(['auth'])

Route.any('*', 'NuxtController.render')
