const database = require('../connectors/connections')

//insert data into database
function insertIntoUsersCollection(filterObj, upsertObj) {
    return new Promise( (resolve,reject) =>{
        database.collection("users").updateOne( filterObj, upsertObj, { upsert: true }, function(err, res) {
            if (err) {
                console.log(err)
                reject(err)
            } else {
                console.log("Document Updated Successfully");
                resolve(res)
            }
        })
    })
}


//get data from database
function getUserData(findObj) {
    return new Promise((resolve,reject) =>{
        database.collection("users").findOne(findObj, function(err, doc) {
            if (err) {
                console.log(err)
                reject(err)
            } else {
                resolve(doc)
            }
        })
    })
}

//find all users with specific condition
async function findAllUsers(query) {
    return new Promise(function(resolve, reject) {
        database.collection("users").find(query).toArray( async function(err, docs) {
            if(err) {
                console.log(err)
                reject(err)
            } else {
                resolve(docs)
            }
        })
    })
}
module.exports ={
    getUserData,
    insertIntoUsersCollection,
    findAllUsers
}