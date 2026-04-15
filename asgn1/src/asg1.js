let canvas, gl;
let shapesList = [];

let currentShape = 'point';
let currentColor = [1, 0, 0];
let currentSize = 10;
let currentSegments = 10;

// ======================
// Setup WebGL
// ======================
function setupWebGL() {
  canvas = document.getElementById('webgl');
  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });

  if (!gl) {
    console.log("WebGL not supported");
  }
}

// ======================
// Connect GLSL
// ======================
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

// ======================
// Main
// ======================
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

// ======================
// Handle Click
// ======================
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

// ======================
// Render Everything
// ======================
function renderAllShapes() {
  gl.clear(gl.COLOR_BUFFER_BIT);

  for (let i = 0; i < shapesList.length; i++) {
    shapesList[i].render();
  }
}

// ======================
// UI Functions
// ======================
function setShape(type) {
  currentShape = type;
}

function clearCanvas() {
  shapesList = [];
  renderAllShapes();
}

// ======================
// Start Program
// ======================
main();