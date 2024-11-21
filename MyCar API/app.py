from flask import Flask, render_template, request
from flask_json import FlaskJSON, json_response, as_json, JsonError
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__, static_url_path='/static')
json = FlaskJSON(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///CarsData.sqlite'
db = SQLAlchemy(app)

class Car(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    year = db.Column(db.String)
    make = db.Column(db.String)
    model = db.Column(db.String)


with app.app_context():
    db.create_all()


@app.route('/')
def main():
    return render_template('index.html')


@app.route('/api/years', methods=['GET'])
def year():
    years = db.session.query(Car.year).distinct().all()
    return json_response(years=years)


@app.route('/api/makes', methods=['POST'])
def make():
    data = request.get_json()
    year = data.get('year')

    makes = db.session.query(Car.make).filter_by(year=year).distinct().all()
    return json_response(makes=makes)


@app.route('/api/models', methods=['POST'])
def model():
    data = request.get_json()
    year = data.get('year')
    make = data.get('make')

    models = db.session.query(Car.model).filter_by(year=year, make=make).distinct().all()
    return json_response(models=models)


app.run(debug=True)