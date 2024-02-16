const express = require('express');

const app = express();

app.get('/', (req, res) => {
   res.send('Hallo from express!');
});

PORT = 3000;
app.listen(PORT, '127.0.0.1', () => {
   console.log(`Server is listening on PORT ${PORT}`);
});
