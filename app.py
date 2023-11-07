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
print(inspector.get_table_names())

# Get column names for 'locations'
locations_cols = inspector.get_columns('locations')

col_names = []
for col in locations_cols:
    col_names.append(col['name'])

# Get the dictionary for 'locations'
results = engine.execute("SELECT * FROM locations").fetchall()

output_list = []
for result in results:
    # result_dict = result.__dict__ # This only works in jupyter notebook?
    output_dict = dict()

    # for col in col_names:
    #     output_dict[col] = result_dict.get(col)
    # output_list.append(output_dict)
    
    # print(dir(result))
    for col in col_names:
        # print(getattr(result, col))
        output_dict[col] = getattr(result, col)
    output_list.append(output_dict)

print(output_list)