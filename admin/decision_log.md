# Decision Log
The purpose of this document is to log all decisions to a central location accessible to all team members.

## Data Cleaning
1. (02 Nov) "Other Notes or Observations / Interactions"
- Description:
    - 2020 Dataset "Other Notes or Observations": 192 >> 96 rows, with 76 unique
    - 2018 Dataset "Other Interactions": 1937 >> 170, with 152 unique
    - Can include NaN values, use as an extra point of interest?
- Decision: No need to use dropna(), retain rows with null values since not a primary attribute.

2. (02 Nov) "Location / Above Ground / Specific Location"
- Description: If retained, will require extra work to parse.
- Decision: Since not a primary attribute and resource-limited, drop columns.

