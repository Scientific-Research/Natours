// type is 'success' or 'error'

export const hideAlert = () => {
   const el = document.querySelector('.alert'); // select the elemnt with alert class and then remove that! exactly the same class as we used in showAlert function!

   // we have to move one level up to the parent element and then remove the child on it!
   if (el) el.parentElement.removeChild(el);
};

export const showAlert = (type, msg) => {
   // NOTE: first of all, we hide other alerts which already exists!
   hideAlert();
   const markup = `<div class="alert alert--${type}">${msg}</div>`;
   document.querySelector('body').insertAdjacentHTML('afterbegin', markup); // inside of the body, right at the beginning!
   // NOTE: hide all alerts after 5 seconds!
   window.setTimeout(() => {
      hideAlert;
   }, 5000);
};
