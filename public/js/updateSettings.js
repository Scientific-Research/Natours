// updateData
import axios from 'axios';
import { showAlert } from './alerts';

// type is either 'password' or 'data'
export const updateSettings = async (data, type) => {
   // export const updateData = async (name, email) => {
   try {
      const url =
         type === 'password'
            ? '/api/v1/users/updateMyPassword' // => in prod mode
            : '/api/v1/users/updateMe'; // => in prod mode
      // ? 'http://127.0.0.1:3000/api/v1/users/updateMyPassword' => in dev mode
      // : 'http://127.0.0.1:3000/api/v1/users/updateMe'; => in dev mode

      const res = await axios.patch(url, data);
      // console.log('response from axios:', res.data); // data is our JSON data!
      if (res.data.status === 'success') {
         showAlert('success', `${type.toUpperCase()} updated successfully!`);
      }
   } catch (error) {
      showAlert('error', error.response.data.message);
   }
};
