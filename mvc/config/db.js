const mongoose = require('mongoose');
const express = require('express');
const URI = process.env.DB_URI;
require('../models/file');
require('../models/user');
require('../models/subject')

if (process.env.APP_ENV === 'production') {
  URI = process.env.PRODB_URI;
}

mongoose.connect(URI, {useNewUrlParser: true});

mongoose.connection.on('conected', () => console.log(`conected to mongo database on ${URI}`))

mongoose.connection.on('connected', () => {
    console.log('mongoose connected to', URI);
});
mongoose.connection.on("error", (err) => {
    console.log('mongoose connection error', err);
});
mongoose.connection.on('disconnected', () => {
    console.log('mongoose disconnected');
});



const gracefulShutdown = (msg, callback) => {
    mongoose.connection.close(() => {
        console.log('mongoose disconnected through', msg);
        callback;
    });
};

process.once('SIGUSR2', () => {
    gracefulShutdown('nodemon restart', () => {
        process.kill(process.pid, 'SIGUSR2');
    });
});
process.on('SIGINT', () => {
    gracefulShutdown('app termination', () => {
        process.exit(0);
    });
});
process.on('SIGTERM', () => {
    gracefulShutdown('Heroku app shutdown', () => {
        process.exit(0);
    });
});

