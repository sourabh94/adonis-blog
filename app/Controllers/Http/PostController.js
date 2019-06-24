'use strict'

const Post = use('App/Models/Post')

class PostController {

    async home({view}) {

        // Fetch a post
        
        const posts = await Post.all();
        
        //console.log(posts.toJSON());
        
        return view.render('index', { posts: posts.toJSON() })
    }

    async view({ request, view}) {
        //console.log(request.post);
        return view.render('post', { post: request.post });
    }

    async create({ request, response, session, auth}) {
        const getPost = request.all();

        //console.log(getPost);

        const posted = await Post.create({
            title: getPost.title,
            body: getPost.body
        });

        session.flash({ message: 'Your article has been posted!' });
        return response.redirect('back');
    }

    async delete({ request, response, session}) {
        const post = request.post;

        await post.delete();
        session.flash({ message: 'Your post has been removed'});
        return response.redirect('back');
    }

    async edit({ request, view}) {
        //console.log(request.post);
        return view.render('admin.post.edit', { post: request.post });
    }

    async update ({ response, request, session}) {
        const post = request.post;

        post.title = request.all().title;
        post.body = request.all().body;

        await post.save();

        session.flash({ message: 'Your post has been updated. '});
        return response.redirect('/admin/home');
    }

}

module.exports = PostController
