class ApiFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    search() {
        const keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: 'i',//$options:'i' ei ta keyword jei ta diye search ba query korbe oi ta case insensitive korbe
            }
        } : {}
        this.query = this.query.find({...keyword});
        console.log(keyword);
        // console.log(this.queryStr);
        return this;
    }
    filter(){
        const queryCopy = {...this.queryStr};//?keyword=product & email=hlw@gamil.com ei ta query er keyword name and diye ja ja takbe sob this.queryStr er modde takbe ja destruct kore query kora word jemon keyword email etc sob newa hocce 
        //removing some fields from category----------
        const removesFields=["keyword","page","limit"];
        // console.log(queryCopy);
        removesFields.forEach((key)=>delete queryCopy[key]);//ei kane removesFields er modde jei value gula ace oi ta gula diye jodi queryStr e diye query kore taile removeFields e sathe match kora queryStr oi gula delete kore baki gula lagbe
        // console.log(queryCopy);

        // Filter for every query example category- ratings-------
        let queryStr = JSON.stringify(queryCopy);
        // console.log(queryStr,"after stringify");
        // const regex = /\b(gt|gte|lt|lte)\b/g;
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);
        console.log(queryStr,"ggg");

        this.query = this.query.find(JSON.parse(queryStr));
        // console.log(queryStr,"after parse");
        return this;
    }

    pagination(resultPerPage){
        const currentPage=Number(this.queryStr.page) || 1 ;
        const skip = resultPerPage * (currentPage-1);//ei kane 5*(1-1)=0 ta product skip korbe total product tekhe. 2nd page e gele 5*(2-1)=5 protom 5 ta product skip korbe total tkhe..3nd page e gele 5*(3-1)=10 protom 10 ta product skip korbe total tkhe protom page er 5 ta soho 10 ta ..eivabe next joto page jabe total tekhe 5 kore kore skip kore jabe

        this.query=this.query.limit(resultPerPage).skip(skip);//limit.(resultPerPage) mane resultPerPage er value soman product show korbe per page...skip(skip) holo next page e jete koi ta skip hobe
        return this;
    }
}

module.exports = ApiFeatures; 