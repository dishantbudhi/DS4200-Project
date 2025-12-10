(function() {
    'use strict';
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    function init() {
        const margin = { top: 80, bottom: 100, left: 90, right: 180 };
        const width = 900 - margin.left - margin.right;
        const height = 550 - margin.top - margin.bottom;
        
        const container = d3.select('#vis3');
        if (container.empty()) {
            console.error('Container #vis3 not found');
            return;
        }
        
        container.selectAll('*').remove();
        
        const svgRoot = container
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom);
        
        const svg = svgRoot
            .append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);
        
        const tooltip = d3.select('body')
            .append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0);
        
        const colorScale = d3.scaleOrdinal()
            .domain(['Urban', 'Suburban', 'Rural'])
            .range(['#D55E00', '#E69F00', '#F0E442']);
        
        const patterns = svgRoot.append('defs');
        
        patterns.append('pattern')
            .attr('id', 'pattern-urban')
            .attr('patternUnits', 'userSpaceOnUse')
            .attr('width', 8)
            .attr('height', 8)
            .append('path')
            .attr('d', 'M 0,8 L 8,0')
            .attr('stroke', '#D55E00')
            .attr('stroke-width', 1.5);
        
        patterns.append('pattern')
            .attr('id', 'pattern-suburban')
            .attr('patternUnits', 'userSpaceOnUse')
            .attr('width', 8)
            .attr('height', 8)
            .append('line')
            .attr('x1', 0)
            .attr('y1', 4)
            .attr('x2', 8)
            .attr('y2', 4)
            .attr('stroke', '#E69F00')
            .attr('stroke-width', 1.5);
        
        patterns.append('pattern')
            .attr('id', 'pattern-rural')
            .attr('patternUnits', 'userSpaceOnUse')
            .attr('width', 8)
            .attr('height', 8)
            .append('line')
            .attr('x1', 4)
            .attr('y1', 0)
            .attr('x2', 4)
            .attr('y2', 8)
            .attr('stroke', '#F0E442')
            .attr('stroke-width', 1.5);
        
        d3.csv('digital_diet_mental_health.csv')
            .then(function(data) {
                const socialMediaBins = [
                    { label: '0-2 hrs', min: 0, max: 2 },
                    { label: '2-4 hrs', min: 2, max: 4 },
                    { label: '4-6 hrs', min: 4, max: 6 }
                ];
                
                const locations = ['Urban', 'Suburban', 'Rural'];
                
                const groupedData = [];
                
                socialMediaBins.forEach(bin => {
                    locations.forEach(location => {
                        const filtered = data.filter(d => {
                            const socialMedia = +d.social_media_hours || 0;
                            const depression = +d.weekly_depression_score || 0;
                            return d.location_type === location &&
                                   socialMedia >= bin.min &&
                                   socialMedia < bin.max &&
                                   depression >= 0;
                        });
                        
                        if (filtered.length > 0) {
                            const depressionScores = filtered.map(d => +d.weekly_depression_score || 0);
                            const avg = d3.mean(depressionScores);
                            const stdDev = d3.deviation(depressionScores) || 0;
                            const count = filtered.length;
                            
                            groupedData.push({
                                bin: bin.label,
                                location: location,
                                avgDepression: avg,
                                stdDev: stdDev,
                                count: count,
                                min: avg - stdDev,
                                max: avg + stdDev
                            });
                        }
                    });
                });
                
                console.log('Grouped data:', groupedData);
                
                if (groupedData.length === 0) {
                    console.error('No data to display');
                    return;
                }
                
                const x0Scale = d3.scaleBand()
                    .domain(socialMediaBins.map(b => b.label))
                    .range([0, width])
                    .padding(0.3);
                
                const x1Scale = d3.scaleBand()
                    .domain(locations)
                    .range([0, x0Scale.bandwidth()])
                    .padding(0.15);
                
                const yScale = d3.scaleLinear()
                    .domain([0, d3.max(groupedData, d => d.max) * 1.1])
                    .range([height, 0])
                    .nice();
                
                svg.append('text')
                    .attr('x', width / 2)
                    .attr('y', -25)
                    .attr('fill', 'black')
                    .style('text-anchor', 'middle')
                    .style('font-size', '20px')
                    .style('font-weight', 'bold')
                    .text('Depression Scores by Social Media Usage and Location');
                
                svg.append('text')
                    .attr('x', width / 2)
                    .attr('y', -5)
                    .attr('fill', '#666')
                    .style('text-anchor', 'middle')
                    .style('font-size', '14px')
                    .style('font-style', 'italic')
                    .text('Average weekly depression scores grouped by social media usage bins and location type');
                
                svg.append('g')
                    .attr('class', 'x-axis')
                    .attr('transform', `translate(0, ${height})`)
                    .call(d3.axisBottom(x0Scale))
                    .selectAll('text')
                    .style('text-anchor', 'middle')
                    .style('font-size', '14px')
                    .style('font-weight', '500')
                    .attr('dx', '0')
                    .attr('dy', '10');
                
                svg.append('text')
                    .attr('x', width / 2)
                    .attr('y', height + 55)
                    .attr('fill', 'black')
                    .style('text-anchor', 'middle')
                    .style('font-size', '15px')
                    .style('font-weight', 'bold')
                    .text('Social Media Usage (hours per day)');
                
                svg.append('g')
                    .attr('class', 'y-axis')
                    .call(d3.axisLeft(yScale))
                    .selectAll('text')
                    .style('font-size', '13px');
                
                svg.append('text')
                    .attr('transform', 'rotate(-90)')
                    .attr('y', -55)
                    .attr('x', -height / 2)
                    .attr('fill', 'black')
                    .style('text-anchor', 'middle')
                    .style('font-size', '15px')
                    .style('font-weight', 'bold')
                    .text('Average Weekly Depression Score');
                
                function updateBars(dataToShow) {
                    svg.selectAll('.bar-group').remove();
                    svg.selectAll('.error-bar').remove();
                    svg.selectAll('.bar-label').remove();
                    
                    const barGroups = svg.selectAll('.bar-group')
                        .data(dataToShow)
                        .enter()
                        .append('g')
                        .attr('class', 'bar-group');
                    
                    barGroups.append('rect')
                        .attr('x', d => x0Scale(d.bin) + x1Scale(d.location))
                        .attr('y', d => yScale(d.avgDepression))
                        .attr('width', x1Scale.bandwidth())
                        .attr('height', d => height - yScale(d.avgDepression))
                        .attr('fill', d => colorScale(d.location))
                        .attr('stroke', '#333')
                        .attr('stroke-width', 1)
                        .attr('opacity', 0.8)
                        .on('mouseover', function(event, d) {
                            tooltip.transition()
                                .duration(200)
                                .style('opacity', 1);
                            tooltip.html(`
                                <strong>Location:</strong> ${d.location}<br/>
                                <strong>Social Media Usage:</strong> ${d.bin}<br/>
                                <strong>Avg Depression Score:</strong> ${d.avgDepression.toFixed(2)}<br/>
                                <strong>Std Deviation:</strong> ${d.stdDev.toFixed(2)}<br/>
                                <strong>Sample Size:</strong> ${d.count} participants<br/>
                                <strong>Range:</strong> ${d.min.toFixed(1)} - ${d.max.toFixed(1)}
                            `)
                                .style('left', (event.pageX + 10) + 'px')
                                .style('top', (event.pageY - 10) + 'px');
                            
                            d3.select(this)
                                .attr('opacity', 1)
                                .attr('stroke-width', 2);
                        })
                        .on('mouseout', function() {
                            tooltip.transition()
                                .duration(200)
                                .style('opacity', 0);
                            
                            d3.select(this)
                                .attr('opacity', 0.8)
                                .attr('stroke-width', 1);
                        });
                    
                    barGroups.append('line')
                        .attr('class', 'error-bar')
                        .attr('x1', d => x0Scale(d.bin) + x1Scale(d.location) + x1Scale.bandwidth() / 2)
                        .attr('x2', d => x0Scale(d.bin) + x1Scale(d.location) + x1Scale.bandwidth() / 2)
                        .attr('y1', d => yScale(d.min))
                        .attr('y2', d => yScale(d.max))
                        .attr('stroke', '#333')
                        .attr('stroke-width', 2);
                    
                    barGroups.append('line')
                        .attr('class', 'error-bar')
                        .attr('x1', d => x0Scale(d.bin) + x1Scale(d.location) + x1Scale.bandwidth() / 2 - 4)
                        .attr('x2', d => x0Scale(d.bin) + x1Scale(d.location) + x1Scale.bandwidth() / 2 + 4)
                        .attr('y1', d => yScale(d.min))
                        .attr('y2', d => yScale(d.min))
                        .attr('stroke', '#333')
                        .attr('stroke-width', 2);
                    
                    barGroups.append('line')
                        .attr('class', 'error-bar')
                        .attr('x1', d => x0Scale(d.bin) + x1Scale(d.location) + x1Scale.bandwidth() / 2 - 4)
                        .attr('x2', d => x0Scale(d.bin) + x1Scale(d.location) + x1Scale.bandwidth() / 2 + 4)
                        .attr('y1', d => yScale(d.max))
                        .attr('y2', d => yScale(d.max))
                        .attr('stroke', '#333')
                        .attr('stroke-width', 2);
                    
                    barGroups.append('text')
                        .attr('class', 'bar-label')
                        .attr('x', d => x0Scale(d.bin) + x1Scale(d.location) + x1Scale.bandwidth() / 2)
                        .attr('y', d => {
                            const barHeight = height - yScale(d.avgDepression);
                            return barHeight > 25 ? yScale(d.avgDepression) - 6 : yScale(d.avgDepression) + 16;
                        })
                        .attr('text-anchor', 'middle')
                        .style('font-size', '12px')
                        .style('fill', 'black')
                        .style('font-weight', 'bold')
                        .text(d => d.avgDepression.toFixed(1));
                    
                    const top3 = [...dataToShow].sort((a, b) => b.avgDepression - a.avgDepression).slice(0, 3);
                    const isTop3 = d => top3.some(t => t.bin === d.bin && t.location === d.location);
                    barGroups.selectAll('rect')
                        .attr('stroke-width', d => isTop3(d) ? 3 : 1)
                        .attr('stroke', d => isTop3(d) ? '#1F2937' : '#333');
                }
                
                updateBars(groupedData);
                
                const legend = svg.append('g')
                    .attr('transform', `translate(${width + 30}, 60)`);
                
                legend.append('text')
                    .attr('x', 0)
                    .attr('y', 0)
                    .style('font-size', '16px')
                    .style('font-weight', 'bold')
                    .text('Location Type');
                
                locations.forEach((location, i) => {
                    const legendItem = legend.append('g')
                        .attr('transform', `translate(0, ${(i + 1) * 38})`);
                    
                    legendItem.append('rect')
                        .attr('width', 26)
                        .attr('height', 20)
                        .attr('fill', colorScale(location))
                        .attr('stroke', '#333')
                        .attr('stroke-width', 2);
                    
                    legendItem.append('rect')
                        .attr('width', 26)
                        .attr('height', 20)
                        .attr('fill', `url(#pattern-${location.toLowerCase()})`)
                        .attr('opacity', 0.3);
                    
                    legendItem.append('text')
                        .attr('x', 32)
                        .attr('y', 15)
                        .style('font-size', '14px')
                        .style('font-weight', '500')
                        .text(location);
                });
                
                function filterByLocation(location) {
                    updateBars(location === 'all' ? groupedData : groupedData.filter(d => d.location === location));
                }
                
                setTimeout(() => {
                    const locationFilter = d3.select('#location-filter');
                    if (!locationFilter.empty()) {
                        locationFilter.on('change', function() {
                            filterByLocation(this.value);
                        });
                    }
                }, 100);
            })
            .catch(function(error) {
                console.error('Error loading bar chart data:', error);
                container.append('div')
                    .style('padding', '20px')
                    .style('text-align', 'center')
                    .style('color', 'red')
                    .text('Error loading data. Check console for details.');
            });
    }
})();
