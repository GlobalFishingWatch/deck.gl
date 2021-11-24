import TileLayer from '../tile-layer/tile-layer';
import {getURLFromTemplate} from '../tile-layer/utils';
import {getFeatures} from './get-features';
import {TemporalGridLoader} from './temporalgrid-loader';
import AnimatedGridCellLayer from './animated-grid-cell-layer';

const defaultProps = {
  loaders: [TemporalGridLoader],
  frame: 0
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
    const {frame} = this.props;
    const {
      x,
      y,
      z,
      bbox: {west, south, east, north}
    } = props.tile;

    const features = getFeatures(props.data, {tileBBox: [west, south, east, north]});
    // console.log(features)

    return new AnimatedGridCellLayer({
      id: `temporalgrid-${x}-${y}-${z}`,
      data: features,
      frame,
      pickable: true,
      filled: true,
      radiusScale: 4,
      // radiusMinPixels: 1,
      // radiusMaxPixels: 100,
      getPosition: d => d.geometry.coordinates[0][0],
      getRadius: d => 2000,
      getFillColor: d => d.properties.color,
      getData: d => d.properties.testData,
      getLineColor: d => [0, 0, 0]
    });

    // return new GeoJsonLayer(
    //   props,
    //   this.getSubLayerProps({
    //     id: `temporalgrid-geojson`,
    //     data: {
    //       "type": "FeatureCollection",
    //       features
    //     },
    //     // getLineColor: [255, 0, 0],
    //     getFillColor: [0, 0, 255],
    //     // updateTriggers
    //   })
    // );

    // return new BitmapLayer(props, {
    //   data: null,
    //   image: props.data,
    //   bounds: [west, south, east, north]
    // });
  }
}

TemporalGridLayer.layerName = 'TemporalGridLayer';
TemporalGridLayer.defaultProps = defaultProps;
