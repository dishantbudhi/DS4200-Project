// Heatmap: Compare Screen Time vs Mental Health Score (2 variables comparison) with interactivity
(function() {
    'use strict';
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    function init() {
        // Check if container exists
        const container = d3.select('#vis4');
        if (container.empty()) {
            console.error('Container #vis4 not found');
            return;
        }
        
        d3.csv('digital_diet_mental_health.csv')
            .then(function(data) {
                console.log('Heatmap data loaded:', data.length);
                
                // Process data: create bins for screen time and mental health score
                const screenTimeLabels = ['0-4 hrs', '4-6 hrs', '6-8 hrs', '8-10 hrs', '10+ hrs'];
                const mentalHealthLabels = ['0-30', '30-50', '50-70', '70-100'];
                
                // Initialize count matrix
                const heatmapData = [];
                
                screenTimeLabels.forEach((screenLabel, i) => {
                    mentalHealthLabels.forEach((healthLabel, j) => {
                        heatmapData.push({
                            'Screen Time': screenLabel,
                            'Mental Health Score': healthLabel,
                            count: 0
                        });
                    });
                });
                
                // Count data points in each bin
                data.forEach(d => {
                    const screenTime = +d.daily_screen_time_hours || 0;
                    const mentalHealth = +d.mental_health_score || 0;
                    
                    // Skip invalid data
                    if (isNaN(screenTime) || isNaN(mentalHealth)) return;
                    
                    // Find screen time bin
                    let screenBin = 0;
                    if (screenTime >= 4 && screenTime < 6) screenBin = 1;
                    else if (screenTime >= 6 && screenTime < 8) screenBin = 2;
                    else if (screenTime >= 8 && screenTime < 10) screenBin = 3;
                    else if (screenTime >= 10) screenBin = 4;
                    
                    // Find mental health bin
                    let healthBin = 0;
                    if (mentalHealth >= 30 && mentalHealth < 50) healthBin = 1;
                    else if (mentalHealth >= 50 && mentalHealth < 70) healthBin = 2;
                    else if (mentalHealth >= 70) healthBin = 3;
                    
                    const index = screenBin * mentalHealthLabels.length + healthBin;
                    if (heatmapData[index]) {
                        heatmapData[index].count += 1;
                    }
                });
                
                console.log('Heatmap data processed:', heatmapData);
                
                // Create Vega-Lite spec for heatmap - simplified without complex selection
                const spec = {
                    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
                    "data": { "values": heatmapData },
                    "mark": {
                        "type": "rect",
                        "stroke": "white",
                        "strokeWidth": 2,
                        "cursor": "pointer"
                    },
                    "encoding": {
                        "x": {
                            "field": "Screen Time",
                            "type": "ordinal",
                            "title": "Daily Screen Time (hours)",
                            "sort": screenTimeLabels
                        },
                        "y": {
                            "field": "Mental Health Score",
                            "type": "ordinal",
                            "title": "Mental Health Score Range",
                            "sort": mentalHealthLabels
                        },
                        "fill": {
                            "field": "count",
                            "type": "quantitative",
                            "scale": {
                                "scheme": "blues"
                            },
                            "legend": { "title": "Number of People" }
                        },
                        "tooltip": [
                            {"field": "Screen Time", "type": "ordinal", "title": "Screen Time"},
                            {"field": "Mental Health Score", "type": "ordinal", "title": "Mental Health Score"},
                            {"field": "count", "type": "quantitative", "title": "Count", "format": ",d"}
                        ]
                    },
                    "width": 500,
                    "height": 400,
                    "title": "Screen Time vs Mental Health Score Distribution"
                };
                
                // Embed the visualization
                vegaEmbed('#vis4', spec, { actions: false })
                    .then(function(result) {
                        console.log('Heatmap embedded successfully');
                        
                        // Add click interaction manually using D3
                        const svg = d3.select('#vis4').select('svg');
                        if (!svg.empty()) {
                            svg.selectAll('rect')
                                .style('cursor', 'pointer')
                                .on('click', function(event, d) {
                                    // Remove previous highlights
                                    svg.selectAll('rect').style('stroke', 'white').style('stroke-width', 2);
                                    // Highlight clicked cell
                                    d3.select(this).style('stroke', 'black').style('stroke-width', 4);
                                })
                                .on('mouseover', function() {
                                    d3.select(this).style('opacity', 0.8);
                                })
                                .on('mouseout', function() {
                                    d3.select(this).style('opacity', 1);
                                });
                        }
                    })
                    .catch(function(error) {
                        console.error('Error embedding heatmap:', error);
                        container.append('div')
                            .style('padding', '20px')
                            .style('text-align', 'center')
                            .style('color', 'red')
                            .html('Error loading heatmap. Check console for details.<br/>Error: ' + error.message);
                    });
            })
            .catch(function(error) {
                console.error('Error loading heatmap data:', error);
                container.append('div')
                    .style('padding', '20px')
                    .style('text-align', 'center')
                    .style('color', 'red')
                    .html('Error loading data. Check console for details.<br/>Error: ' + error.message);
            });
    }
})();
