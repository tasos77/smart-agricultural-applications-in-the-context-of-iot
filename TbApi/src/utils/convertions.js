import moment from 'moment'

const nightTimeArray = [
  '6 PM',
  '7 PM',
  '8 PM',
  '9 PM',
  '10 PM',
  '11 PM',
  '12 AM',
  '1 AM',
  '2 AM',
  '3 AM',
  '4 AM',
  '5 AM'
]
const dayTimeArray = [
  '6 AM',
  '7 AM',
  '8 AM',
  '9 AM',
  '10 AM',
  '11 AM',
  '12 PM',
  '1 PM',
  '2 PM',
  '3 PM',
  '4 PM',
  '5 PM'
]

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
  console.log(data.predicted_rain)
  console.log(data.predicted_uv)
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

const calcIcon = (aggregatdRainValues, aggregatedTimestampsArray) => {
  return aggregatdRainValues.map((rainValue, index) => {
    if (rainValue >= 1) {
      return 'rain'
    } else if (nightTimeArray.includes(moment(aggregatedTimestampsArray[index]).format('h A'))) {
      return 'clear_night'
    } else {
      return 'clear_day'
    }
  })
}

export function calcSingleIcon(rainValue, timestamp) {
  if (rainValue >= 1) {
    return 'rain'
  } else if (nightTimeArray.includes(moment(timestamp).format('h A'))) {
    return 'clear_night'
  } else {
    return 'clear_day'
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

const buildExtendedResponseFormat = (values, timestamps, minMaxArray) => {
  return values.map((value, index) => {
    return {
      ts: timestamps[index],
      value: value.toFixed(2),
      range: minMaxArray[index]
    }
  })
}

const calcForecastTimestampsArray = (array) => {
  const timestamps = []
  array.forEach((item, index) => {
    timestamps.push(moment().add(index, 'hours').valueOf())
  })
  return timestamps
}

const calcHistoryTimestampsArray = (array) => {
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

const aggregateArrayMinMax = (array, numGroups) => {
  const groupSize = Math.ceil(array.length / numGroups)
  const aggregatedArray = []

  for (let i = 0; i < numGroups; i++) {
    const startIndex = i * groupSize
    const endIndex = Math.min((i + 1) * groupSize, array.length)

    if (startIndex < endIndex) {
      // Calculate the min and max for the current group
      const groupValues = array.slice(startIndex, endIndex)
      const groupMin = Math.min(...groupValues)
      const groupMax = Math.max(...groupValues)

      // Push the min and max to the aggregated array
      aggregatedArray.push({ min: groupMin, max: groupMax })
    }
  }
  return aggregatedArray
}
