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

  // Example usage:
  const originalArray = temperature.map((item) => parseFloat(item.value))
  console.log(originalArray)
  const numGroups = 24

  const aggregatedArray = aggregateArray(originalArray, numGroups)

  // const aggregatedTimestampts = aggregatedArray.map(item, (index) => {
  //   return moment.subtract(index, 'minutes')
  // })
  // console.log(aggregatedArray)
  // console.log(aggregatedTimestampts)
  return {
    temperature,
    humidity,
    soil_moisture,
    rain,
    uv
  }
}

function aggregateArray(array, numGroups) {
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
