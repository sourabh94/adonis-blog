'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Job = use('App/Models/Job')

class FindJob {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ request , params, session, response }, next) {
    // call next to advance the request
    const job = await Job.find(params.id);

    if(!job){
      session.flash({notification:'job not found'});

      return response.redirect('back');
    }
    request.job = job;
    
    await next()
  }
}

module.exports = FindJob
