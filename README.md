# We, The New York Squirrels
![image](https://github.com/alyssahondrade/Project3/assets/138610916/f0185984-d1bb-473f-b932-c6cb5d841353)

Project 3 - UWA/edX Data Analytics Bootcamp

GitHub repository at: [https://github.com/alyssahondrade/Project3.git](https://github.com/alyssahondrade/Project3.git)

Presentation slides at: [We, The New York City Squirrels](https://www.canva.com/design/DAFzenMw14o/LYJVAZa6CBkn-DByMrmZUg/edit?utm_content=DAFzenMw14o&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)

## Usage
- __Step 1__: Clone the repository to your local machine.
- __Step 2__: Open a terminal at the repository.
- __Step 3__: Run `flask run`.
- __Step 4__: Enjoy the dashboard!

## Table of Contents
1. [Introduction](https://github.com/alyssahondrade/Project3#introduction)
    1. [Research Questions](https://github.com/alyssahondrade/Project3#research-questions)
    2. [Repository Structure](https://github.com/alyssahondrade/Project3#repository-structure)
    3. [Dataset](https://github.com/alyssahondrade/Project3#dataset)
2. [Scope](https://github.com/alyssahondrade/Project3#scope)
    1. [Architecture](https://github.com/alyssahondrade/Project3/blob/main/README.md#architecture)
3. [Analysis](https://github.com/alyssahondrade/Project3/tree/main#analysis)
4. [Future Research](https://github.com/alyssahondrade/Project3#future-research)
5. [References](https://github.com/alyssahondrade/Project3#references)


## Introduction
The project will create an interactive visualisation of a squirrel’s day-to-day life in New York City. The project is based on the 2018 and 2020 Squirrel Census, where the data from 2018 was collected over a two-week period and the data for 2020 was collected on a single day (01 March 2020) but simplified for the project as autumn and spring.

The project singles in on a specific animal but can be scaled to any wildlife and its interactions / behaviours in similar metropolitan areas.

### Research Questions
1. How does the squirrel frequency and range of activities and behaviours compare between autumn and spring?

2. How does the squirrel population diversity (colours, age, location) compare between autumn and spring?

3. How do squirrels, in a park setting, interact with humans and other wildlife?

### Repository Structure
The root directory contains:
- `app.py`, the Flask script used to serve both the data and the dashboard.
- `squirrels.sqlite`, the SQLite database.

Other directories:
- `admin` contains team project management files, including [`references.md`](https://github.com/alyssahondrade/Project3/blob/main/admin/references.md).
- `erd` contains all documents relevant to the ERD and schema.
- `images` contains all images used in the README.
- `presentation` contains slides and squirrel story.
- `resources` contains subdirectories: `clean` data (4 CSV files) and `raw` data (3 CSV files).
- `static/js` contains the dashboard JavaScript files.
- `templates` contains the HTML files.

### Dataset
Retrieved data from the following two websites:
- [`The Squirrel Census`](https://www.thesquirrelcensus.com/data)
- [`2018 Central Park Squirrel Census - Squirrel Data`](https://data.cityofnewyork.us/Environment/2018-Central-Park-Squirrel-Census-Squirrel-Data/vfnx-vebw)

__Dataset Limitations__
- The squirrels were not counted more than once, a scientific advisor was onsite providing guidance.
- The 2020 dataset was limited to one day, 01 March 2020, whereas the 2018 data was collected over a two-week period.
- The 2018 dataset was limited to “Central Park”, whereas the 2020 data was collected over multiple smaller parks.


## Scope
The project will focus on the following data attributes:
- Latitude and longitude, to plot the sightings on a map.
- Squirrels identified using unique IDs.
- Squirrel sightings have the following recorded:
    - Primary Fur Colour
    - Highlight Fur Colour
    - Activities (running, chasing, climbing, eating, foraging, etc.)
    - Interactions with humans (approaches, indifferent, runs from)
- The weather on the day of the sighting
- The age of the squirrel (2018 dataset only)

### Architecture
The project workflow demonstrates the early planning of the project. From this, the following components were utilised in the project:
- Track: A dashboard page with multiple charts that update from the same data.
- Databse: SQLite
- Additional JS Library: Chroma.js and Lodash

|![project_workflow](https://github.com/alyssahondrade/Project3/blob/main/images/project_workflow.png)|
|:---:|
|Project Workflow|

The data wrangling diagrams are shown below.
|![data_wrangling_1](https://github.com/alyssahondrade/Project3/blob/main/images/2018%20Dataset.png)|![data_wrangling_2](https://github.com/alyssahondrade/Project3/blob/main/images/2020%20Dataset.png)|![data_wrangling_3](https://github.com/alyssahondrade/Project3/blob/main/images/Both%20Datasets.png)|
|:---:|:---:|:---:|
|2018 Dataset|2020 Dataset|Both Datasets|

The ERD of the cleaned dataset is shown below, this was used to inform the SQLite database build.
|![squirrels_erd](https://github.com/alyssahondrade/Project3/blob/main/images/squirrel_erd.png)|
|:---:|
|Database ERD|

The coding approach diagram demonstrates the final architecture state of the project.
|![coding_approach](https://github.com/alyssahondrade/Project3/blob/main/images/coding_approach.png)|
|:---:|
|Coding Approach|


## Analysis
1. How does the squirrel frequency and range of activities and behaviours compare between autumn and spring?
- In autumn, squirrels are more likely to dig, run, and sit, which could be attributed to the coming of winter. Squirrels could be preparing their food vaults and are wary of predators during this time.
- Squirrels are more likely to forage, climb, and eat during spring, likely due to the availability of food sources.

![squirrel_activities](https://github.com/alyssahondrade/Project3/blob/main/images/squirrel_activities_bar_chart.png)

2. How does the squirrel population diversity (colours, age, location) compare between autumn and spring?
- There were significantly more Gray squirrels with white or cinnamon highlights than any other squirrels.
- 31 Black squirrels were found in total across both datasets, compared to 810 and 530 Gray squirrels - specifically with cinnamon and white highlights respectively.

![squirrel_appearance](https://github.com/alyssahondrade/Project3/blob/main/images/squirrel_appearance_heat_map.png)

3. How do squirrels, in a park setting, interact with humans and other wildlife?
- During autumn, most squirrels observed the other wildlife rather than interacting it. A third were indifferent during this time and very few approached other wildlife.
- Comparatively during spring, squirrels were only observing other wildlife 3% of the time. Roughly 70% of squirrels were indifferent during this time, and they were more likely to approach the wildlife when compared to autumn.
- In both seasons, the percentage of squirrels ran that from the wildlife appeared to be similar.

![squirrel_interactions](https://github.com/alyssahondrade/Project3/blob/main/images/squirrel_interactions_radar_plot.png)

In conclusion, the project could be applied to any wildlife species within the metro area if the dataset was available.


## Future Research
- Locations: Map squirrel locations (location, specific location) and track squirrel vertical movements (above ground, etc).
- Map filtering such that selecting checkboxes will filter relevant markers (AND logic, as opposed to OR).
- Additional visualisations for the longitudinal (slider) plot.

__Future Amendments__
- Add numbers to the heatmap.
- Tidy the overview page and convert to an "About" section.
- Clean up the "squirrel_story.md".

## References
The full reference list utilised in the project is available at: [`references.md`](https://github.com/alyssahondrade/Project3/blob/main/admin/references.md)
