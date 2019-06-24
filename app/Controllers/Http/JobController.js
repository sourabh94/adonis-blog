'use strict'

const Job = use('App/Models/Job')

class JobController {

    async home({view}) {
        
        // creating a job
        // const job = new Job;
        // job.title = 'My job title';
        // job.link = 'http://google.com';
        // job.description = 'My job description';
        // await job.save();

        // Fetch a job
        const jobs = await Job.all();

        return view.render('index', { jobs: jobs.toJSON() })
    }

    async userIndex({view, auth}) {

        // Fetch all user's jobs
        const jobs = await auth.user.jobs().fetch();
       // console.log(jobs)

        return view.render('jobs', { jobs: jobs.toJSON() })
    }

    async create({ request, response, session, auth}) {
        const job = request.all();

        const posted = await auth.user.jobs().create({
            title: job.title,
            link: job.link,
            description: job.description
        });

        session.flash({ message: 'Your job has been posted!' });
        return response.redirect('back');
    }

    async delete({ request, response, session}) {
        const job = request.job;

        await job.delete();
        session.flash({ message: 'Your job has been removed'});
        return response.redirect('back');
    }

    async edit({ request, view }) {
        return view.render('edit', { job: request.job });
    }

    async update ({ response, request, session}) {
        const job = request.job;

        job.title = request.all().title;
        job.link = request.all().link;
        job.description = request.all().description;

        await job.save();

        session.flash({ message: 'Your job has been updated. '});
        return response.redirect('/post-a-job');
    }

}

module.exports = JobController
