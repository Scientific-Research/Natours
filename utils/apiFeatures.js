// NOTE: We define here our class to use this class everywhere in our code:
class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  // we make now one method for each functionality://///////////////////////////
  ////////////////////////////////////////////////FILTER/////////////////!SECTION
  filter() {
    // const queryObj = { ...req.query }; // we made a copy of the req.query and converted it to an Object!
    const queryObj = {
      ...this.queryString
    }; // we made a copy of the req.query and converted it to an Object!
    const excludedFields = ['page', 'sort', 'limit', 'fields'];

    // Remove all these excluded fields from queryObj: => we don't need to have a new array, that's why we use FOREACH:
    excludedFields.forEach(el => delete queryObj[el]);

    // 1B) Advanced filtering:
    // NOTE: Exercise: {difficulty:'easy', duration:{$gte:5}}
    // we can do all these using replace() => gte, gt, lte, lt using regular expression
    // In Postman: 127.0.0.1:3000/api/v1/tours?difficulty=easy&duration[gte]=5
    // In VSCode Terminal:console.log(req.query)=>{ difficulty: 'easy', duration: { gte: '5' } }
    // console.log('queryObj' + queryObj);
    let queryStr = JSON.stringify(queryObj);
    // console.log('queryStr' + queryStr);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    // console.log(JSON.parse(queryStr)); // we want the Object here!

    // NOTE: THIS IS THE THIRD METHOD TO WRITE A SEARCH QUERY:
    // const tours = await Tour.find(req.query); // We don't set the parameters here in find() function, rather,
    // const tours = await Tour.find(queryObj); // We don't set the parameters here in find() function, rather,
    // const query = Tour.find(queryObj); // We don't set the parameters here in find() function, rather,
    // let query = Tour.find(JSON.parse(queryStr)); // We don't set the parameters here in find() function, rather,
    // all the search query parameters are available in URL in Postman. From there, we can set all the parameters!
    // this.query.find(JSON.parse(queryStr));
    this.query = this.query.find(JSON.parse(queryStr));
    // NOTE: we added now the price less than 1500 to the URL Search Query and it works fine
    // we can also add more search query to the URL like price in Postman URL
    // 127.0.0.1:3000/api/v1/tours?difficulty=easy&duration[gte]=5&price[lt]=1500

    // Regular expression: \b: means we want only these
    // four word and not these four words inside other words!
    // g means it replace for all these four word and not only the first one!

    return this; // to send entire object for next section which is sort().
  }
  ///////////////////SORT///////////////////////!SECTION
  sort() {
    // 2) Sorting in an Ascending Order: 127.0.0.1:3000/api/v1/tours?sort=price
    // Sorting in a descending Order: 127.0.0.1:3000/api/v1/tours?sort=-price
    // if (req.query.sort) {
    if (this.queryString.sort) {
      console.log(this.queryString.sort);
      // NOTE: it shows us an array of duration and price when we enter this url in Pastman: {{URL}}api/v1/tours?sort=duration&sort=price
      // output in Terminal: [ 'duration', 'price' ]
      // split can works only on string and not array, that's why we receive an error in Postman.
      // Hackers make use of that: they enter two times this word: sort and postman undesrtand that as an array, split does not understand array and at the end, we will have an error!
      // NOTE: we will use a package to remove such duplicate fields!
      // this package called: hpp => Http Parameter Polution

      // how to bring the search query items together with space instead of comma:
      // const sortBy = req.query.sort.split(',').join(' ');
      const sortBy = this.queryString.sort.split(',').join(' ');
      console.log(sortBy); // -price -ratingsAverage
      // 127.0.0.1:3000/api/v1/tours?sort=-price,-ratingsAverage
      // query = query.sort(req.query.sort);
      // query = query.sort(sortBy);
      this.query = this.query.sort(sortBy);
      // console.log(query);

      // sort('price ratingsAverage')
    } else {
      // query = query.sort('-createdAt');
      this.query = this.query.sort('-createdAt');
    }
    return this; // to send entire object for next section.
  }

  ////////////////////////////////// Limit fields /////////////////////////////////!SECTION
  limitFields() {
    // 3) Field limiting
    // NOTE: this is our URL in Postman:
    // 127.0.0.1:3000/api/v1/tours?fields=name,duration,difficulty,price
    // 127.0.0.1:3000/api/v1/tours?fields=-name,-duration => it gives us all the items in
    // a tour except name and duration in Postman, because they are minus signs beside them.
    // and we see only these four fields in Postman as result plus _id and without --v.
    // when we remove all the search queries and our URL in postman is like this:
    // 127.0.0.1:3000/api/v1/tours => the compiler goes to the else section and we will
    // not have the --v anymore!
    // if (req.query.fields) {
    if (this.queryString.fields) {
      // const fields = req.query.fields.split(',').join(' '); //this will produce:name duration price
      const fields = this.queryString.fields.split(',').join(' '); //this will produce:name duration price
      // query = query.select('name duration price');
      // query = query.select(fields); // to use this field!
      this.query = this.query.select(fields); // to use this field!
    } else {
      this.query = this.query.select('-__v'); // we exclude this item(version=> __v)
      // query = query.select('-__v'); // we exclude this item(version=> __v)
    }
    return this;
  }

  ///////////////////////// Pagination ////////////////////////////////!SECTION
  pagination() {
    // 4) Pagination: 127.0.0.1:3000/api/v1/tours?page=2&limit=10
    // const page = req.query.page * 1 || 1; // we say page number one is default value in JS!
    const page = this.queryString.page * 1 || 1; // we say page number one is default value in JS!
    const limit = this.queryString.limit * 1 || 100; // default value for limit would be 100!
    // const limit = req.query.limit * 1 || 100; // default value for limit would be 100!
    const skip = (page - 1) * limit; // for page No.3 => skip = (3-1)*10=20 and we skip 20 results
    // and page No.3 starts from result 21.
    // NOTE: page=2&limit=10 => user wants page Number 2 and 10 results per page!
    // 1-10 => page 1, 11-20 => page 2, 21-30 => page 3, ...
    // skip(10) means 10 items in first page has to be skipped to arrive to the second page!
    // but when we say page=3&limit=10, we have to set skip for 20 => skip(20), after 20 items
    // we will achieve third page!
    // query = query.skip(10).limit(10);
    // query = query.skip(skip).limit(limit);
    this.query = this.query.skip(skip).limit(limit);

    // if (req.query.page) {
    // if (this.queryString.page) {
    //    const numTours = await Tour.countDocuments();
    //    if (skip >= numTours) throw new Error('This page does not exist!');
    //    // NOTE: as soon as we get an Error, it goes out of try() block that we are now there
    //    // and will be in catch() section and shows the user the Error message!
    // }
    return this;
  }
}

// let tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));
// NOTE: WE DON'T NEED THIS ANYMORE, IT WAS JUST READING THE JSON FILE FOR TESTING PURPOSES
// I WILL USE ABOVE TOURS IMPORTED FROM TOURMODEL WHICH READS DATA FROM MONGODB!
// let tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

// const tourRouter = express.Router();
// app.use('/api/v1/tours', router);
// app.use('/api/v1/tours', tourRouter);
// this middleware is placed before all the other middlewares to check if the id is valid
// then goes to the next middleware, otherwise, it will return and will not go to other middlewares.
// NOTE: WE DON'T NEED THIS checkID MIDDLEWARE ANYMORE, BECAUSE MONGODB WILL NEVER GIVE US FALSE
// ID WHICH IS GREATED THAN THE LENGTH OF TOURS:
// exports.checkID = (req, res, next, val) => {
//    console.log(`Tour id is: ${val}`); // val has the value of id
//    if (req.params.id * 1 > tours.length) {
//       return res.status(404).json({
//          status: 'fail',
//          message: 'Invalid ID -- Checked by checkID middleware in tourController.js',
//       });
//    }
//    next();
// };

// Check Body
// NOTE: MONGOOSE SCHEMA WILL TAKE CARE OF THAT AND WE DON'T NEED IT HERE ANYMORE!
// exports.checkBody = (req, res, next) => {
//    if (!req.body.name || !req.body.price) {
//       return res.status(400).json({
//          status: 'fail',
//          message: 'Missing name or price properties!',
//       });
//    }
//    next();
// };

// 2) ROUTE HANDLERS

module.exports = APIFeatures;