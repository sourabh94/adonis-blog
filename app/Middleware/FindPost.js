'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Post = use('App/Models/Post')

class FindPost {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ request, params, response }, next) {
    // call next to advance the request
    const post = await Post.find(params.id);
    //console.log(post);
    if(!post){
      session.flash({notification:'post not found'});

      return response.redirect('back');
    }
    request.post = post;
    
    await next()
  
  }
  
}

module.exports = FindPost
