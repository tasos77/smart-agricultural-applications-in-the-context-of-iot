import {
  aggregateArray,
  calcHistoryTimestampsArray,
  rebuildTbResponseFormat,
  buildExtendedResponseFormat,
  exportTBValuesArray,
  aggregateArrayMinMax,
  calcForecastTimestampsArray,
  calcIcon
} from './commonTools.js'

export function aggregateHistoryData(data) {
  const numGroups = 24

  const temperatureValues = exportTBValuesArray(data.temperature)
  const humidityValues = exportTBValuesArray(data.humidity)
  const soilMoistureValues = exportTBValuesArray(data.soilMoisture)
  const rainValues = exportTBValuesArray(data.rain)
  const uvValues = exportTBValuesArray(data.uv)

  const aggregatedTemperatureArray = aggregateArray(temperatureValues, numGroups)
  const aggregatedHumidityArray = aggregateArray(humidityValues, numGroups)
  const aggregatedSoilMoistureArray = aggregateArray(soilMoistureValues, numGroups)
  const aggregatedRainArray = aggregateArray(rainValues, numGroups)
  const aggregatedUvArray = aggregateArray(uvValues, numGroups)

  const aggregatedTimestampsArray = calcHistoryTimestampsArray(aggregatedTemperatureArray)

  return {
    temperature: rebuildTbResponseFormat(aggregatedTemperatureArray, aggregatedTimestampsArray),
    humidity: rebuildTbResponseFormat(aggregatedHumidityArray, aggregatedTimestampsArray),
    soilMoisture: rebuildTbResponseFormat(aggregatedSoilMoistureArray, aggregatedTimestampsArray),
    rain: rebuildTbResponseFormat(aggregatedRainArray, aggregatedTimestampsArray),
    uv: rebuildTbResponseFormat(aggregatedUvArray, aggregatedTimestampsArray)
  }
}

export function transformTBDataToTimeseriesForecastAppFormat(data) {
  const timeseriesForecastAppCompatibleHistoryMeasurements = []

  for (let i = 0; i < data.temperature.length; i++) {
    timeseriesForecastAppCompatibleHistoryMeasurements.push({
      timestamp: data.temperature[i].ts,
      temperature: parseFloat(data.temperature[i].value),
      humidity: parseFloat(data.humidity[i].value),
      rain: parseFloat(data.rain[i].value),
      soil_moisture: parseFloat(data.soilMoisture[i].value),
      uv: parseFloat(data.uv[i].value)
    })
  }

  return timeseriesForecastAppCompatibleHistoryMeasurements
}

export function transformTimeseriesForecastAppToTBDataFormat(data) {
  const humidity = []
  const temperature = []
  const soilMoisture = []
  const rain = []
  const uv = []
  const numGroups = 24

  for (let i = 0; i < data.predicted_temperature.length; i++) {
    temperature.push({
      ts: data.predicted_timestamp[i][0],
      value: data.predicted_temperature[i][0]
    })
    humidity.push({
      ts: data.predicted_timestamp[i][0],
      value: data.predicted_humidity[i][0]
    })
    soilMoisture.push({
      ts: data.predicted_timestamp[i][0],
      value: data.predicted_soil_moisture[i][0]
    })
    rain.push({
      ts: data.predicted_timestamp[i][0],
      value: data.predicted_rain[i][0]
    })
    uv.push({
      ts: data.predicted_timestamp[i][0],
      value: data.predicted_uv[i][0]
    })
  }

  const temperatureValues = exportTBValuesArray(temperature)
  const humidityValues = exportTBValuesArray(humidity)
  const soilMoistureValues = exportTBValuesArray(soilMoisture)
  const rainValues = exportTBValuesArray(rain)
  const uvValues = exportTBValuesArray(uv)

  const aggregatedTemperatureArray = aggregateArray(temperatureValues, numGroups)
  const aggregatedHumidityArray = aggregateArray(humidityValues, numGroups)
  const aggregatedSoilMoistureArray = aggregateArray(soilMoistureValues, numGroups)
  const aggregatedRainArray = aggregateArray(rainValues, numGroups)
  const aggregatedUvArray = aggregateArray(uvValues, numGroups)

  const aggregatedTemperatureMinMax = aggregateArrayMinMax(temperatureValues, numGroups)
  // const aggregatedHumidityMinMax = aggregateArrayMinMax(humidityValues, numGroups)
  // const aggregatedSoilMoistureMinMax = aggregateArrayMinMax(soilMoistureValues, numGroups)
  // const aggregatedRainMinMax = aggregateArrayMinMax(rainValues, numGroups)
  // const aggregatedUvMinMax = aggregateArrayMinMax(uvValues, numGroups)

  const aggregatedTimestampsArray = calcForecastTimestampsArray(aggregatedTemperatureArray)

  return {
    temperature: buildExtendedResponseFormat(
      aggregatedTemperatureArray,
      aggregatedTimestampsArray,
      aggregatedTemperatureMinMax
    ),
    humidity: rebuildTbResponseFormat(aggregatedHumidityArray, aggregatedTimestampsArray),
    soilMoisture: rebuildTbResponseFormat(aggregatedSoilMoistureArray, aggregatedTimestampsArray),
    rain: rebuildTbResponseFormat(aggregatedRainArray, aggregatedTimestampsArray),
    uv: rebuildTbResponseFormat(aggregatedUvArray, aggregatedTimestampsArray),
    icons: calcIcon(aggregatedRainArray, aggregatedTimestampsArray)
  }
}
