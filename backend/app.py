from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import base64
import numpy as np
import cv2
import torch
from ultralytics import YOLO
import json

product_types = json.load(open("static/product_type_map.json"))

app = Flask(__name__)
CORS(app)
app.config["CORS_HEADERS"] = "Content-Type"

socketio = SocketIO(app, cors_allowed_origins="*")

model = YOLO("model.pt")    

@app.route("/")
def hello_world() -> str:
    return "Hello, World!"

@socketio.on("connect")
def handle_connect():
    print("Client connected")
    emit("message", {"data": "Connected to the server"})

@socketio.on("disconnect")
def handle_disconnect():
    print("Client disconnected")

@socketio.on("send_data")
def handle_send_data(data):
    image_data = data["data"].split(",")[1]
    decoded_data = base64.b64decode(image_data)

    nparr = np.frombuffer(decoded_data, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    img = cv2.resize(img, (640, 480))
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    
    img = torch.from_numpy(img).permute(2, 0, 1).float().div(255.0).unsqueeze(0)
    results = model.predict(img)

    results: list = results[0].summary()
    results: list[str] = set(
        [result["name"] for result in results if result["confidence"] > 0.25]
    )

    print(product_types.get("handbag")+ "dasscacdsfdsfdsfds")

    results = [
        {
            "name": result,
            "link": product_types.get(result, f"https://www.walmart.com/search/?q={result}"),
        }
        for result in results if result != "person"
    ]
    

    # print(results)    


    emit("data_processed", results)

if __name__ == "__main__":
    socketio.run(app, host='0.0.0.0', port=5555, debug=False)
