import psycopg2
import pandas as pd

# Database connection details
DB_HOST = "localhost"
DB_NAME = "fitness_app"
DB_USER = "postgres"
DB_PASSWORD = "abcd"

# Connect to the database
def fetch_data():
    try:
        connection = psycopg2.connect(
            host=DB_HOST,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD
        )
        cursor = connection.cursor()

        # Query to fetch exercise records
        query = """
        SELECT user_id
        FROM Exercisegroups;
        """
        cursor.execute(query)
        records = cursor.fetchall()

        # Convert to DataFrame for easier processing
        columns = ["exercise_group", "exercise_name", "weight", "reps", "sets", "recorded_at"]
        df = pd.DataFrame(records, columns=columns)
        return df

    except Exception as e:
        print(f"Error: {e}")
        return None
    finally:
        if connection:
            connection.close()

# Analyze trends
def analyze_trends(df):
    feedback = []
    grouped = df.groupby("exercise_name")

    for name, group in grouped:
        # Calculate changes over time
        group = group.sort_values("recorded_at")
        if len(group) > 1:
            initial_weight = group.iloc[0]["weight"]
            final_weight = group.iloc[-1]["weight"]
            initial_reps = group.iloc[0]["reps"]
            final_reps = group.iloc[-1]["reps"]

            weight_trend = "increased" if final_weight > initial_weight else "decreased"
            reps_trend = "increased" if final_reps > initial_reps else "decreased"

            # Compliments and Improvements
            feedback.append({
                "exercise_name": name,
                "weight_trend": weight_trend,
                "reps_trend": reps_trend,
                "compliment": "Great consistency!" if weight_trend == "increased" else "Consider focusing more on progressive overload.",
                "improvement": "Focus on increasing reps for better endurance." if reps_trend == "decreased" else "Good job maintaining high reps!"
            })
    return feedback

# Generate report
def generate_report(feedback):
    print("\nExercise Trends and Feedback Report:\n")
    for entry in feedback:
        print(f"Exercise: {entry['exercise_name']}")
        print(f"  - Weight trend: {entry['weight_trend']}")
        print(f"  - Reps trend: {entry['reps_trend']}")
        print(f"  - Compliment: {entry['compliment']}")
        print(f"  - Improvement Suggestion: {entry['improvement']}\n")

# Main function
if __name__ == "__main__":
    data = fetch_data()
    if data is not None:
        feedback = analyze_trends(data)
        generate_report(feedback)
