require('dotenv').config();


const mongoose = require('mongoose');


function connectDB(){

    mongoose.set('strictQuery', false);

    mongoose.connect(process.env.MONGO_CONNECTION_URL, {useNewUrlParser: true});

    const connection = mongoose.connection;


    try{
        connection.once('open', () => {
            console.log('Database connected.');
        })
    }
    catch(err){
        console.log('Connection failed.');
    }


}


module.exports = connectDB;