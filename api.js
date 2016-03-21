import m from 'mithril';

function getLane(lane_number) {
  return m.request({
    method: 'GET',
    url: `/lanes/${lane_number}.json`,
    background: true
  });
}

export default getLane;
