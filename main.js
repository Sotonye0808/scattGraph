// Define the dimensions and margins for the graph
const margin = { top: 50, right: 50, bottom: 50, left: 50 };
const width = 800 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

// Append the SVG element to the container
const svg = d3.select("#scatterplot")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Fetch the data
d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json").then(data => {
    // Data preprocessing
    const parseTime = d3.timeParse("%M:%S");
    data.forEach(d => {
        d.Time = parseTime(d.Time);
    });

    // Define scales
    const xScale = d3.scaleTime()
        .domain(d3.extent(data, d => d.Year))
        .range([0, width]);

    const yScale = d3.scaleTime()
        .domain(d3.extent(data, d => d.Time))
        .range([height, 0]);

    // Create axes
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
    const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));

    // Append axes to SVG
    svg.append("g")
        .attr("id", "x-axis")
        .attr("transform", `translate(0,${height})`)
        .call(xAxis);

    svg.append("g")
        .attr("id", "y-axis")
        .call(yAxis);

    // Add dots to represent the data points
    svg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("cx", d => xScale(d.Year))
        .attr("cy", d => yScale(d.Time))
        .attr("r", 5)
        .attr("data-xvalue", d => d.Year)
        .attr("data-yvalue", d => d.Time.toISOString())
        .on("mouseover", (event, d) => {
            const tooltip = d3.select("#tooltip");
            tooltip.transition().duration(200).style("opacity", 0.9);
            tooltip.html(`${d.Name}: ${d.Nationality}<br>Year: ${d.Year}, Time: ${d.Time.getMinutes()}:${d.Time.getSeconds()}`)
                .attr("data-year", d.Year)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", () => {
            d3.select("#tooltip").transition().duration(200).style("opacity", 0);
        });
});
