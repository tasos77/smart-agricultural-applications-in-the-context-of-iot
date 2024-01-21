export function convertAlarmEvent(alarmName) {
  switch (alarmName) {
    case 'High Temp':
      return { measurement: 'temperature', flag: 1 }
    case 'High Humidity':
      return { measurement: 'humidity', flag: 1 }
    case 'High Soil':
      return { measurement: 'soil moisture', flag: 1 }
    case 'High Rain':
      return { measurement: 'rain', flag: 1 }
    case 'High UV':
      return { measurement: 'uv', flag: 1 }
    case 'Fine Temp':
      return { measurement: 'temperature', flag: 0 }
    case 'Fine Humidity':
      return { measurement: 'humidity', flag: 0 }
    case 'Fine Soil':
      return { measurement: 'soil moisture', flag: 0 }
    case 'Fine Rain':
      return { measurement: 'rain', flag: 0 }
    case 'Fine UV':
      return { measurement: 'uv', flag: 0 }
    default:
      return null
  }
}
