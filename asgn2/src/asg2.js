let canvas, gl;
let a_Position;
let u_ModelMatrix, u_GlobalRotation, u_Color;

// ================= STATE =================
let gAnimalGlobalRotation = 0;

let gThighAngle = 0;
let gCalfAngle = 0;
let gFootAngle = 0;
let gTailAngle = 0;

let gAnimate = false;
let gPoke = false;
let g_seconds = 0;

let g_lastFrameTime = performance.now();
let gCube = null;

// ================= MAIN =================
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

  canvas.onmousemove = function (ev) {
    if (ev.buttons === 1) {
      gAnimalGlobalRotation = (ev.clientX / canvas.width) * 360;
    }
  };

  canvas.onmousedown = function (ev) {
    if (ev.shiftKey) {
      gPoke = true;
      setTimeout(() => gPoke = false, 400);
    }
  };

  requestAnimationFrame(tick);
}

// ================= SHADERS =================
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

// ================= UI =================
function setupUI() {
  document.getElementById("rotSlider").oninput = e =>
    gAnimalGlobalRotation = e.target.value;

  document.getElementById("thighSlider").oninput = e =>
    gThighAngle = e.target.value;

  document.getElementById("calfSlider").oninput = e =>
    gCalfAngle = e.target.value;

  document.getElementById("footSlider").oninput = e =>
    gFootAngle = e.target.value;

  document.getElementById("tailSlider").oninput = e =>
    gTailAngle = e.target.value;
}

function toggleAnimation() {
  gAnimate = !gAnimate;
}

// ================= ANIMATION =================
function updateAnimation() {
  if (!gAnimate) return;

  gThighAngle = 30 * Math.sin(g_seconds);
  gCalfAngle = 25 * Math.sin(g_seconds + 0.5);
  gFootAngle = 20 * Math.sin(g_seconds + 1);

  gTailAngle = 40 * Math.sin(g_seconds * 2);

  if (gPoke) {
    gThighAngle = 70;
    gCalfAngle = -60;
    gFootAngle = 40;
  }
}

// ================= LOOP =================
function tick() {
  g_seconds = performance.now() / 1000;

  let now = performance.now();
  let fps = 1000 / (now - g_lastFrameTime);
  g_lastFrameTime = now;

  document.getElementById("fps").innerText = fps.toFixed(1);

  updateAnimation();
  renderScene();

  requestAnimationFrame(tick);
}

// ================= DRAW =================
function drawCube(M, color) {
  if (!gCube) gCube = new Cube();
  gCube.matrix = M;
  gCube.color = color;
  gCube.render();
}

// ================= LEG (FIXED AXIS) =================
function leg(base, x, z, phase) {

  let hipY = -0.40;

  // ===== THIGH =====
  let thigh = new Matrix4(base);
  thigh.translate(x, hipY, z);

  // 🔥 FIX: Z-axis swing (forward/back walking motion)
  thigh.rotate(gThighAngle * phase, 0, 0, 1);

  let thighSave = new Matrix4(thigh);

  let thighModel = new Matrix4(thigh);
  thighModel.scale(0.12, 0.50, 0.12);
  drawCube(thighModel, [0.8, 0.5, 0.5, 1]);

  // ===== CALF =====
  let calf = new Matrix4(thighSave);
  calf.translate(0, -0.50, 0);

  calf.rotate(gCalfAngle * phase, 0, 0, 1); // 🔥 FIXED

  let calfSave = new Matrix4(calf);

  let calfModel = new Matrix4(calf);
  calfModel.scale(0.10, 0.35, 0.10);
  drawCube(calfModel, [0.9, 0.6, 0.6, 1]);

  // ===== FOOT =====
  let foot = new Matrix4(calfSave);
  foot.translate(0, -0.35, 0);

  foot.rotate(gFootAngle * phase, 0, 0, 1); // 🔥 FIXED

  let footModel = new Matrix4(foot);
  footModel.scale(0.18, 0.06, 0.25);
  drawCube(footModel, [0.95, 0.4, 0.4, 1]);
}

// ================= SCENE =================
function renderScene() {
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  let globalRot = new Matrix4();
  globalRot.rotate(gAnimalGlobalRotation, 0, 1, 0);
  gl.uniformMatrix4fv(u_GlobalRotation, false, globalRot.elements);

  // BODY
  let body = new Matrix4();
  body.scale(0.6, 0.3, 0.3);
  drawCube(body, [0.6, 0.6, 0.6, 1]);

  // HEAD
  let head = new Matrix4(body);
  head.translate(0.75, 0.3, 0);

  let headBase = new Matrix4(head);

  let headVisual = new Matrix4(head);
  headVisual.scale(0.5, 0.8, 0.5);
  drawCube(headVisual, [0.7, 0.7, 0.7, 1]);

  // EYES
  let eyeL = new Matrix4(headBase);
  eyeL.translate(0.25, 0.25, 0.3);
  eyeL.scale(0.08, 0.08, 0.08);
  drawCube(eyeL, [0, 0, 0, 1]);

  let eyeR = new Matrix4(headBase);
  eyeR.translate(0.25, 0.25, -0.3);
  eyeR.scale(0.08, 0.08, 0.08);
  drawCube(eyeR, [0, 0, 0, 1]);

  // NOSE
  let nose = new Cone();
  nose.color = [0.85, 0.6, 0.6, 1]

  let noseM = new Matrix4(headBase);
  noseM.translate(0.28, 0.15, 0);
  noseM.scale(0.08, 0.08, 0.12);

  nose.render(noseM);

  // Ears
  let leftEar = new Matrix4(headBase);
  leftEar.translate(0.15, 0.50, 0.25);
  leftEar.scale(0.12, 0.18, 0.05);
  drawCube(leftEar, [0.85, 0.6, 0.6, 1]);

  let rightEar = new Matrix4(headBase);
  rightEar.translate(0.15, 0.50, -0.25);
  rightEar.scale(0.12, 0.18, 0.05);
  drawCube(rightEar, [0.85, 0.6, 0.6, 1]);
  

  // LEGS (ALL FIXED MOTION)
  leg(body, 0.3, 0.2, 1);
  leg(body, 0.3, -0.2, -1);
  leg(body, -0.3, 0.2, -1);
  leg(body, -0.3, -0.2, 1);

  // TAIL
  let tail = new Matrix4();
  tail.translate(-0.45, 0, 0);
  tail.rotate(gTailAngle, 0, 0, 1);

  let tailSave = new Matrix4(tail);

  let t1 = new Matrix4(tail);
  t1.scale(0.3, 0.05, 0.05);
  drawCube(t1, [0.5, 0.3, 0.3, 1]);

  let t2 = new Matrix4(tailSave);
  t2.translate(-0.3, 0, 0);
  t2.rotate(gTailAngle * 0.5, 0, 0, 1);
  t2.scale(0.3, 0.05, 0.05);
  drawCube(t2, [0.5, 0.3, 0.3, 1]);
}