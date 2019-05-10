/* globals d3 */

const plotHeadingErrors = (width) => {
  const height = width / 2;
  const plot = d3.select("#heading_errors")
    .attr("width", width)
    .attr("height", height);

  const margin = { left: 40, bottom: 20 };

  const x = d3.scaleLinear().range([margin.left, width]);
  const y = d3.scaleLinear().range([height - margin.bottom, 0]);

  const xPos = error => d => x(Math.sin(error * Math.PI / 180) * (d + 1))
  const yPos = error => d => y(Math.cos(error * Math.PI / 180) * (d + 1))

  // IMPORTANT: ratio of width to height needs to be the same (1/2)
  x.domain([-15, 185]);  // 200 meters wide
  y.domain([910, 1010]); // 100 meters tall

  const line = error => d3.line()
    .defined(d => Math.cos(error * Math.PI / 180) * (d + 1) > y.domain()[0])
    .x(xPos(error))
    .y(yPos(error));

  const distance = [...Array(1000).keys()]; // 0 to 999


  plot.append("g")
    .attr("class", "axis x-axis")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x));

  plot.append("g")
    .attr("class", "axis y-axis")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y));

  const vehicleIcon = (fill, x, y, rotate) => `
    <svg
      x="${x - (Math.cos(rotate * Math.PI / 180) * 15)}"
      y="${y - (Math.sin(rotate * Math.PI / 180) * 30)}"
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
    { error: 0,   color: "#1a9850" },
    { error: 0.5, color: "#66bd63" },
    { error: 1,   color: "#a6d96a" },
    { error: 5,   color: "#f46d43" },
    { error: 10,  color: "#d73027" }];

  lines.forEach(({ error, color }) => {
    plot.append("g")
      .append("path")
        .attr("class", "line")
        .attr("d", line(error)(distance))
        .attr("stroke", color);

    plot.append('g')
      .html(vehicleIcon(color, xPos(error)(1000), yPos(error)(1000), error));
  });
};

document.addEventListener('DOMContentLoaded', () => {
  const width = document.getElementById('body').clientWidth;
  plotHeadingErrors(width);
});
