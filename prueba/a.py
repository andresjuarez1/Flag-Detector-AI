from flask import Flask, request, jsonify
from flask_cors import CORS
from keras.models import load_model
import cv2
import numpy as np

app = Flask(__name__)
CORS(app, origins='http://localhost:5173')

model = load_model('modelo.h5')
classes = ['Mexico', 'Qatar', 'Georgia', 'Espana', 'Ecuador', 'USA', 'Chile', 'Peru', 'Tunez', 'Eslovaquia']

history_texts = {
    'Mexico': 'La bandera de México consiste en tres franjas verticales: verde, blanco y rojo, con el escudo nacional en el centro de la franja blanca. Los colores representan la esperanza, la unidad y la sangre derramada por los héroes nacionales, respectivamente.',
    'Qatar': 'La bandera de Qatar es de color carmesí con una franja blanca vertical a la izquierda. El carmesí es un color tradicionalmente asociado con los países árabes, y la franja blanca representa la paz.',
    'Georgia': 'La bandera de Georgia consta de cinco cruces de San Jorge, que son cruces rojas sobre un fondo blanco. Es uno de los diseños de bandera más antiguos que aún se utilizan y tiene raíces históricas profundas en el cristianismo ortodoxo.',
    'Espana': 'La bandera de España, también conocida como la Rojigualda, consta de tres franjas horizontales: roja, amarilla y roja, con el escudo de armas de España al centro de la franja amarilla. La bandera tiene una larga historia que se remonta al siglo XV. El rojo y el amarillo son los colores tradicionales de España, y el escudo de armas simboliza la historia y la identidad del país.',
    'Ecuador': 'La bandera de Ecuador consta de tres franjas horizontales: amarillo, azul y rojo. El amarillo representa la generosidad y la riqueza de la tierra, el azul simboliza el océano y el cielo, y el rojo representa la sangre derramada por los héroes nacionales.',
    'USA': 'La bandera de los Estados Unidos, también conocida como la "Stars and Stripes" (Estrellas y Barras), consta de trece franjas horizontales alternas de color rojo y blanco, con un cuadrado azul en el cantón que contiene 50 estrellas blancas. Cada estrella representa un estado de la Unión y cada franja representa una de las trece colonias originales.',
    'Chile': 'La bandera de Chile consta de dos franjas horizontales: blanca (arriba) y roja (abajo), con una estrella azul en el cantón. El blanco simboliza la nieve de la cordillera de los Andes, la franja roja representa la sangre derramada por la patria, y la estrella representa el progreso y la honestidad.',
    'Peru': 'La bandera del Perú consta de tres franjas verticales: roja (izquierda), blanca (centro) y roja (derecha), con el escudo de armas en el centro de la franja blanca. El rojo simboliza la sangre derramada por la patria y el sacrificio de los héroes, el blanco representa la paz y la pureza, y el escudo de armas representa la historia y la identidad del país.',
    'Tunez': 'La bandera de Túnez es de color rojo con un círculo blanco en el centro. El rojo simboliza la sangre derramada durante la lucha por la independencia, y el círculo blanco representa la esperanza y la paz.',
    'Eslovaquia': 'La bandera de Eslovaquia consta de tres franjas horizontales: blanca (arriba), azul (centro) y roja (abajo). El azul representa la libertad, la verdad y la lealtad, el blanco simboliza la unidad y la paz, y el rojo representa el coraje y la valentía.'
}   

@app.route('/predict', methods=['POST'])
def predict():
    image_data = request.files['image']
    img = cv2.imdecode(np.fromstring(image_data.read(), np.uint8), cv2.IMREAD_GRAYSCALE)
    img = cv2.resize(img, (64, 64))
    img = np.array(img).reshape(-1, 64, 64, 1)
    
    prediction = model.predict(img)
    predicted_class = classes[np.argmax(prediction)]
    
    if predicted_class in history_texts:
        return jsonify({'predicted_class': predicted_class, 'history_text': history_texts[predicted_class]})
    else:
        return jsonify({'predicted_class': predicted_class})

if __name__ == '__main__':
    app.run(debug=True)
