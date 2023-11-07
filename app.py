'''
This modules creates a Flask API to deploy the Squirrel Dashboard.

Version: 04 Nov 2023
'''

#################################################
# Imports
#################################################
from flask import Flask, jsonify

from sqlalchemy.orm import Session, declarative_base
from sqlalchemy import create_engine, inspect, Column, String, Boolean, Float

#################################################
# SQLITE CONNECTION
#################################################
# Create an engine for the squirrels.sqlite database
engine = create_engine("sqlite:///squirrels.sqlite")

# Create database session object
session = Session(bind=engine)

# View all of the classes
inspector = inspect(engine)
table_names = inspector.get_table_names()

endpoint_data = dict()
for table in table_names:
    # Get the column names for the table
    table_columns = inspector.get_columns(table)

    col_names = []
    for col in table_columns:
        col_names.append(col['name'])

    results = engine.execute(f"SELECT * FROM {table}").fetchall()

    output_list = []
    for result in results:
        output_dict = dict()

        for col in col_names:
            output_dict[col] = getattr(result, col)
        output_list.append(output_dict)

    endpoint_data[table] = output_list

print(endpoint_data['appearance'])


# # Get column names for 'locations'
# locations_cols = inspector.get_columns('locations')

# col_names = []
# for col in locations_cols:
#     col_names.append(col['name'])

# # Get the dictionary for 'locations'
# results = engine.execute("SELECT * FROM locations").fetchall()

# output_list = []
# for result in results:
#     # result_dict = result.__dict__ # This only works in jupyter notebook?
#     output_dict = dict()

#     # for col in col_names:
#     #     output_dict[col] = result_dict.get(col)
#     # output_list.append(output_dict)
    
#     # print(dir(result))
#     for col in col_names:
#         # print(getattr(result, col))
#         output_dict[col] = getattr(result, col)
#     output_list.append(output_dict)

#################################################
# Flask Setup
app = Flask(__name__)
#################################################

#################################################
# Flask Routes
#################################################
@app.route("/")
def homepage():
    return(
        f"Welcome to the NYC Squirrels Dashboard<br>"
        f"Available routes:<br>"
        f"/locations<br>"
        f"/appearance<br>"
        f"/activities<br>"
        f"/interactions<br>"
    )

@app.route("/locations")
def locations_route():
    return jsonify(endpoint_data['locations'])

@app.route("/appearance")
def appearance_route():
    return jsonify(endpoint_data['appearance'])

@app.route("/activities")
def activities_route():
    return jsonify(endpoint_data['activities'])

@app.route("/interactions")
def interactions_route():
    return jsonify(endpoint_data['interactions'])