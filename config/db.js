const mongoose = require('mongoose');
const connectWithDb =()=>{
    mongoose.connect(process.env.DB_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true,
        //useCreateIndex:true,
        //useFindAndModify:false
    })
    .then(()=>{
        console.log('connected to db');
    }).catch(err=>{
        console.log('DB connection error:');
        console.log(err);
        process.exit(1);
    }
    );
};

module.exports=connectWithDb;




