export function pumpFunc(predictedData) {
  let rain = []
  let soilMoisture = []
  let humidity = []

  rain = predictedData.predicted_rain.map((item) => {
    return parseFloat(item[0])
  })

  soilMoisture = predictedData.predicted_soil_moisture.map((item) => {
    return parseFloat(item[0])
  })
  humidity = predictedData.predicted_humidity.map((item) => {
    return parseFloat(item[0])
  })

  const aggregatedHumidityArray = aggregateArray(humidity)
  const aggregatedSoilMoistureArray = aggregateArray(soilMoisture)
  const aggregatedRainArray = aggregateArray(rain)
  const customArrayHumidity = [0, 0, 0, 0, 0, 0]
  const customArraySoilMoisture = [0, 0, 0, 0, 0]
  const customArrayRain = [0, 0, 0, 0, 0]

  //   return aggregatedRainArray.some((value) => value >= 1)
  return !(
    customArrayHumidity.some((value) => value >= 1) ||
    customArraySoilMoisture.some((value) => value >= 1) ||
    customArrayRain.some((value) => value >= 1)
  )
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
