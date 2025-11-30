import pandas as pd
import altair as alt
import numpy as np

# Load the data
df = pd.read_csv('digital_diet_mental_health.csv')

# Select variables for correlation analysis
variables = [
    'daily_screen_time_hours',
    'phone_usage_hours',
    'laptop_usage_hours',
    'social_media_hours',
    'entertainment_hours',
    'gaming_hours',
    'sleep_duration_hours',
    'sleep_quality',
    'physical_activity_hours_per_week',
    'mental_health_score',
    'weekly_anxiety_score',
    'weekly_depression_score',
    'mindfulness_minutes_per_day'
]

# Calculate correlation matrix
corr_data = df[variables].corr()

# Convert to long format for Altair
corr_long = corr_data.reset_index().melt(
    id_vars='index',
    var_name='variable2',
    value_name='correlation'
)
corr_long.columns = ['variable1', 'variable2', 'correlation']

# Create readable labels
label_mapping = {
    'daily_screen_time_hours': 'Daily Screen Time',
    'phone_usage_hours': 'Phone Usage',
    'laptop_usage_hours': 'Laptop Usage',
    'social_media_hours': 'Social Media',
    'entertainment_hours': 'Entertainment',
    'gaming_hours': 'Gaming',
    'sleep_duration_hours': 'Sleep Duration',
    'sleep_quality': 'Sleep Quality',
    'physical_activity_hours_per_week': 'Physical Activity',
    'mental_health_score': 'Mental Health Score',
    'weekly_anxiety_score': 'Anxiety Score',
    'weekly_depression_score': 'Depression Score',
    'mindfulness_minutes_per_day': 'Mindfulness'
}

corr_long['var1_label'] = corr_long['variable1'].map(label_mapping)
corr_long['var2_label'] = corr_long['variable2'].map(label_mapping)

# Create selection for clicking
selection = alt.selection_point(fields=['variable1'])

# Create heatmap
chart = alt.Chart(corr_long).mark_rect().encode(
    x=alt.X('var2_label:N', title='Variable', sort=list(label_mapping.values())),
    y=alt.Y('var1_label:N', title='Variable', sort=list(label_mapping.values())),
    color=alt.Color('correlation:Q',
                   scale=alt.Scale(domain=[-1, 0, 1],
                                  range=['#4a90e2', 'white', '#e24a90']),
                   legend=alt.Legend(title='Correlation')),
    stroke=alt.condition(selection, alt.value('black'), alt.value('white')),
    strokeWidth=alt.condition(selection, alt.value(2), alt.value(0)),
    tooltip=['var1_label', 'var2_label', alt.Tooltip('correlation:Q', format='.3f')]
).add_params(
    selection
).properties(
    width=600,
    height=600,
    title='Correlation Matrix: Screen Time and Mental Health Factors'
).configure_axis(
    labelFontSize=10,
    titleFontSize=14,
    labelAngle=-45,
    labelLimit=200
).configure_title(
    fontSize=18,
    fontWeight='bold'
)

# Save as HTML
chart.save('visualizations/altair/heatmap.html')

# Also save the JSON spec
chart_json = chart.to_json()
with open('visualizations/altair/heatmap.json', 'w') as f:
    f.write(chart_json)

print("Heatmap created successfully!")

