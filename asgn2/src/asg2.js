let canvas, gl;
let a_Position;
let u_ModelMatrix, u_GlobalRotation, u_Color;

// ===== GLOBAL STATE =====
let gAnimalGlobalRotation = 0;
let gThighAngle = 0;
let gCalfAngle = 0;
let gTailAngle = 0;

let gAnimate = false;
let g_seconds = 0;

// ===== MAIN =====
function main() {
  canvas = document.getElementById('webgl');
  gl = canvas.getContext('webgl');

  if (!gl) {
    console.log('WebGL not supported');
    return;
  }

  initShaders();
  gl.enable(gl.DEPTH_TEST);

  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  u_GlobalRotation = gl.getUniformLocation(gl.program, 'u_GlobalRotation');
  u_Color = gl.getUniformLocation(gl.program, 'u_Color');

  setupUI();

  requestAnimationFrame(tick);
}

// ===== SHADERS =====
const VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotation;
  void main() {
    gl_Position = u_GlobalRotation * u_ModelMatrix * a_Position;
  }
`;

const FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_Color;
  void main() {
    gl_FragColor = u_Color;
  }
`;

function initShaders() {
  let vs = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vs, VSHADER_SOURCE);
  gl.compileShader(vs);

  let fs = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fs, FSHADER_SOURCE);
  gl.compileShader(fs);

  let program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);

  gl.useProgram(program);
  gl.program = program;
}

// ===== UI =====
function setupUI() {
  document.getElementById("rotSlider").oninput = (e) => {
    gAnimalGlobalRotation = e.target.value;
  };

  document.getElementById("thighSlider").oninput = (e) => {
    gThighAngle = e.target.value;
  };

  document.getElementById("calfSlider").oninput = (e) => {
    gCalfAngle = e.target.value;
  };

  document.getElementById("tailSlider").oninput = (e) => {
    gTailAngle = e.target.value;
  };
}

function toggleAnimation() {
  gAnimate = !gAnimate;
}

// ===== ANIMATION =====
function updateAnimationAngles() {
  if (gAnimate) {
    gThighAngle = 30 * Math.sin(g_seconds);
    gCalfAngle = 30 * Math.sin(g_seconds + 1);
    gTailAngle = 45 * Math.sin(g_seconds);
  }
}

// ===== LOOP =====
function tick() {
  g_seconds = performance.now() / 1000.0;

  updateAnimationAngles();
  renderScene();

  requestAnimationFrame(tick);
}

// ===== HELPER =====
function renderCube(matrix, color) {
  let cube = new Cube();
  cube.color = color;
  cube.matrix = matrix;
  cube.render();
}

// ===== RENDER SCENE =====
function renderScene() {
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  let globalRot = new Matrix4();
  globalRot.rotate(gAnimalGlobalRotation, 0, 1, 0);
  gl.uniformMatrix4fv(u_GlobalRotation, false, globalRot.elements);

  // ===== BODY =====
  let body = new Matrix4();
  body.scale(0.6, 0.3, 0.3);
  renderCube(body, [0.6, 0.6, 0.6, 1]);

  // ===== HEAD =====
  let head = new Matrix4(body);
  head.translate(1.2, 0.3, 0);
  head.scale(0.5, 0.5, 0.5);
  renderCube(head, [0.7, 0.7, 0.7, 1]);

  // ===== FRONT LEG (CHAIN) =====
  let thigh = new Matrix4();
  thigh.translate(0.3, -0.3, 0.2);
  thigh.rotate(gThighAngle, 1, 0, 0);

  let thighSave = new Matrix4(thigh);
  thigh.scale(0.1, 0.3, 0.1);
  renderCube(thigh, [0.8, 0.5, 0.5, 1]);

  // calf
  let calf = new Matrix4(thighSave);
  calf.translate(0, -0.3, 0);
  calf.rotate(gCalfAngle, 1, 0, 0);

  let calfSave = new Matrix4(calf);
  calf.scale(0.1, 0.3, 0.1);
  renderCube(calf, [0.8, 0.5, 0.5, 1]);

  // foot (3rd level)
  let foot = new Matrix4(calfSave);
  foot.translate(0, -0.3, 0);
  foot.scale(0.15, 0.05, 0.2);
  renderCube(foot, [0.9, 0.4, 0.4, 1]);

  // ===== TAIL =====
  let tail1 = new Matrix4();
  tail1.translate(-0.5, 0, 0);
  tail1.rotate(gTailAngle, 0, 0, 1);

  let t1Save = new Matrix4(tail1);
  tail1.scale(0.3, 0.05, 0.05);
  renderCube(tail1, [0.5, 0.3, 0.3, 1]);

  let tail2 = new Matrix4(t1Save);
  tail2.translate(-0.3, 0, 0);
  tail2.rotate(gTailAngle * 0.5, 0, 0, 1);
  tail2.scale(0.3, 0.05, 0.05);
  renderCube(tail2, [0.5, 0.3, 0.3, 1]);

  /*
  ============================
  STEP 11+ GUIDE
  ============================

  ADD MORE LEGS:
  - Duplicate front leg code
  - Change translate() position
  - Add phase offset in animation

  COLOR:
  - You already pass color per cube
  - Improve by making variables per body part

  THIRD JOINT:
  - Already done (foot)
  - Could add toes or jaw

  NON-CUBE:
  - Create new class like Sphere or Cylinder
  - Similar to Cube.js buffer logic

  MOUSE ROTATION:
  - Track mouse X/Y
  - Update gAnimalGlobalRotation dynamically

  POKE ANIMATION:
  - Detect shift-click
  - Temporarily override angles

  PERFORMANCE:
  - Reuse Cube objects instead of creating new each frame
  - Move static objects outside render loop
  */
}