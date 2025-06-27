import { API_YMAPS } from "../config/const"
 
const loadYmapsApi = (callback) => {

    if (window.ymaps == undefined) {
      const script = document.createElement('script')
      script.src = API_YMAPS
      script.onload = () => {
        callback(window.ymaps)
      }
      document.head.append(script)
    } else {
      callback(window.ymaps)
    }

}

export {loadYmapsApi}