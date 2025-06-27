export function copyToClipboard() {
    document.querySelectorAll('[data-copy]').forEach(el => {
        el.addEventListener('click', e => {
            e.preventDefault()
            let text = (e.target.closest('a')) ? e.target.closest('a').innerText : e.target.dataset.copy
            navigator.clipboard.writeText(text)
                .then(() => {
                    window.STATUS.msg('Скопировано в буфер обмена!')
                })
                .catch(err => {
                    console.log('Something went wrong', err);
                });

        })
    })
} 