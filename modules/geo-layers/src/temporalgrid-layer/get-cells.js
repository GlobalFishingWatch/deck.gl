export const FEATURE_ROW_INDEX = 0
export const FEATURE_COL_INDEX = 1
export const FEATURE_CELLS_START_INDEX = 2

export const CELL_NUM_INDEX = 0
export const CELL_START_INDEX = 1
export const CELL_END_INDEX = 2
export const CELL_VALUES_START_INDEX = 3

export const getCells = (intArray, sublayerCount) => {
  const numRows = intArray[FEATURE_ROW_INDEX]
  const numCols = intArray[FEATURE_COL_INDEX]
  let indexInCell = 0
  let startIndex = 0
  let cellIndex = 0
  let startFrame = 0
  let endFrame = 0
  let endIndex = 0
  const cells = []
  for (let i = FEATURE_CELLS_START_INDEX; i < intArray.length; i++) {
    const value = intArray[i]
    if (indexInCell === CELL_NUM_INDEX) {
      startIndex = i
      cellIndex = value
    } else if (indexInCell === CELL_START_INDEX) {
      startFrame = value
    } else if (indexInCell === CELL_END_INDEX) {
      endFrame = value
      endIndex = startIndex + CELL_VALUES_START_INDEX + (endFrame - startFrame + 1) * sublayerCount
    }
    indexInCell++
    if (i === endIndex - 1) {
      indexInCell = 0
      cells.push({
        data: intArray.slice(startIndex, endIndex),
        cellIndex,
        startFrame,
        endFrame,
      })
    }
  }
  return {
    numRows,
    numCols,
    cells,
  }
}