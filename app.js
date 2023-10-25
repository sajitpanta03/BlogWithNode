require('dotenv').config();

const express = require('express');
const expressLayouts = require('express-ejs-layouts');

const connectDB = require('./server/config/db');

const app = express();
const PORT = process.env.PORT || 5000; 
   
connectDB();

app.use(express.urlencoded({ extended: true }))
app.use(express.json());

app.use(express.static('public'));

// Templating Engine
app.use(expressLayouts);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

app.use('/', require('./server/routes/main'));
app.use('/', require('./server/routes/admin'));
 
app.listen(PORT, ()=> {
    console.log(`App listening on port: ${PORT}`);
})