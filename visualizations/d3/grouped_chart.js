// D3 Grouped Bar Chart: Mental Health Scores by Location and Gender
(function() {
    'use strict';
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    function init() {
        // Set up dimensions and margins
        const margin = { top: 50, bottom: 80, left: 80, right: 150 };
        const width = 800 - margin.left - margin.right;
        const height = 500 - margin.top - margin.bottom;
        
        // Check if container exists
        const container = d3.select('#vis5');
        if (container.empty()) {
            console.error('Container #vis5 not found');
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
        
        // Color scale for gender
        const colorScale = d3.scaleOrdinal()
            .domain(['Male', 'Female', 'Other'])
            .range(['#4a90e2', '#e24a90', '#90e24a']);
        
        // Load data
        d3.csv('digital_diet_mental_health.csv')
            .then(function(data) {
                console.log('Data loaded:', data.length, 'rows');
                
                // Process data: group by location and gender
                const grouped = {};
                
                data.forEach(d => {
                    const location = d.location_type;
                    const gender = d.gender;
                    const score = +d.mental_health_score || 0;
                    
                    if (!location || !gender || isNaN(score)) return;
                    
                    const key = location + '_' + gender;
                    if (!grouped[key]) {
                        grouped[key] = {
                            location: location,
                            gender: gender,
                            sum: 0,
                            count: 0
                        };
                    }
                    grouped[key].sum += score;
                    grouped[key].count += 1;
                });
                
                console.log('Grouped data:', grouped);
                
                // Calculate averages
                const groupedData = Object.values(grouped).map(g => ({
                    location: g.location,
                    gender: g.gender,
                    score: g.sum / g.count
                }));
                
                console.log('Averaged data:', groupedData);
                
                if (groupedData.length === 0) {
                    console.error('No data to display');
                    return;
                }
                
                // Create scales
                const locations = ['Urban', 'Suburban', 'Rural'];
                const genders = ['Male', 'Female', 'Other'];
                
                const x0Scale = d3.scaleBand()
                    .domain(locations)
                    .range([0, width])
                    .padding(0.2);
                
                const x1Scale = d3.scaleBand()
                    .domain(genders)
                    .range([0, x0Scale.bandwidth()])
                    .padding(0.05);
                
                const yScale = d3.scaleLinear()
                    .domain([0, d3.max(groupedData, d => d.score) * 1.1])
                    .range([height, 0])
                    .nice();
                
                // Create axes
                const xAxis = d3.axisBottom(x0Scale);
                const yAxis = d3.axisLeft(yScale);
                
                // X-axis
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
                    .text('Location Type');
                
                // Y-axis
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
                    .text('Average Mental Health Score');
                
                // Draw bars function with custom scales
                function updateBarsWithScales(dataToShow) {
                    // Remove existing bars and labels
                    svg.selectAll('.bar-group').remove();
                    svg.selectAll('.bar-label').remove();
                    
                    // Create bar groups
                    const barGroups = svg.selectAll('.bar-group')
                        .data(dataToShow)
                        .enter()
                        .append('g')
                        .attr('class', 'bar-group');
                    
                    // Add rectangles
                    barGroups.append('rect')
                        .attr('x', d => {
                            const sortBy = d3.select('#sort-filter').node() ? d3.select('#sort-filter').node().value : 'location';
                            if (sortBy === 'score') {
                                return currentX0Scale(d.location + ' - ' + d.gender) || 0;
                            } else {
                                return (currentX0Scale(d.location) || 0) + (currentX1Scale(d.gender) || 0);
                            }
                        })
                        .attr('y', d => currentYScale(d.score))
                        .attr('width', d => {
                            const sortBy = d3.select('#sort-filter').node() ? d3.select('#sort-filter').node().value : 'location';
                            return sortBy === 'score' ? currentX0Scale.bandwidth() : currentX1Scale.bandwidth();
                        })
                        .attr('height', d => height - currentYScale(d.score))
                        .attr('fill', d => colorScale(d.gender))
                        .attr('opacity', 0.8)
                        .on('mouseover', function(event, d) {
                            d3.select(this)
                                .attr('opacity', 1)
                                .attr('stroke', 'black')
                                .attr('stroke-width', 2);
                            
                            const tooltip = d3.select('body')
                                .append('div')
                                .attr('class', 'tooltip')
                                .style('opacity', 1);
                            
                            tooltip.html(`
                                <strong>Location:</strong> ${d.location}<br/>
                                <strong>Gender:</strong> ${d.gender}<br/>
                                <strong>Avg Mental Health Score:</strong> ${d.score.toFixed(1)}
                            `)
                                .style('left', (event.pageX + 10) + 'px')
                                .style('top', (event.pageY - 10) + 'px');
                        })
                        .on('mouseout', function() {
                            d3.select(this)
                                .attr('opacity', 0.8)
                                .attr('stroke', 'none');
                            
                            d3.selectAll('.tooltip').remove();
                        });
                    
                    // Add value labels
                    barGroups.append('text')
                        .attr('class', 'bar-label')
                        .attr('x', d => {
                            const sortBy = d3.select('#sort-filter').node() ? d3.select('#sort-filter').node().value : 'location';
                            if (sortBy === 'score') {
                                return (currentX0Scale(d.location + ' - ' + d.gender) || 0) + currentX0Scale.bandwidth() / 2;
                            } else {
                                return (currentX0Scale(d.location) || 0) + (currentX1Scale(d.gender) || 0) + currentX1Scale.bandwidth() / 2;
                            }
                        })
                        .attr('y', d => {
                            const barHeight = height - currentYScale(d.score);
                            return barHeight > 20 ? currentYScale(d.score) - 5 : currentYScale(d.score) + 15;
                        })
                        .attr('text-anchor', 'middle')
                        .style('font-size', '11px')
                        .style('fill', 'black')
                        .style('font-weight', 'bold')
                        .text(d => d.score.toFixed(1));
                }
                
                // Store scales for updates
                let currentX0Scale = x0Scale;
                let currentX1Scale = x1Scale;
                let currentYScale = yScale;
                
                // Initial draw
                updateBarsWithScales(groupedData);
                
                // Add legend (positioned to avoid overlap)
                const legend = svg.append('g')
                    .attr('transform', `translate(${width + 20}, 50)`);
                
                legend.append('text')
                    .attr('x', 0)
                    .attr('y', 0)
                    .style('font-size', '14px')
                    .style('font-weight', 'bold')
                    .text('Gender');
                
                genders.forEach((d, i) => {
                    const legendItem = legend.append('g')
                        .attr('transform', `translate(0, ${(i + 1) * 25})`);
                    
                    legendItem.append('rect')
                        .attr('width', 15)
                        .attr('height', 15)
                        .attr('fill', colorScale(d));
                    
                    legendItem.append('text')
                        .attr('x', 20)
                        .attr('y', 12)
                        .style('font-size', '12px')
                        .text(d);
                });
                
                // Filter and sort functions
                function updateVisualization() {
                    let data = [...groupedData];
                    
                    // Filter by gender
                    const selectedGender = d3.select('#gender-filter').node().value;
                    console.log('Selected gender:', selectedGender);
                    if (selectedGender !== 'all') {
                        data = data.filter(d => d.gender === selectedGender);
                    }
                    
                    // Sort
                    const sortBy = d3.select('#sort-filter').node().value;
                    console.log('Sort by:', sortBy);
                    
                    if (sortBy === 'score') {
                        // Sort by score descending
                        data.sort((a, b) => b.score - a.score);
                        // Create new domain based on sorted data
                        const sortedLabels = data.map(d => d.location + ' - ' + d.gender);
                        currentX0Scale = d3.scaleBand()
                            .domain(sortedLabels)
                            .range([0, width])
                            .padding(0.2);
                    } else {
                        // Sort by location, then gender
                        data.sort((a, b) => {
                            const locOrder = { 'Urban': 0, 'Suburban': 1, 'Rural': 2 };
                            if (locOrder[a.location] !== locOrder[b.location]) {
                                return locOrder[a.location] - locOrder[b.location];
                            }
                            const genderOrder = { 'Male': 0, 'Female': 1, 'Other': 2 };
                            return genderOrder[a.gender] - genderOrder[b.gender];
                        });
                        currentX0Scale = d3.scaleBand()
                            .domain(locations)
                            .range([0, width])
                            .padding(0.2);
                    }
                    
                    // Update x1Scale based on new x0Scale
                    currentX1Scale = d3.scaleBand()
                        .domain(genders)
                        .range([0, currentX0Scale.bandwidth()])
                        .padding(0.05);
                    
                    // Update y scale based on filtered data
                    const maxScore = d3.max(data, d => d.score);
                    currentYScale = d3.scaleLinear()
                        .domain([0, maxScore * 1.1])
                        .range([height, 0])
                        .nice();
                    
                    // Update axes
                    svg.select('.x-axis').remove();
                    svg.select('.y-axis').remove();
                    
                    // X-axis
                    svg.append('g')
                        .attr('class', 'x-axis')
                        .attr('transform', `translate(0, ${height})`)
                        .call(d3.axisBottom(currentX0Scale))
                        .selectAll('text')
                        .style('text-anchor', sortBy === 'score' ? 'end' : 'middle')
                        .attr('dx', sortBy === 'score' ? '-.8em' : '0')
                        .attr('dy', sortBy === 'score' ? '.15em' : '10')
                        .attr('transform', sortBy === 'score' ? 'rotate(-45)' : 'rotate(0)');
                    
                    // Y-axis
                    svg.append('g')
                        .attr('class', 'y-axis')
                        .call(d3.axisLeft(currentYScale));
                    
                    // Update bars with new scales
                    updateBarsWithScales(data);
                }
                
                // Update bars function with custom scales
                function updateBarsWithScales(dataToShow) {
                    // Remove existing bars and labels
                    svg.selectAll('.bar-group').remove();
                    svg.selectAll('.bar-label').remove();
                    
                    // Create bar groups
                    const barGroups = svg.selectAll('.bar-group')
                        .data(dataToShow)
                        .enter()
                        .append('g')
                        .attr('class', 'bar-group');
                    
                    // Add rectangles
                    barGroups.append('rect')
                        .attr('x', d => {
                            if (d3.select('#sort-filter').node().value === 'score') {
                                return currentX0Scale(d.location + ' - ' + d.gender);
                            } else {
                                return currentX0Scale(d.location) + currentX1Scale(d.gender);
                            }
                        })
                        .attr('y', d => currentYScale(d.score))
                        .attr('width', d => {
                            if (d3.select('#sort-filter').node().value === 'score') {
                                return currentX0Scale.bandwidth();
                            } else {
                                return currentX1Scale.bandwidth();
                            }
                        })
                        .attr('height', d => height - currentYScale(d.score))
                        .attr('fill', d => colorScale(d.gender))
                        .attr('opacity', 0.8)
                        .on('mouseover', function(event, d) {
                            d3.select(this)
                                .attr('opacity', 1)
                                .attr('stroke', 'black')
                                .attr('stroke-width', 2);
                            
                            const tooltip = d3.select('body')
                                .append('div')
                                .attr('class', 'tooltip')
                                .style('opacity', 1);
                            
                            tooltip.html(`
                                <strong>Location:</strong> ${d.location}<br/>
                                <strong>Gender:</strong> ${d.gender}<br/>
                                <strong>Avg Mental Health Score:</strong> ${d.score.toFixed(1)}
                            `)
                                .style('left', (event.pageX + 10) + 'px')
                                .style('top', (event.pageY - 10) + 'px');
                        })
                        .on('mouseout', function() {
                            d3.select(this)
                                .attr('opacity', 0.8)
                                .attr('stroke', 'none');
                            
                            d3.selectAll('.tooltip').remove();
                        });
                    
                    // Add value labels
                    barGroups.append('text')
                        .attr('class', 'bar-label')
                        .attr('x', d => {
                            const xPos = d3.select('#sort-filter').node().value === 'score' 
                                ? currentX0Scale(d.location + ' - ' + d.gender) + currentX0Scale.bandwidth() / 2
                                : currentX0Scale(d.location) + currentX1Scale(d.gender) + currentX1Scale.bandwidth() / 2;
                            return xPos;
                        })
                        .attr('y', d => {
                            const barHeight = height - currentYScale(d.score);
                            return barHeight > 20 ? currentYScale(d.score) - 5 : currentYScale(d.score) + 15;
                        })
                        .attr('text-anchor', 'middle')
                        .style('font-size', '11px')
                        .style('fill', 'black')
                        .style('font-weight', 'bold')
                        .text(d => d.score.toFixed(1));
                }
                
                // Add event listeners (wait a bit to ensure elements exist)
                setTimeout(() => {
                    const genderFilter = d3.select('#gender-filter');
                    const sortFilter = d3.select('#sort-filter');
                    
                    if (!genderFilter.empty()) {
                        genderFilter.on('change', function() {
                            console.log('Gender filter changed');
                            updateVisualization();
                        });
                    } else {
                        console.error('Gender filter not found');
                    }
                    
                    if (!sortFilter.empty()) {
                        sortFilter.on('change', function() {
                            console.log('Sort filter changed');
                            updateVisualization();
                        });
                    } else {
                        console.error('Sort filter not found');
                    }
                }, 200);
            })
            .catch(function(error) {
                console.error('Error loading data:', error);
                d3.select('#vis5').append('text')
                    .attr('x', 400)
                    .attr('y', 250)
                    .style('text-anchor', 'middle')
                    .style('fill', 'red')
                    .text('Error loading data. Check console for details.');
            });
    }
})();
