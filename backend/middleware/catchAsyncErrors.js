module.exports=theFunc=>(req,res,next)=>{
    Promise.resolve(theFunc(req,res,next)).catch(next);
}

//ei ta holo try catch 
//try catch kore required field gula na dile kono document create korle server crash hoye jeto but try catch e async await k niye ashai server tik takhe and error throw kore