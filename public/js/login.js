import axios from 'axios';
import { hideAlert, showAlert } from './alerts';

export const login = async (email, password) => {
   // console.log('LOGIN...');
   // console.log(email, password);
   //  alert(email, password);
   // NOTE: to get the http request for the login, we use the axios from CDN to fecth the data!

   // Usage:
   try {
      const res = await axios.post('http://127.0.0.1:3000/api/v1/users/login', { email, password });

      // console.log('response from axios:', res.data); // data is our JSON data!
      if (res.data.status === 'success') {
         showAlert('success', 'Logged in successfully!');
         // alert('Logged in successfully!');
         window.setTimeout(() => {
            location.assign('/');
         }, 100);
      }
   } catch (error) {
      // console.log('Error:', error.response.data);
      showAlert('error', error.response.data.message); // we get the message from our data => JSON data!
      // alert(error.response.data.message); // we get the message from our data => JSON data!
   }
};
