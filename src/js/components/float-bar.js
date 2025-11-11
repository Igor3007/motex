export const floatBar = () => {

  if (document.querySelector('.float-bar__top')) {
    const btnPageScrollTop = document.querySelector('.float-bar__top')
    const btnFloat = document.querySelector('.float-bar')
    btnPageScrollTop.addEventListener('click', e => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      })
    })

    window.addEventListener('scroll', e => {
      if (document.documentElement.scrollTop > 400) {
        btnFloat.classList.add('is-active')
      } else {
        if (btnFloat.classList.contains('is-active')) btnFloat.classList.remove('is-active')
      }
    })
  }

}
