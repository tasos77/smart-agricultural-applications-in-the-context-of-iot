export function pumpFunc(rainData) {
  let rain = []

  rain = rainData.map((item) => {
    return parseFloat(item[0])
  })

  const aggregatedRainArray = aggregateArray(rain)
  const customArray = [0, 0, 0, 0, 0, 1]
  //   return aggregatedRainArray.some((value) => value >= 1)
  return customArray.some((value) => value >= 1)
}

const aggregateArray = (array, numGroups = 24) => {
  const groupSize = Math.ceil(array.length / numGroups)
  const aggregatedArray = []

  for (let i = 0; i < numGroups; i++) {
    const startIndex = i * groupSize
    const endIndex = Math.min((i + 1) * groupSize, array.length)

    if (startIndex < endIndex) {
      // Calculate the average for the current group
      const groupValues = array.slice(startIndex, endIndex)
      const groupAverage = groupValues.reduce((sum, value) => sum + value, 0) / groupValues.length

      // Push the average to the aggregated array
      aggregatedArray.push(groupAverage)
    }
  }
  return aggregatedArray
}
