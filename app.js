const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema')
const app = express();

const mongoose = require('mongoose');

//const context = () => MongoClient.connect('mongodb://username:password@localhost:27017/database_name', { useNewUrlParser: true }).then(client => client.db('database_name'));

mongoose.connect(
    'mongodb://mongo:27017/promosexpress',  
    {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    })
    .then(db => console.log('DB connected'))
    .catch(err => console.log(err))

mongoose.connection.once('open', () => {
    console.log('conneted to database');
});

// This route will be used as an endpoint to interact with Graphql, 
// All queries will go through this route. 
app.use('/graphql', graphqlHTTP({
    // Directing express-graphql to use this schema to map out the graph 
    schema,
    // Directing express-graphql to use graphiql when goto '/graphql' address in the browser
    // which provides an interface to make GraphQl queries
    graphiql:true,
    customFormatErrorFn: (err) => {
        return err
    }
}));

app.get('', (req, res) => {
    res.send('David Marico!');
});

app.get('/hello-world', (req, res) => {
    res.send('David Marico x2!');
});

app.listen(3000, () => {
    console.log('Listening on port 3000');
});