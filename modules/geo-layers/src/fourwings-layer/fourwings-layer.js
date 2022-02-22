import {CompositeLayer, SpriteLayer} from 'deck.gl';
import { Texture2D } from '@luma.gl/core';
import GL from '@luma.gl/constants';

const BOUNDS = [-90, 0, 0, 66.51326044311186]

export default class FourwingsLayer extends CompositeLayer {
  initializeState() {
    const {gl} = this.context;
    this.state = {
      texture: new Texture2D(gl, {
        width: 4,
        height: 1,
        format: GL.RGB,
        data: new Uint8Array([255, 0, 255,255, 0, 255, 0, 0, 255, 0, 0, 255]),
        parameters: {
          [GL.TEXTURE_MAG_FILTER]: GL.NEAREST,
          [GL.TEXTURE_MIN_FILTER]: GL.NEAREST
        },
        // pixelStore: {
        //   [GL.UNPACK_FLIP_Y_WEBGL]: true
        // },
        // mipmaps: true
      }),
    }
  }

  updateState({props, oldProps, changeFlags}) {
    // TODO check if texture should be generated again
    // console.log(props, oldProps, changeFlags)
    // this.setState({...result, apiVersion});
    // https://deck.gl/docs/developer-guide/custom-layers/attribute-management
  }

  renderLayers() {
    const { animationCurrentFrame } = this.props;
    const { texture } = this.state;
  
    
    return [
      new SpriteLayer({
        id: "sprite-layer",
        bounds: BOUNDS,
        // image: "mummy.png",
        image: texture,
        animationCurrentFrame,
        animationNumCols: 4,
        animationNumRows: 1,
        // animationNumCols: 5,
        // animationNumRows: 5,
        textureParameters: {
          [GL.TEXTURE_MIN_FILTER]: GL.NEAREST,
          [GL.TEXTURE_MAG_FILTER]: GL.NEAREST
        }
      })
    ]
  }
}
FourwingsLayer.defaultProps = {
  animationCurrentFrame: {type: 'number', value: 0, min: 0}
};
FourwingsLayer.layerName = 'FourwingsLayer';