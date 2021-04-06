require('dotenv').config({path: __dirname + '/.env'});
const MongoClient = require('mongodb').MongoClient;
var database;
//connect to the MongoDB database
MongoClient.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
	if (error){
		console.log(error);
		throw new Error(error);
	}
	else {
		console.log(`${process.env.DATABASE_NAME} connected!`);
		database = client.db(process.env.DATABASE_NAME);
	}
});

module.exports ={
    database
}