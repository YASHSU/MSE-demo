from flask import Flask, request, jsonify
import math
from flask_cors import CORS  # For handling cross-origin requests

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes (for development)

def calculate_distance(point_a, point_b):
    return math.sqrt((point_b['x'] - point_a['x'])**2 + (point_b['y'] - point_a['y'])**2)

@app.route('/calculate_distance', methods=['POST'])
def calculate_distance_route():
    data = request.get_json()
    point_a = data.get('pointA')
    point_b = data.get('pointB')

    if point_a and point_b:
        distance = calculate_distance(point_a, point_b)
        return jsonify({'distance': distance})
    else:
        return jsonify({'error': 'Invalid data'}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)
