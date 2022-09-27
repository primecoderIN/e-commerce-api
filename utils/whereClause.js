//base - Product.find()

//BigQuery - search=coder&page=2&category=shortsleeves&rating[gte]=4&price[gte]=199&price[lte]=999

//This class will have methods to handle search filter and pagination operations

class WhereClause {
  constructor(base, bigQuery) {
    this.base = base;
    this.bigQuery = bigQuery;
  }

  //order of search filter and pager matters here
  search() {
    const searchWord = this.bigQuery.search
      ? {
          name: {
            $regex: this.bigQuery.search,
            $options: i,
          },
        }
      : {};
    this.base = this.base.find({ ...searchWord });
    return this;
  }

  filter() {
    let copyOfBigQuery = { ...this.bigQuery };
    delete copyOfBigQuery["search"];
    delete copyOfBigQuery["limit"];
    delete copyOfBigQuery["page"];
    let stringCopyOfBigQuery = JSON.stringify(copyOfBigQuery);
    stringCopyOfBigQuery = stringCopyOfBigQuery.replace(
      /\b(gte | lte | gt | lt)\b/g,
      (m) => `$${m}`
    );
    let JsonOfCopiedQuery = JSON.parse(stringCopyOfBigQuery);
    this.base = this.base.find(JsonOfCopiedQuery);
    return this;
  }

  pager(resultPerPage) {
    let currentPage = 1;
    if (this.bigQuery.page) {
      currentPage = this.bigQuery.page;
    }
    this.base = this.base
      .limit(resultPerPage)
      .skip((currentPage - 1) * resultPerPage);
    return this;
  }
}


module.exports = WhereClause;