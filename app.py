
from flask import Flask, render_template, request, jsonify
import math

app = Flask(__name__)

def calculate_metrics(defects, units, opportunities):
    try:
        defects = float(defects)
        units = float(units)
        opportunities = float(opportunities)
        
        if units <= 0 or opportunities <= 0:
            return None
            
        dpmo = (defects * 1000000) / (units * opportunities)
        
        yield_process = 1 - (dpmo / 1000000)
        if yield_process >= 0.9999966:
            sigma = 6.0
        else:
            sigma = 0.8406 + math.sqrt(29.37 - 2.221 * math.log(dpmo))
            
        yield_percent = 100 * yield_process
        defects_percent = (defects / (units * opportunities)) * 100
        rty = ((units - defects) / units) * 100
        defective_units = (defects / units) * 100
        dpm = (defects * 1000000) / units

        return {
            'sigma': round(sigma, 2),
            'yield': round(yield_percent, 4),
            'defects_percent': round(defects_percent, 4),
            'dpmo': round(dpmo, 2),
            'rty': round(rty, 2),
            'defective_units': round(defective_units, 2),
            'dpm': round(dpm, 2)
        }
    except Exception as e:
        return None

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/calculate', methods=['POST'])
def calculate():
    data = request.get_json()
    result = calculate_metrics(
        data.get('defects', 0),
        data.get('units', 0),
        data.get('opportunities', 0)
    )
    if result is None:
        return jsonify({'error': 'Valores inválidos'}), 400
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)