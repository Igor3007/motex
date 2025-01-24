document.addEventListener("DOMContentLoaded", function () {

    /********************************************
     * ajax request
     ********************************************/

    function ajax(params, btn, response) {
        let xhr = new XMLHttpRequest();
        xhr.open('POST', params.url)
        xhr.send(params.data)

        xhr.onload = function () {
            response(xhr.status, xhr.response)
        };

        xhr.onerror = function () {
            console.error(`Ошибка соединения`);
        };

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 3) {
                btn.classList.add('btn-loading')
            }

            if (xhr.readyState == 4) {
                setTimeout(function () {
                    btn.classList.remove('btn-loading')
                }, 300)
            }
        };
    }

    /* Вывод сообщений */
    function state(type_err, message) {
        if (!document.querySelector('#status')) {
            var elem = document.createElement("div");
            elem.setAttribute('id', 'status');
            document.body.append(elem)
        }

        document.querySelector('#status').classList.remove('complete')
        document.querySelector('#status').classList.remove('error')

        if (type_err) {
            document.querySelector('#status').classList.add('complete')
            document.querySelector('#status').innerHTML = message
        } else {
            document.querySelector('#status').classList.add('error')
            document.querySelector('#status').innerHTML = message
        }

        setTimeout(function () {
            document.querySelector('#status').classList.remove('complete')
            document.querySelector('#status').classList.remove('error')
        }, 8000);
    }


    window.initSendForm = function (el, onclose) {
        el.querySelectorAll('[data-form]').forEach(function (item) {

        })
    }

});


