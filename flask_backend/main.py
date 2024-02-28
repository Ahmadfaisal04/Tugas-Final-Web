from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_mysqldb import MySQL
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
CORS(app, origins="*", methods=["GET", "POST"], headers=["Content-Type"])

# SQLAlchemy configurations
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:@localhost/final'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class History(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    data = db.Column(db.String(255))
    date = db.Column(db.DateTime, default=db.func.current_timestamp())

    def __repr__(self):
        return f'<History {self.id}>'


@app.route('/api/post_data', methods=['POST'])
def post_data():
    try:
        # Get data from request
        data = request.json
        # Create a new History object
        new_history = History(data=data['data'])
        # Add the object to the session and commit to the database
        db.session.add(new_history)
        db.session.commit()
        return jsonify({'message': 'Data posted successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@app.route('/api/get_history', methods=['GET'])
def get_history():
    try:
        # Query all records from the History table
        history_records = History.query.all()
        # Serialize the history records
        serialized_history = [{
            'id': record.id,
            'data': record.data,
            'date': record.date
        } for record in history_records]
        return jsonify(serialized_history)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

        
@app.route("/api/data", methods=["GET"])
def apidata():
    return jsonify({"nama":"Muh maman", "tes":"dwertyu"})


if __name__ == "__main__":
    # app.app_context().push()
    # db.create_all()
    app.run(debug=True)