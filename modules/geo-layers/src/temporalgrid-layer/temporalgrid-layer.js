
import { GeoJsonLayer } from '@deck.gl/layers/';
import TileLayer from '../tile-layer/tile-layer'
import {getURLFromTemplate} from '../tile-layer/utils';
import { getFeatures } from './get-features';
import {TemporalGridLoader} from './temporalgrid-loader';


const defaultProps = {
  loaders: [TemporalGridLoader],
  // binary: true
};

export default class TemporalGridLayer extends TileLayer {

  getTileData(tile) {
    const {data, fetch} = this.props;
    const {signal} = tile;

    tile.url = getURLFromTemplate(data, tile);

    if (tile.url) {
      return fetch(tile.url, {propName: 'data', layer: this, signal});
    }
    return null;
  }

  renderSubLayers(props) {
    const {
      x, y, z,
      bbox: {west, south, east, north}
    } = props.tile;
    
    const features = getFeatures(props.data, { tileBBox: [west, south, east, north] })
    console.log(features)

    return new GeoJsonLayer(
      props,
      this.getSubLayerProps({
        id: `temporalgrid-geojson`,
        data: {
          "type": "FeatureCollection",
          features
        },
        // getLineColor: [255, 0, 0],
        getFillColor: [0, 0, 255],
        // updateTriggers
      })
    );

    // return new BitmapLayer(props, {
    //   data: null,
    //   image: props.data,
    //   bounds: [west, south, east, north]
    // });
  }
}

TemporalGridLayer.layerName = 'TemporalGridLayer';
TemporalGridLayer.defaultProps = defaultProps;