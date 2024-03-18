import '@babel/polyfill';
import { login, logout } from './login';
import { updateSettings } from './updateSettings';
import { bookTour } from './stripe';

// DOM ELEMENTS
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-tour');

// DELEGATION

if (loginForm)
   loginForm.addEventListener('submit', (e) => {
      // document.querySelector('.form').addEventListener('submit', (e) => {

      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      // console.log(email, password);
      login(email, password);
   });

// NOTE: when somebody click on the logout button, the logout function will be executed!
if (logOutBtn) logOutBtn.addEventListener('click', logout);

if (userDataForm)
   userDataForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // to create a form here and append the requested fields to that form => we do this to add photo, otherwise, the previous code for name and email was enough and we don't nedd the form here!
      const form = new FormData();
      form.append('name', document.getElementById('name').value);
      form.append('email', document.getElementById('email').value);
      form.append('photo', document.getElementById('photo').files[0]); // Only one photo=>index 0
      console.log(form);

      updateSettings(form, 'data'); // axios recognize the form as an object and do the same like before! we don't need to change anything in updateSettings file!

      // const name = document.getElementById('name').value;
      // const email = document.getElementById('email').value;
      // updateSettings({ name, email }, 'data');
   });

if (userPasswordForm)
   userPasswordForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      document.querySelector('.btn--save-password').textContent = 'Updating...';

      const passwordCurrent = document.getElementById('password-current').value;
      const password = document.getElementById('password').value;
      const passwordConfirm = document.getElementById('password-confirm').value;
      await updateSettings(
         { passwordCurrent, password, passwordConfirm },
         'password'
      );

      // NOTE: to clear the fields after our password updated successfully!

      document.querySelector('.btn--save-password').textContent =
         'Save Password';
      document.getElementById('password-current').value = '';
      document.getElementById('password').value = '';
      document.getElementById('password-confirm').value = '';
   });

if (bookBtn)
   bookBtn.addEventListener('click', (e) => {
      // const tourId = e.target.dataset.tourId;
      e.target.textContent = 'Processing...';
      const { tourId } = e.target.dataset;
      bookTour(tourId);
   });
