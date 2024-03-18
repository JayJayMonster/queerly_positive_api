//Be able to use .env variables
require('dotenv').config();

//Connect Mongoose package
let mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/articles');

//Connect package with web server
const express = require('express');
const cors = require('cors');

//Make the app available
app = express();
app.use(cors());

const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

let articlesRouter = require('./routes/articleRoutes');

app.use('/api', articlesRouter);

//Start web application with port 8080 (standard is 80)
app.listen(process.env.PORT_KEY);
