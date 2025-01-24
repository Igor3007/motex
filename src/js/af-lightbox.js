document.addEventListener('DOMContentLoaded', function (event) {
    class afLightbox {
        constructor(option) {
            this.modal = '';
            this.warningModal = document.querySelector('.warn-modal');
            this.warningModalClose = this.warningModal.querySelector('.close-warn');
            this.closeWarningBtn = this.warningModal.querySelector('.btn-blue');
            this.stayBtn = this.warningModal.querySelector('.btn-custom');

            this.warningModalClose.addEventListener('click', () => this.closeWarning());
            this.closeWarningBtn.addEventListener('click', () => this.closePopup());
            this.stayBtn.addEventListener('click', () => this.closeWarning());

            if (option) {
                this.mobileBottom = (option.mobileInBottom ? option.mobileInBottom : false);
            }
        }

        createTemplate() {
            let template = document.createElement('div');
            template.innerHTML = `
                <div class="af-popup"> 
                    <div class="af-popup__bg"></div> 
                    <div class="af-popup__wrp"> 
                        <div class="af-popup__container"> 
                            <div class="af-popup__content"></div> 
                        </div> 
                    </div> 
                </div>`;
            document.body.append(template);
            this.instanse = template;
            return template;
        }

        open(content, afterShow) {
            let _this = this;
            this.modal = this.createTemplate();
            if (window.innerWidth <= 480 && this.mobileBottom) {
                this.modal.querySelector(".af-popup").classList.add("af-popup--mobile");
            }
            document.body.classList.add('page-hidden');
            this.modal.querySelector('.af-popup__content').innerHTML = content;

            this.modal.querySelectorAll('.af-popup__close, [data-af-popup="close"]').forEach(element => {
                element.addEventListener('click', function () {
                    _this.showWarning();
                });
            });

            if (afterShow) afterShow(this.modal);
            setTimeout(() => {
                this.modal.querySelector(".af-popup").classList.add("af-popup--visible");
            }, 10);
            this.createEvent();
        }

        showWarning() {
            this.warningModal.classList.add('is-visible');
        }

        closeWarning() {
            this.warningModal.classList.remove('is-visible');
        }

        closePopup() {
            if (window.innerWidth <= 480 && document.body.classList.contains('page-hidden')) {
                document.body.classList.remove('page-hidden');
            }
            this.instanse.querySelector('.af-popup').classList.remove('af-popup--visible');
            setTimeout(() => {
                this.instanse.remove();
                document.body.classList.remove('page-hidden');
            }, 300);
            this.closeWarning();
        }

        createEvent() {

        }
    }

    let buttonClickCall = document.querySelectorAll('.get-modal--call');
    buttonClickCall.forEach(buttonCall => {
        buttonCall.addEventListener('click', e => popupCall(buttonCall));
    });

    function popupCall(buttonCall) {
        const callPopup = new afLightbox({mobileInBottom: true});
        let htmlCall = document.querySelector('#modal-call').outerHTML;
        let template = `
            <div class="popup-call"> 
                <div class="af-popup__close"> 
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" tabindex="-1">
                        <path d="M20 20L4 4m16 0L4 20"></path>
                    </svg> 
                </div> 
                <div class="popup-call__content">${htmlCall}</div> 
            </div>`;
        callPopup.open(template, function (instance) {
            if (instance.querySelector('.popup-call')) {
                console.log('Popup opened with content:', htmlCall);
            }
            window.initSendForm(instance, () => {
                callPopup.close();
            });
        });
    }
});
