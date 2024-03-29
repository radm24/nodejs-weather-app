require('dotenv').config();

const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = express();
const port = process.env.PORT || 3000;

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);

hbs.registerHelper('link', function(text, url) {
    const handlebars = hbs.handlebars;
    const escapedText = handlebars.escapeExpression(text);
    const escapedUrl = handlebars.escapeExpression(url);
    return new handlebars.SafeString(`<a href="${escapedUrl}">${escapedText}</a>`);
})
hbs.registerPartials(partialsPath);

// Setup static directory to server
app.use(express.static(publicDirectoryPath));

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Radik Musin'
    });
});

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Radik Musin'
    });
});

app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'By this web application you can get an actual weather forecast for any location.\nFor that you need to enter a name of an interested location on',
        title: 'Help',
        name: 'Radik Musin'
    });
});

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address!'
        });
    };

    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({ error });
        };
        
        forecast({ latitude, longitude }, (error, forecastData) => {
            if (error) {
                return res.send({ error });
            };

            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            });
        });
    });
});

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term.'
        });
    };

    res.send({
        products: []
    });
});

app.get('/help/*', (req, res) => {
    res.render('404', {
        errorMessage: 'Help article not found.',
        title: '404',
        name: 'Radik Musin'
    });
});

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Radik Musin',
        errorMessage: 'Page not found.'
    });
});

app.listen(port, () => {
    console.log(`Server is up on port ${port}.`);
});