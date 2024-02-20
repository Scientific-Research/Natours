// const express = require('express');

// const app = express();
const app = require('./app');
// show us which environment we are using currently: => it shows us development
// console.log(app.get('env'));
console.log(process.env); // shows us a bunch of node variables
// type this command in VSCode Terminal: NODE_ENV=development X=23 nodemon server.js
// 4) START SERVER => now, our exntry point to start our application is server.js and no longer
// app.js => i will change it in package.json for nodemon too.

PORT = 3000;
app.listen(PORT, '127.0.0.1', () => {
   console.log(`Server is listening on PORT ${PORT}`);
});
