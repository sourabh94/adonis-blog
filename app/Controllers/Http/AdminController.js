'use strict'

const Post = use('App/Models/Post')

class AdminController {

    async home({view}) {

        // Fetch a post
        
        const posts = await Post.all();
        
        //console.log(posts.toJSON());
        
        return view.render('admin.home', { posts: posts.toJSON() })
    }

    async userIndex({view, auth, response}) {

        // Fetch all user's jobs
        const user = await auth.user;
        //console.log(user);
        if(auth.user)
        return response.redirect('/admin/home');
        else
        return view.render('auth.login');
    }

    async files(request, response){
        request.csrfField();
        const images = fs.readdirSync(Helpers.publicPath('upload'))
        var sorted = []
        for (let item of images){
            if(item.split('.').pop() === 'png'
            || item.split('.').pop() === 'jpg'
            || item.split('.').pop() === 'jpeg'
            || item.split('.').pop() === 'svg'){
                var abc = {
                      "image" : "/upload/"+item,
                      "folder" : '/'
                }
                sorted.push(abc)
            }else{
                const images2 = fs.readdirSync(Helpers.publicPath('/upload/'+item))
                for (let items of images2){
                    if(items.split('.').pop() === 'png'
                    || items.split('.').pop() === 'jpg'
                    || items.split('.').pop() === 'jpeg'
                    || items.split('.').pop() === 'svg'){
                        var abc = {
                              "image" : "/upload/"+item+'/'+items,
                             "folder" : item
                        }
                        sorted.push(abc)
                    }
                }
            }
        }
  
        await response.send(sorted);
    }

    async upload_token (request, response, next) {
        const upload_token = request.csrfToken()
        response.json({'upload_token': upload_token})
     }
     async upload(request, response){
         //upload file
         if(request.file('flFileUpload') && request.file('flFileUpload').clientName() !== ''){
             const flFileUpload = request.file('flFileUpload', {
                 maxSize: '2mb',
                 allowedExtensions: ['jpg', 'png', 'jpeg', 'gif', 'svg']
             })
             var d = new Date();
             var n = d.getTime();
             const fileName = 'upload_'+n+`.${flFileUpload.extension()}`
             const folder = request.input('txtFolderUpload')
     
             if(folder !== '/'){
                await flFileUpload.move(Helpers.publicPath('/upload/'+folder+'/'), fileName)
             }else{
               await flFileUpload.move(Helpers.publicPath('/upload/'), fileName)
             }
             response.redirect('back')
         }else{
             response.redirect('back')
         }
     }
     
    async creat_folder(request, response){
         var folder = Helpers.publicPath('/upload/') + request.input('folder')
         if(!fs.existsSync(folder)){
             fs.mkdirSync(folder)
             var readStream = fs.createReadStream(Helpers.publicPath('/no-image.png'));
             var writeStream = fs.createWriteStream(folder+'/no-image.png');
             readStream.pipe(writeStream);
         }
         response.redirect('back')
     }
     
    async edit_folder(request, response){
       var folder = request.input('folder')
       var folder_edit = request.input('folder_edit')
       fs.renameSync(Helpers.publicPath('/upload/'+folder), Helpers.publicPath('/upload/'+folder_edit))
       response.redirect('back')
     }
     
    async delete_folder(request, response){
         var folder_del = Helpers.publicPath('/upload/') + request.input('folder_del')
         var images = fs.readdirSync(folder_del)
         for (let item of images){
           fs.unlinkSync(folder_del+'/'+item);
         }
         fs.rmdirSync(Helpers.publicPath('/upload/') + request.input('folder_del'))
         response.redirect('back')
     }
     
    async delete_file(request, response){
         var url_del = Helpers.publicPath() + request.input('url_del')
         if(fs.existsSync(url_del)){
             fs.unlinkSync(url_del)
         }
         response.redirect('back')
     }

}

module.exports = AdminController
