// updateData
import axios from 'axios';
import { showAlert } from './alerts';

export const updateData = async (name, email) => {
   try {
      const res = await axios.patch('http://127.0.0.1:3000/api/v1/users/updateMe', { name, email });

      // console.log('response from axios:', res.data); // data is our JSON data!
      if (res.data.status === 'success') {
         showAlert('success', 'Data updated successfully!');
      }
   } catch (error) {
      showAlert('error', error.response.data.message);
   }
};
