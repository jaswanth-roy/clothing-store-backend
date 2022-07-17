//try catch and async -await // use proimise

module.exports = func=>(req,res,next) => {
    Promise.resolve(func(req,res,next)).catch(next);
};
