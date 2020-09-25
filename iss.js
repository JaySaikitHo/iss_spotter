const request = require('request');





const fetchMyIP = function (callback) {
  request(`https://api.ipify.org?format=json`, (error, response, body) => {
    
    if (error) {
      return callback(error, null);
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const ip = JSON.parse(body);
    callback(null,ip);
  });

};

const fetchCoordsByIP = function (ip, callback) {
  request(`https://ipvigilante.com/${ip.ip}`, (error, response, body) => {
    ;

    if (error) {
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const gps = JSON.parse(body);
    const latandlong = { latitude: gps.data.latitude, longitude: gps.data.longitude };
    callback(null, latandlong);
  });

};


const fetchISSFlyOverTimes = function (coords, callback) {
  const url = `http://api.open-notify.org/iss-pass.json?lat=${coords.latitude}&lon=${coords.longitude}`;
  request(url, (error, response, body) => {
    

    if (error) {
      callback(error, null);
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const predictions = JSON.parse(body);
    callback(null, predictions.response);
  });
};

const nextISSTimesForMyLocation = function (callback) {
  fetchMyIP((error,ip) => {
    
    if (error) {
      return callback(error, null);
    }
    fetchCoordsByIP(ip, (error, latandlong) => {
      
      if (error) {
        return callback(error, null);
      }
      fetchISSFlyOverTimes(latandlong, (error, predictions) => {
        if (error) {
          return callback(error, null);
        }
        callback(null, predictions);
      });
    });

  });

};
module.exports = {
  nextISSTimesForMyLocation
};