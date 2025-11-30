# The Impact of Screen Time on Mental Health

## Project Overview

This project explores the relationship between screen time patterns and mental health outcomes across different demographic groups. Through interactive visualizations built with Altair and D3.js, we examine how factors like gender, sleep patterns, social media usage, and location context relate to anxiety, depression, and overall mental well-being.

## Project Structure

```
DS4200-Project/
├── index.html                 # Main HTML file
├── styles.css                  # CSS styling
├── digital_diet_mental_health.csv  # Dataset
├── design_explanation.txt      # Design rationale document
├── scripts/                    # Python scripts (optional)
│   ├── create_bar_chart.py
│   ├── create_pie_chart.py
│   └── create_heatmap.py
├── visualizations/
│   ├── altair/                 # Altair visualizations (JavaScript)
│   │   ├── bar_chart.js        # Box plot: Screen time by gender
│   │   ├── pie_chart.js         # Scatter plot: Screen time vs sleep
│   │   └── heatmap.js           # Heatmap: Screen time vs mental health
│   └── d3/                     # D3 visualizations
│       ├── scatter_plot.js      # Scatter plot: Depression vs social media
│       └── grouped_chart.js    # Grouped bar: Mental health by location/gender
└── README.md
```

## Visualizations

Our project includes 5 distinct visualizations, each exploring different aspects of the screen time-mental health relationship:

1. **Box Plot (Altair)**: Screen time distribution by gender
   - Shows gender differences in screen time patterns, variability, and outliers
   - Reveals whether certain gender groups have distinct usage behaviors

2. **Scatter Plot (Altair)**: Screen time vs sleep duration relationship
   - Explores how screen time correlates with sleep patterns
   - Color and size encode sleep quality to identify lifestyle impacts
   - Critical for understanding sleep as a pathway between screen time and mental health

3. **Scatter Plot (D3)**: Depression score vs. social media usage
   - Interactive exploration of the social media-depression relationship
   - Location filtering and brushing tools for detailed analysis
   - Examines dose-response relationships and contextual moderators

4. **Heatmap (Altair)**: Screen time vs mental health score distribution
   - Bivariate analysis showing population-level patterns
   - Identifies critical thresholds and optimal screen time ranges
   - Click interaction to highlight specific combinations

5. **Grouped Bar Chart (D3)**: Mental health scores by location and gender
   - Examines intersectional patterns across demographics and context
   - Interactive filtering and sorting capabilities
   - Reveals which combinations show better or worse outcomes

## Running the Project

### Local Development

1. Ensure you have a local web server running (required for loading CSV files)
   - Python: `python3 -m http.server 8000`
   - Node.js: `npx http-server`
   - Or use VS Code Live Server extension

2. Open `index.html` in your browser via the local server
   - Example: `http://localhost:8000/index.html`

### GitHub Pages Deployment

1. Push the repository to GitHub
2. Go to Settings > Pages
3. Select the main branch as the source
4. The site will be available at `https://[username].github.io/[repo-name]/`

## Dependencies

All dependencies are loaded via CDN:
- D3.js v7
- Vega-Lite v5
- Vega-Embed v6

No local installation required!

## Data Source

Dataset: "Impact of Screen Time on Mental Health" from Kaggle
- 2,000 observations
- 25 features
- Source: https://www.kaggle.com/datasets/khushikyad001/impact-of-screen-time-on-mental-health/data

## Key Insights

The visualizations reveal several important patterns:
- Gender differences in screen time usage patterns
- Relationship between screen time and sleep disruption
- Social media's specific association with depression
- Critical thresholds for screen time and mental health outcomes
- Contextual factors (location, gender) that moderate mental health impacts

## Team Members

- Alexandra Rosado Poma
- Dishant Budhi
- Justin Lee

## Course

DS 4200: Information Presentation and Data Visualization
