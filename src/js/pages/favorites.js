import { afLightbox } from '../components/af-lightbox'

const buttons = document.querySelectorAll('[data-action="clear"]');
const clearAction = (e) => {
    e.preventDefault();
    const html = `<div class="warn-modal">
                    <div class="warn-modal__heading"><h2>Очистить список?</h2></div>
                    <div class="warn-modal__info">
                        <div class="warn-modal__info-text">
                            <p>Список не очистится, <br> если вы закроете окно</p>
                        </div>
                        <div class="warn-modal__info-actions">
                            <button class="btn-blue">Очистить</button>
                            <button class="btn-custom">Отменить</button>
                        </div>
                    </div>
                </div>`
    const popup = new afLightbox({
        mobileInBottom: true,
    });
    popup.open(html, content => {
        content.querySelector('.btn-blue').addEventListener('click', () => {

            fetch(e.target.dataset.url, {
                method: 'GET',
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.status) {
                        window.STATUS.msg('Список избранного очищен!')
                        document.querySelector('.mx-bd-catalog__container').innerHTML = '<div class="empty" >Ваш список избранных товаров пуст ;)</div>'
                        popup.close();
                    } else {
                        window.STATUS.err('Error clear favorites list')
                    }
                }
                )

        })
        content.querySelector('.btn-custom').addEventListener('click', () => {
            popup.close();
        })
    });
}

buttons.forEach(button => {
    button.addEventListener('click', clearAction);
});