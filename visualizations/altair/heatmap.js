(function() {
    'use strict';
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    function init() {
        const container = d3.select('#vis4');
        if (container.empty()) {
            console.error('Container #vis4 not found');
            return;
        }
        
        d3.csv('digital_diet_mental_health.csv')
            .then(function(data) {
                const screenTimeLabels = ['0-4 hrs', '4-6 hrs', '6-8 hrs', '8-10 hrs', '10+ hrs'];
                const mentalHealthLabels = ['0-30', '30-50', '50-70', '70-100'];
                
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
                
                data.forEach(d => {
                    const screenTime = +d.daily_screen_time_hours || 0;
                    const mentalHealth = +d.mental_health_score || 0;
                    
                    if (isNaN(screenTime) || isNaN(mentalHealth)) return;
                    
                    const screenBin = screenTime < 4 ? 0 : screenTime < 6 ? 1 : screenTime < 8 ? 2 : screenTime < 10 ? 3 : 4;
                    const healthBin = mentalHealth < 30 ? 0 : mentalHealth < 50 ? 1 : mentalHealth < 70 ? 2 : 3;
                    
                    const index = screenBin * mentalHealthLabels.length + healthBin;
                    if (heatmapData[index]) {
                        heatmapData[index].count += 1;
                    }
                });
                
                const spec = {
                    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
                    "data": { "values": heatmapData },
                    "layer": [
                        {
                            "mark": {
                                "type": "rect",
                                "stroke": "white",
                                "strokeWidth": 2.5,
                                "cursor": "pointer"
                            },
                            "encoding": {
                                "x": {
                                    "field": "Screen Time",
                                    "type": "ordinal",
                                    "title": "Daily Screen Time (hours)",
                                    "sort": screenTimeLabels,
                                    "axis": {
                                        "titleFontSize": 15,
                                        "labelFontSize": 13,
                                        "titleFontWeight": "bold"
                                    }
                                },
                                "y": {
                                    "field": "Mental Health Score",
                                    "type": "ordinal",
                                    "title": "Mental Health Score Range",
                                    "sort": mentalHealthLabels,
                                    "axis": {
                                        "titleFontSize": 15,
                                        "labelFontSize": 13,
                                        "titleFontWeight": "bold"
                                    }
                                },
                                "fill": {
                                    "field": "count",
                                    "type": "quantitative",
                                    "scale": {
                                        "scheme": "blues",
                                        "nice": true
                                    },
                                    "legend": { 
                                        "title": "Number of Participants",
                                        "titleFontSize": 14,
                                        "labelFontSize": 13,
                                        "titleFontWeight": "bold"
                                    }
                                }
                            }
                        },
                        {
                            "mark": {
                                "type": "text",
                                "fontSize": 14,
                                "fontWeight": "bold"
                            },
                            "encoding": {
                                "x": {
                                    "field": "Screen Time",
                                    "type": "ordinal",
                                    "sort": screenTimeLabels
                                },
                                "y": {
                                    "field": "Mental Health Score",
                                    "type": "ordinal",
                                    "sort": mentalHealthLabels
                                },
                                "text": {
                                    "field": "count",
                                    "type": "quantitative",
                                    "format": "d"
                                },
                                "fill": {
                                    "condition": {
                                        "test": {
                                            "field": "count",
                                            "gt": 50
                                        },
                                        "value": "white"
                                    },
                                    "value": "#333"
                                }
                            },
                            "transform": [
                                {
                                    "filter": {
                                        "field": "count",
                                        "gt": 0
                                    }
                                }
                            ]
                        }
                    ],
                    "width": 650,
                    "height": 500,
                    "title": {
                        "text": "Screen Time and Mental Health Distribution",
                        "subtitle": "Distribution of participants across screen time and mental health score ranges",
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
                
                vegaEmbed('#vis4', spec, { actions: false })
                    .then(function(result) {
                        const svg = d3.select('#vis4').select('svg');
                        if (!svg.empty()) {
                            svg.selectAll('rect')
                                .style('cursor', 'pointer')
                                .on('click', function(event, d) {
                                    svg.selectAll('rect').style('stroke', 'white').style('stroke-width', 2);
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
