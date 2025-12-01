import pandas as pd
import altair as alt

# Load the data
df = pd.read_csv('digital_diet_mental_health.csv')

# Create age groups
def create_age_group(age):
    if age < 18:
        return '13-17'
    elif age < 26:
        return '18-25'
    elif age < 36:
        return '26-35'
    elif age < 46:
        return '36-45'
    else:
        return '46+'

df['age_group'] = df['age'].apply(create_age_group)

# Calculate average screen time by age group and gender
avg_screen_time = df.groupby(['age_group', 'gender'])['daily_screen_time_hours'].mean().reset_index()
avg_screen_time.columns = ['Age Group', 'Gender', 'Average Screen Time (hours)']

# Create the bar chart
chart = alt.Chart(avg_screen_time).mark_bar().encode(
    x=alt.X('Age Group:N', title='Age Group', sort=['13-17', '18-25', '26-35', '36-45', '46+']),
    y=alt.Y('Average Screen Time (hours):Q', title='Average Daily Screen Time (hours)'),
    color=alt.Color('Gender:N', 
                   scale=alt.Scale(domain=['Male', 'Female', 'Other'],
                                  range=['#4a90e2', '#e24a90', '#90e24a']),
                   legend=alt.Legend(title='Gender')),
    column=alt.Column('Gender:N', 
                     header=alt.Header(title='Gender Comparison')),
    tooltip=['Age Group', 'Gender', alt.Tooltip('Average Screen Time (hours):Q', format='.2f')]
).properties(
    width=200,
    height=300,
    title='Average Daily Screen Time by Age Group and Gender'
).configure_axis(
    labelFontSize=12,
    titleFontSize=14
).configure_header(
    labelFontSize=12,
    titleFontSize=14
).configure_legend(
    labelFontSize=12,
    titleFontSize=14
)

# Save as HTML
chart.save('visualizations/altair/boxplot.html')

# Also save the JSON spec for embedding
chart_json = chart.to_json()
with open('visualizations/altair/boxplot.json', 'w') as f:
    f.write(chart_json)

print("Boxplot created successfully!")

