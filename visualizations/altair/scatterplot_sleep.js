d3.csv('digital_diet_mental_health.csv').then(function(data) {
    const scatterData = data
        .map(d => ({
            'Screen Time': +d.daily_screen_time_hours || 0,
            'Sleep Duration': +d.sleep_duration_hours || 0,
            'Sleep Quality': +d.sleep_quality || 0
        }))
        .filter(d => d['Screen Time'] > 0 && d['Sleep Duration'] > 0 && d['Sleep Duration'] <= 12);
    
    const spec = {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "data": { "values": scatterData },
        "width": 700,
        "height": 500,
        "layer": [
            {
                "mark": {
                    "type": "circle",
                    "opacity": 0.7,
                    "size": 80
                },
                "encoding": {
                    "x": {
                        "field": "Screen Time",
                        "type": "quantitative",
                        "title": "Daily Screen Time (hours)",
                        "scale": {"zero": false},
                        "axis": {
                            "titleFontSize": 15,
                            "labelFontSize": 13,
                            "titleFontWeight": "bold"
                        }
                    },
                    "y": {
                        "field": "Sleep Duration",
                        "type": "quantitative",
                        "title": "Sleep Duration (hours)",
                        "scale": {"zero": false},
                        "axis": {
                            "titleFontSize": 15,
                            "labelFontSize": 13,
                            "titleFontWeight": "bold"
                        }
                    },
                    "color": {
                        "field": "Sleep Quality",
                        "type": "quantitative",
                        "scale": {
                            "scheme": "viridis",
                            "domain": [0, 10]
                        },
                        "legend": { 
                            "title": "Sleep Quality (1-10 scale, higher is better)",
                            "titleFontSize": 14,
                            "labelFontSize": 13,
                            "titleFontWeight": "bold"
                        }
                    }
                }
            },
            {
                "mark": {
                    "type": "rule",
                    "strokeDash": [5, 5],
                    "stroke": "#999",
                    "strokeWidth": 1.5,
                    "opacity": 0.5
                },
                "encoding": {
                    "y": {
                        "datum": 7,
                        "type": "quantitative"
                    }
                }
            }
        ],
        "title": {
            "text": "Screen Time and Sleep Duration",
            "subtitle": "Relationship between daily screen time and sleep duration, colored by sleep quality. Dashed line indicates recommended 7 hours of sleep.",
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
    
    vegaEmbed('#vis2', spec, { actions: false }).catch(console.error);
});
