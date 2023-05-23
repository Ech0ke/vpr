const button = document.querySelector("#submit");
const info1 = document.querySelector(".info1");
const widthInput = document.querySelector("#width");
const heightInput = document.querySelector("#height");
const depthInput = document.querySelector("#depth");
const variables = document.querySelector(".variables");
button.addEventListener("click", handleClick);

var startTime, startTime1, startTime2, endTime, endTime1, endTime2;

function handleClick(e) {
  e.preventDefault();

  const studentNumber = parseInt(
    document.getElementById("studentNumber").value
  );

  function sumDigits(number) {
    let str = number.toString();
    let sum = 0;
    while (str.length != 1) {
      sum = 0;

      for (let i = 0; i < str.length; i++) {
        sum += parseInt(str.charAt(i), 10);
      }

      str = sum.toString();
    }
    return sum;
  }

  let b = studentNumber % 10;
  const a = Math.floor((studentNumber % 100) / 10);
  if (b === 0) {
    b = sumDigits(studentNumber);
  }

  variables.innerHTML = `a = ${a}<br /> b = ${b}`;

  //tikslo funkcija
  function finalFunction(x1, x2) {
    return -0.125 * x1 * x2 * (1 - x1 - x2);
  }

  function golden(l, r, Xi, gradX, gradY, epsilon) {
    const fi = (Math.sqrt(5) - 1) / 2;
    let L = r - l;
    let x1 = r - fi * L;
    let x2 = l + fi * L;
    let counterGoldFX = 0;

    let y1 = finalFunction(Xi[0] - x1 * gradX, Xi[1] - x1 * gradY);

    let y2 = finalFunction(Xi[0] - x2 * gradX, Xi[1] - x2 * gradY);
    counterGoldFX += 2;
    while (L >= epsilon) {
      if (y2 < y1) {
        l = x1;
        L = r - l;
        x1 = x2;
        y1 = y2;
        x2 = l + fi * L;
        y2 = finalFunction(Xi[0] - x2 * gradX, Xi[1] - x2 * gradY);
        counterGoldFX++;
      } else {
        r = x2;
        L = r - l;
        x2 = x1;
        y2 = y1;
        x1 = r - fi * L;
        y1 = finalFunction(Xi[0] - x1 * gradX, Xi[1] - x1 * gradY);
        counterGoldFX++;
      }
    }
    let minimalValue = Math.min(y1, y2);
    answer = x1;
    if (minimalValue === y2) {
      answer = x2;
    }
    return [answer, counterGoldFX];
  }

  let X0 = [0, 0];
  let X1 = [1, 1];
  let Xm = [a / 10, b / 10];

  function gradientFunctionByX(x1, x2) {
    return 0.125 * x2 * (2 * x1 + x2 - 1);
  }

  function gradientFunctionByY(x1, x2) {
    return 0.125 * x1 * (x1 + 2 * x2 - 1);
  }

  function gradientDescent(startPoint, gamma, epsilon) {
    let gradientPointsX = [];
    let gradientPointsY = [];
    let gradientDescentFxValues = [];

    let i = 1;
    let Xi = [];
    Xi = startPoint.slice();

    let gradX;
    let gradY;

    let counterGrad = 0;
    let counterFX = 0;
    let counter = 0;

    maxIterations = 100;

    while (i < maxIterations) {
      gradX = gradientFunctionByX(Xi[0], Xi[1]);
      gradY = gradientFunctionByY(Xi[0], Xi[1]);

      counterGrad += 2;
      Xi[0] = Xi[0] - gamma * gradX;
      Xi[1] = Xi[1] - gamma * gradY;
      gradientPointsX.push(Xi[0]);
      gradientPointsY.push(Xi[1]);
      gradientDescentFxValues.push(finalFunction(Xi[0], Xi[1]));
      counterFX++;
      let normGrad = Math.sqrt(gradX ** 2 + gradY ** 2);
      if (normGrad < epsilon) {
        break;
      }

      i++;
      counter++;
    }

    return [gradientPointsX, gradientPointsY, counterFX, counter];
  }

  function steepestDescent(startPoint, epsilon) {
    let steepestDescentX = [];
    let steepestDescentY = [];
    let steepestDescentFxValues = [];

    let i = 1;
    let Xi = [];
    Xi = startPoint.slice();

    let gradX, gradY;

    let counterGrad = 0;
    let counter = 0;
    let counterFX = 0;

    maxIterations = 100;

    while (i < maxIterations) {
      gradX = gradientFunctionByX(Xi[0], Xi[1]);
      gradY = gradientFunctionByY(Xi[0], Xi[1]);

      counterGrad += 2;

      let normGrad = Math.sqrt(gradX ** 2 + gradY ** 2);
      if (normGrad < epsilon) {
        break;
      }
      const [gamma, counterGoldFX] = golden(0, i + 5, Xi, gradX, gradY);
      counterFX += counterGoldFX;
      Xi[0] = Xi[0] - gamma * gradX;
      Xi[1] = Xi[1] - gamma * gradY;
      steepestDescentX.push(Xi[0]);
      steepestDescentY.push(Xi[1]);
      steepestDescentFxValues.push(finalFunction(Xi[0], Xi[1]));
      counterFX++;

      i++;
      counter++;
    }

    return [steepestDescentX, steepestDescentY, counterFX, counter];
  }

  function getModVector(vector) {
    return Math.sqrt(vector.reduce((acc, val) => acc + val ** 2, 0));
  }

  function simplexTriangle(Xi, epsilon, alpha, gamma, beta, μ) {
    let simplex = [[...Xi, finalFunction(Xi[0], Xi[1])]];
    let maxIterations = 100;
    let counterFX = 1;
    let counter = 0;
    let points = [];
    let pointsForNumbers = [Xi];

    for (let i = 0; i < Xi.length; i++) {
      let argList = [...Xi];
      argList[i] -= alpha;
      simplex.push([...argList, finalFunction(argList[0], argList[1])]);
      counterFX++;
    }
    pointsForNumbers.push(simplex[simplex.length - 2].slice(0, 2));

    for (let i = 0; i < maxIterations; i++) {
      pointsForNumbers.push(simplex[simplex.length - 1].slice(0, 2));
      // 1. Sort
      simplex.sort(function (a, b) {
        return a[simplex.length - 1] - b[simplex.length - 1];
      });
      points.push(simplex);

      // 6. Check convergence
      if (
        getModVector([
          simplex[0][0] - simplex[simplex.length - 1][0],
          simplex[0][1] - simplex[simplex.length - 1][1],
        ]) < epsilon
      ) {
        break;
      }

      let centroid = Array(Xi.length).fill(0);
      for (let j = 0; j < Xi.length; j++) {
        for (let k = 0; k < simplex.length - 1; k++) {
          centroid[j] += simplex[k][j];
        }
        centroid[j] /= simplex.length - 1;
      }

      // 2. Reflect
      let reflection = Array(Xi.length).fill(0);
      for (let j = 0; j < Xi.length; j++) {
        reflection[j] =
          centroid[j] + alpha * (centroid[j] - simplex[simplex.length - 1][j]);
      }
      let reflection_value = finalFunction(reflection[0], reflection[1]);
      counterFX++;

      // 3. Evaluate or Extend
      if (
        simplex[0][2] <= reflection_value &&
        reflection_value < simplex[simplex.length - 2][2]
      ) {
        simplex[simplex.length - 1] = [...reflection, reflection_value];
        continue;
      } else if (reflection_value < simplex[0][2]) {
        let extend = Array(Xi.length).fill(0);
        for (let j = 0; j < Xi.length; j++) {
          extend[j] = centroid[j] + gamma * (reflection[j] - centroid[j]);
        }
        let extended_value = finalFunction(extend[0], extend[1]);
        counterFX++;
        if (extended_value < simplex[0][2]) {
          simplex[simplex.length - 1] = [...extend, extended_value];
        } else {
          simplex[simplex.length - 1] = [...reflection, reflection_value];
        }
        continue;
      }

      // 4. Contract
      let contraction = new Array(Xi.length).fill(0);
      for (let j = 0; j < Xi.length; j++) {
        contraction[j] =
          centroid[j] + μ * (simplex[simplex.length - 1][j] - centroid[j]);
      }
      let contraction_value = finalFunction(contraction[0], contraction[1]);
      counterFX++;
      if (contraction_value < simplex[simplex.length - 1][2]) {
        simplex[simplex.length - 1] = [...contraction, contraction_value];
        continue;
      }

      // 5. Reduce
      for (let j = 1; j < simplex.length; j++) {
        let reduce = new Array(Xi.length).fill(0);
        for (let k = 0; k < Xi.length; k++) {
          reduce[k] = simplex[0][k] + beta * (simplex[j][k] - simplex[0][k]);
        }
        let reduceValue = finalFunction(reduce[0], reduce[1]);
        counterFX++;
        simplex[j] = [...reduce, reduceValue];
      }
      pointsForNumbers.push(simplex[simplex.length - 2]);
      counter = points.length;
    }
    const zValue = points[points.length - 1][2][2];
    console.log(`Points for numbers: ${pointsForNumbers[0]}`);
    console.log(`Zvalue: ${zValue}`);

    return [pointsForNumbers, counterFX, counter, zValue];
  }

  function plotDescent(
    points,
    counterFX,
    counter,
    divName,
    plotName,
    infoName
  ) {
    const delta = 0.001;
    const x = [];
    const y = [];
    for (let i = 0; i <= 0.8; i += delta) {
      x.push(i);
    }
    for (let i = 0; i <= 0.7; i += delta) {
      y.push(i);
    }
    const Z = [];
    for (let i = 0; i < y.length; i++) {
      const row = [];
      for (let j = 0; j < x.length; j++) {
        row.push(-0.125 * x[j] * y[i] * (1 - x[j] - y[i]));
      }
      Z.push(row);
    }

    const contours = {
      type: "contour",
      x: x,
      y: y,
      z: Z,
      colorscale: "RdBu",
      autocontour: false,
      line: {
        width: 0.5,
      },
      contours: {
        coloring: "lines",
        start: -0.004,
        end: 0.04,
        size: 0.001,
        showlabels: true,
        labelfont: {
          size: 9,
        },
      },
      colorbar: {
        // ticks: "outside",
      },
    };

    const iterations = [];
    for (let i = 1; i <= counter; i++) {
      iterations.push(i);
    }

    const data = [contours];
    for (let i = 0; i < points.length; i += 2) {
      if (iterations.includes(i / 2)) {
        const marker = {
          size: 10,
          symbol: "circle",
        };
        const text = i / 2 + 1;
        if (i === points.length - 2) {
          marker.symbol = "x";
        }
        data.push({
          x: [points[i]],
          y: [points[i + 1]],
          mode: "markers",
          marker: marker,
          text: text,
          textposition: "top center",
        });
      }
    }
    const layout = {
      title: plotName,
      xaxis: {
        title: "X",
      },
      yaxis: {
        title: "Y",
      },
    };
    Plotly.newPlot(divName, data, layout);

    const zValue = finalFunction(
      points[points.length - 2],
      points[points.length - 1]
    );

    const infoContainer = document.querySelector(`.${infoName}`);
    if (isNaN(zValue)) {
      infoContainer.innerHTML = `x ≈ 0 y ≈ 0,<br />kai f(0,0) ≈ 0
        <br />Tikslo funkcijos iškvietimų skaičius: ${counterFX}<br /> Žingsnių skaičius: ${counter}<br />`;
    } else {
      infoContainer.innerHTML = `x ≈ ${points[points.length - 2].toFixed(
        4
      )} y ≈ ${points[points.length - 1].toFixed(4)},<br />kai f(${points[
        points.length - 2
      ].toFixed(4)},${points[points.length - 1].toFixed(4)}) ≈ ${zValue}
          <br />Tikslo funkcijos iškvietimų skaičius: ${counterFX}<br /> Žingsnių skaičius: ${counter}<br />`;
    }
  }

  function plotSimplex(
    points,
    zValue,
    counterFX,
    counter,
    divName,
    plotName,
    infoName
  ) {
    const delta = 0.001;
    const x = [];
    const y = [];

    const xArray = [];
    const yArray = [];

    for (let i = 0; i < points.length; i++) {
      xArray.push(points[i][0]);
      yArray.push(points[i][1]);
    }

    // Create arrays to store the triangle vertices and colors
    const triangles = [];
    const colors = [];

    // Loop over the pairs of points to form triangles
    for (let i = 0; i < xArray.length - 2; i++) {
      const color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(
        Math.random() * 256
      )}, ${Math.floor(Math.random() * 256)})`; // Generate a different color for each triangle
      colors.push(color);

      // Define the vertices of the triangle
      const vertices = [
        [xArray[i], yArray[i]],
        [xArray[i + 1], yArray[i + 1]],
        [xArray[i + 2], yArray[i + 2]],
      ];
      triangles.push(vertices);
    }

    // Create a trace for each triangle
    const data = triangles.map((vertices, i) => ({
      x: vertices.map((vertex) => vertex[0]),
      y: vertices.map((vertex) => vertex[1]),
      mode: "lines",
      line: {
        color: colors[i],
        width: 3,
      },
      name: `Triangle ${i + 1}`,
      text: `Apex point: ${i + 1}`,
      hoverinfo: "text",
    }));

    // Add a trace for the original points
    data.push({
      x: xArray,
      y: yArray,
      mode: "markers+text",
      type: "scatter",
      marker: {
        size: 5,
        symbol: "circle",
        color: "rgb(255, 0, 0)",
        opacity: 1,
      },
      name: "Points",
      text: [...Array(xArray.length).keys()].map((i) => `${i + 1}`),
      textposition: "bottom", // Add the labels to the "text" property
    });

    const layout = {
      title: plotName,
      hovermode: "false",
    };

    counter = xArray.length;
    const infoContainer = document.querySelector(`.${infoName}`);
    Plotly.newPlot(divName, data, layout);
    infoContainer.innerHTML = `x ≈ ${xArray[xArray.length - 1].toFixed(
      4
    )} y ≈ ${yArray[yArray.length - 1].toFixed(4)},<br />kai f(${xArray[
      xArray.length - 1
    ].toFixed(4)},${yArray[yArray.length - 1].toFixed(4)}) ≈ ${zValue}
      <br />Tikslo funkcijos iškvietimų skaičius: ${counterFX}<br /> Žingsnių skaičius: ${counter}<br />`;
  }

  function createZArray(x, y) {
    const z = [];
    for (let i = 0; i < x.length; i++) {
      z.push(x[i]);
      z.push(y[i]);
    }
    return z;
  }

  function useGradientDescent(X, gamma, epsilon, divName, plotName, infoName) {
    const [gradientPointsX, gradientPointsY, counterFX, counter] =
      gradientDescent(X, gamma, epsilon);
    combinedArray = createZArray(gradientPointsX, gradientPointsY);
    plotDescent(combinedArray, counterFX, counter, divName, plotName, infoName);
  }

  function useSteepestDescent(X, epsilon, divName, plotName, infoName) {
    const [gradientPointsX, gradientPointsY, counterFX, counter] =
      steepestDescent(X, epsilon);

    combinedArray = createZArray(gradientPointsX, gradientPointsY);
    plotDescent(combinedArray, counterFX, counter, divName, plotName, infoName);
  }

  function useSimplex(
    X,
    epsilon,
    alpha,
    gamma,
    beta,
    μ,
    divName,
    plotName,
    infoName
  ) {
    const [pointsForNumbers, counterFX, counter, zValue] = simplexTriangle(
      X,
      epsilon,
      alpha,
      gamma,
      beta,
      μ
    );
    plotSimplex(
      pointsForNumbers,
      zValue,
      counterFX,
      counter,
      divName,
      plotName,
      infoName
    );
  }

  useGradientDescent(
    X0,
    3,
    0.001,
    "graph1",
    "Gradient descent X0(0,0)",
    "info1"
  );

  useGradientDescent(
    X1,
    3,
    0.001,
    "graph2",
    "Gradient descent X1(1,1)",
    "info2"
  );

  useGradientDescent(
    Xm,
    3,
    0.001,
    "graph3",
    `Gradient descent Xm(${Xm[0]},${Xm[1]})`,
    "info3"
  );

  useSteepestDescent(X0, 0.001, "graph4", "Steepest descent X0(0,0)", "info4");

  useSteepestDescent(X1, 0.001, "graph5", "Steepest descent X1(1,1)", "info5");

  useSteepestDescent(
    Xm,
    0.001,
    "graph6",
    `Steepest descent Xm(${Xm[0]},${Xm[1]})`,
    "info6"
  );

  useSimplex(
    X0,
    0.001,
    0.5,
    4,
    0.5,
    -0.5,
    "graph7",
    "Simplex method X0(0,0)",
    "info7"
  );

  useSimplex(
    X1,
    0.001,
    0.5,
    4,
    0.5,
    -0.5,
    "graph8",
    "Simplex method X1(1,1)",
    "info8"
  );

  useSimplex(
    Xm,
    0.001,
    0.5,
    4,
    0.5,
    -0.5,
    "graph9",
    `Simplex method Xm(${Xm[0]},${Xm[1]})`,
    "info9"
  );
}
