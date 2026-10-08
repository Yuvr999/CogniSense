import sys

packages = ['xgboost', 'lightgbm', 'catboost', 'shap', 'imblearn', 'sklearn', 'matplotlib', 'seaborn', 'joblib', 'pandas', 'numpy']

for pkg in packages:
    try:
        __import__(pkg)
        print(f"{pkg}: available")
    except ImportError:
        print(f"{pkg}: NOT available")
