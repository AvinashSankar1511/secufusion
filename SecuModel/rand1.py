from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
import pandas as pd
import pickle

# Load dataset
df = pd.read_csv(r'SECUDATA.csv')

# Preprocessing
X = df.drop(columns=['false_positive'])  # Assuming 'false_positive' is the target column
y = df['false_positive']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train Random Forest Model
rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
rf_model.fit(X_train, y_train)

# Evaluate Model
def evaluate_model(model, X_test, y_test):
    y_pred = model.predict(X_test)
    return {
        'accuracy': round(accuracy_score(y_test, y_pred) * 100),
        'precision': round(precision_score(y_test, y_pred) * 100),
        'recall': round(recall_score(y_test, y_pred) * 100),
        'f1_score': round(f1_score(y_test, y_pred) * 100)
    }

rf_results = evaluate_model(rf_model, X_test, y_test)
print("Random Forest Results:", rf_results)

# Save Model
with open(r'rf_model.pkl', 'wb') as f:
    pickle.dump(rf_model, f)

print("Model saved successfully.")
