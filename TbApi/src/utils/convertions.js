import moment from 'moment'

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
  const soil_moisture = []
  const rain = []
  const uv = []

  for (let i = 0; i < data.predicted_temperature.length; i++) {
    temperature.push({
      ts: data.predicted_timestamp[i][0],
      value: data.predicted_temperature[i][0].toFixed(1)
    })
    humidity.push({
      ts: data.predicted_timestamp[i][0],
      value: data.predicted_humidity[i][0].toFixed(1)
    })
    soil_moisture.push({
      ts: data.predicted_timestamp[i][0],
      value: data.predicted_soil_moisture[i][0].toFixed(1)
    })
    rain.push({
      ts: data.predicted_timestamp[i][0],
      value: data.predicted_rain[i][0].toFixed(1)
    })
    uv.push({
      ts: data.predicted_timestamp[i][0],
      value: data.predicted_uv[i][0].toFixed(1)
    })
  }

  return {
    temperature,
    humidity,
    soil_moisture,
    rain,
    uv
  }
}

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

  const aggregatedTimestampsArray = calcTimestampsArray(aggregatedTemperatureArray)

  return {
    temperature: rebuildTbResponseFormat(aggregatedTemperatureArray, aggregatedTimestampsArray),
    humidity: rebuildTbResponseFormat(aggregatedHumidityArray, aggregatedTimestampsArray),
    soilMoisture: rebuildTbResponseFormat(aggregatedSoilMoistureArray, aggregatedTimestampsArray),
    rain: rebuildTbResponseFormat(aggregatedRainArray, aggregatedTimestampsArray),
    uv: rebuildTbResponseFormat(aggregatedUvArray, aggregatedTimestampsArray)
  }
}

const rebuildTbResponseFormat = (values, timestamps) => {
  return values.map((value, index) => {
    return {
      ts: timestamps[index],
      value: value.toFixed(2)
    }
  })
}

const calcTimestampsArray = (array) => {
  const timestamps = []
  array.forEach((item, index) => {
    timestamps.push(moment().subtract(index, 'hours').valueOf())
  })
  return timestamps.reverse()
}

const exportTBValuesArray = (array) => {
  return array.map((item) => parseFloat(item.value))
}

const aggregateArray = (array, numGroups) => {
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
