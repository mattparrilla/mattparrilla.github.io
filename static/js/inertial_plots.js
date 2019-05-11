/* globals d3 */

const plotHeadingErrors = (width) => {
  const margin = { top: 50, left: 80, bottom: 60 };
  // height needs to be 1/2 of width including margins
  const height = width / 2 + (margin.left * 2 - (margin.top + margin.bottom));
  const plot = d3.select("#heading_errors")
    .attr("width", width)
    .attr("height", height);

  const x = d3.scaleLinear().range([margin.left, width]);
  const y = d3.scaleLinear().range([height - margin.bottom, margin.top]);

  const xPos = error => d => x(Math.sin(error * Math.PI / 180) * d);
  const yPos = error => d => y(Math.cos(error * Math.PI / 180) * d);

  // IMPORTANT: ratio of width to height needs to be the same (1/2)
  x.domain([-15, 205]);   // 220 meters wide
  y.domain([895, 1005]); // 110 meters tall

  const line = error => d3.line()
    .defined(d => Math.cos(error * Math.PI / 180) * (d + 1) >= y.domain()[0])
    .x(xPos(error))
    .y(yPos(error));

  // make 10k element array of numbers 1 to 1000
  const distance = [...Array(10000).keys()].map(i => (i + 1) / 10);


  const vehicleIcon = (fill, x, y, rotate) => `
    <svg
      x="${x - (Math.cos(rotate * Math.PI / 180) * 15)}"
      y="${y - 10}"
      stroke="#fff"
      stroke-width="1"
      height="30"
      width="30">
      <polygon
        transform="rotate(${rotate}) translate(5,5)"
        fill="${fill}"
        stroke="${fill}"
        points="0,20 10,15 20,20 10,0 0,20" />
    </svg>`;

  const lines = [
    { error: 0,   color: "#111" },
    { error: 1, color: "#1a9850" },
    { error: 2,   color: "#66bd63" },
    { error: 5,   color: "#f46d43" },
    { error: 10,  color: "#d73027" }];

  lines.forEach(({ error, color }) => {
    plot.append("g")
      .append("path")
        .attr("class", "line")
        .attr("d", line(error)(distance))
        .attr("stroke", color);

    const origin = {
      x: xPos(error)(1000),
      y: yPos(error)(1000)
    }

    plot.append('g')
      .html(vehicleIcon(color, origin.x, origin.y, error));

    plot.append("text")
      .attr("class", `data_label ${error ? "error" : "no_error"}`)
      .attr("transform", `translate(${origin.x}, ${origin.y - 10}), rotate(-30)`)
      .text(error ? `${error}° Error` : "No Error");
  });

  plot.append("g")
    .attr("class", "axis x-axis")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).tickArguments([20]));

  plot.append("g")
    .attr("class", "axis y-axis")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y));

  const ticks = d3.selectAll(".tick text")
  ticks.attr("class", d => `tick_${d}`);

  plot.append("text")
    .attr("class", "axis_label")
    .attr("x", width / 2 - 110)
    .attr("y", height - 10)
    .text("Easting Distance Traveled (meters)");

  plot.append("text")
    .attr("class", "axis_label")
    .attr("transform", `translate(20,350), rotate(-90)`)
    .text("Northing Distance Traveled (meters)");
};

document.addEventListener('DOMContentLoaded', () => {
  const width = document.getElementById('body').clientWidth;
  plotHeadingErrors(width);
});
