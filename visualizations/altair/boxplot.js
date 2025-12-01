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
                "title": "Gender"
            },
            "y": {
                "field": "Screen Time",
                "type": "quantitative",
                "title": "Daily Screen Time (hours)"
            },
            "color": {
                "field": "Gender",
                "type": "ordinal",
                "scale": {
                    "domain": genders,
                    "range": ["#0072B2", "#E69F00", "#009E73"]
                },
                "legend": null
            },
            "tooltip": [
                {"field": "Gender", "type": "ordinal"},
                {"field": "Screen Time", "type": "quantitative", "format": ".2f"}
            ]
        },
        "width": 500,
        "height": 400,
        "title": "Screen Time Distribution by Gender"
    };
    
    // Embed the visualization
    vegaEmbed('#vis1', spec, { actions: false }).catch(console.error);
});
