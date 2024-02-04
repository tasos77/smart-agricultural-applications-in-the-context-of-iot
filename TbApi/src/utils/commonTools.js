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

export function aggregateArray(array, numGroups) {
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

export function aggregateArrayMinMax(array, numGroups) {
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
      aggregatedArray.push({ min: groupMin.toFixed(2), max: groupMax.toFixed(2) })
    }
  }
  return aggregatedArray
}

export function rebuildTbResponseFormat(values, timestamps) {
  return values.map((value, index) => {
    return {
      ts: timestamps[index],
      value: value.toFixed(2)
    }
  })
}

export function buildExtendedResponseFormat(values, timestamps, minMaxArray) {
  return values.map((value, index) => {
    return {
      ts: timestamps[index],
      value: value.toFixed(2),
      range: minMaxArray[index]
    }
  })
}

export function calcForecastTimestampsArray(array) {
  const timestamps = []
  array.forEach((item, index) => {
    timestamps.push(moment().add(index, 'hours').valueOf())
  })
  return timestamps
}

export function calcHistoryTimestampsArray(array) {
  const timestamps = []
  array.forEach((item, index) => {
    timestamps.push(moment().subtract(index, 'hours').valueOf())
  })
  return timestamps.reverse()
}

export function exportTBValuesArray(array) {
  return array.map((item) => parseFloat(item.value))
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

export function calcIcon(aggregatdRainValues, aggregatedTimestampsArray) {
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
