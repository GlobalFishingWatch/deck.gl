import React, {useState, useMemo, Fragment} from 'react';
import {render} from 'react-dom';
import DeckGL from '@deck.gl/react';
import {GeoJsonLayer} from '@deck.gl/layers';
import {TemporalGridLayer} from '@deck.gl/geo-layers';

// source: Natural Earth http://www.naturalearthdata.com/ via geojson.xyz
const COUNTRIES =
  'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_admin_0_scale_rank.geojson'; //eslint-disable-line

const INITIAL_VIEW_STATE = {
  latitude: 51.47,
  longitude: 0.45,
  zoom: 1.5,
  bearing: 0,
  pitch: 0
};

const temporalConfig = {
  // data: 'https://dev-api-4wings-tiler-gee-poc-jzzp2ui3wq-uc.a.run.app/v1/4wings/tile/heatmap/{z}/{x}/{y}?date-range=2018-01-01T00:00:00.000Z,2019-04-11T23:59:59.000Z&datasets[0]=public-current-um-global4km&format=mvt&interval=day&temporal-aggregation=false',
  data:
    'https://gateway.api.dev.globalfishingwatch.org/v1/4wings/tile/heatmap/{z}/{x}/{y}?proxy=true&format=intArray&temporal-aggregation=false&interval=10days&datasets[0]=public-global-fishing-effort:v20201001&',
  minZoom: 0,
  maxZoom: 19,
  tileSize: 512,
  frame: 0
};

function Root() {
  const [frame, setFrame] = useState(0);

  const temporalGridLayer = useMemo(
    () => {
      return new TemporalGridLayer({...temporalConfig, frame});
    },
    [frame]
  );

  const onButtonClick = () => {
    temporalGridLayer.getViewportData();
  };

  return (
    <Fragment>
      <DeckGL layers={[temporalGridLayer]} controller={true} initialViewState={INITIAL_VIEW_STATE}>
        <GeoJsonLayer
          id="base-map"
          data={COUNTRIES}
          stroked={true}
          filled={true}
          lineWidthMinPixels={2}
          opacity={0.4}
          getLineColor={[60, 60, 60]}
          getFillColor={[200, 200, 200]}
        />
      </DeckGL>
      <div style={{position: 'fixed'}}>
        <button onClick={onButtonClick}>Click to get data in viewport</button>
        <button style={{position: 'fixed'}} onClick={() => setFrame(f => f + 1)}>
          Increase frame {frame}
        </button>
      </div>
    </Fragment>
  );
}

/* global document */
render(<Root />, document.body.appendChild(document.createElement('div')));
