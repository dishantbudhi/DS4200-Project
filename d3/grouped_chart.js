if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGroupedChart);
} else {
  initGroupedChart();
}

function initGroupedChart() {
  let margin = {
    top: 70,
    bottom: 80,
    left: 80,
    right: 150
  };

  let width = 800 - margin.left - margin.right;
  let height = 500 - margin.top - margin.bottom;

  let container = d3.select('#vis5');

  if (container.empty()) {
    console.error('Container #vis5 not found');
    return;
  }

  container.selectAll('*').remove();

  let svg = container
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  let colorScale = d3.scaleOrdinal()
    .domain(['Male', 'Female', 'Other'])
    .range(['#0072B2', '#E69F00', '#009E73']);

  d3.csv('digital_diet_mental_health.csv')
    .then(function(data) {
      let grouped = {};

      data.forEach(d => {
        let location = d.location_type;
        let gender = d.gender;
        let score = +d.mental_health_score || 0;

        if (!location || !gender || isNaN(score)) return;

        let key = location + '_' + gender;
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

      let groupedData = Object.values(grouped).map(g => ({
        location: g.location,
        gender: g.gender,
        score: g.sum / g.count
      }));

      if (groupedData.length === 0) {
        console.error('No data to display');
        return;
      }

      let locations = ['Urban', 'Suburban', 'Rural'];
      let genders = ['Male', 'Female', 'Other'];

      let x0Scale = d3.scaleBand()
        .domain(locations)
        .range([0, width])
        .padding(0.2);

      let x1Scale = d3.scaleBand()
        .domain(genders)
        .range([0, x0Scale.bandwidth()])
        .padding(0.05);

      let yScale = d3.scaleLinear()
        .domain([0, d3.max(groupedData, d => d.score) * 1.1])
        .range([height, 0])
        .nice();

      svg.append('text')
        .attr('x', width / 2)
        .attr('y', -25)
        .attr('fill', 'black')
        .style('text-anchor', 'middle')
        .style('font-size', '20px')
        .style('font-weight', 'bold')
        .text('Mental Health by Location and Gender');

      svg.append('text')
        .attr('x', width / 2)
        .attr('y', -5)
        .attr('fill', '#666')
        .style('text-anchor', 'middle')
        .style('font-size', '14px')
        .style('font-style', 'italic')
        .text('Average mental health scores grouped by location type and gender');

      let xAxis = svg.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(x0Scale));

      xAxis.append('text')
        .attr('x', width / 2)
        .attr('y', 45)
        .attr('fill', 'black')
        .style('text-anchor', 'middle')
        .style('font-size', '14px')
        .text('Location Type');

      let yAxis = svg.append('g')
        .attr('class', 'y-axis')
        .call(d3.axisLeft(yScale));

      yAxis.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', -50)
        .attr('x', -height / 2)
        .attr('fill', 'black')
        .style('text-anchor', 'middle')
        .style('font-size', '14px')
        .text('Average Mental Health Score');

      let currentX0Scale = x0Scale;
      let currentX1Scale = x1Scale;
      let currentYScale = yScale;

      function updateBarsWithScales(dataToShow) {
        svg.selectAll('.bar-group').remove();
        svg.selectAll('.bar-label').remove();

        let barGroups = svg.selectAll('.bar-group')
          .data(dataToShow)
          .enter()
          .append('g')
          .attr('class', 'bar-group');

        let rects = barGroups.append('rect')
          .attr('x', d => currentX0Scale(d.location) + currentX1Scale(d.gender))
          .attr('y', d => currentYScale(d.score))
          .attr('width', currentX1Scale.bandwidth())
          .attr('height', d => height - currentYScale(d.score))
          .attr('fill', d => colorScale(d.gender))
          .attr('opacity', 0.8)
          .attr('stroke', '#333')
          .attr('stroke-width', 1)
          .on('mouseover', function(event, d) {
            d3.select(this)
              .attr('opacity', 1)
              .attr('stroke', 'black')
              .attr('stroke-width', 2);

            d3.select('body').append('div')
              .attr('class', 'tooltip')
              .style('opacity', 1)
              .html(`<strong>Location:</strong> ${d.location}<br/><strong>Gender:</strong> ${d.gender}<br/><strong>Avg Mental Health Score:</strong> ${d.score.toFixed(1)}<br/><em>Higher scores indicate better mental health</em>`)
              .style('left', (event.pageX + 10) + 'px')
              .style('top', (event.pageY - 10) + 'px');
          })
          .on('mouseout', function() {
            d3.select(this)
              .attr('opacity', 0.8)
              .attr('stroke', '#333')
              .attr('stroke-width', 1);
            d3.selectAll('.tooltip').remove();
          });

        barGroups.append('text')
          .attr('class', 'bar-label')
          .attr('x', d => currentX0Scale(d.location) + currentX1Scale(d.gender) + currentX1Scale.bandwidth() / 2)
          .attr('y', d => {
            let barHeight = height - currentYScale(d.score);
            return barHeight > 20 ? currentYScale(d.score) - 5 : currentYScale(d.score) + 15;
          })
          .attr('text-anchor', 'middle')
          .style('font-size', '12px')
          .style('fill', 'black')
          .style('font-weight', 'bold')
          .text(d => d.score.toFixed(1));

        let minScore = d3.min(dataToShow, d => d.score);
        rects.attr('stroke-width', d => d.score === minScore ? 3 : 1)
          .attr('stroke', d => d.score === minScore ? '#1F2937' : '#333');
      }

      updateBarsWithScales(groupedData);

      let legend = svg.append('g')
        .attr('transform', `translate(${width + 30}, 60)`);

      legend.append('text')
        .attr('x', 0)
        .attr('y', 0)
        .style('font-size', '16px')
        .style('font-weight', 'bold')
        .text('Gender');

      genders.forEach((d, i) => {
        let legendItem = legend.append('g')
          .attr('transform', `translate(0, ${(i + 1) * 38})`);

        legendItem.append('rect')
          .attr('width', 26)
          .attr('height', 20)
          .attr('fill', colorScale(d))
          .attr('stroke', '#333')
          .attr('stroke-width', 2);

        legendItem.append('text')
          .attr('x', 32)
          .attr('y', 15)
          .style('font-size', '14px')
          .style('font-weight', '500')
          .text(d);
      });

      function updateVisualization() {
        let selectedGender = d3.select('#gender-filter').node().value;
        let data = selectedGender === 'all' ? groupedData : groupedData.filter(d => d.gender === selectedGender);

        let locOrder = { 'Urban': 0, 'Suburban': 1, 'Rural': 2 };
        let genderOrder = { 'Male': 0, 'Female': 1, 'Other': 2 };
        data.sort((a, b) => locOrder[a.location] - locOrder[b.location] || genderOrder[a.gender] - genderOrder[b.gender]);

        currentX0Scale = d3.scaleBand()
          .domain(locations)
          .range([0, width])
          .padding(0.2);

        currentX1Scale = d3.scaleBand()
          .domain(genders)
          .range([0, currentX0Scale.bandwidth()])
          .padding(0.05);

        let maxScore = d3.max(data, d => d.score);
        currentYScale = d3.scaleLinear()
          .domain([0, maxScore * 1.1])
          .range([height, 0])
          .nice();

        svg.select('.x-axis').remove();
        svg.select('.y-axis').remove();

        let newXAxis = svg.append('g')
          .attr('class', 'x-axis')
          .attr('transform', `translate(0, ${height})`)
          .call(d3.axisBottom(currentX0Scale));

        newXAxis.selectAll('text')
          .style('text-anchor', 'middle')
          .style('font-size', '14px')
          .style('font-weight', '500')
          .attr('dx', '0')
          .attr('dy', '10');

        let newYAxis = svg.append('g')
          .attr('class', 'y-axis')
          .call(d3.axisLeft(currentYScale));

        newYAxis.selectAll('text')
          .style('font-size', '13px');

        updateBarsWithScales(data);
      }

      setTimeout(() => {
        let genderFilter = d3.select('#gender-filter');

        if (!genderFilter.empty()) {
          genderFilter.on('change', function() {
            updateVisualization();
          });
        } else {
          console.error('Gender filter not found');
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
