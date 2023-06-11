const mongoose = require('mongoose');

const mongoURI = "mongodb+srv://error404:error404@cluster0.6ke0hoy.mongodb.net/" ;


const connectToMongo = async  ()=>{
   mongoose.connect(mongoURI, await console.log('Connected to Mongodb'))  
}


module.exports = connectToMongo;