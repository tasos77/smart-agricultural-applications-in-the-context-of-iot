import { aggregateArray } from './commonTools.js'

const humidityUpperThreshold = 60
const soilMoistureUpperThreshold = 75
const rainLowerThreshold = 30
// const humidityLowerThreshold = 40
// const soilMoistureLowerThreshold = 50

export function pumpFunc(predictedData: any) {
  let rain = []
  let soilMoisture = []
  let humidity = []

  rain = predictedData.predicted_rain.map((item: any) => {
    return parseFloat(item[0])
  })

  soilMoisture = predictedData.predicted_soil_moisture.map((item: any) => {
    return parseFloat(item[0])
  })
  humidity = predictedData.predicted_humidity.map((item: any) => {
    return parseFloat(item[0])
  })

  const aggregatedHumidityArray = aggregateArray(humidity, 24)
  const aggregatedSoilMoistureArray = aggregateArray(soilMoisture, 24)
  const aggregatedRainArray = aggregateArray(rain, 24)

  return !(
    aggregatedHumidityArray.some((value) => value > humidityUpperThreshold) ||
    aggregatedSoilMoistureArray.some((value) => value > soilMoistureUpperThreshold) ||
    aggregatedRainArray.some((value) => value > rainLowerThreshold)
  )
}
