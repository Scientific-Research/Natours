import '@babel/polyfill';
import { login } from './login';

// DOM ELEMENTS
const loginForm = document.querySelector('.form');

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
