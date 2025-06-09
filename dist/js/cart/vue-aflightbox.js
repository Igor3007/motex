 const vueAflightbox = Vue.component('afLightbox', {

     template: `
            <div class = "af-popup"
            @click = "closeOnWindow" :class = "{'af-popup--visible' : isopen, 'af-popup--mobile': deviceWidth <= 480} " >
                <div class="af-popup__bg" ></div>
                <div class="af-popup__wrp">
                    <div class="af-popup__container">
                        <div class="af-popup__close" @click="close()">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" tabindex="-1"><path d="M20 20L4 4m16 0L4 20"></path></svg>
                        </div>
                        <div class = "af-popup__content"> 
                            <slot><div>sllooottt</div></slot>
                        </div>
                    </div>
                </div>
            </div>
        `,

     name: 'aflightbox',

     data: function () {
         return {
             isopen: false,
             deviceWidth: document.body.clientWidth
         }
     },

     methods: {

         closeOnWindow(e) {
             if (!e.target.closest('.af-popup__content')) {
                 this.close()
             }
         },

         open() {
             this.isopen = true;
             document.body.classList.toggle('page-hidden', this.isopen)
         },

         close() {
             this.isopen = false
             document.body.classList.toggle('page-hidden', this.isopen)
         }
     }
 })