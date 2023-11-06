'''
This modules creates a Flask API to deploy the Squirrel Dashboard.

Version: 04 Nov 2023
'''

#################################################
# Imports
#################################################
from flask import Flask, jsonify

from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func, MetaData

# import numpy as np
# import datetime as dt

from pprint import pprint
from json import loads, dumps


#################################################
# SQLITE CONNECTION
#################################################
# Create an engine for the hawaii.sqlite database
engine = create_engine("sqlite:///squirrels.sqlite")

metadata = MetaData()
metadata.reflect(bind=engine)

# Reflect the database into ORM classes
# Base = automap_base()
# Base.prepare(autoload_with = engine)
Base = automap_base(metadata=metadata)
Base.prepare()

# Save references to the respective table
# locations = Base.classes.locations
# appearance = Base.classes.appearance
# activities = Base.classes.activities
# interactions = Base.classes.interactions

locations = metadata.tables["locations"]
appearance = metadata.tables["appearance"]
activities = metadata.tables["activities"]
interactions = metadata.tables["interactions"]

# Create a database session object
session = Session(bind=engine)

# session.query(locations).fetchall()
# test = session.query(locations).all()
# print(test)

# for row in test:
#     print(row.squirrel_id)

#################################################
# Flask Setup
app = Flask(__name__)
#################################################

#################################################
# Flask Routes
#################################################
@app.route("/")
def homepage():
    return("Welcome to the NYC Squirrels Dashboard<br/>")


@app.route("/locations")
def locations_route():
    # data = [row.to_dict() for row in test]  # Convert to a list of dictionaries
    # data = [dict(list(row)) for row in test]

    test = session.query(locations).all()
    for row in test
    
    return jsonify(data)



"""
justice_league_members = [
    {"superhero": "Aquaman", "real_name": "Arthur Curry"},
    {"superhero": "Batman", "real_name": "Bruce Wayne"},
    {"superhero": "Cyborg", "real_name": "Victor Stone"},
    {"superhero": "Flash", "real_name": "Barry Allen"},
    {"superhero": "Green Lantern", "real_name": "Hal Jordan"},
    {"superhero": "Superman", "real_name": "Clark Kent/Kal-El"},
    {"superhero": "Wonder Woman", "real_name": "Princess Diana"}
]
"""