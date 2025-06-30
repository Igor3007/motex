/* =========================================
video
=========================================*/
 
document.querySelectorAll('.video').forEach(container => {

    const video = container.querySelector('video')

    container.querySelector('.video__button').addEventListener('click', e => {
        video.play()
        video.setAttribute('controls', '')
        container.classList.add('is-play')
    })

    container.addEventListener('mouseenter', e => {
        !video.getAttribute('preload') || video.setAttribute('preload', 'true')
    })

    video.addEventListener('pause', e => {
        container.classList.add('is-pause')
        video.removeAttribute('controls')
    })
    video.addEventListener('play', e => {
        !container.classList.contains('is-pause') || container.classList.remove('is-pause')
    })
})
 