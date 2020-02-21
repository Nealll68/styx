const { hooks } = require('@adonisjs/ignitor')

hooks.after.httpServer(async () => {
    const Monitor = use('App/Services/Monitor') 
    const User = use('App/Models/User')
    const Config = use('App/Models/Config')

    await Monitor.takeMeasures()

    if (await User.getCount() === 0) {
        await User.create({
            username: 'admin',
            password: 'admin',
            privilege: 2
        })
    }

    if (await Config.getCount() === 0) {
        await Config.create()
    }
})