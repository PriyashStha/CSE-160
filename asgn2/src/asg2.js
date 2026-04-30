let canvas, gl;
let a_Position;
let u_ModelMatrix, u_GlobalRotation, u_Color;

// ===== GLOBAL STATE =====
let gAnimalGlobalRotation = 0;
let gThighAngle = 0;
let gCalfAngle = 0;
let gFootAngle = 0;
let gTailAngle = 0;

let gAnimate = false;
let g_seconds = 0;

let gMouseX = 0;
let gPoke = false;

// FPS
let g_lastFrameTime = performance.now();

// Performance: reuse cube
let gCube = null;

// ===== MAIN =====
function main() {
  canvas = document.getElementById('webgl');
  gl = canvas.getContext('webgl');
  if (!gl) return;

  initShaders();
  gl.enable(gl.DEPTH_TEST);

  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  u_GlobalRotation = gl.getUniformLocation(gl.program, 'u_GlobalRotation');
  u_Color = gl.getUniformLocation(gl.program, 'u_Color');

  setupUI();

  canvas.onmousemove = function(ev) {
    if (ev.buttons === 1) {
      gMouseX = ev.clientX;
      gAnimalGlobalRotation = gMouseX / 2;
    }
  };

  canvas.onmousedown = function(ev) {
    if (ev.shiftKey) {
      gPoke = true;
      setTimeout(() => gPoke = false, 500);
    }
  };

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
  document.getElementById("rotSlider").oninput = e => gAnimalGlobalRotation = e.target.value;
  document.getElementById("thighSlider").oninput = e => gThighAngle = e.target.value;
  document.getElementById("calfSlider").oninput = e => gCalfAngle = e.target.value;
  document.getElementById("footSlider").oninput = e => gFootAngle = e.target.value;
  document.getElementById("tailSlider").oninput = e => gTailAngle = e.target.value;
}

function toggleAnimation() {
  gAnimate = !gAnimate;
}

// ===== ANIMATION =====
function updateAnimationAngles() {
  if (gAnimate) {
    gThighAngle = 30 * Math.sin(g_seconds);
    gCalfAngle = 30 * Math.sin(g_seconds + 1);
    gFootAngle = 20 * Math.sin(g_seconds + 2);
    gTailAngle = 45 * Math.sin(g_seconds * 2);
  }

  if (gPoke) {
    gThighAngle = 60;
    gCalfAngle = -60;
    gFootAngle = 30;
  }
}

// ===== LOOP =====
function tick() {
  g_seconds = performance.now() / 1000.0;

  let now = performance.now();
  let fps = 1000 / (now - g_lastFrameTime);
  g_lastFrameTime = now;
  document.getElementById("fps").innerText = fps.toFixed(1);

  updateAnimationAngles();
  renderScene();

  requestAnimationFrame(tick);
}

// ===== HELPER =====
function renderCube(matrix, color) {
  if (!gCube) gCube = new Cube();
  gCube.matrix = matrix;
  gCube.color = color;
  gCube.render();
}

// ===== SCENE =====
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
  head.translate(0.75, 0.3, 0);

  let headBase = new Matrix4(head);

  let headVisual = new Matrix4(head);
  headVisual.scale(0.5, 0.8, 0.5);
  renderCube(headVisual, [0.7, 0.7, 0.7, 1]);

  // ===== EYES =====
  let leftEye = new Matrix4(headBase);
  leftEye.translate(0.25, 0.25, 0.35);
  leftEye.scale(0.1, 0.1, 0.1);
  renderCube(leftEye, [0, 0, 0, 1]);

  let rightEye = new Matrix4(headBase);
  rightEye.translate(0.25, 0.25, -0.35);
  rightEye.scale(0.1, 0.1, 0.1);
  renderCube(rightEye, [0, 0, 0, 1]);

  // ===== NOSE =====
  let nose = new Matrix4(headBase);
  nose.translate(0.28, 0.15, 0);
  nose.scale(0.08, 0.08, 0.12);
  renderCube(nose, [0.2, 0.2, 0.2, 1]);

  // ===== FRONT LEG =====
  let thigh = new Matrix4();
  thigh.translate(0.3, -0.3, 0.2);
  thigh.rotate(gThighAngle, 0, 0, 1);

  let thighSave = new Matrix4(thigh);
  let thighModel = new Matrix4(thigh);
  thighModel.scale(0.1, 0.3, 0.1);
  renderCube(thighModel, [0.8, 0.5, 0.5, 1]);

  let calf = new Matrix4(thighSave);
  calf.translate(0, -0.3, 0);
  calf.rotate(gCalfAngle, 0, 0, 1);

  let calfSave = new Matrix4(calf);
  let calfModel = new Matrix4(calf);
  calfModel.scale(0.1, 0.3, 0.1);
  renderCube(calfModel, [0.8, 0.5, 0.5, 1]);

  let foot = new Matrix4(calfSave);
  foot.translate(0, -0.2, 0);
  foot.rotate(gFootAngle, 0, 0, 1);
  foot.scale(0.15, 0.05, 0.2);
  renderCube(foot, [0.9, 0.4, 0.4, 1]);

  // ===== BACK LEG =====
  let thigh2 = new Matrix4();
  thigh2.translate(-0.3, -0.3, 0.2);
  thigh2.rotate(gThighAngle, 0, 0, 1);

  let t2Save = new Matrix4(thigh2);
  let thigh2Model = new Matrix4(thigh2);
  thigh2Model.scale(0.1, 0.3, 0.1);
  renderCube(thigh2Model, [0.8, 0.5, 0.5, 1]);

  let calf2 = new Matrix4(t2Save);
  calf2.translate(0, -0.3, 0);
  calf2.rotate(gCalfAngle, 0, 0, 1);

  let c2Save = new Matrix4(calf2);
  let calf2Model = new Matrix4(calf2);
  calf2Model.scale(0.1, 0.3, 0.1);
  renderCube(calf2Model, [0.8, 0.5, 0.5, 1]);

  let foot2 = new Matrix4(c2Save);
  foot2.translate(0, -0.2, 0);
  foot2.rotate(gFootAngle, 0, 0, 1);
  foot2.scale(0.15, 0.05, 0.2);
  renderCube(foot2, [0.9, 0.4, 0.4, 1]);

  // ===== FRONT RIGHT LEG =====
  let thighR = new Matrix4();
  thighR.translate(0.3, -0.3, -0.2);   // mirrored Z side
  thighR.rotate(gThighAngle, 0, 0, 1);

  let thighRSave = new Matrix4(thighR);
  let thighRModel = new Matrix4(thighR);
  thighRModel.scale(0.1, 0.3, 0.1);
  renderCube(thighRModel, [0.8, 0.5, 0.5, 1]);

  let calfR = new Matrix4(thighRSave);
  calfR.translate(0, -0.3, 0);
  calfR.rotate(gCalfAngle, 0, 0, 1);

  let calfRSave = new Matrix4(calfR);
  let calfRModel = new Matrix4(calfR);
  calfRModel.scale(0.1, 0.3, 0.1);
  renderCube(calfRModel, [0.8, 0.5, 0.5, 1]);

  let footR = new Matrix4(calfRSave);
  footR.translate(0, -0.2, 0);
  footR.rotate(gFootAngle, 0, 0, 1);
  footR.scale(0.15, 0.05, 0.2);
  renderCube(footR, [0.9, 0.4, 0.4, 1]);

    // ===== BACK RIGHT LEG =====
  let thighR2 = new Matrix4();
  thighR2.translate(-0.3, -0.3, -0.2);
  thighR2.rotate(gThighAngle, 0, 0, 1);

  let thighR2Save = new Matrix4(thighR2);
  let thighR2Model = new Matrix4(thighR2);
  thighR2Model.scale(0.1, 0.3, 0.1);
  renderCube(thighR2Model, [0.8, 0.5, 0.5, 1]);

  let calfR2 = new Matrix4(thighR2Save);
  calfR2.translate(0, -0.3, 0);
  calfR2.rotate(gCalfAngle, 0, 0, 1);

  let calfR2Save = new Matrix4(calfR2);
  let calfR2Model = new Matrix4(calfR2);
  calfR2Model.scale(0.1, 0.3, 0.1);
  renderCube(calfR2Model, [0.8, 0.5, 0.5, 1]);

  let footR2 = new Matrix4(calfR2Save);
  footR2.translate(0, -0.2, 0);
  footR2.rotate(gFootAngle, 0, 0, 1);
  footR2.scale(0.15, 0.05, 0.2);
  renderCube(footR2, [0.9, 0.4, 0.4, 1]);

  // ===== TAIL =====
  let tail1 = new Matrix4();
  tail1.translate(-0.45, 0, 0);
  tail1.rotate(gTailAngle, 0, 0, 1);

  let t1Save = new Matrix4(tail1);
  let tailModel = new Matrix4(tail1);
  tailModel.scale(0.3, 0.05, 0.05);
  renderCube(tailModel, [0.5, 0.3, 0.3, 1]);

  let tail2 = new Matrix4(t1Save);
  tail2.translate(-0.3, 0, 0);
  tail2.rotate(gTailAngle * 0.5, 0, 0, 1);
  tail2.scale(0.3, 0.05, 0.05);
  renderCube(tail2, [0.5, 0.3, 0.3, 1]);
}