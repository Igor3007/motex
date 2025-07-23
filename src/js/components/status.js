export function Status() {

    this.containerElem = '#status'
    this.headerElem = '#status_header'
    this.msgElem = '#status_msg'
    this.btnElem = '#status_btn'
    this.timeOut = 10000,
      this.autoHide = true

    this.init = function () {
      let elem = document.createElement('div')
      elem.setAttribute('id', 'status')
      elem.innerHTML = '<div id="status_header"></div> <div id="status_msg"></div><div id="status_btn"></div>'
      document.body.append(elem)

      document.querySelector(this.btnElem).addEventListener('click', function () {
        this.parentNode.setAttribute('class', '')
      })
    }

    this.msg = function (_msg, _header) {
      this.onShow('complete', _header, _msg)
      if (this.autoHide) {
        this.onHide();
      }
    }
    this.err = function (_msg, _header) {
      _header = (_header ? _header : '')
      this.onShow('error', _header, _msg)
      if (this.autoHide) {
        this.onHide();
      }
    }
    this.wrn = function (_msg, _header) {
      _header = (_header ? _header : '')
      this.onShow('warning', _header, _msg)
      if (this.autoHide) {
        this.onHide();
      }
    }

    this.onShow = function (_type, _header, _msg) {
      document.querySelector(this.headerElem).innerText = _header || null;
      document.querySelector(this.msgElem).innerText = _msg || null;
      document.querySelector(this.containerElem).className = _type;
    }

    this.onHide = function () {
      setTimeout(() => {
        document.querySelector(this.containerElem).setAttribute('class', '')
      }, this.timeOut);
    }

    return this.init()

}
