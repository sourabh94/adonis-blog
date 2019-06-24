================================================================================
*Plugin imagebrowser ckeditor.
*Inherited and developed by: Quoc Nguyen Bao, Thank you to the author: Slavi Pantaleev (Copyright (c) 2013)

Contact Info====================================================================
- Full Name: Quoc Nguyen Bao
- Email: quocbao.thietke.laptrinhweb@gmail.com
- Facebook: https://www.facebook.com/devilcry1989
- Phone, Zalo: +84 937 587 087
- Skype: quocbao_design
================================================================================

Donations (Visa master)=========================================================
- Sacombank: https://www.sacombank.com.vn
- Bank account holder: NGUYEN BAO QUOC
- Bank account number: 060132908268
================================================================================

Install=========================================================================
* route
//file
Route.get('/files', 'HomeController.files')
//upload
Route.post('/upload', 'HomeController.upload')
Route.get('/upload_token', 'HomeController.upload_token')
//creat folder
Route.post('/creat_folder', 'HomeController.creat_folder')
//edit folder
Route.post('/edit_folder', 'HomeController.edit_folder')
//delete folder
Route.post('/delete_folder', 'HomeController.delete_folder')
//delete files
Route.post('/delete_file', 'HomeController.delete_file')

- 1/Dowload plugin:
+ https://ckeditor.com/download
+ Add javascript:
<script type="text/javascript">
  CKEDITOR.replace('description', {
    "extraPlugins" : 'imagebrowser',
		"imageBrowser_listUrl" : "/files"
  });
</script>

- 2/Creat api controller:
* files(request, response){
      request.csrfToken()
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

      yield response.send(sorted);
}
- 3/Add control controller: (upload_token, upload, creat_folder, edit_folder, delete_folder, delete_file)
* upload_token (request, response, next) {
   const upload_token = request.csrfToken()
   response.json({'upload_token': upload_token})
}
* upload(request, response){
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
		  yield flFileUpload.move(Helpers.publicPath('/upload/'+folder+'/'), fileName)
		}else{
		  yield flFileUpload.move(Helpers.publicPath('/upload/'), fileName)
		}
		response.redirect('back')
	}else{
		response.redirect('back')
	}
}



* creat_folder(request, response){
	var folder = Helpers.publicPath('/upload/') + request.input('folder')
	if(!fs.existsSync(folder)){
		fs.mkdirSync(folder)
		var readStream = fs.createReadStream(Helpers.publicPath('/no-image.png'));
		var writeStream = fs.createWriteStream(folder+'/no-image.png');
		readStream.pipe(writeStream);
	}
	response.redirect('back')
}

* edit_folder(request, response){
  var folder = request.input('folder')
  var folder_edit = request.input('folder_edit')
  fs.renameSync(Helpers.publicPath('/upload/'+folder), Helpers.publicPath('/upload/'+folder_edit))
  response.redirect('back')
}

* delete_folder(request, response){
	var folder_del = Helpers.publicPath('/upload/') + request.input('folder_del')
	var images = fs.readdirSync(folder_del)
	for (let item of images){
	  fs.unlinkSync(folder_del+'/'+item);
	}
	fs.rmdirSync(Helpers.publicPath('/upload/') + request.input('folder_del'))
	response.redirect('back')
}

* delete_file(request, response){
	var url_del = Helpers.publicPath() + request.input('url_del')
	if(fs.existsSync(url_del)){
		fs.unlinkSync(url_del)
	}
	response.redirect('back')
}
- 4/Run and view results
================================================================================
