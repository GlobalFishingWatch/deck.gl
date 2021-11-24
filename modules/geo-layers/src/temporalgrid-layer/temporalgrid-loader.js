import Protobuf from 'pbf';
import {getCells} from './get-cells';
import { tileToBoundingBox } from '../tile-layer/utils'

const decodeProto = data => {
  const readField = (tag, obj, pbf) => {
    if (tag === 1) pbf.readPackedVarint(obj.data);
  };
  const read = (pbf, end) => {
    return pbf.readFields(readField, {data: []}, end);
  };
  const pbfData = new Protobuf(data);
  const intArray = read(pbfData);
  return intArray && intArray.data;
};

const parseTemporalgrid = (arraybuffer, options) => {
  const url = options.baseUri;
  const [z, x, y] = url
    .slice(url.length - 5, url.length)
    .split('/')
    .map(coordinate => parseInt(coordinate, 10));

  const bbox = tileToBoundingBox({ isGeospatial: true }, x, y, z);
  const int16ArrayBuffer = decodeProto(arraybuffer);
  const cells = getCells(bbox, int16ArrayBuffer, /* TODO */ 1);
  return cells;
};

export const TemporalGridWorkerLoader /* : Loader*/ = {
  name: 'Temporl Grid',
  id: 'temporalgrid',
  module: 'temporalgrid',
  version: '1',
  // Note: ArcGIS uses '.pbf' extension and 'application/octet-stream'
  extensions: ['mvt', 'pbf'],
  mimeTypes: [
    'application/vnd.mapbox-vector-tile',
    'application/x-protobuf'
    // 'application/octet-stream'
  ],
  // worker: true,
  worker: false,
  category: 'geometry',
  options: {
    temporalgrid: {
      // coordinates: 'local',
      // layerProperty: 'layerName',
      // layers: null,
      // tileIndex: null
    }
  }
};

export const TemporalGridLoader /* : LoaderWithParser*/ = {
  ...TemporalGridWorkerLoader,
  parse: async (arrayBuffer, options) => parseTemporalgrid(arrayBuffer, options),
  parseSync: parseTemporalgrid,
  binary: true
};
