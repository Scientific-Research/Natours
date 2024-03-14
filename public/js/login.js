import axios from 'axios';
import { showAlert } from './alerts';

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

export const logout = async () => {
   try {
      const res = await axios.get('http://127.0.0.1:3000/api/v1/users/logout');

      if (res.data.status === 'success') {
         location.reload(true); // it forces a reload from the server and not from browser cache! in this case, we will not have the user menu from cache, rather, we will have a fresh page from server => that's why this true here is very important!
      }
   } catch (error) {
      console.log('hallo');

      showAlert('error', 'Error logging out! Try again.' + error.response); // when for example, we don't have Internet!
   }
};
