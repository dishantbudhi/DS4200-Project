import pandas as pd
import altair as alt

# Load the data
df = pd.read_csv('digital_diet_mental_health.csv')

# Calculate total hours by device type
device_data = pd.DataFrame({
    'Device': ['Phone', 'Laptop', 'Tablet', 'TV'],
    'Total Hours': [
        df['phone_usage_hours'].sum(),
        df['laptop_usage_hours'].sum(),
        df['tablet_usage_hours'].sum(),
        df['tv_usage_hours'].sum()
    ]
})

# Calculate percentages
device_data['Percentage'] = (device_data['Total Hours'] / device_data['Total Hours'].sum() * 100).round(1)
device_data['Label'] = device_data['Device'] + ': ' + device_data['Percentage'].astype(str) + '%'

# Create pie chart (using arc marks)
base = alt.Chart(device_data).encode(
    theta=alt.Theta(field='Total Hours', type='quantitative', stack=True),
    color=alt.Color('Device:N',
                    scale=alt.Scale(domain=['Phone', 'Laptop', 'Tablet', 'TV'],
                                   range=['#667eea', '#764ba2', '#f093fb', '#4facfe']),
                    legend=alt.Legend(title='Device Type')),
    tooltip=['Device', alt.Tooltip('Total Hours:Q', format=',.0f'), 
             alt.Tooltip('Percentage:Q', format='.1f', suffix='%')]
)

pie = base.mark_arc(outerRadius=120, innerRadius=60)
text = base.mark_text(radius=140, size=14, fontWeight='bold').encode(
    text='Label:N'
)

# Add selection for interactive legend
selection = alt.selection_point(fields=['Device'], bind='legend')

chart = (pie + text).add_params(selection).encode(
    opacity=alt.condition(selection, alt.value(1), alt.value(0.2))
).properties(
    width=400,
    height=400,
    title='Distribution of Screen Time by Device Type'
).configure_title(
    fontSize=18,
    fontWeight='bold'
).configure_legend(
    labelFontSize=12,
    titleFontSize=14
)

# Save as HTML
chart.save('visualizations/altair/pie_chart.html')

# Also save the JSON spec
chart_json = chart.to_json()
with open('visualizations/altair/pie_chart.json', 'w') as f:
    f.write(chart_json)

print("Pie chart created successfully!")

