from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import IsolationForest
import numpy as np

app = Flask(__name__)
CORS(app)

# --- NLP Categorization Logic ---
def categorize_transaction(description, custom_categories=None):
    description = description.lower()
    
    if custom_categories:
        for category in custom_categories:
            keywords = category.get('keywords', [])
            if isinstance(keywords, list) and any(keyword.lower() in description for keyword in keywords):
                return category['category_name']

    default_keywords = {
        'Transport': ['uber', 'lyft', 'taxi', 'transport', 'gas', 'metro', 'bus', 'airline'],
        'Food & Drinks': ['starbucks', 'mcdonalds', 'restaurant', 'cafe', 'grubhub', 'doordash', 'coffee'],
        'Groceries': ['safeway', 'walmart', 'costco', 'groceries', 'market', 'trader joe\'s'],
        'Shopping': ['amazon', 'shopping', 'target', 'best buy', 'macys', 'store'],
        'Entertainment': ['spotify', 'netflix', 'movie', 'cinema', 'hulu', 'disney+'],
        'Utilities': ['utility', 'electric', 'water', 'internet', 'comcast', 'verizon', 'power', 'gas'],
        'Healthcare': ['cvs', 'walgreens', 'pharmacy', 'hospital', 'doctor', 'clinic'],
        'Rent/Mortgage': ['rent', 'mortgage'],
        'Loan Repayment': ['loan', 'repayment'],
        'Insurance': ['insurance'],
        'Education': ['education', 'university', 'college', 'books'],
        'Income': ['paycheck', 'deposit', 'salary', 'invoice payment']
    }

    for category, keywords in default_keywords.items():
        if any(keyword in description for keyword in keywords):
            return category
            
    return 'Miscellaneous'

@app.route('/categorize', methods=['POST'])
def categorize():
    data = request.get_json()
    description = data.get('description', '')
    custom_categories = data.get('custom_categories', None) 
    
    if not description:
        return jsonify({'category': 'Miscellaneous'})
        
    category = categorize_transaction(description, custom_categories)
    return jsonify({'category': category})


# --- ML Prediction Logic ---
@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    try:
        df = pd.DataFrame([data])
        expense_columns = ['groceries', 'transport', 'eating_out', 'entertainment', 'utilities', 'healthcare', 'education', 'miscellaneous', 'rent', 'loan_repayment', 'insurance']
        features = df[['income'] + expense_columns].fillna(0)
        
        np.random.seed(42)
        df['next_month_expenses'] = df[expense_columns].sum(axis=1) * (1 + np.random.uniform(-0.1, 0.1))
        target = df['next_month_expenses']

        model = LinearRegression()
        model.fit(features, target)
        prediction = model.predict(features)
        
        return jsonify({'predicted_expenses': round(prediction[0], 2)})
    except Exception as e:
        print(f"Prediction Error: {e}")
        return jsonify({'error': 'Could not generate prediction.'}), 500

# --- Budget Recommendation Logic ---
@app.route('/recommend_budget', methods=['POST'])
def recommend_budget():
    data = request.get_json()
    try:
        spending_data = data.get('spending', {})
        budgets_data = data.get('budgets', {})
        income = spending_data.get('income', 0)

        budget_to_spending_map = {
            'Groceries': 'groceries', 'Transport': 'transport',
            'Food & Drinks': 'eating_out', 'Entertainment': 'entertainment',
            'Shopping': 'shopping', 'Utilities': 'utilities',
            'Healthcare': 'healthcare', 'Education': 'education',
            'Rent/Mortgage': 'rent', 'Miscellaneous': 'miscellaneous'
        }

        recommendations = []
        budget_summary = {}
        total_spent = 0
        total_budget = 0

        for budget_name, budget_amount_raw in budgets_data.items():
            budget_amount = float(budget_amount_raw)
            total_budget += budget_amount
            spending_key = budget_to_spending_map.get(budget_name)
            spent_amount = spending_data.get(spending_key, 0) if spending_key else 0
            
            budget_summary[budget_name] = {'budget': budget_amount, 'spent': spent_amount}

            if budget_amount > 0 and spent_amount > budget_amount:
                overage = spent_amount - budget_amount
                recommendations.append(f"You are ${overage:.2f} over budget in '{budget_name}'.")

        total_spent = sum(v for k, v in spending_data.items() if k != 'income')

        if not recommendations and total_budget > 0:
            recommendations.append("You are within your budget for all set categories. Great job!")
        elif not recommendations:
            recommendations.append("Set some budgets to get started with analysis!")
        
        return jsonify({'recommendations': recommendations, 'budget_summary': budget_summary})
    except Exception as e:
        print(f"Recommendation Error: {e}")
        return jsonify({'error': 'Could not generate recommendations.'}), 500


# --- CORRECTED Anomaly Detection Logic ---
@app.route('/detect_anomalies', methods=['POST'])
def detect_anomalies():
    transactions = request.get_json()
    if not transactions or len(transactions) < 5:
        return jsonify({'anomalies': []})

    try:
        df = pd.DataFrame(transactions)
        
        # --- FIX IS HERE: More robust data preparation ---
        # 1. Ensure 'amount' is a numeric type and positive for the model
        df['amount'] = pd.to_numeric(df['amount'], errors='coerce').abs().fillna(0)
        # 2. Ensure 'category' is a string, filling any potential nulls
        df['category'] = df['category'].astype(str).fillna('Uncategorized')
        
        # 3. One-Hot Encode the 'category' column to convert it to numbers
        df_encoded = pd.get_dummies(df, columns=['category'], prefix='cat', dummy_na=False)
        
        # 4. Define the features for the model (amount + all new category columns)
        features = ['amount'] + [col for col in df_encoded.columns if 'cat_' in col]
        
        # 5. Train the model on the combined features
        model = IsolationForest(contamination=0.1, random_state=42)
        df_encoded['anomaly_score'] = model.fit_predict(df_encoded[features])
        
        # 6. Filter for anomalies from the original dataframe based on index
        anomalies_indices = df_encoded[df_encoded['anomaly_score'] == -1].index
        anomalies = df.loc[anomalies_indices]

        result = anomalies.to_dict(orient='records')
        
        return jsonify({'anomalies': result})
    except Exception as e:
        # Provide a more detailed error log on the Python server
        print(f"ANOMALY DETECTION CRASH: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': 'Could not perform anomaly detection due to an internal error.'}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5001, use_reloader=False)

