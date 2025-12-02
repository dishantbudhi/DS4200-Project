// Scatter Plot: Screen Time vs Sleep Duration (showing lifestyle relationship)
d3.csv('digital_diet_mental_health.csv').then(function(data) {
    // Process data: screen time vs sleep duration
    const scatterData = data
        .map(d => ({
            'Screen Time': +d.daily_screen_time_hours || 0,
            'Sleep Duration': +d.sleep_duration_hours || 0,
            'Sleep Quality': +d.sleep_quality || 0
        }))
        .filter(d => d['Screen Time'] > 0 && d['Sleep Duration'] > 0 && d['Sleep Duration'] <= 12);
    
    // Create Vega-Lite spec for scatter plot
    const spec = {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "data": { "values": scatterData },
        "mark": {
            "type": "circle",
            "opacity": 0.6,
            "size": 50
        },
        "encoding": {
            "x": {
                "field": "Screen Time",
                "type": "quantitative",
                "title": "Daily Screen Time (hours)",
                "scale": {"zero": false}
            },
            "y": {
                "field": "Sleep Duration",
                "type": "quantitative",
                "title": "Sleep Duration (hours)",
                "scale": {"zero": false}
            },
            "color": {
                "field": "Sleep Quality",
                "type": "quantitative",
                "scale": {
                    "scheme": "viridis",
                    "domain": [0, 10]
                },
                "legend": { "title": "Sleep Quality (1-10)" }
            },
            "size": {
                "field": "Sleep Quality",
                "type": "quantitative",
                "scale": {"range": [30, 150]},
                "legend": null
            }
        },
        "width": 600,
        "height": 400,
        "title": "Screen Time vs Sleep Duration Relationship"
    };
    
    // Embed the visualization
    vegaEmbed('#vis2', spec, { actions: false }).catch(console.error);
});
