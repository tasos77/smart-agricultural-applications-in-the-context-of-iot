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

  temperature: [
    {
      ts: 123,
      value: '66.3'
    }
  ]

  for (let i = 0; i < data.predicted_temperature.length; i++) {
    temperature.push({
      timestamp: data.predicted_timestamp[i][0],
      value: data.predicted_temperature[i][0]
    })
    humidity.push({
      timestamp: data.predicted_timestamp[i][0],
      value: data.predicted_humidity[i][0]
    })
    soil_moisture.push({
      timestamp: data.predicted_timestamp[i][0],
      value: data.predicted_soil_moisture[i][0]
    })
    rain.push({
      timestamp: data.predicted_timestamp[i][0],
      value: data.predicted_rain[i][0]
    })
    uv.push({
      timestamp: data.predicted_timestamp[i][0],
      value: data.predicted_uv[i][0]
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
