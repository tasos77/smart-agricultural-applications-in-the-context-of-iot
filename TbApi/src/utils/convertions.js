export function transformTBDataToTimeseriesForecastAppFormat(data) {
  const timeseriesForecastAppCompatibleHistoryMeasurements = [];

  for (let i = 0; i < data.temperature.length; i++) {
    timeseriesForecastAppCompatibleHistoryMeasurements.push({
      timestamp: data.temperature[i].ts,
      temperature: parseFloat(data.temperature[i].value),
      humidity: parseFloat(data.humidity[i].value),
      rain: parseFloat(data.rain[i].value),
      soil_moisture: parseFloat(data.soilMoisture[i].value),
      uv: parseFloat(data.uv[i].value),
    });
  }

  return timeseriesForecastAppCompatibleHistoryMeasurements;
}
