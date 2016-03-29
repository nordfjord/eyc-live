import m from 'mithril';

var ROOT = 'https://api.xbowling.com';
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
  return ROOT + '/venue/' + VENUE_ID + '/lane/' + lane_number + '?from=' + encodeURIComponent(startDate) + '&to=' + encodeURIComponent(endDate);
}

function getLane(lane_number) {
  return m.request({
    method: 'GET',
    url: createUrl(lane_number),
    background: true
  });
}

export default getLane;
