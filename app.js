const fs = require('fs');
const express = require('express');
// const tours = require('./dev-data/data/tours-simple.json');

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

// const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'utf-8'));
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));
// without 'utf-8', we will have Buffer(a lot of numbers from ASCII Table)
// with 'utf-8' we will have string at output but not in the from of JS object string
// That's why at the end, we have to add JSON.parse() to convert our string to JS object string

app.get('/api/v1/tours', (req, res) => {
   //    res.status(200).send(tours.map((tour) => tour));
   // Solution Nr.1
   //    res.status(200).send({
   //       tours,
   //    });
   // Solution Nr.2 // actually, we don't need to write .json() here, because we convert the file
   // already to the JSON via JSON.parse() and it is enough to write only .send() =>
   // douple mouple :)
   res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
         // tours:tours
         tours,
      },
   });
});

PORT = 3000;
app.listen(PORT, '127.0.0.1', () => {
   console.log(`Server is listening on PORT ${PORT}`);
});
