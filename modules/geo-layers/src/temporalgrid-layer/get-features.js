const getCellCoords = (tileBBox, cell, numCols) => {
  const col = cell % numCols
  const row = Math.floor(cell / numCols)
  const [minX, minY, maxX, maxY] = tileBBox
  const width = maxX - minX
  const height = maxY - minY
  return {
    col,
    row,
    width,
    height,
  }
}

const getRectangleFeature = ({ tileBBox, cell, numCols, numRows, addMeta }) => {
  const [minX, minY] = tileBBox
  const { col, row, width, height } = getCellCoords(tileBBox, cell, numCols)

  const squareMinX = minX + (col / numCols) * width
  const squareMinY = minY + (row / numRows) * height
  const squareMaxX = minX + ((col + 1) / numCols) * width
  const squareMaxY = minY + ((row + 1) / numRows) * height

  const properties = addMeta
    ? {
        _col: col,
        _row: row,
      }
    : {}

  return {
    type: 'Feature',
    properties,
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [squareMinX, squareMinY],
          [squareMaxX, squareMinY],
          [squareMaxX, squareMaxY],
          [squareMinX, squareMaxY],
          [squareMinX, squareMinY],
        ],
      ],
    },
  }
}


const getFeature = (featureParams) => {
  return getRectangleFeature(featureParams)
}

export const getFeatures = (tile, { tileBBox }) => {
  return tile.cells.map(cell => {
    const feature = getFeature({
      cell: cell.cellIndex,
      numCols: tile.numCols,
      numRows: tile.numRows,
      tileBBox
    })
    feature.properties.data = cell.data
    return feature
  })
} 