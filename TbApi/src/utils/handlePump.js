import { aggregateArray } from './commonTools.js'

const humidityUpperThreshold = 60
const humidityLowerThreshold = 40
const soilMoistureUpperThreshold = 75
const soilMoistureLowerThreshold = 50
const rainLowerThreshold = 30

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

  return !(
    aggregatedHumidityArray.some((value) => value > humidityUpperThreshold) ||
    aggregatedSoilMoistureArray.some((value) => value > soilMoistureUpperThreshold) ||
    aggregatedRainArray.some((value) => value > rainLowerThreshold)
  )
}
