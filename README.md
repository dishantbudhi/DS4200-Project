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
├── requirements.txt            # Python dependencies
├── altair/                     # Altair visualizations (JavaScript + Python)
│   ├── boxplot.js              # Visualization 1: Box plot (GENERATED - run create_boxplot.py)
│   ├── scatterplot_sleep.js    # Visualization 2: Scatter plot (GENERATED - run create_scatterplot_sleep.py)
│   ├── heatmap.js              # Visualization 4: Heatmap (GENERATED - run create_heatmap.py)
│   ├── create_boxplot.py       # Python script to generate boxplot.js
│   ├── create_scatterplot_sleep.py # Python script to generate scatterplot_sleep.js
│   └── create_heatmap.py       # Python script to generate heatmap.js
├── d3/                         # D3 visualizations (JavaScript)
│   ├── scatter_plot.js         # Visualization 3: Grouped bar - Depression vs social media
│   └── grouped_chart.js        # Visualization 5: Grouped bar - Mental health by location/gender
└── README.md
```

## Visualizations

Our project includes 5 distinct visualizations, each exploring different aspects of the screen time-mental health relationship:

1. **Visualization 1 — Boxplot (Altair)**: Screen Time by Gender (With Tooltip)
   - Highlights central tendencies, variation, and outliers
   - Tooltip improves interpretation by showing exact medians, quartiles, and outlier values
   - Key takeaway: All gender groups center around 6 hours of screen time, but females show more upper-end outliers—indicating slightly wider variability

2. **Visualization 2 — Scatterplot (Altair)**: Screen Time vs Sleep Duration (With Tooltip)
   - Ideal for dense continuous data
   - Tooltips allow viewers to hover and inspect specific sleep quality, screen time, and sleep duration values
   - Key takeaway: There is no strong linear relationship—sleep duration varies widely across all screen-time levels. However, lower sleep quality appears slightly more common among heavier screen users

3. **Visualization 3 — Average Depression Score by Social Media Usage and Location (D3)**: Interactive Grouped Bar Chart with Error Bars
   - Grouped bar chart showing average depression scores across social media usage bins (0-2, 2-4, 4-6, 6-8, 8+ hours), grouped by location type
   - Error bars display standard deviation to show variability within each group
   - Colorblind-friendly design using Okabe-Ito color palette (blue, orange, green) with pattern overlays for additional differentiation
   - Interactive location filter allows viewers to focus on specific location types
   - Hover tooltips reveal detailed statistics including sample size and standard deviation
   - Key takeaway: Higher social media usage generally corresponds with higher depression scores across all location types, with urban participants showing the most pronounced increases at higher usage levels

4. **Visualization 4 — Heatmap (Altair)**: Screen Time vs Mental Health Score Distribution (With Tooltip)
   - Ideal for showing density patterns
   - Tooltip interactivity lets users hover to see the exact number of participants in each cell
   - Key takeaway: The highest concentration of participants falls between 4–8 hours of screen time and moderate mental health scores. Nothing suggests that extreme screen time directly predicts very low or very high mental health scores

5. **Visualization 5 — Mental Health Scores by Location and Gender (D3)**: Interactive Bar Chart
   - Hover tooltips display the exact average score for each bar
   - Interactive legend allows users to highlight or isolate a gender category
   - Key takeaway: Overall mental health scores are fairly consistent, ranging from about 49 to 51 across all regions and genders. There is a slight dip in the urban male group, but the differences are small

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

### Web Dependencies (CDN)
All web dependencies are loaded via CDN:
- D3.js v7
- Vega-Lite v5
- Vega-Embed v6

No local installation required for the website!

### Python Dependencies (Required for generating JS files)
The JavaScript files in `altair/` are generated from Python scripts. To regenerate them:
```bash
pip install -r requirements.txt
```

Then run the scripts to generate the JavaScript files:
```bash
python altair/create_boxplot.py          # Generates altair/boxplot.js
python altair/create_scatterplot_sleep.py # Generates altair/scatterplot_sleep.js
python altair/create_heatmap.py          # Generates altair/heatmap.js
```

**Note:** The `.js` files in `altair/` are auto-generated. To modify visualizations, edit the Python scripts and regenerate the JS files.

## Data Source

Dataset: "Impact of Screen Time on Mental Health" from Kaggle
- 2,001 participants
- 25 attributes
- Source: https://www.kaggle.com/datasets/khushikyad001/impact-of-screen-time-on-mental-health/data

## Key Insights

The visualizations reveal several important patterns:
- Screen time is relatively similar across genders
- Social media usage has a stronger relationship to depression scores than general screen time
- Sleep duration is highly varied, and while screen time may influence sleep quality slightly, the effect is not large
- Environmental differences exist but are subtle, with urban groups showing slightly higher depression indicators
- Most participants fall into moderate mental-health ranges, even at higher screen-time levels

Overall, screen time does play a role in mental health, but it's one factor among many. Social media behavior, sleep quality, and environment all contribute to the bigger picture.

## Team Members

- Alexandra Rosado Poma
- Dishant Budhi
- Justin Lee

## Design Documentation

See `design_explanation.txt` for detailed design rationale, visualization choices, and the published website link.

## Course

DS 4200: Information Presentation and Data Visualization
