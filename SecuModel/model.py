import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
import joblib  # For saving models

# Load dataset
df = pd.read_csv(r"C:\\Users\\HP\\Desktop\\SecuModel\\SECUDATA.csv")

# Remove duplicate rows
df = df.drop_duplicates()

# Handling missing values (if any)
df = df.dropna()

# Feature Engineering: Creating new features
df['confidence_risk_interaction'] = df['confidence_Low'] * df['risk_Informational']
df['total_confidence'] = df[['confidence_High', 'confidence_Low', 'confidence_Medium']].sum(axis=1)
df['total_risk'] = df[['risk_Informational', 'risk_Low', 'risk_Medium']].sum(axis=1)

# Define features (X) and target variable (y)
X = df.drop(columns=['false_positive'])  # Drop target column
y = df['false_positive']  # Target column

# Split dataset (80% train, 20% test)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

# Standardize features (important for Logistic Regression)
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Save the scaler for deployment
joblib.dump(scaler, r"C:\Users\HP\Desktop\SecuModel\scaler.pkl")

### Logistic Regression with Grid Search ###
log_model = LogisticRegression(max_iter=5000, random_state=42)
param_grid = {'C': [0.01, 0.1, 1, 10, 100], 'solver': ['lbfgs', 'liblinear']}
grid_search = GridSearchCV(log_model, param_grid, cv=5, scoring='f1', n_jobs=-1)
grid_search.fit(X_train_scaled, y_train)
best_log_model = grid_search.best_estimator_

# Save Logistic Regression model
joblib.dump(best_log_model, r"C:\Users\HP\\Desktop\SecuModel\logistic_regression_model.pkl")

### Gradient Boosting Classifier ###
gb_model = GradientBoostingClassifier(n_estimators=100, random_state=42)
gb_model.fit(X_train, y_train)

# Save Gradient Boosting model
joblib.dump(gb_model, r"C:\Users\HP\Desktop\SecuModel\gradient_boosting_model.pkl")

# Predictions & Evaluation
models = {'Logistic Regression': best_log_model, 'Gradient Boosting': gb_model}
results = {}

for name, model in models.items():
    if name == "Logistic Regression":
        y_pred = model.predict(X_test_scaled)
    else:
        y_pred = model.predict(X_test)

    results[name] = {
        'accuracy': accuracy_score(y_test, y_pred),
        'precision': precision_score(y_test, y_pred),
        'recall': recall_score(y_test, y_pred),
        'f1_score': f1_score(y_test, y_pred)
    }

# Print evaluation results
for model, metrics in results.items():
    print(f"\n{model} Results:")
    for metric, value in metrics.items():
        print(f"{metric}: {value:.4f}")

print("\nModels saved successfully.")
