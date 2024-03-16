import '@babel/polyfill';
import { login, logout } from './login';
import { updateSettings } from './updateSettings';

// DOM ELEMENTS
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');

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
