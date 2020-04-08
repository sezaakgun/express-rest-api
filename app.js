const logger = require('morgan');
const cors = require('cors');
const express = require('express');
const authRoute = require('./app/routes/auth.js');
const userRoute = require('./app/routes/user.js');

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use('/uploads', express.static('uploads'));
app.use('/v1.0/auth/', authRoute);
app.use('/v1.0/users/', userRoute);

module.exports = app;
