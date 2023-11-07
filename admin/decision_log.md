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

3.










4. The "highlights" column needed to be parsed to access the different highlight colours. This was discovered after merging the two datasets, and processed accordingly.

5. Needed to change datatypes constantly, since "True" and "False" was not being recognised as a boolean.

6. Created a PostgreSQL, thinking we could export the resulting database for use in Flask. Turns out we could use SQLAlchemy and Pandas `to_sql()` to build the SQLite database using cleaned data (CSV format) converted back to a dataframe.
- No need to use `automap_base()` or `Base.classes` to access the data contained in the tables.
- Able to use table names in the query straight away.

7. Change "locations" to metadata and add the "date" column back in.