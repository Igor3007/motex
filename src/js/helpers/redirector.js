/*
 behavior for `.switch` element;
 */
import {redirectTo} from './redirect-to';

export const initRedirectSwitch = () => {

  document
    .querySelectorAll('[data-redirect]')
    .forEach(redirector => {
      // set redirector state of page
      const destinationOn = redirector.getAttribute('data-redirect');
      const destinationOff = redirector.getAttribute('data-redirect-off');
      const {pathname} = window.location;

      redirector.checked = (pathname === destinationOn);

      redirector.addEventListener('change', (e) => {
        const {checked} = e.target;
        const url = checked ? destinationOn : destinationOff;
        redirectTo(url, 500);
      })
    });

  window.addEventListener('pageshow', () => {
    document
      .querySelectorAll('[data-redirect]')
      .forEach(redirector => {
        const destinationOn = redirector.getAttribute('data-redirect');
        const {pathname} = window.location;
        redirector.checked = (pathname === destinationOn);
      })
  });
}
