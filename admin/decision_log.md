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

3. Columns Cleaning
- Remove columns (2020):
    - 'Area Name', irrelevant.
    - 'Area ID, irrelevant.
    - 'Color Notes', irrelevant and too few data points.
    - 'Location', irrelevant and would take too much resources to clean the data. ***
    - 'Above Ground (...)', irrelevant and would take too much resources to clean the data. ***
    - 'Specific Location', irrelevant and would take too much resources to clean the data.
- Remove columns (2018):
    - 'Hectare', inconsistent with 2020 dataset.
    - 'Shift', inconsistent with 2020 dataset.
    - 'Hectare Squirrel Number', inconsistent with 2020 dataset.
    - 'Age', inconsistent with 2020 dataset.
    - 'Date', inconsistent with 2020 dataset, right??? We know 2018 data was collected in October [Autumn] and 2020 data was collected in March [Spring]
    - 'Combination of Primary and Highlight Color', inconsistent with 2020 dataset.
    - 'Color notes', inconsistent with 2020 dataset.
    - 'Location', irrelevant and would take too much resources to clean the data. ***
    - 'Above Ground Sighter Measurement', irrelevant and would take too much resources to clean the data. ***
    - 'Specific Location', inconsistent with 2020 dataset.
    - 'Lat/Long', delete due to double up.

4. Finalise column names
    - park_name                 /  - park_name [Central Park only - can create new column to match 2020 dataset column]
    - park_ID                   /  - park_ID [DOESN'T EXIST IN 2018 DATASET - or maybe we keep this as an ID might be easier to map?]
    - squirrel_ID               /  - 'Unique Squirrel ID' (change to squirrel_ID)
    - primary_fur_color         /  - primary_fur_color
    - highlights_in_fur_color   /  - 'Highlight Fur Color' (change to highlights_in_fur_color)
    - foraging
    - climbing
    - eating
    - running
    - chasing
    - shouting                  /  - 'Kuks' + 'Quaas' + 'Moans' (change to shouting)
    - sitting
    - digging
    - other_activities          /  - 'Other Activities' + 'Tail flags' + 'Tail twitches' (changed to other_activities)
    - interactions_with_humans  /  - 'Approaches' + 'Indifferent' + 'Runs from' + 'Other Interactions' (changed to interactions_with_humans) [MAYBE 'OTHER SPECIES'?]
    - other_observations        /  - other_observations [DOESN'T EXIST IN 2018 DATASET]
    - squirrel_latitude         /  - 'Y' (change to squirrel_latitude)
    - squirrel_longitude        /  - 'X' (change to squirrel_longitude)

5. The "highlights" column needed to be parsed to access the different highlight colours. This was discovered after merging the two datasets, and processed accordingly.

6. Needed to change datatypes constantly, since "True" and "False" was not being recognised as a boolean.

7. Created a PostgreSQL, thinking we could export the resulting database for use in Flask. Turns out we could use SQLAlchemy and Pandas `to_sql()` to build the SQLite database using cleaned data (CSV format) converted back to a dataframe.
- No need to use `automap_base()` or `Base.classes` to access the data contained in the tables.
- Able to use table names in the query straight away.

7. Change "locations" to metadata and add the "date" column back in.