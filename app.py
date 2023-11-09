'''
This modules creates a Flask API to deploy the Squirrel Dashboard.

Version: 04 Nov 2023
'''

#################################################
# Imports
#################################################
from flask import Flask, jsonify
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

endpoint_data = dict()
for table in table_names:
    # Get the column names for the table
    table_columns = inspector.get_columns(table)

    col_names = []
    for col in table_columns:
        col_names.append(col['name'])

    statement = f"SELECT * FROM {table}"
    with engine.connect() as conn:        
        results = conn.execute(text(statement))
        # results = conn.execute(text(f"SELECT * FROM {table}"))
        # results = engine.execute(f"SELECT * FROM {table}").fetchall()

        output_list = []
        for result in results:
            output_dict = dict()
    
            for col in col_names:
                output_dict[col] = getattr(result, col)
            output_list.append(output_dict)
    
        endpoint_data[table] = output_list

# print(endpoint_data['appearance'])


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
CORS(app)
#################################################

#################################################
# Flask Routes
#################################################
@app.route("/")
def homepage():
    return(
        f"Welcome to the NYC Squirrels Dashboard<br>"
        f"Available routes:<br>"
        f"/metadata<br>"
        f"/appearance<br>"
        f"/activities<br>"
        f"/interactions<br>"
    )

@app.route("/metadata")
# @app.route("/locations", methods=['GET'])
def locations_route():
    return jsonify(endpoint_data['metadata'])
    # response = jsonify(endpoint_data['locations'])
    # response.headers.add('Access-Control-Allow-Origin', '*')
    # return response

@app.route("/appearance")
# @app.route("/appearance", methods=['GET'])
def appearance_route():
    return jsonify(endpoint_data['appearance'])
    # response = jsonify(endpoint_data['appearance'])
    # response.headers.add('Access-Control-Allow-Origin', '*')
    # return response

@app.route("/activities")
# @app.route("/activities", methods=['GET'])
def activities_route():
    return jsonify(endpoint_data['activities'])
    # response = jsonify(endpoint_data['activities'])
    # response.headers.add('Access-Control-Allow-Origin', '*')
    # return response

@app.route("/interactions")
# @app.route("/interactions", methods=['GET'])
def interactions_route():
    return jsonify(endpoint_data['interactions'])
    # response = jsonify(endpoint_data['interactions'])
    # response.headers.add('Access-Control-Allow-Origin', '*')
    # return response

# @app.route('your route', methods=['GET'])
# def yourMethod(params):
#     response = flask.jsonify({'some': 'data'})
#     response.headers.add('Access-Control-Allow-Origin', '*')
#     return response

if __name__ == '__main__':
    app.run(debug=True)