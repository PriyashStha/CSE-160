// ========================= main.js =========================

let canvas, gl;
let a_Position;
let u_ModelMatrix, u_GlobalRotation, u_Color;

let gAnimalGlobalRotation = 0;
let gThighAngle = 0;
let gCalfAngle = 0;
let gTailAngle = 0;
let g_animationOn = false;
let g_time = 0;

let cubeBuffer;


function main() {
  canvas = document.getElementById('webgl');
  gl = getWebGLContext(canvas);
  initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);

  gl.enable(gl.DEPTH_TEST);

  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  u_GlobalRotation = gl.getUniformLocation(gl.program, 'u_GlobalRotation');
  u_Color = gl.getUniformLocation(gl.program, 'u_Color');

  setupBuffers();
  setupUI();
  tick();
}

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

function setupBuffers() {
  const v = [
    // FRONT
    -0.5,-0.5,0.5, 0.5,-0.5,0.5, 0.5,0.5,0.5,
    -0.5,-0.5,0.5, 0.5,0.5,0.5, -0.5,0.5,0.5,
    // BACK
    -0.5,-0.5,-0.5, -0.5,0.5,-0.5, 0.5,0.5,-0.5,
    -0.5,-0.5,-0.5, 0.5,0.5,-0.5, 0.5,-0.5,-0.5,
    // LEFT
    -0.5,-0.5,-0.5, -0.5,-0.5,0.5, -0.5,0.5,0.5,
    -0.5,-0.5,-0.5, -0.5,0.5,0.5, -0.5,0.5,-0.5,
    // RIGHT
    0.5,-0.5,-0.5, 0.5,0.5,-0.5, 0.5,0.5,0.5,
    0.5,-0.5,-0.5, 0.5,0.5,0.5, 0.5,-0.5,0.5,
    // TOP
    -0.5,0.5,-0.5, -0.5,0.5,0.5, 0.5,0.5,0.5,
    -0.5,0.5,-0.5, 0.5,0.5,0.5, 0.5,0.5,-0.5,
    // BOTTOM
    -0.5,-0.5,-0.5, 0.5,-0.5,-0.5, 0.5,-0.5,0.5,
    -0.5,-0.5,-0.5, 0.5,-0.5,0.5, -0.5,-0.5,0.5
  ];

  cubeBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(v), gl.STATIC_DRAW);
}

function setupUI() {
  document.getElementById('rotSlider').oninput = e => gAnimalGlobalRotation = e.target.value;
  document.getElementById('thighSlider').oninput = e => gThighAngle = e.target.value;
  document.getElementById('calfSlider').oninput = e => gCalfAngle = e.target.value;
  document.getElementById('tailSlider').oninput = e => gTailAngle = e.target.value;

  canvas.onmousemove = e => {
    if (e.buttons == 1) {
      gAnimalGlobalRotation = e.clientX;
    }
  };

  canvas.onclick = e => {
    if (e.shiftKey) {
      gTailAngle = 30; // poke animation
    }
  };
}

function drawCube(M, color) {
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeBuffer);
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);

  gl.uniformMatrix4fv(u_ModelMatrix, false, M.elements);
  gl.uniform4fv(u_Color, color);

  gl.drawArrays(gl.TRIANGLES, 0, 36);
}

function renderScene() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  let globalRot = new Matrix4();
  globalRot.rotate(gAnimalGlobalRotation, 0,1,0);
  gl.uniformMatrix4fv(u_GlobalRotation, false, globalRot.elements);

  // BODY
  let body = new Matrix4();
  body.scale(1.5,0.5,0.5);
  drawCube(body, [0.6,0.6,0.6,1]);

  // HEAD
  let head = new Matrix4(body);
  head.translate(0.8,0.6,0);
  head.scale(0.4,0.4,0.4);
  drawCube(head, [0.7,0.7,0.7,1]);

  // FRONT LEG CHAIN (3 levels)
  let thigh = new Matrix4(body);
  thigh.translate(0.5,-1,0.3);
  thigh.rotate(gThighAngle,1,0,0);
  thigh.scale(0.2,0.5,0.2);
  drawCube(thigh,[0.3,0.3,1,1]);

  let calf = new Matrix4(thigh);
  calf.translate(0,-1,0);
  calf.rotate(gCalfAngle,1,0,0);
  calf.scale(0.8,0.8,0.8);
  drawCube(calf,[1,0.3,0.3,1]);

  let foot = new Matrix4(calf);
  foot.translate(0,-1,0);
  foot.scale(1.2,0.3,1.2);
  drawCube(foot,[0.2,0.2,0.2,1]);

  // TAIL (chain)
  let tail1 = new Matrix4(body);
  tail1.translate(-1,0,0);
  tail1.rotate(gTailAngle,0,0,1);
  tail1.scale(0.6,0.1,0.1);
  drawCube(tail1,[1,0.5,0.5,1]);

  let tail2 = new Matrix4(tail1);
  tail2.translate(-1,0,0);
  tail2.rotate(gTailAngle,0,0,1);
  drawCube(tail2,[1,0.5,0.5,1]);
}

function updateAnimationAngles() {
  if (g_animationOn) {
    gThighAngle = 30*Math.sin(g_time/300);
    gCalfAngle = 20*Math.cos(g_time/300);
    gTailAngle = 20*Math.sin(g_time/500);
  }
}

function tick() {
  g_time = performance.now();
  updateAnimationAngles();
  renderScene();
  requestAnimationFrame(tick);
}

function toggleAnimation() {
  g_animationOn = !g_animationOn;
}
