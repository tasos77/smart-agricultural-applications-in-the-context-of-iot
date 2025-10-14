import {
  aggregateArray,
  aggregateArrayMinMax,
  buildExtendedResponseFormat,
  calcForecastTimestampsArray,
  calcHistoryTimestampsArray,
  calcIcon,
  exportTBValuesArray,
  rebuildTbResponseFormat
} from './commonTools.js'

export function aggregateHistoryData(data: any) {
  const numGroups = 24

  const temperatureValues = exportTBValuesArray(data.temperature)
  const humidityValues = exportTBValuesArray(data.humidity)
  const soilMoistureValues = exportTBValuesArray(data.soilMoisture)
  const rainValues = exportTBValuesArray(data.rain)
  const uvValues = exportTBValuesArray(data.uv)

  const aggregatedTemperatureArray = aggregateArray(
    temperatureValues,
    numGroups
  )
  const aggregatedHumidityArray = aggregateArray(humidityValues, numGroups)
  const aggregatedSoilMoistureArray = aggregateArray(
    soilMoistureValues,
    numGroups
  )
  const aggregatedRainArray = aggregateArray(rainValues, numGroups)
  const aggregatedUvArray = aggregateArray(uvValues, numGroups)

  const aggregatedTimestampsArray = calcHistoryTimestampsArray(
    aggregatedTemperatureArray
  )

  return {
    temperature: rebuildTbResponseFormat(
      aggregatedTemperatureArray,
      aggregatedTimestampsArray
    ),
    humidity: rebuildTbResponseFormat(
      aggregatedHumidityArray,
      aggregatedTimestampsArray
    ),
    soilMoisture: rebuildTbResponseFormat(
      aggregatedSoilMoistureArray,
      aggregatedTimestampsArray
    ),
    rain: rebuildTbResponseFormat(
      aggregatedRainArray,
      aggregatedTimestampsArray
    ),
    uv: rebuildTbResponseFormat(aggregatedUvArray, aggregatedTimestampsArray)
  }
}

export function transformTBDataToTimeseriesForecastAppFormat(data: any) {
  if (!data || !data.temperature || data.temperature.length === 0) {
    return []
  }
  return data.temperature.map((item: any, index: number) => {
    return {
      timestamp: data.temperature[index].ts,
      temperature: parseFloat(data.temperature[index].value),
      humidity: parseFloat(data.humidity[index].value),
      rain: parseFloat(data.rain[index].value),
      soil_moisture: parseFloat(data.soilMoisture[index].value),
      uv: parseFloat(data.uv[index].value)
    }
  })
}

export function transformTimeseriesForecastAppToTBDataFormat(predicted_data: any) {
  const humidity = []
  const temperature = []
  const soilMoisture = []
  const rain = []
  const uv = []
  const numGroups = 24

  const data = JSON.parse(JSON.stringify(predicted_data))

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

  const aggregatedTemperatureArray = aggregateArray(
    temperatureValues,
    numGroups
  )
  const aggregatedHumidityArray = aggregateArray(humidityValues, numGroups)
  const aggregatedSoilMoistureArray = aggregateArray(
    soilMoistureValues,
    numGroups
  )
  const aggregatedRainArray = aggregateArray(rainValues, numGroups)
  const aggregatedUvArray = aggregateArray(uvValues, numGroups)

  const aggregatedTemperatureMinMax = aggregateArrayMinMax(
    temperatureValues,
    numGroups
  )
  // const aggregatedHumidityMinMax = aggregateArrayMinMax(humidityValues, numGroups)
  // const aggregatedSoilMoistureMinMax = aggregateArrayMinMax(soilMoistureValues, numGroups)
  // const aggregatedRainMinMax = aggregateArrayMinMax(rainValues, numGroups)
  // const aggregatedUvMinMax = aggregateArrayMinMax(uvValues, numGroups)

  const aggregatedTimestampsArray = calcForecastTimestampsArray(
    aggregatedTemperatureArray
  )

  return {
    temperature: buildExtendedResponseFormat(
      aggregatedTemperatureArray,
      aggregatedTimestampsArray,
      aggregatedTemperatureMinMax
    ),
    humidity: rebuildTbResponseFormat(
      aggregatedHumidityArray,
      aggregatedTimestampsArray
    ),
    soilMoisture: rebuildTbResponseFormat(
      aggregatedSoilMoistureArray,
      aggregatedTimestampsArray
    ),
    rain: rebuildTbResponseFormat(
      aggregatedRainArray,
      aggregatedTimestampsArray
    ),
    uv: rebuildTbResponseFormat(aggregatedUvArray, aggregatedTimestampsArray),
    icons: calcIcon(aggregatedRainArray, aggregatedTimestampsArray)
  }
}
