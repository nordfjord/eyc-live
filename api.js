import m from 'mithril';

const ROOT = 'http://api.xbowling.com';
const SCORE_TIMEOUT_MINUTES = 90;
const VENUE_ID = 5395;

function formatDate(d) {
  const year = d.getUTCFullYear(),
      month = d.getUTCMonth() + 1,
      date = d.getUTCDate(),
      hours = d.getUTCHours(),
      minutes = d.getUTCMinutes(),
      seconds = d.getUTCSeconds();

  return `${year}/${month}/${date} ${hours}:${minutes}:${seconds}`;
}

function getLane(lane_number) {
  let endDate = new Date();

  if ((localStorage || {}).dev) {
    endDate = new Date('2016-03-19T23:00:00');
  }
  const startDate = new Date(+endDate - (SCORE_TIMEOUT_MINUTES * 6e4));

  return m.request({
    method: 'GET',
    url: `${ROOT}/venue/${VENUE_ID}/lane/${lane_number}`,
    data: {
      from: formatDate(startDate),
      to: formatDate(endDate)
    },
    background: true
  });
}

export default getLane;
