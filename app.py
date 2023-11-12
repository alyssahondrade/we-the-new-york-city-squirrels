'''
This modules creates a Flask API to deploy the Squirrel Dashboard.

Version: 04 Nov 2023
'''

#################################################
# Imports
#################################################
from flask import Flask, jsonify, render_template
from flask_cors import CORS

from sqlalchemy.orm import Session
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import create_engine, inspect, Column, String, Boolean, Float, text

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

# Initialise the dictionary that will hold the results
endpoint_data = dict()

# Loop through each table in the database
for table in table_names:
    
    # Get the column names for the table
    table_columns = inspector.get_columns(table)

    # Extract the name from each column
    col_names = []
    for col in table_columns:
        col_names.append(col['name'])

    # SQL query to return everything from a table
    statement = f"SELECT * FROM {table}"

    # Connect to the database
    with engine.connect() as conn:
        
        # Execute the statement
        results = conn.execute(text(statement))

        # Loop through each row in the table
        output_list = []
        for result in results:
            output_dict = dict()

            # Loop through each value in the row
            for col in col_names:
                output_dict[col] = getattr(result, col)
            output_list.append(output_dict)

        # Populate the dictionary
        endpoint_data[table] = output_list


#################################################
# Flask Setup
#################################################
app = Flask(__name__)

CORS(app)

#################################################
# Flask Routes
#################################################
@app.route("/")
def homepage():
    # return(
    #     f"Welcome to the NYC Squirrels Dashboard<br>"
    #     f"Available routes:<br>"
    #     f"/metadata<br>"
    #     f"/appearance<br>"
    #     f"/activities<br>"
    #     f"/interactions<br>"
    # )
    return render_template("index.html")

@app.route("/metadata")
def locations_route():
    return jsonify(endpoint_data['metadata'])

@app.route("/appearance")
def appearance_route():
    return jsonify(endpoint_data['appearance'])

@app.route("/activities")
def activities_route():
    return jsonify(endpoint_data['activities'])

@app.route("/interactions")
def interactions_route():
    return jsonify(endpoint_data['interactions'])

@app.route("/overview")
def overview():
    return render_template("overview.html")


if __name__ == '__main__':
    app.run(debug=True)