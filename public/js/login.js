const login = async (email, password) => {
   console.log(email, password);
   //  alert(email, password);
   // NOTE: to get the http request for the login, we use the axios from CDN to fecth the data!
   //  const api = axios.create({
   //     baseURL: 'http://127.0.0.1:3000/api/v1',
   //  });

   //  try {
   //     const res = await api.axios({
   //        method: 'POST',
   //        url: 'http://127.0.0.1:3000/api/v1/users/login',
   //        data: {
   //           email: email,
   //           password: password,
   //        },
   //     });
   const api = axios.create({
      baseURL: 'http://127.0.0.1:3000/api/v1',
   });

   // Usage:
   try {
      const res = await api.post('/users/login', { email, password });
      console.log('response from axios:', res.data);
   } catch (error) {
      console.log('Error:', error.response.data);
   }
   //     console.log('response from axios: ' + res.data);
   //  } catch (error) {
   //     console.log(error.response.data);
   //  }
};

document.querySelector('.form').addEventListener('submit', (e) => {
   e.preventDefault();
   const email = document.getElementById('email').value;
   const password = document.getElementById('password').value;
   login(email, password);
});
