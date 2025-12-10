# The Impact of Screen Time on Mental Health

## Project Overview

This project explores the relationship between screen time patterns and mental health outcomes across different demographic groups. Through visualizations built with Altair (Vega-Lite) and D3.js, we examine how factors like gender, sleep patterns, social media usage, and location context relate to anxiety, depression, and overall mental well-being.

## Project Structure

```
DS4200-Project/
├── index.html                 # Main HTML file
├── styles.css                  # CSS styling
├── digital_diet_mental_health.csv  # Dataset (optional for submission)
├── design_explanation.txt      # Design rationale document
├── requirements.txt            # Python dependencies
├── altair/                     # Altair visualizations (PNG images + Python)
│   ├── visualizations.ipynb    # Jupyter notebook with all Altair visualizations
│   ├── generate_pngs.py        # Python script to generate PNG images
│   ├── boxplot.png             # Visualization 1: Box plot - Screen time by gender
│   ├── scatterplot_sleep.png   # Visualization 2: Scatter plot - Screen time vs sleep
│   └── heatmap.png             # Visualization 4: Heatmap - Screen time vs mental health
├── d3/                         # D3 visualizations (JavaScript)
│   ├── scatter_plot.js         # Visualization 3: Grouped bar - Depression vs social media
│   └── grouped_chart.js        # Visualization 5: Grouped bar - Mental health by location/gender
└── README.md
```

## Visualizations

Our project includes 5 distinct visualizations, each exploring different aspects of the screen time-mental health relationship:

1. **Visualization 1 — Boxplot (Altair)**: Screen Time by Gender
   - PNG image displayed in index.html
   - Highlights central tendencies, variation, and outliers
   - Key takeaway: All gender groups center around 6 hours of screen time, but females show more upper-end outliers—indicating slightly wider variability

2. **Visualization 2 — Scatterplot (Altair)**: Screen Time vs Sleep Duration
   - PNG image displayed in index.html
   - Shows relationship between screen time and sleep duration, colored by sleep quality
   - Includes reference line at 7 hours (recommended sleep duration)
   - Key takeaway: Sleep duration varies widely across all screen-time levels. However, lower sleep quality appears more common among heavier screen users

3. **Visualization 3 — Average Depression Score by Social Media Usage and Location (D3)**: Interactive Grouped Bar Chart with Error Bars
   - Interactive JavaScript visualization
   - Grouped bar chart showing average depression scores across social media usage bins (0-2, 2-4, 4-6 hrs), grouped by location type
   - Error bars display standard deviation to show variability within each group
   - Colorblind-friendly design with pattern overlays for additional differentiation
   - Interactive location filter allows viewers to focus on specific location types
   - Hover tooltips reveal detailed statistics including sample size and standard deviation
   - Key takeaway: Higher social media usage generally corresponds with higher depression scores across all location types, with urban participants showing the most pronounced increases at higher usage levels

4. **Visualization 4 — Heatmap (Altair)**: Screen Time vs Mental Health Score Distribution
   - PNG image displayed in index.html
   - Shows density patterns across screen time and mental health score ranges
   - Text labels show exact counts in each cell
   - Key takeaway: The highest concentration of participants falls between 4–8 hours of screen time and moderate mental health scores. Extreme screen time doesn't directly predict very low or very high mental health scores

5. **Visualization 5 — Mental Health Scores by Location and Gender (D3)**: Interactive Bar Chart
   - Interactive JavaScript visualization
   - Hover tooltips display the exact average score for each bar
   - Interactive gender filter allows users to filter by gender category
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

### Python Dependencies (Required for generating PNG images)
The PNG images in `altair/` are generated from Python code. To regenerate them:

```bash
pip install -r requirements.txt
```

Then run either:
- The Jupyter notebook: `altair/visualizations.ipynb` (run all cells)
- Or the Python script: `python altair/generate_pngs.py`

**Note:** The PNG files in `altair/` are generated from the notebook or script. To modify visualizations, edit the notebook/script and regenerate the PNGs.

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

See `design_explanation.txt` for detailed design rationale, visualization choices, technical implementation details, CSS design decisions, JavaScript design decisions, Python/notebook design decisions, HTML structure decisions, and the published website link.

## Course

DS 4200: Information Presentation and Data Visualization
