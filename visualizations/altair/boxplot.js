// Box Plot: Screen Time Distribution by Gender (showing gender differences)
d3.csv('digital_diet_mental_health.csv').then(function(data) {
    // Process data: filter and prepare for box plot
    const genders = ['Male', 'Female', 'Other'];
    
    // Convert to numeric and filter
    const boxData = data
        .map(d => ({
            Gender: d.gender,
            'Screen Time': +d.daily_screen_time_hours || 0
        }))
        .filter(d => genders.includes(d.Gender) && !isNaN(d['Screen Time']) && d['Screen Time'] > 0);
    
    // Create Vega-Lite spec for box plot
    const spec = {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "data": { "values": boxData },
        "mark": "boxplot",
        "encoding": {
            "x": {
                "field": "Gender",
                "type": "ordinal",
                "sort": genders,
                "title": "Gender",
                "axis": {
                    "titleFontSize": 15,
                    "labelFontSize": 13,
                    "titleFontWeight": "bold"
                }
            },
            "y": {
                "field": "Screen Time",
                "type": "quantitative",
                "title": "Daily Screen Time (hours)",
                "axis": {
                    "titleFontSize": 15,
                    "labelFontSize": 13,
                    "titleFontWeight": "bold"
                }
            },
            "color": {
                "field": "Gender",
                "type": "ordinal",
                "scale": {
                    "domain": genders,
                    "range": ["#0072B2", "#E69F00", "#009E73"]
                },
                "legend": { 
                    "title": "Gender",
                    "titleFontSize": 14,
                    "labelFontSize": 13,
                    "titleFontWeight": "bold"
                }
            }
        },
        "width": 600,
        "height": 450,
        "title": {
            "text": "Screen Time Distribution by Gender",
            "subtitle": "Distribution of daily screen time hours across gender groups",
            "fontSize": 18,
            "subtitleFontSize": 14,
            "fontWeight": "bold"
        },
        "config": {
            "axis": {
                "labelFontSize": 13,
                "titleFontSize": 15
            },
            "legend": {
                "labelFontSize": 13,
                "titleFontSize": 14
            }
        }
    };
    
    // Embed the visualization
    vegaEmbed('#vis1', spec, { actions: false }).catch(console.error);
});
