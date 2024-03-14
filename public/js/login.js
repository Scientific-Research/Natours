const login = async (email, password) => {
   //  console.log(email, password);
   //  alert(email, password);
   // NOTE: to get the http request for the login, we use the axios from CDN to fecth the data!

   // Usage:
   try {
      const res = await axios.post('http://127.0.0.1:3000/api/v1/users/login', { email, password });

      // console.log('response from axios:', res.data); // data is our JSON data!
      if (res.data.status === 'success') {
         alert('Logged in successfully!');
         window.setTimeout(() => {
            location.assign('/');
         }, 1500);
      }
   } catch (error) {
      // console.log('Error:', error.response.data);
      alert(error.response.data.message); // we get the message from our data => JSON data!
   }
};

document.querySelector('.form').addEventListener('submit', (e) => {
   e.preventDefault();
   const email = document.getElementById('email').value;
   const password = document.getElementById('password').value;
   login(email, password);
});
