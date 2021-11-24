import {Deck} from '@deck.gl/core';
import {GeoJsonLayer} from '@deck.gl/layers';
import {TemporalGridLayer} from '@deck.gl/geo-layers';

// source: Natural Earth http://www.naturalearthdata.com/ via geojson.xyz
const COUNTRIES =
  'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_admin_0_scale_rank.geojson';

const INITIAL_VIEW_STATE = {
  latitude: 51.47,
  longitude: 0.45,
  zoom: 4,
  bearing: 0,
  pitch: 30
};

let frame = 0;

const temporalConfig = {
  // https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#Tile_servers
  // data: 'https://dev-api-4wings-tiler-gee-poc-jzzp2ui3wq-uc.a.run.app/v1/4wings/tile/heatmap/{z}/{x}/{y}?date-range=2018-01-01T00:00:00.000Z,2019-04-11T23:59:59.000Z&datasets[0]=public-current-um-global4km&format=mvt&interval=day&temporal-aggregation=false',
  data:
    'https://gateway.api.dev.globalfishingwatch.org/v1/4wings/tile/heatmap/{z}/{x}/{y}?proxy=true&format=intArray&temporal-aggregation=false&interval=10days&datasets[0]=public-global-fishing-effort:v20201001&',

  minZoom: 0,
  maxZoom: 19,
  tileSize: 512,
  frame: 0
};

const basemap = new GeoJsonLayer({
  id: 'base-map',
  data: COUNTRIES,
  // Styles
  stroked: true,
  filled: true,
  lineWidthMinPixels: 2,
  opacity: 0.4,
  getLineColor: [60, 60, 60],
  getFillColor: [200, 200, 200]
});

export const deck = new Deck({
  initialViewState: INITIAL_VIEW_STATE,
  controller: true
});

const temporalGridLayer = new TemporalGridLayer({ ...temporalConfig, frame })
const deckProps = {layers: [temporalGridLayer, basemap]}
const update = () => {
  deck.setProps(deckProps);
};

// For automated test cases
/* global document */
document.body.style.margin = '0px';

const onButtonClick = () => {
  // eslint-disable-next-line
  console.info(temporalGridLayer.getViewportData());
};
const button = document.getElementById('get-data');
button.addEventListener('click', onButtonClick);

// eslint-disable-next-line no-undef
window.setInterval(() => {
  update();
  frame++;
}, 16);
