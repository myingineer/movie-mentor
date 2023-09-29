class ApiFeatures {
    constructor(queryObject, queryString) {
        this.queryObject = queryObject;
        this.queryString = queryString;
    };

    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.queryObject = this.queryObject.sort(sortBy);
        } else {
            this.queryObject = this.queryObject.sort('-createdAt');
        };

        return this;
    };

    limitFields() {
        if (this.queryString.fields) {
            const fieldsToShow = this.queryString.fields.split(',').join(' ');
            this.queryObject = this.queryObject.select(fieldsToShow);
        } else {
            this.queryObject = this.queryObject.select('-__v');
        };

        return this;
    };

    pagination() {
        const page = +this.queryString.page || 1;
        const limit = +this.queryString.limit || 25;
        const skip = (page - 1) * limit; // For each page, how many movies should be skipped before that page
      
        this.queryObject = this.queryObject.skip(skip).limit(limit);

        return this;
    };
      
};


module.exports = ApiFeatures;