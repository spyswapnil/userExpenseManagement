User Expense Management

To run this project : 
1. npm install
2. npm start


APIs created in this project are:

1. Sign Up API -->                      /users/signUp(POST)
2. Login API -->                        /users/login(POST)
3. New Expense API -->                  /users/expenses/new(POST)
4. Get Expense of a user API -->        /users/expenses?email=xxxxxx@xxx.com(GET)


Folder Structure:

1. Connectors -->   it contains the database connection from mongoDB
2. helpers -->      it contains all the helper functions used in database interaction
3. validations -->  it contains the validation file which validates the schemas of API request

To test the API you can use ngrok to generate a temporary url and club it with the endpoints mentioned above:

(go to the path where ngrok is installed)
ngrok http PORTNAME (replace portname with the PORTNAME on which you want to run your application)

You need to add .env file where you can configure:

DATABASE_URL,DATABASE_NAME,PORT