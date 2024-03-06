from flask import Flask, request, jsonify
from flask_cors import CORS
from keras.models import load_model
import cv2
import numpy as np

app = Flask(__name__)
CORS(app, origins='http://localhost:5173')

model = load_model('modelo.h5')
classes = ['Mexico', 'Qatar', 'Georgia', 'Espana', 'Ecuador', 'USA', 'Chile', 'Peru', 'Tunez', 'Eslovaquia']

@app.route('/predict', methods=['POST'])
def predict():
    
    image_data = request.files['image']
    
    img = cv2.imdecode(np.fromstring(image_data.read(), np.uint8), cv2.IMREAD_GRAYSCALE)
    img = cv2.resize(img, (64, 64))
    img = np.array(img).reshape(-1, 64, 64, 1)
    
    prediction = model.predict(img)
    predicted_class = classes[np.argmax(prediction)]
    
    return jsonify({'predicted_class': predicted_class})

if __name__ == '__main__':
    app.run(debug=True)
