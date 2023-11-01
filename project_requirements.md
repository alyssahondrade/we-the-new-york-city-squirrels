# Project Requirements

## Specific Requirements:
1. Visualisation must include:
    - A Python Flask-powered API
    - HTML/CSS
    - JavaScript
    - At least one database (SQL, MongoDB, SQLite)

2. Chosen track: Dashboard page with multiple charts that update from the same data.

3. JS Library: <?>

4. Dataset with at least 100 records.

5. User-driven interaction (menus, dropdowns, textboxes).

6. At least 3 views for the final visualisation.

## Work Breakdown Structure
1. Project Proposal
    - Finalise research questions - what story do we want to tell?
    - Finalise visualisations - what is the best way to visualise each concept?

2. Data exploration
    - Identify minimum requirements for the columns and drop rows which do not satisfy this
    - Confirm dataset is at least 100 records
    - Confirm all columns required for each final visualisation is valid

3. Data transformation / cleaning
    - For each dataset:
        - Drop/Impute missing values
        - Rename columns to common between datasets, for consistency
    - Ensure data is in 2NF
        - For the 2020 dataset, parse the `Activities` column to separate activites, like in 2018 dataset. Parse the `Park Conditions`, `Other Animal Sightings`, `Litter`, `Squirrel Sighter(s)` from the parks dataset.
    - Convert the datatypes
    - Merge dataset: confirm squirrel IDs are unique after merge
  
4. Data loading - MODULE 9 CHALLENGE
    - Choose a database (SQL, MongoDB, SQLite)
    - Create ERD
    - Create Schema
    - Load data to database (test with SELECT *)

5. API - MODULE 10 CHALLENGE
    - Create database connection (use: create_engine)
    - Flask setup and define routes
    - Create each route

6. Visualisation - MODULE 14 CHALLENGE
    - Create the `index.html`
        - Import JS libraries
        - Link to `.js` and `.css` files
    - JS script source code

7. Presentation
    - Populate README
    - Create slide deck
    - Presentation practice

## Dashboard Views

### View 1 - Park Conditions Map
- The map will display the number of squirrels sighted per condition - bubble/choropleth?
- Users can toggle between 2018 and 2020 datasets using a dropdown menu (INTERACTION).
- Users can select park conditions of interest: size, condition, weather.

### View 2 - Pie Charts
- As the map option is updated, the pie chart values change for:
    - Primary colour
    - Squirrel activity
- Labels appear when the user hovers over the pie chart sections (INTERACTION).

### View 3 - Bar Charts
- Display comparisons for:
    - Squirrel ages (adult, juvenile, unknown)
    - Behaviour towards humans