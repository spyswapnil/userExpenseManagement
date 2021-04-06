require('dotenv').config({path: __dirname + '/.env'});
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const moment = require('moment');
const bcrypt = require('bcrypt');
const helpers = require('./helpers/helpers');
const validations = require('./validations/validators');
const app = express();


app.use(express.json());
app.use(cors({origin: true}));
app.options('*', cors()) // include before other routes   
app.use(bodyParser.json());



//user registeration API
app.post('/users/signUp', async (req, res) => {
    console.log(req.body)
    const { error } = validations.validateUser(req.body, "user")
    if(error) {
        //validation failed
        res.status(400).send(error.details[0].message)
    } else {
        let password = req.body.password
        let userFind = {
            email: req.body.email
        }
        let userDetails = await helpers.getUserData(userFind)
        if(userDetails) {
            //when user already registered
            console.log(userDetails)
            res.send(`${userDetails.email} already exists`).status(400)
        } else {
            //password encryption using hash
            let salt = await bcrypt.genSalt(20);
            password = await bcrypt.hash(password, salt);
            let userFilter = {
                email : req.body.email
            }
            let userCreate = {
                $set: {
                    password: password,
                    createdAt: moment().unix()
                }            
            }
            await helpers.insertIntoUsersCollection(userFilter, userCreate)
        }
        res.send('User Saved Successfully').status(200)
    }
})

// user login API
app.post('/users/login', async (req, res) => {
    console.log(req.body)
    const { error } = validations.validateUser(req.body, "user")
    if(error) {
        //user validation failed
        res.status(400).send(error.details[0].message)
    } else {
        let userObj = {
            email: req.body.email
        }
        let userDetails = await helpers.getUserData(userObj)
        if(userDetails) {
            console.log(userDetails)
            if(userDetails.isLoggedIn == true) {
                //when user tries to login again while he is already logged in
                res.send('You are already logged in').status(200)
            } else {
                //check password of user
                await bcrypt.compare(req.body.password, userDetails.password, async function (err,isValid) {
                    if(err) {
                        console.log(err)
                    } else if( isValid) {
                        let userFilter = {
                            email : req.body.email
                        }
                        let userUpdate = {
                            $set: {
                                isLoggedIn: true,
                                loggedInAt: moment().unix()
                            }            
                        }
                        await helpers.insertIntoUsersCollection(userFilter, userUpdate)
                        res.send(`${req.body.email} Authenticated Successfully`).status(200)
                    }
                })
            }
        } else {
            res.send('Please register yourself first').status(404)
        }
    }
})

//adding new expenses
app.post('/users/expenses/new', async (req, res) =>{
    console.log(req.body)
    const { error } = validations.validateUser(req.body, "expense")
    if(error) {
        //validation failed
        res.status(400).send(error.details[0].message)
    } else {
        let userObj = {
            email: req.body.email
        }
        let userDetails = await helpers.getUserData(userObj)
        if(userDetails) {
            console.log(userDetails)
            if(userDetails.isLoggedIn == false) {
                //user not logged in
                res.send('Please Login first').status(404)
            } else {
                let userFilter = {
                    email : req.body.email
                }
                let userUpdate = {
                    $addToSet: {
                        expenses: {
                            expenseName: req.body.expenseName,
                            expenseAmount: req.body.expenseAmount,
                            expenseIncurredOn: moment().unix()
                        }
                    }
                }     
                //update collection with specific fields      
                await insertIntoUsersCollection(userFilter, userUpdate)
                res.send(`Expenses Saved Successfully`).status(200)
            }
        } else {
            res.send('Please register yourself first').status(404)
        }
    }
})

//get expenses of a specific user
app.get('/users/expenses', async (req,res) => {
    console.log(req.query)
    const { error } = validations.validateUser(req.query)
    if(error) {
        //validation failed
        res.status(400).send(error.details[0].message)
    } else {
        let userObj = {
            email: req.query.email
        }
        let userDetails = await helpers.getUserData(userObj)
        if(userDetails) {
            console.log(userDetails)
            if(userDetails.isLoggedIn == false) {
                //user is not logged in
                res.send('Please Login first').status(404)
            } else {
                let expenseArray = []
                let totalExpense = 0
                for (let index = 0; index < userDetails.expenses.length; index++) {
                    //iterate over each expense
                    let eachExpense = userDetails.expenses[index]
                    const dateObject = new Date(eachExpense.expenseIncurredOn * 1000)
                    const humanDateFormat = dateObject.toLocaleString()
                    eachExpense.expenseIncurredOn = humanDateFormat
                    totalExpense = totalExpense + eachExpense.expenseAmount
                    expenseArray.push({
                        expenseName: eachExpense.expenseName,
                        expenseAmount: eachExpense.expenseAmount,
                        expenseDate: eachExpense.expenseIncurredOn
                    })
                }
                res.send({
                    totalExpenses: totalExpense,
                    expenses: expenseArray.reverse()
                })
            }
        }
    }
    
})

//app listening to a port
app.listen(process.env.PORT ? process.env.PORT : 3000, () => {
    console.log(`Listening on port ${process.env.PORT}`);
});