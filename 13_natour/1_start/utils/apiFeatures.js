class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    console.log('filter');
    //==================== filtering ======================
    const queryObj = { ...this.queryString };
    const excluded = ['page', 'limit', 'sort', 'fields'];

    excluded.forEach((excludeParam) => delete queryObj[excludeParam]);

    //=========================== Advanced filtering ===============================
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);

    // let query = Tour.find(JSON.parse(queryStr));
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    console.log('sort');
    //============================ Sorting =================================
    //! http://127.0.0.1:8000/api/v1/tours?sort=-price  or   http://127.0.0.1:8000/api/v1/tours?sort=price ==> if you want to sort the data based on price in ascending order than you can just pass the query params as "sort=price" , else if you want to sort in descending order than you can pass the query params in "sort=-price" . In case if both tour have same price and in those you want another deciding factor to sort , than you can add another key name based on which you wanna sort as shown below "http://127.0.0.1:8000/api/v1/tours?sort=-price,ratingsAverage" . We have both "price" and "ratingsAverage" as property inside out tour .
    if (this.queryString.sort) {
      let sortBy = this.queryString.sort.split(',').join(' '); //
      this.query = this.query.sort(sortBy); // query.sort("-price") or query.sort("price") or query.sort("-price ratingsAverage"); if we are sending two properties based on which tour should be sorted, than at first tour will be sorted based on "price" property. But a certain tours have same price than only after that those tours will be sorted based on second property i.e. "ratingsAverage" . And you can handle wheter the data should be in ascending or descending order using "-".
    } else {
      this.query = this.query.sort('-createdAt'); // creating a default sorting based on tours created in case user doesnt sort the tours .
    }
    return this;
  }

  fields() {
    console.log('fields');
    //============================ Fields limiting =================================
    //!==> Fields means displaying only limited data to the user, which are actually required by the user instead of providing all the data every time user request for the data. "http://127.0.0.1:8000/api/v1/tours?fields=name,duration,price,difficulty"
    if (this.queryString.fields) {
      const fieldQuery = this.queryString.fields.split(',').join(' '); // "name duration price difficulty"
      this.query = this.query.select(fieldQuery); // "name duration price difficulty" ==> if fields are given in this manner than only these four fields are selected. but if use negative sign than it means exclude that field which contains "-" . For eg query.select("-name") --> This query says that include all the fields except name field .
    } else {
      this.query = this.query.select('-__v'); // this field is given created by mongoose, and it uses this field internally . So we no need to include this field.
      //!==> We can also exclude a field in the schema, Go to "tourModel.js" and there you can see that we have excluded it using "select : false" , but if you want to overwrite this than you can use "+" sign same like "-" while sending query .
    }
    return this;
  }

  pagination() {
    console.log('pagination');
    //============================== Pagination ==================================
    //==> http://127.0.0.1:8000/api/v1/tours?page=2&limit=10 ==> Here limit means that on each page there will be only 10 documents(data) .
    let page = this.queryString.page * 1; // its a trick to change string to number.
    let pageDataLimit = this.queryString.limit * 1;
    let dataSkip = (page - 1) * pageDataLimit; // This is a formula to calculate how many datas should be escaped if one page has a certain data limit.
    //! query = query.skip(10).limit(10); ==> skip says that leave 10 datas and continue from the 11th data. And limit says that only 10 data is allowed to display, so 11th to 20th data will be displayed.
    // let totalDocuments = await Tour.countDocuments(); // counts total number of documents, returns a promise.
    // if (dataSkip >= totalDocuments) {
    //   throw new Error('No more data available');
    // }
    this.query = this.query.skip(dataSkip).limit(pageDataLimit);
    return this;
  }
}

module.exports = APIFeatures;
