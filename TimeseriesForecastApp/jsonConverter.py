
import pandas as pd

json_data = [
    {"timestamp": 10, "temperature": 15, "humidity": 30, "soilMoisture": 10},
    {"timestamp": 10, "temperature": 15, "humidity": 30, "soilMoisture": 10},
    {"timestamp": 10, "temperature": 15, "humidity": 30, "soilMoisture": 10},
]
df = pd.DataFrame(json_data)
print(df)
