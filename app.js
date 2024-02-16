const express = require('express');
const tours = require('./dev-data/data/tours-simple.json');

const app = express();

/**  
// GET
app.get('/', (req, res) => {
    //    res.status(200).send('Hallo from express!');
    // or we can send the message in format of JSON:
    // JSON is ,in fact, a JavsScript Object Notaion, which is a JavaScript Object, but
    // the difference is that: Key has quotation like Value. but in Normal JS Object, Key
    // doesn't have quotaion and Value only has the quotation! for example:
    // message is Key and 'Hello from express' is Value here!
    res.status(200).json({
        message: 'Hallo from express!',
        app: 'Natours',
    });
});

// POST
app.post('/info', (req, res) => {
    //    res.status(200).send('Hallo from express!');
    // or we can send the message in format of JSON:
    // JSON is ,in fact, a JavsScript Object Notaion, which is a JavaScript Object, but
    // the difference is that: Key has quotation like Value. but in Normal JS Object, Key
    // doesn't have quotaion and Value only has the quotation! for example:
    // message is Key and 'Hello from express' is Value here!
    res.status(200).json({
        message: 'Hallo from express!',
        app: 'Natours',
    });
});
*/

app.get('/api/v1/tours', (req, res) => {
   res.status(200).send(tours.map((tour) => tour));
});

PORT = 3000;
app.listen(PORT, '127.0.0.1', () => {
   console.log(`Server is listening on PORT ${PORT}`);
});
