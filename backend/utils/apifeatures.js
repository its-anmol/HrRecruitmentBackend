class ApiFeatures{
    constructor(query,querystr){
        this.query=query,
        this.querystr=querystr
    }

    Search(){
        const keyword=this.querystr.keyword ? {
            title:{
                $regex:this.querystr.keyword,
                $options:"i",
            }
        }:{};
        this.query=this.query.find({...keyword})
        return this
    }

    filter(){
        const querycopy={...this.querystr}
        // removing field for category
        const removefield=["keyword","page","limit"];
        removefield.forEach(key=>delete querycopy[key])
        console.log(querycopy);

        let querystr =JSON.stringify(querycopy);
        querystr=querystr.replace(/\b(gt|gte|lt|lte)\b/g,(key)=>`$${key}`)
        console.log(querystr);
        this.query=this.query.find(JSON.parse(querystr));

        return this

    }

    pagination(resultPerPage){
        const currentPage=Number(this.querystr.page)||1;
        const skip= resultPerPage*(currentPage-1)
        this.query=this.query.limit(resultPerPage).skip(skip);
        return this

    }
}

module.exports=ApiFeatures