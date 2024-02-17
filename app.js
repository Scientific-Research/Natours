const fs = require('fs');
const express = require('express');
// const tours = require('./dev-data/data/tours-simple.json');

const app = express();

// for app.post(), we need this app.use(express.json()) absolutely!
app.use(express.json()); // To parse JSON data => this is a middleware and we use it when we
// have JSON and express - it stays between req and res, that's why it called: middleware!

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
      //   data: {
      //      // tours:tours
      //      tours,
      //   },
      // tours:tours
      // OR
      tours,
   });
});

// to get the tour with ID:
app.get('/api/v1/tours/:id', (req, res) => {
   const id = req.params.id;
   console.log(id);

   const tour = tours.find((item) => item.id === parseInt(id));
   console.log(tour);

   res.status(200).json({
      status: 'success',
      results: tours.length,
      tours: tour,
   });
});

// POST
app.post('/api/v1/tours', (req, res) => {
   // SOME INITIAL TESTS:
   //    const bodyContent = req.body;
   //    console.log(bodyContent);
   //    res.send('bodyContent: ' + bodyContent); // ERROR in Postman
   //    res.send(`bodyContent: ${bodyContent}`); // ERROR in Potsman
   //    res.send({ bodyContent: bodyContent }); // it must be in format of JSON OBJECT due to middleware:
   // app.use(express.json());

   ///// THIS IS MY SOLUTION TO GET THE ID AND PUT IT IN OUR OBJECT TOUR!
   const id_1 = tours.length - 1; // we don't need actually the length, we need only last id
   const newId = id_1 + 1;
   //    const tour = { data: req.body, id: id }; // here reads the information from Postman due to req.body
   //    const tour = { id: req.body.id, data: req.body }; // here reads the information from Postman due to req.body
   const newTour = req.body; // here reads the information from Postman due to req.body
   newTour.id = newId; // to add above id to our tour object in Postman!
   console.log(newTour);
   ///// THIS IS MY SOLUTION TO GET THE ID AND PUT IT IN OUR OBJECT TOUR!

   ///// THIS IS JONAS SOLUTION TO GET THE ID AND PUT IT IN OUR OBJECT TOUR!
   //    const newId = tours[tours.length - 1].id + 1;
   //    const newTour = Object.assign({ id: newId }, req.body);
   ///// THIS IS JONAS SOLUTION TO GET THE ID AND PUT IT IN OUR OBJECT TOUR!

   tours.push(newTour); // to add the new tour to our current tours
   //    res.status(201).json({
   //       status: 'success',
   //       results: tours.length,
   //       tours: tour,
   //    });
   // WHEN WE USE ASYNC FUNCTION, WE HAVE TO BRING THE res.status()...
   // INSIDE THE fs.writeFile()
   fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours, null, 2), () =>
      res.status(201).json({
         status: 'success',
         //  results: tours.length,
         //  data: {
         tours: newTour,
         //  },
      })
   );
   // WE ARE NOT ALLOWING TO USE SYNC FUNCTION HERE, BECAUSE IT WILL
   // BLOCK THE PROGRAM! THAT'S WHY WE HAVE TO USE ASYNC FUNCTION LIKE ABOVE FINCTION!
   // fs.writeFileSync(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours, null, 2), 'utf-8');
});

PORT = 3000;
app.listen(PORT, '127.0.0.1', () => {
   console.log(`Server is listening on PORT ${PORT}`);
});
