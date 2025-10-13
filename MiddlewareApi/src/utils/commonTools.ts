import moment from 'moment'

const nightTimeArray: string[] = [
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

export function aggregateArray(array: number[], numGroups: number) {
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

export function aggregateArrayMinMax(array: number[], numGroups: number) {
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

export function rebuildTbResponseFormat(values: number[], timestamps: number[]) {
  return values.map((value, index) => {
    return {
      ts: timestamps[index],
      value: value.toFixed(2)
    }
  })
}

export function buildExtendedResponseFormat(values: number[], timestamps: number[], minMaxArray: { min: string, max: string }[]) {
  return values.map((value, index) => {
    return {
      ts: timestamps[index],
      value: value.toFixed(2),
      range: minMaxArray[index]
    }
  })
}

export function calcForecastTimestampsArray(array: number[]) {
  const timestamps: number[] = []
  array.forEach((item, index) => {
    timestamps.push(moment().add(index, 'hours').valueOf())
  })
  return timestamps
}

export function calcHistoryTimestampsArray(array: number[]) {
  const timestamps: number[] = []
  array.forEach((item, index) => {
    timestamps.push(moment().subtract(index, 'hours').valueOf())
  })
  return timestamps.reverse()
}

export function exportTBValuesArray(array: { ts: number, value: string }[]) {
  return array.map((item) => parseFloat(item.value))
}

export function calcSingleIcon(rainValue: number, timestamp: number) {
  if (rainValue > 20) {
    return 'rain'
  } else if (nightTimeArray.includes(moment(timestamp).format('h A'))) {
    return 'clear_night'
  } else {
    return 'clear_day'
  }
}

export function calcIcon(aggregatdRainValues: number[], aggregatedTimestampsArray: number[]) {
  return aggregatdRainValues.map((rainValue, index) => {
    if (rainValue > 20) {
      return 'rain'
    } else if (nightTimeArray.includes(moment(aggregatedTimestampsArray[index]).format('h A'))) {
      return 'clear_night'
    } else {
      return 'clear_day'
    }
  })
}

export function createWebSocketDataObject(token: string, entityId: string) {
  return {
    authCmd: {
      cmdId: 0,
      token: token
    },
    cmds: [
      {
        entityType: 'DEVICE',
        entityId: entityId,
        scope: 'LATEST_TELEMETRY',
        cmdId: 1,
        type: 'TIMESERIES'
      },
      {
        cmdId: 2,
        query: {
          alarmFields: [
            {
              type: 'ALARM_FIELD',
              key: 'createdTime'
            },
            {
              type: 'ALARM_FIELD',
              key: 'originator'
            },
            {
              type: 'ALARM_FIELD',
              key: 'type'
            },
            {
              type: 'ALARM_FIELD',
              key: 'severity'
            },
            {
              type: 'ALARM_FIELD',
              key: 'status'
            },
            {
              type: 'ALARM_FIELD',
              key: 'assignee'
            }
          ],
          entityFields: [],
          entityFilter: {
            type: 'singleEntity',
            singleEntity: {
              entityType: 'DEVICE',
              id: entityId
            }
          },
          latestValues: [],
          pageLink: {
            page: 0,
            pageSize: 10,
            searchPropagatedAlarms: false,
            severityList: [],
            sortOrder: {
              direction: 'DESC',
              key: {
                key: 'createdTime',
                type: 'ALARM_FIELD'
              }
            },
            statusList: [],
            textSearch: null,
            timeWindow: 86400000,
            typeList: []
          }
        },
        type: 'ALARM_DATA'
      },
      {
        cmdId: 3,
        latestCmd: {
          keys: [
            {
              type: 'ATTRIBUTE',
              key: 'pump_state'
            }
          ]
        },
        query: {
          entityFields: [
            { key: 'name', type: 'ENTITY_FIELD' },
            { key: 'label', type: 'ENTITY_FIELD' },
            { key: 'additionalInfo', type: 'ENTITY_FIELD' }
          ],
          entityFilter: {
            singleEntity: {
              entityType: 'DEVICE',
              id: entityId
            },
            type: 'singleEntity'
          },
          latestValues: [{ key: 'pump_state', type: 'ATTRIBUTE' }],
          pageLink: {
            dynamic: true,
            page: 0,
            pageSize: 10,
            sortOrder: null,
            textSearch: null
          }
        },
        type: 'ENTITY_DATA'
      }
    ]
  }
}
