import {CompositeLayer, SpriteLayer} from 'deck.gl';
import GL from '@luma.gl/constants';

const BOUNDS = [-90, 0, 0, 66.51326044311186]

export default class FourwingsLayer extends CompositeLayer {
  renderLayers() {
    const { animationCurrentFrame } = this.props;
    return [
      new SpriteLayer({
        id: "sprite-layer",
        bounds: BOUNDS,
        image: "mummy.png",
        animationCurrentFrame,
        animationNumCols: 5,
        animationNumRows: 5,
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