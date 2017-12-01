
d3.csv('dados.csv', function(error, data) {
    var margin = {top: 13, right: 13, bottom: 23, left: 7},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var parser = d3.timeParse('%H:%M');
    data.forEach(d => d.horario_inicial = parser(d.horario_inicial));
    data.forEach(d => d.homens_pedestres = d.homens_pedestres / d.total_pedestres);
    data.forEach(d => d.mulheres_pedestres = d.mulheres_pedestres / d.total_pedestres);
    var newData = data.filter(d => d.local === 'jackson');

    var keys = data.columns.slice(11, 13);

    var x = d3.scaleTime()
        .domain(d3.extent(newData.map(d => d.horario_inicial)))
        .range([margin.left, width]);

    var y = d3.scaleLinear()
        .domain([0, 1])
        .range([height, 0])
        .nice();

    var gender = d3.scaleOrdinal()
        .domain(keys)
        .range(['indigo', 'mediumaquamarine']);

    var svg = d3.select('#vis').append('svg')
        .attr('version', '1.1')
        .attr('viewBox', '0 0 ' +
              (width + margin.left + margin.right) + ' ' +
              (height + margin.top + margin.bottom))
        .attr('width', '100%');

    var g = svg.append('g')
        .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

    g.selectAll('g')
        .data(d3.stack().keys(keys)(newData))
        .enter()
        .append('g')
            .attr('fill', d => gender(d.key))
        .selectAll('rect')
        .data(d => d)
        .enter()
        .append('rect')
            .attr('x', d => x(d.data.horario_inicial))
            .attr('y', d => y(d[1]))
            .attr('height', d => y(d[0]) - y(d[1]))
            .attr('width', width / newData.length);

    g.append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(x));
});
