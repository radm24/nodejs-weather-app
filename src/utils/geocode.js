const request = require('postman-request');

const geocode = (address, callback) => {
    debugger;
    const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + encodeURIComponent(address) + '.json?access_token=' + process.env.MB_KEY + '&limit=1';
    request({ url, json: true }, (error, { body }) => {
        debugger;
        if (error) {
            callback('Unable to connect to location services!', undefined);
        } else if (!body.features.length) {
            callback('Unable to find location! Try another search.', undefined);
        } else {
            callback(undefined, {
                latitude: body.features[0].center[1],
                longitude: body.features[0].center[0],
                location: body.features[0].place_name
            });
        }
    });
}

module.exports = geocode;