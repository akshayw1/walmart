from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import base64
import numpy as np
import cv2
import torch
from ultralytics import YOLO
import json

# Load product type mapping
product_types = json.load(open("static/product_type_map.json"))

app = Flask(__name__)
CORS(app)
app.config["CORS_HEADERS"] = "Content-Type"

socketio = SocketIO(app, cors_allowed_origins="*")

# Load YOLO model
model = YOLO("model.pt")    

@app.route("/")
def hello_world() -> str:
    return "Flask server is running!"

@socketio.on("connect")
def handle_connect():
    print("Client connected")
    emit("message", {"data": "Connected to Flask server"})

@socketio.on("send_frame")
def handle_send_frame(data):
    try:
        # Decode base64 image data
        image_data = data["data"].split(",")[1]
        decoded_data = base64.b64decode(image_data)

        nparr = np.frombuffer(decoded_data, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        # Preprocess image
        img = cv2.resize(img, (640, 480))
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        
        img = torch.from_numpy(img).permute(2, 0, 1).float().div(255.0).unsqueeze(0)
        
        # Model inference
        results = model.predict(img)

        # Process results
        results = set([result['name'] for result in results[0].summary() if result['confidence'] > 0.25])

        # Build response
        detected_products = [
            {
                "name": result,
                "link": product_types.get(result, f"https://www.walmart.com/search/?q={result}")
            }
        for result in results if result != "person"
        ]

        # Emit processed data back to Node.js
        emit("data_processed", detected_products)
    except Exception as e:
        print(f"Error processing frame: {e}")
        emit("error", {"message": "Error processing frame"})

if __name__ == "__main__":
    socketio.run(app, host='0.0.0.0', port=5555, debug=False)
