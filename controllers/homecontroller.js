
const BigPromise= require('../middlewares/bigpromise');



exports.home =BigPromise( async(req, res) => {
    const db =await db();
    res.status(200).json({
        success: true,
        greeting: 'hello from API server',
    });
})
    



exports.homeDummy = (req, res) => {
    res.status(200).json({
        success: true,
        greeting: 'this is another dummy route for checking purpose',
    });
};
        