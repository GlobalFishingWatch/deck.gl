export const FEATURE_ROW_INDEX = 0;
export const FEATURE_COL_INDEX = 1;
export const FEATURE_CELLS_START_INDEX = 2;

export const CELL_NUM_INDEX = 0;
export const CELL_START_INDEX = 1;
export const CELL_END_INDEX = 2;
export const CELL_VALUES_START_INDEX = 3;

const getCellCoords = ({tileBBox, cellIndex, numCols}) => {
  const col = cellIndex % numCols;
  const row = Math.floor(cellIndex / numCols);
  const {west, north, east, south} = tileBBox;
  const width = east - west;
  const height = south - north;
  return {
    col,
    row,
    width,
    height
  };
};

const getCellPosition = ({tileBBox, cellIndex, numCols, numRows}) => {
  const {west, north} = tileBBox;
  const {col, row, width, height} = getCellCoords({tileBBox, cellIndex, numCols});

  const pointMinX = west + (col / numCols) * width;
  const pointMinY = north + (row / numRows) * height;

  return [pointMinX, pointMinY];
};

export const getCells = (tileBBox, intArray, sublayerCount) => {
  const numRows = intArray[FEATURE_ROW_INDEX];
  const numCols = intArray[FEATURE_COL_INDEX];
  let indexInCell = 0;
  let startIndex = 0;
  let cellIndex = 0;
  let startFrame = 0;
  let endFrame = 0;
  let endIndex = 0;
  const cells = [];
  for (let i = FEATURE_CELLS_START_INDEX; i < intArray.length; i++) {
    const value = intArray[i];
    if (indexInCell === CELL_NUM_INDEX) {
      startIndex = i;
      cellIndex = value;
    } else if (indexInCell === CELL_START_INDEX) {
      startFrame = value;
    } else if (indexInCell === CELL_END_INDEX) {
      endFrame = value;
      endIndex = startIndex + CELL_VALUES_START_INDEX + (endFrame - startFrame + 1) * sublayerCount;
    }
    indexInCell++;
    if (i === endIndex - 1) {
      indexInCell = 0;
      cells.push({
        data: intArray.slice(startIndex, endIndex),
        cellIndex,
        startFrame,
        endFrame,
        coords: getCellPosition({tileBBox, cellIndex, numRows, numCols})
      });
    }
  }
  return {
    numRows,
    numCols,
    cells
  };
};
