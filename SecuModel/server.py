from flask import Flask, request, jsonify
import joblib
import pandas as pd

# Load saved model
model = joblib.load("rf_model.pkl")

app = Flask(__name__)
# Define columns
columns = [
    "pluginId", "cweid", "sourceMessageId", "wascid", "method_GET",
    "confidence_High", "confidence_Low", "confidence_Medium",
    "risk_Informational", "risk_Low", "risk_Medium",
    "alert_Content Security Policy (CSP) Header Not Set",
    "alert_Cross-Domain JavaScript Source File Inclusion",
    "alert_Cross-Domain Misconfiguration",
    "alert_Modern Web Application"
]

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    # Process data
    print(len(data))
    rows = []
    for item in data:
        alert_text = item.get("alert", "").lower()
        row = {
            "pluginId": item.get("pluginId", ""),
            "cweid": item.get("cweid", ""),
            "sourceMessageId": item.get("messageId", ""),
            "wascid": item.get("wascid", ""),
            "method_GET": 1 if item.get("method", "") == "GET" else 0,
            "confidence_High": 1 if item.get("confidence", "") == "High" else 0,
            "confidence_Low": 1 if item.get("confidence", "") == "Low" else 0,
            "confidence_Medium": 1 if item.get("confidence", "") == "Medium" else 0,
            "risk_Informational": 1 if item.get("risk", "") == "Informational" else 0,
            "risk_Low": 1 if item.get("risk", "") == "Low" else 0,
            "risk_Medium": 1 if item.get("risk", "") == "Medium" else 0,
            "alert_Content Security Policy (CSP) Header Not Set": 1 if "content security policy (csp) header not set" in alert_text else 0,
            "alert_Cross-Domain JavaScript Source File Inclusion": 1 if "cross-domain javascript source file inclusion" in alert_text else 0,
            "alert_Cross-Domain Misconfiguration": 1 if "cross-domain misconfiguration" in alert_text else 0,
            "alert_Modern Web Application": 1 if "modern web application" in alert_text else 0
        }
        rows.append(row)

    # Create DataFrame and save to CSV
    df = pd.DataFrame(rows, columns=columns)
    prediction = model.predict(df)

    # Ensure the response is a proper JSON object
    return jsonify({"prediction": prediction.tolist()})

if __name__ == "__main__":
    app.run(port=5000)
