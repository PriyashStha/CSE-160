let canvas, gl;
let shapesList = [];

let currentShape = 'point';
let currentColor = [1, 0, 0];
let currentSize = 10;
let currentSegments = 10;


// Setup WebGL
function setupWebGL() {
  canvas = document.getElementById('webgl');
  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });

  if (!gl) {
    console.log("WebGL not supported");
  }
}


// Connect GLSL
function connectVariablesToGLSL() {
  const VSHADER_SOURCE = `
    attribute vec4 a_Position;
    uniform float u_Size;
    void main() {
      gl_Position = a_Position;
      gl_PointSize = u_Size;
    }`;

  const FSHADER_SOURCE = `
    precision mediump float;
    uniform vec4 u_FragColor;
    void main() {
      gl_FragColor = u_FragColor;
    }`;

  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log("Shader initialization failed");
    return;
  }

  gl.a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  gl.u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  gl.u_Size = gl.getUniformLocation(gl.program, 'u_Size');
}


// Main
function main() {
  setupWebGL();
  connectVariablesToGLSL();

  // VERY IMPORTANT
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  canvas.onmousedown = click;
  canvas.onmousemove = function(ev) {
    if (ev.buttons == 1) click(ev);
  };

  renderAllShapes();
}


// Handle Click
function click(ev) {
  let rect = ev.target.getBoundingClientRect();

  let x = ((ev.clientX - rect.left) - canvas.width / 2) / (canvas.width / 2);
  let y = (canvas.height / 2 - (ev.clientY - rect.top)) / (canvas.height / 2);

  // Convert to numbers
  currentColor = [
    parseFloat(document.getElementById("red").value),
    parseFloat(document.getElementById("green").value),
    parseFloat(document.getElementById("blue").value)
  ];

  currentSize = parseFloat(document.getElementById("size").value);
  currentSegments = parseInt(document.getElementById("segments").value);

  let shape;

  if (currentShape === 'point') {
    shape = new Point();
  } else if (currentShape === 'triangle') {
    shape = new Triangle();
  } else {
    shape = new Circle();
  }

  shape.position = [x, y];
  shape.color = currentColor;
  shape.size = currentSize;
  shape.segments = currentSegments;

  shapesList.push(shape);

  renderAllShapes();
}


// Render Everything
function renderAllShapes() {
  gl.clear(gl.COLOR_BUFFER_BIT);

  for (let i = 0; i < shapesList.length; i++) {
    shapesList[i].render();
  }
}


// UI Functions
function setShape(type) {
  currentShape = type;
}

function clearCanvas() {
  shapesList = [];
  renderAllShapes();
}



// Drawing
function drawMyPicture() {
  shapesList = [];

  // Moon
  let moon = new Circle();
  moon.position = [0.6, 0.6];      // top-right sky
  moon.color = [0.9, 0.9, 0.95];   // soft white-blue (moon color)
  moon.size = 60;                  // same size as sun
  moon.segments = 30;              // smooth circle
  shapesList.push(moon);
  

  // Letter P
  let pTop = new Triangle();
  pTop.position = [0.50, 0.66];
  pTop.size = 10;
  pTop.color = [0, 0, 0];
  pTop.rotation = Math.PI / 6;
  shapesList.push(pTop);

  // ➕ All P circles (including first + second + bottom)
  for (let i = 0; i < 5; i++) {
    let pCircle = new Circle();
    pCircle.position = [0.50, 0.63 - i * 0.03]; // 0.63, 0.60, 0.57, 0.54, 0.51
    pCircle.size = 4;
    pCircle.color = [0, 0, 0];
    pCircle.segments = 20;
    shapesList.push(pCircle);
  }


  // Letter S 
  let sPositions = [
  // Top curve (right to left)
  [0.72, 0.66],
  [0.68, 0.68],
  [0.64, 0.68],
  [0.62, 0.66],

  // Middle transition (curving down)
  [0.64, 0.63],
  [0.68, 0.61],
  [0.70, 0.58],

  // Bottom curve (left to right)
  [0.68, 0.55],
  [0.64, 0.53],
  [0.60, 0.53]
  ];

  for (let i = 0; i < sPositions.length; i++) {
    let sTri = new Triangle();
    sTri.position = sPositions[i];
    sTri.size = 5;
    sTri.color = [0, 0, 0];

    sTri.rotation = (i % 2 === 0) ? 0 : Math.PI / 6;

    shapesList.push(sTri);
  }



   //  Stars
  let starPositions = [
    [-0.8, 0.8],
    [-0.5, 0.7],
    [-0.2, 0.85],
    [0.1, 0.75],
  ];

  for (let i = 0; i < starPositions.length; i++) {
    let x = starPositions[i][0];
    let y = starPositions[i][1];

    // main star body
    for (let j = 0; j < 4; j++) {
      let starArm = new Triangle();
      starArm.position = [x, y];
      starArm.size = 6;
      starArm.color = [1.0, 1.0, 0.85];
      starArm.rotation = (Math.PI / 2) * j + (i * 0.2);
      shapesList.push(starArm);
    }

    // diagonal sparkle
    let sparkle1 = new Triangle();
    sparkle1.position = [x, y];
    sparkle1.size = 6;
    sparkle1.color = [1.0, 1.0, 1.0];
    sparkle1.rotation = Math.PI / 4;
    shapesList.push(sparkle1);

    let sparkle2 = new Triangle();
    sparkle2.position = [x, y];
    sparkle2.size = 6;
    sparkle2.color = [1.0, 1.0, 1.0];
    sparkle2.rotation = -Math.PI / 4;
    shapesList.push(sparkle2);
  }


  // Trees
  let treeXPositions = [-0.75, -0.45, -0.15, 0.15, 0.45];
  let treeYOffset = -0.10;

  for (let i = 0; i < treeXPositions.length; i++) {
    let x = treeXPositions[i];

    // trunk
    let trunk = new Triangle();
    trunk.position = [x, -0.25 + treeYOffset];
    trunk.color = [0.55, 0.27, 0.07];
    trunk.size = 30;
    shapesList.push(trunk);

    // 🍃 leaves (also moved down consistently)
    let leafOffsets = [
      [0.0, 0.13],
      [-0.03, 0.17],
      [0.03, 0.17]
    ];

    for (let j = 0; j < leafOffsets.length; j++) {
      let leaf = new Triangle();

      leaf.position = [
        x + leafOffsets[j][0],
        (-0.25 + treeYOffset) + leafOffsets[j][1]
      ];

      leaf.color = [0.1, 0.7, 0.2];
      if (j === 1) leaf.color = [0.1, 0.6, 0.2];
      if (j === 2) leaf.color = [0.0, 0.8, 0.3];

      leaf.size = 40;
      shapesList.push(leaf);
    }
  }
  
  // =========================
  // RENDER EVERYTHING
  // =========================
  renderAllShapes();
}

// ======================
// Start Program
// ======================
main();