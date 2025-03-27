 const vueCartCutter = Vue.component('vueCartCutter', {

     template: '<div><slot></slot></div>',
     name: 'vueCartCutter',
     mounted: function () {
         console.log('vueCartCutter')

     },

     data: function () {
         return {
             isopen: false,
             fileArray: []
         }
     },

     methods: {

         changeFileInput: function (e) {

             let mimeType = [
                 'image/jpeg',
                 'application/x-zip-compressed',
                 'image/png',
             ]

             let files = Array.from(e.target.files);

             if ((files.length + this.fileArray.length) > 10) {
                 alert('Допустимо не более 10 файлов, лишние файлы были удалены')
             }

             for (let key in files) {

                 if (!mimeType.includes(files[key].type)) {
                     alert('Не поддерживаемый тип файла ' + files[key].name)
                     break;
                 }

                 if (files[key].size > 50000000) {
                     alert('Допустимы файлы не более 50мБ \n' + files[key].name)
                     break;
                 }

                 if (this.fileArray.length < 10) {
                     this.fileArray.push(files[key])
                 }

             }

         },

         removeAttachFile: function (i) {
             this.fileArray.splice(i, 1);
         },
     }
 })