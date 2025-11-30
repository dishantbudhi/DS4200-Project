// D3 Scatter Plot: Depression Score vs Social Media Usage
let scatterData = [];
let filteredData = [];
let xScale, yScale;
let brush;

// Set up dimensions and margins (increased right margin for legend)
const margin = { top: 50, bottom: 60, left: 70, right: 150 };
const width = 800 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

// Wait for DOM
(function() {
    'use strict';
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    function init() {
        // Check if container exists
        const container = d3.select('#vis3');
        if (container.empty()) {
            console.error('Container #vis3 not found');
            return;
        }
        
        // Clear any existing content
        container.selectAll('*').remove();
        
        // Create SVG
        const svg = container
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);
        
        // Create tooltip
        const tooltip = d3.select('body')
            .append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0);
        
        // Color scale for location
        const colorScale = d3.scaleOrdinal()
            .domain(['Urban', 'Suburban', 'Rural'])
            .range(['#667eea', '#764ba2', '#f093fb']);
        
        // Load data
        d3.csv('digital_diet_mental_health.csv')
            .then(function(data) {
                console.log('Scatter plot data loaded:', data.length);
                
                // Process data
                scatterData = data
                    .map(d => ({
                        socialMedia: +d.social_media_hours || 0,
                        depression: +d.weekly_depression_score || 0,
                        location: d.location_type,
                        gender: d.gender,
                        age: +d.age || 0,
                        screenTime: +d.daily_screen_time_hours || 0
                    }))
                    .filter(d => d.socialMedia > 0 && d.depression >= 0);
                
                filteredData = scatterData;
                
                // Create scales
                xScale = d3.scaleLinear()
                    .domain([0, d3.max(scatterData, d => d.socialMedia)])
                    .range([0, width])
                    .nice();
                
                yScale = d3.scaleLinear()
                    .domain([0, d3.max(scatterData, d => d.depression)])
                    .range([height, 0])
                    .nice();
                
                // Create axes
                const xAxis = d3.axisBottom(xScale);
                const yAxis = d3.axisLeft(yScale);
                
                svg.append('g')
                    .attr('class', 'x-axis')
                    .attr('transform', `translate(0, ${height})`)
                    .call(xAxis)
                    .append('text')
                    .attr('x', width / 2)
                    .attr('y', 45)
                    .attr('fill', 'black')
                    .style('text-anchor', 'middle')
                    .style('font-size', '14px')
                    .text('Social Media Usage (hours per day)');
                
                svg.append('g')
                    .attr('class', 'y-axis')
                    .call(yAxis)
                    .append('text')
                    .attr('transform', 'rotate(-90)')
                    .attr('y', -50)
                    .attr('x', -height / 2)
                    .attr('fill', 'black')
                    .style('text-anchor', 'middle')
                    .style('font-size', '14px')
                    .text('Weekly Depression Score');
                
                // Create brush
                brush = d3.brush()
                    .extent([[0, 0], [width, height]])
                    .on('brush', brushed)
                    .on('end', brushEnded);
                
                svg.append('g')
                    .attr('class', 'brush')
                    .call(brush);
                
                // Draw points
                updateScatter();
                
                // Add legend
                const legend = svg.append('g')
                    .attr('transform', `translate(${width + 20}, 50)`);
                
                legend.append('text')
                    .attr('x', 0)
                    .attr('y', 0)
                    .style('font-size', '14px')
                    .style('font-weight', 'bold')
                    .text('Location');
                
                const legendData = ['Urban', 'Suburban', 'Rural'];
                legendData.forEach((d, i) => {
                    const legendItem = legend.append('g')
                        .attr('transform', `translate(0, ${(i + 1) * 25})`);
                    
                    legendItem.append('circle')
                        .attr('r', 5)
                        .attr('fill', colorScale(d));
                    
                    legendItem.append('text')
                        .attr('x', 10)
                        .attr('y', 5)
                        .style('font-size', '12px')
                        .text(d);
                });
                
                // Filter function
                function filterByLocation(location) {
                    if (location === 'all') {
                        filteredData = scatterData;
                    } else {
                        filteredData = scatterData.filter(d => d.location === location);
                    }
                    // Clear brush when filtering
                    svg.select('.brush').call(brush.move, null);
                    updateScatter();
                }
                
                // Brush functions
                function brushed(event) {
                    if (event.selection) {
                        const [[x0, y0], [x1, y1]] = event.selection;
                        
                        // Convert brush coordinates back to data space
                        const xMin = xScale.invert(Math.min(x0, x1));
                        const xMax = xScale.invert(Math.max(x0, x1));
                        const yMin = yScale.invert(Math.max(y0, y1));
                        const yMax = yScale.invert(Math.min(y0, y1));
                        
                        // Get base filtered data (by location)
                        const locationFilter = d3.select('#location-filter').property('value');
                        let baseData = locationFilter === 'all' ? scatterData : 
                                      scatterData.filter(d => d.location === locationFilter);
                        
                        // Apply brush filter
                        filteredData = baseData.filter(d => {
                            return d.socialMedia >= xMin && d.socialMedia <= xMax &&
                                   d.depression >= yMin && d.depression <= yMax;
                        });
                        updateScatter();
                    }
                }
                
                function brushEnded(event) {
                    if (!event.selection) {
                        // Reset to location filter only
                        const locationFilter = d3.select('#location-filter').property('value');
                        filterByLocation(locationFilter);
                    }
                }
                
                // Add filter dropdown handler
                setTimeout(() => {
                    const locationFilter = d3.select('#location-filter');
                    if (!locationFilter.empty()) {
                        locationFilter.on('change', function() {
                            filterByLocation(this.value);
                        });
                    }
                }, 100);
                
                // Draw points function
                function updateScatter() {
                    const circles = svg.selectAll('circle.data-point')
                        .data(filteredData, d => d.socialMedia + '_' + d.depression + '_' + d.location);
                    
                    circles.exit().remove();
                    
                    circles.enter()
                        .append('circle')
                        .attr('class', 'data-point')
                        .merge(circles)
                        .attr('cx', d => xScale(d.socialMedia))
                        .attr('cy', d => yScale(d.depression))
                        .attr('r', 4)
                        .attr('fill', d => colorScale(d.location))
                        .attr('opacity', 0.6)
                        .on('mouseover', function(event, d) {
                            tooltip.transition()
                                .duration(200)
                                .style('opacity', 1);
                            tooltip.html(`
                                <strong>Location:</strong> ${d.location}<br/>
                                <strong>Gender:</strong> ${d.gender}<br/>
                                <strong>Age:</strong> ${d.age}<br/>
                                <strong>Social Media:</strong> ${d.socialMedia.toFixed(1)} hrs<br/>
                                <strong>Depression Score:</strong> ${d.depression.toFixed(1)}<br/>
                                <strong>Total Screen Time:</strong> ${d.screenTime.toFixed(1)} hrs
                            `)
                                .style('left', (event.pageX + 10) + 'px')
                                .style('top', (event.pageY - 10) + 'px');
                            
                            d3.select(this)
                                .attr('r', 6)
                                .attr('opacity', 1);
                        })
                        .on('mouseout', function() {
                            tooltip.transition()
                                .duration(200)
                                .style('opacity', 0);
                            
                            d3.select(this)
                                .attr('r', 4)
                                .attr('opacity', 0.6);
                        });
                }
            })
            .catch(function(error) {
                console.error('Error loading scatter plot data:', error);
            });
    }
})();
