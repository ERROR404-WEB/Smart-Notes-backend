const mongoose = require('mongoose');

const mongoURI = "mongodb+srv://error404:<password>@cluster0.mhtohzu.mongodb.net/" ;


const connectToMongo = async  ()=>{
   mongoose.connect(mongoURI, await console.log('Connected to Mongodb'))  
}


module.exports = connectToMongo;