var request = require('request');
var path = require('path');
var fs = require('fs');

var ROOT = 'http://api.xbowling.com';
var SCORE_TIMEOUT_MINUTES = 90;
var VENUE_ID = 5395;

function formatDate(d) {
  const year = d.getUTCFullYear(),
      month = d.getUTCMonth() + 1,
      date = d.getUTCDate(),
      hours = d.getUTCHours(),
      minutes = d.getUTCMinutes(),
      seconds = d.getUTCSeconds();

  return `${year}/${month}/${date} ${hours}:${minutes}:${seconds}`;
}

var lastRequest = null;

function createUrl(lane_number) {
  var endDate = new Date();
  var startDate = new Date(+endDate - SCORE_TIMEOUT_MINUTES * 6e4);
  endDate = formatDate(endDate);
  startDate = formatDate(startDate);
  return ROOT + '/venue/' + VENUE_ID + '/lane/' + lane_number + '?from=' + startDate + '&to=' + endDate;
}

function getLane(i) {
  request(createUrl(i)).pipe(fs.createWriteStream(path.join(__dirname, '../lanes/' + i + '.json')));
}

var initialize = function(){
  if (new Date().getUTCHours() < 9) {
    console.log('canceling lane refresh, since it\'s not 9 already');
    return;
  }
  console.log('refreshing lanes at', formatDate(new Date()));
  for (var i = 1; i <= 22; ++i) {
    getLane(i);
  }
};

initialize();

setInterval(function(){
  initialize();
}, 15000);
