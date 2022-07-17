const product = require("../models/product");

//base - product.findById();

class whereClause {
    constructor(base,bigQ) {
        this.base = base;
        this.bigQ = bigQ;
    }

    search() {
        const searchword=this.bigQ.search ? {
            name:{
                $regex:this.bigQ.search,
                $options:'i'

            }


        }: {}
        this.base=this.base.find({...searchword});
        return this;
        
    
    }
    filter() {
        const copyQ={...this.bigQ};
        delete copyQ["search"];
        delete copyQ["page"];
        delete copyQ["limit"];
        // convert bigQ into string =>copyQ
        let queryCopyString=JSON.stringify(copyQ);
        queryCopyString=queryCopyString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        // convert string to object =>queryCopyObject
        const queryCopyObject=JSON.parse(queryCopyString);
        this.base=this.base.find(queryCopyObject);
        return this;


        


    }

    //pagination
    pager (resultperPage){
        let currentPage=this.bigQ.page || 1;
        // let currentPage=1;
        // if(this.bigQ.page){
        //     currentPage=this.bigQ.page;
        // }
      
        let skip=(currentPage-1)*resultperPage;
        this.base=this.base.skip(skip).limit(resultperPage);
        return this;

    }
}

module.exports = whereClause;