import os
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

def run_eda_and_feature_engineering():
    print("--- Starting EDA & Feature Engineering ---")
    input_path = "data/raw/vineyard_telemetry.csv"
    
    if not os.path.exists(input_path):
        print("Error: Raw telemetry file not found! Run generate_data.py first.")
        return
        
    df = pd.read_csv(input_path)
    
    # Ensure processed directory exists
    os.makedirs("data/processed", exist_ok=True)
    
    # --- Feature Engineering ---
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    df = df.sort_values(['vineyard_zone_id', 'timestamp'])
    
    # 1. Soil moisture rolling average (trend tracking)
    df['soil_moisture_rolling_avg'] = df.groupby('vineyard_zone_id')['soil_moisture_percent'].transform(lambda x: x.rolling(window=3, min_periods=1).mean())
    
    # 2. Temperature differential (Air vs Soil heat stress proxy)
    df['temp_differential'] = round(df['air_temperature'] - df['soil_temperature'], 2)
    
    # Save processed dataset
    processed_path = "data/processed/vineyard_processed.csv"
    df.to_csv(processed_path, index=False)
    print(f"Cleaned & Engineered dataset saved at: {processed_path}")
    
    # --- EDA Plot Generation ---
    plt.figure(figsize=(8, 6))
    numeric_cols = [
        'soil_moisture_percent', 
        'soil_temperature', 
        'air_temperature', 
        'humidity_percent', 
        'wind_speed', 
        'rain_forecast_mm'
    ]
    corr = df[numeric_cols].corr()
    
    sns.heatmap(corr, annot=True, cmap='coolwarm', fmt=".2f", linewidths=0.5)
    plt.title("Vineyard Telemetry Correlation Matrix")
    plt.tight_layout()
    
    plot_path = "data/processed/eda_correlation_plot.png"
    plt.savefig(plot_path)
    plt.close()
    print(f"EDA Correlation plot successfully saved at: {plot_path}")

if __name__ == "__main__":
    run_eda_and_feature_engineering()