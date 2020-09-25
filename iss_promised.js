const request = require('request-promise-native');

const fetchMyIP = function () {
  return request('https://api.ipify.org?format=json')
  
 

};

const fetchCoordsByIP = function (body){
  const ip = JSON.parse(body);
  
  return request(`https://ipvigilante.com/${ip.ip}`)
}
const fetchISSFlyOverTimes = function (body){
  const gps = JSON.parse(body);
  const location = {latitude: gps.data.latitude, longitude: gps.data.longitude}
  const url = `http://api.open-notify.org/iss-pass.json?lat=${location.latitude}&lon=${location.longitude}`
  return request(url)
}

const nextISSTimesForMyLocation = function () {
  return fetchMyIP()
  .then(fetchCoordsByIP)
  .then(fetchISSFlyOverTimes)
  .then((times) => {
    const {response} = JSON.parse(times);
    return response;
  }

  )
}
module.exports = { nextISSTimesForMyLocation };