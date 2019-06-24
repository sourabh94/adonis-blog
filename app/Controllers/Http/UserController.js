'use strict'

const User = use('App/Models/User')

class UserController {

    async checkAdmin({view, request, response, auth}){

        let user = await User.findOrCreate({ type: 'admin' },{ username: 'admin', password: 'hcpadmin@2019', type:'admin' });
        
        //console.log(user);

        return view.render('auth.login');

    }

    async create({request, response, auth}){

        const user = await User.create(request.only(['username','email','password']));
        
        await auth.login(user);
        return response.redirect('/');

    }

    async login({ request, auth, response, session }) {
        const { username, password } = request.all();
        
        try {
            await auth.attempt(username, password);
            return response.redirect('/admin');
        } catch (error) {
            //console.log(error);
            session.flash({loginError: 'These credentials do not work.'})
            return response.redirect('/login');
        }
    }

}

module.exports = UserController
