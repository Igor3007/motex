const redirectors = document.querySelectorAll('[data-redirect]');
const redirectTo = (url) => {
  setTimeout(() => {
    window.location.href = url;
  }, 500);
}
redirectors.forEach(redirect => {
  redirect.checked = false;
  redirect.addEventListener('change', (e) => {
    const destination = e.target.getAttribute('data-redirect');
    const {origin} = window.location;
    const {checked} = e.target;
    if (!checked) {
      return;
    }
    redirectTo(`${origin}/${destination}`);
  });
})
