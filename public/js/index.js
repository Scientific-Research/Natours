import '@babel/polyfill';
import { login, logout } from './login';
import { updateSettings } from './updateSettings';

// DOM ELEMENTS
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');

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
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      updateSettings({ name, email }, 'data');
   });

if (userPasswordForm)
   userPasswordForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const passwordCurrent = document.getElementById('password-current').value;
      const password = document.getElementById('password').value;
      const passwordConfirm = document.getElementById('password-confirm').value;
      await updateSettings({ passwordCurrent, password, passwordConfirm }, 'password');

      // NOTE: to clear the fields after our password updated successfully!

      document.getElementById('password-current').value = '';
      document.getElementById('password').value = '';
      document.getElementById('password-confirm').value = '';
   });
