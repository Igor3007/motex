/** redirect to url with delay
 *
 * @param url - redirection url
 * @param timeout - delay
 */
export const redirectTo = (url, timeout = 0) => {
  setTimeout(() => {
    window.location.href = url;
  }, timeout);
}
