 /* =================================================
  css variable
  =================================================*/

  const css_variable = () => {
    let vh = window.innerHeight * 0.01;
    let hgtheader = document.querySelector('.header') ? document.querySelector('.header').clientHeight : 64
    let hgtheaderTop = document.querySelector('.top-header') ? document.querySelector('.top-header').clientHeight : 54
    let hgtheaderMain = document.querySelector('.main-header') ? document.querySelector('.main-header').clientHeight : 103

    document.documentElement.style.setProperty('--vh', vh + 'px');
    document.documentElement.style.setProperty('--hgt-header', hgtheader + 'px');
    document.documentElement.style.setProperty('--hgt-header-top', hgtheaderTop + 'px');
    document.documentElement.style.setProperty('--hgt-header-main', hgtheaderMain + 'px');

    window.globalConfig = {
      vh,
      hgtheader,
      hgtheaderTop,
      hgtheaderMain
    }

    return window.globalConfig
  }

  

  window.addEventListener('load', css_variable)
  window.addEventListener('resize', css_variable)

 