"""
Python script to generate PNG images from Altair visualizations
Run this script to generate PNG files for use in index.html

Usage:
    python altair/generate_pngs.py
"""

import altair as alt
import pandas as pd
import os
import sys

# Get paths
script_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(script_dir)
csv_path = os.path.join(project_root, 'digital_diet_mental_health.csv')

# Load the data
if not os.path.exists(csv_path):
    print(f"Error: Could not find data file at {csv_path}")
    sys.exit(1)

df = pd.read_csv(csv_path)
print(f"Data loaded: {len(df)} rows")

# ============================================================================
# Visualization 1: Boxplot - Screen Time by Gender
# ============================================================================
print("\nGenerating Visualization 1: Boxplot...")

genders = ['Male', 'Female', 'Other']
box_data = df[
    df['gender'].isin(genders) & 
    (df['daily_screen_time_hours'] > 0)
].copy()

box_data = box_data[['gender', 'daily_screen_time_hours']]
box_data.columns = ['Gender', 'Screen Time']

boxplot_chart = alt.Chart(box_data).mark_boxplot().encode(
    x=alt.X(
        'Gender:N',
        sort=genders,
        title='Gender',
        axis=alt.Axis(
            titleFontSize=15,
            labelFontSize=13,
            titleFontWeight='bold'
        )
    ),
    y=alt.Y(
        'Screen Time:Q',
        title='Daily Screen Time (hours)',
        axis=alt.Axis(
            titleFontSize=15,
            labelFontSize=13,
            titleFontWeight='bold'
        )
    ),
    color=alt.Color(
        'Gender:N',
        scale=alt.Scale(
            domain=genders,
            range=['#0072B2', '#E69F00', '#009E73']
        ),
        legend=alt.Legend(
            title='Gender',
            titleFontSize=14,
            labelFontSize=13,
            titleFontWeight='bold'
        )
    )
).properties(
    width=600,
    height=450,
    title=alt.TitleParams(
        text='Screen Time Distribution by Gender',
        subtitle='Distribution of daily screen time hours across gender groups',
        fontSize=18,
        subtitleFontSize=14,
        fontWeight='bold'
    )
).configure_axis(
    labelFontSize=13,
    titleFontSize=15
).configure_legend(
    labelFontSize=13,
    titleFontSize=14
)

png_path = os.path.join(script_dir, 'boxplot.png')
boxplot_chart.save(png_path, scale_factor=2)
print(f"✓ Saved boxplot.png to {png_path}")

# ============================================================================
# Visualization 2: Scatterplot - Screen Time vs Sleep Duration
# ============================================================================
print("\nGenerating Visualization 2: Scatterplot...")

scatter_data = df[
    (df['daily_screen_time_hours'] > 0) & 
    (df['sleep_duration_hours'] > 0) & 
    (df['sleep_duration_hours'] <= 12)
].copy()

scatter_data = scatter_data[[
    'daily_screen_time_hours', 
    'sleep_duration_hours', 
    'sleep_quality'
]]
scatter_data.columns = ['Screen Time', 'Sleep Duration', 'Sleep Quality']

scatter = alt.Chart(scatter_data).mark_circle(
    opacity=0.7,
    size=80
).encode(
    x=alt.X(
        'Screen Time:Q',
        title='Daily Screen Time (hours)',
        scale=alt.Scale(zero=False),
        axis=alt.Axis(
            titleFontSize=15,
            labelFontSize=13,
            titleFontWeight='bold'
        )
    ),
    y=alt.Y(
        'Sleep Duration:Q',
        title='Sleep Duration (hours)',
        scale=alt.Scale(zero=False),
        axis=alt.Axis(
            titleFontSize=15,
            labelFontSize=13,
            titleFontWeight='bold'
        )
    ),
    color=alt.Color(
        'Sleep Quality:Q',
        scale=alt.Scale(
            scheme='viridis',
            domain=[0, 10]
        ),
        legend=alt.Legend(
            title='Sleep Quality (1-10 scale, higher is better)',
            titleFontSize=14,
            labelFontSize=13,
            titleFontWeight='bold'
        )
    )
)

reference_line = alt.Chart(pd.DataFrame({'y': [7]})).mark_rule(
    strokeDash=[5, 5],
    stroke='#999',
    strokeWidth=1.5,
    opacity=0.5
).encode(
    y='y:Q'
)

scatterplot_chart = alt.layer(scatter, reference_line).properties(
    width=700,
    height=500,
    title=alt.TitleParams(
        text='Screen Time and Sleep Duration',
        subtitle='Relationship between daily screen time and sleep duration, colored by sleep quality.',
        fontSize=18,
        subtitleFontSize=14,
        fontWeight='bold'
    )
).configure_axis(
    labelFontSize=13,
    titleFontSize=15
).configure_legend(
    labelFontSize=13,
    titleFontSize=14
)

png_path = os.path.join(script_dir, 'scatterplot_sleep.png')
scatterplot_chart.save(png_path, scale_factor=2)
print(f"✓ Saved scatterplot_sleep.png to {png_path}")

# ============================================================================
# Visualization 4: Heatmap - Screen Time vs Mental Health Distribution
# ============================================================================
print("\nGenerating Visualization 4: Heatmap...")

screen_time_labels = ['0-4 hrs', '4-6 hrs', '6-8 hrs', '8-10 hrs', '10+ hrs']
mental_health_labels = ['0-30', '30-50', '50-70', '70-100']

def bin_screen_time(hours):
    if hours < 4:
        return '0-4 hrs'
    elif hours < 6:
        return '4-6 hrs'
    elif hours < 8:
        return '6-8 hrs'
    elif hours < 10:
        return '8-10 hrs'
    else:
        return '10+ hrs'

def bin_mental_health(score):
    if score < 30:
        return '0-30'
    elif score < 50:
        return '30-50'
    elif score < 70:
        return '50-70'
    else:
        return '70-100'

df_heatmap = df.copy()
df_heatmap['Screen Time'] = df_heatmap['daily_screen_time_hours'].apply(bin_screen_time)
df_heatmap['Mental Health Score'] = df_heatmap['mental_health_score'].apply(bin_mental_health)

heatmap_data = df_heatmap.groupby(['Screen Time', 'Mental Health Score']).size().reset_index(name='count')

from itertools import product
all_combinations = list(product(screen_time_labels, mental_health_labels))
existing_combinations = set(zip(heatmap_data['Screen Time'], heatmap_data['Mental Health Score']))

for st, mh in all_combinations:
    if (st, mh) not in existing_combinations:
        heatmap_data = pd.concat([
            heatmap_data,
            pd.DataFrame([{'Screen Time': st, 'Mental Health Score': mh, 'count': 0}])
        ], ignore_index=True)

rects = alt.Chart(heatmap_data).mark_rect(
    stroke='white',
    strokeWidth=2.5,
    cursor='pointer'
).encode(
    x=alt.X(
        'Screen Time:O',
        sort=screen_time_labels,
        title='Daily Screen Time (hours)',
        axis=alt.Axis(
            titleFontSize=15,
            labelFontSize=13,
            titleFontWeight='bold'
        )
    ),
    y=alt.Y(
        'Mental Health Score:O',
        sort=mental_health_labels,
        title='Mental Health Score Range',
        axis=alt.Axis(
            titleFontSize=15,
            labelFontSize=13,
            titleFontWeight='bold'
        )
    ),
    fill=alt.Fill(
        'count:Q',
        scale=alt.Scale(scheme='blues', nice=True),
        legend=alt.Legend(
            title='Number of Participants',
            titleFontSize=14,
            labelFontSize=13,
            titleFontWeight='bold'
        )
    )
)

text = alt.Chart(heatmap_data[heatmap_data['count'] > 0]).mark_text(
    fontSize=14,
    fontWeight='bold'
).encode(
    x=alt.X('Screen Time:O', sort=screen_time_labels),
    y=alt.Y('Mental Health Score:O', sort=mental_health_labels),
    text=alt.Text('count:Q', format='d'),
    fill=alt.condition(
        alt.datum.count > 50,
        alt.value('white'),
        alt.value('#333')
    )
)

heatmap_chart = alt.layer(rects, text).properties(
    width=650,
    height=500,
    title=alt.TitleParams(
        text='Screen Time and Mental Health Distribution',
        subtitle='Distribution of participants across screen time and mental health score ranges',
        fontSize=18,
        subtitleFontSize=14,
        fontWeight='bold'
    )
).configure_axis(
    labelFontSize=13,
    titleFontSize=15
).configure_legend(
    labelFontSize=13,
    titleFontSize=14
)

png_path = os.path.join(script_dir, 'heatmap.png')
heatmap_chart.save(png_path, scale_factor=2)
print(f"✓ Saved heatmap.png to {png_path}")

print("\n✓ All PNG files generated successfully!")
print(f"PNG files saved in: {script_dir}")

