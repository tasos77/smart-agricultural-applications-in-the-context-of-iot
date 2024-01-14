# from datetime import datetime
# import pandas as pd
# timestamp = 1703280070269  # Replace with your timestamp
# print(timestamp/1000)
# my_datetime = datetime.fromtimestamp(
#     timestamp / 1000)  # Apply fromtimestamp function
# print(my_datetime)

from datetime import datetime
import pandas as pd
a = 1703280070269
date = datetime.fromtimestamp(a // 1000)
print(date)

ts = pd.to_datetime(a, unit='ms')
print(ts)
