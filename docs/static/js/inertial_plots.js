/* globals d3 */


const plotErrors = (id, errors, xPos, yPos, defined) => {
  const width = document.getElementById('body').clientWidth;
  const margin = { top: 50, left: 80, bottom: 60 };
  // height needs to be 1/2 of width including margins
  const height = width / 2 + (margin.left * 2 - (margin.top + margin.bottom));
  const plot = d3.select(`#${id}`)
    .attr("width", width)
    .attr("height", height);

  const x = d3.scaleLinear().range([margin.left, width]);
  const y = d3.scaleLinear().range([height - margin.bottom, margin.top]);

  // IMPORTANT: ratio of width to height needs to be the same (1/2)
  x.domain([-15, 205]);   // 220 meters wide
  y.domain([895, 1005]); // 110 meters tall

  const line = error => d3.line()
    .defined(d => defined(error)(d) >= y.domain()[0])
    .x(xPos(x, error))
    .y(yPos(y, error));

  // make 10k element array of numbers 1 to 1000
  const distance = [...Array(10000).keys()].map(i => (i + 1) / 10);

  // the polygon transform attribute's value is very specific and fragile
  const vehicleIcon = (fill, x, y, rotate) => `
    <svg
      x="${x - (rotate > 3 ? 14 : 15)}"
      y="${y - 10}"
      stroke="#fff"
      stroke-width="1"
      height="30"
      width="30">
      <polygon
        transform="rotate(${rotate}) translate(${rotate > 10 ? 6 : 5},5)"
        fill="${fill}"
        stroke="${fill}"
        points="0,20 10,15 20,20 10,0 0,20" />
    </svg>`;

  const colors = ["#111", "#1a9850", "#66bd63", "#f46d43", "#d73027"];

  const lines = errors.map((error, i) => ({
    error,
    color: colors[i],
  }));

  lines.forEach(({ error, color }) => {
    plot.append("g")
      .append("path")
        .attr("class", "line")
        .attr("d", line(error)(distance))
        .attr("stroke", color);

    const origin = {
      x: xPos(x, error)(1000),
      y: yPos(y, error)(1000)
    }

    plot.append('g')
      .html(vehicleIcon(color, origin.x, origin.y, error));

    plot.append("text")
      .attr("class", `data_label ${error ? "error" : "no_error"}`)
      .attr("transform", `translate(${origin.x}, ${origin.y - 10}), rotate(-30)`)
      .text(error ? `${error}°${id == "gyro_errors" ? "/hr" : ""} Error` : "No Error");
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

  // Plot small context box
  const contextDimensions = { width: 40, height: 100 };
  x.domain([-15, 205]);
  y.domain([0, 1005]);
  x.range([5, contextDimensions.width - 5])
  y.range([contextDimensions.height - 5, 5])
  const contextPosition = {
    x: width - contextDimensions.width - 50,
    y: height - margin.bottom - contextDimensions.height - 30
  };

  const contextId = `${id}_context_plot`;
  const contextPlot = `
    <svg
      id="${contextId}"
      x="${contextPosition.x}"
      y="${contextPosition.y}"
      height="${contextDimensions.height}"
      width="${contextDimensions.width}">
    </svg>`;

  plot.append("g").html(contextPlot);

  lines.reverse().forEach(({ error, color }) => {
    plot.select(`#${contextId}`)
      .append("g")
        .append("path")
          .attr("class", "context_line")
          .attr("d", line(error)(distance))
          .attr("stroke", color);
  });

  plot.select(`#${contextId}`)
    .append("g")
    .html(`
      <rect
        x=2
        y=2
        width="${contextDimensions.width - 4}"
        height="${contextDimensions.width / 2}"
        fill-opacity="0"
        stroke="#333"
        stroke-width="2px"
      />`);

  plot.select(`#${contextId}`)
    .append("g")
    .html(`<circle cx="${x(0)}" cy="${y(0)}" r="3" />`);

  plot.append("text")
    .attr("class", "context")
    .attr("transform", `translate(${contextPosition.x - 0},${contextPosition.y + contextDimensions.height + 15}) rotate(-0)`)
    .text("Full transit");

  if (id == "gyro_errors") {
    // THIS SCALING IS ONLY GOOD AT A SPECIFIC RESOLUTION
    const smallMultipleDimensions = { width: width / 4, height: 200 };
    const smallMultiplePlot = d3.select("#gyro_small_multiples")
      .attr("width", width)
      .attr("height", smallMultipleDimensions.height);

    x.domain([0, 400]);
    y.domain([0, 1000]);
    y.range([smallMultipleDimensions.height - 5, 5])

    const durations = [2, 1, 0.5, 0.25];
    durations.forEach((hours, i) => {
      const duration = hours * 3600;
      const velocity = 1000 / duration;
      const smallLine = error => d3.line()
        .x(d => x(Math.sin((error / 3600) * (d / velocity) * Math.PI / 180) * d))
        .y(d => y(Math.cos((error / 3600) * (d / velocity) * Math.PI / 180) * d));

      x.range([
        smallMultipleDimensions.width / 2 + smallMultipleDimensions.width * i,
        smallMultipleDimensions.width - 5 + (smallMultipleDimensions.width * i)
      ])

      lines.forEach(({ error, color }) => {
        smallMultiplePlot.append("g")
            .append("path")
              .attr("class", "context_line")
              .attr("d", smallLine(error)(distance))
              .attr("stroke", color);
      });
      smallMultiplePlot.append("text")
        .attr("class", "labels")
        .attr("transform", `translate(${smallMultipleDimensions.width * i + smallMultipleDimensions.width / 2 + 20}, ${smallMultipleDimensions.height - 10})`)
        .text(`${hours} hr`);

    smallMultiplePlot.append("g")
      .html(`<line
        class="small_multiple_axis_line"
        x1="${smallMultipleDimensions.width * i + smallMultipleDimensions.width / 2 - 5}"
        y1="5"
        x2="${smallMultipleDimensions.width * i + smallMultipleDimensions.width / 2 + 1}"
        y2="5"/>`);
    });

    smallMultiplePlot.append("text")
      .attr("transform", `translate(${smallMultipleDimensions.width / 2 - 50}, 10)`)
      .text("1 km");
      
  }
};

document.addEventListener('DOMContentLoaded', () => {
  plotErrors(
    "heading_errors",
    [0, 1, 2, 5, 10],
    (x, error) => d => x(Math.sin(error * Math.PI / 180) * d),
    (y, error) => d => y(Math.cos(error * Math.PI / 180) * d),
    error => d => (Math.cos(error * Math.PI / 180) * d));

  // gyro error is sin(rot_rate * t) with rotation rate in deg / s
  // time is distance / velocity
  const velocity = 0.5; // m/s
  plotErrors(
    "gyro_errors",
    [0, 1, 5, 10, 15],
    (x, error) => d => x(Math.sin((error / 3600) * (d / velocity) * Math.PI / 180) * d),
    (y, error) => d => y(Math.cos((error / 3600) * (d / velocity) * Math.PI / 180) * d),
    error => d => (Math.cos((error / 3600) * (d / velocity) * Math.PI / 180) * d));
});
