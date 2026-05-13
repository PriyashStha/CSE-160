const VSHADER_SOURCE = `
attribute vec4 a_Position;
attribute vec2 a_UV;

uniform mat4 u_ModelMatrix;
uniform mat4 u_ViewMatrix;
uniform mat4 u_ProjectionMatrix;

varying vec2 v_UV;

void main() {

  gl_Position =
    u_ProjectionMatrix *
    u_ViewMatrix *
    u_ModelMatrix *
    a_Position;

  v_UV = a_UV;
}
`;

const FSHADER_SOURCE = `
precision mediump float;

varying vec2 v_UV;

uniform sampler2D u_Sampler0;
uniform sampler2D u_Sampler1;
uniform sampler2D u_Sampler2;

uniform int u_whichTexture;

void main() {

  if (u_whichTexture == 0) {
    gl_FragColor = texture2D(u_Sampler0, v_UV);
  }

  else if (u_whichTexture == 1) {
    gl_FragColor = texture2D(u_Sampler1, v_UV);
  }

  else if (u_whichTexture == 2) {
    gl_FragColor = texture2D(u_Sampler2, v_UV);
  }

  else {
    gl_FragColor = vec4(1,0,1,1);
  }
}
`;

let canvas;
let gl;

let a_Position;
let a_UV;

let u_ModelMatrix;
let u_ViewMatrix;
let u_ProjectionMatrix;

let u_whichTexture;

let u_Sampler0;
let u_Sampler1;
let u_Sampler2;

let camera;

let mouseDown = false;
let lastMouseX = 0;

function setupWebGL() {

  canvas = document.getElementById('webgl');

  gl = canvas.getContext('webgl', {
    preserveDrawingBuffer: true
  });

  if (!gl) {
    console.log('Failed to get WebGL');
    return;
  }

  gl.enable(gl.DEPTH_TEST);
}

function connectVariablesToGLSL() {

  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to initialize shaders');
    return;
  }

  a_Position =
    gl.getAttribLocation(gl.program, 'a_Position');

  a_UV =
    gl.getAttribLocation(gl.program, 'a_UV');

  u_ModelMatrix =
    gl.getUniformLocation(gl.program, 'u_ModelMatrix');

  u_ViewMatrix =
    gl.getUniformLocation(gl.program, 'u_ViewMatrix');

  u_ProjectionMatrix =
    gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');

  u_whichTexture =
    gl.getUniformLocation(gl.program, 'u_whichTexture');

  u_Sampler0 =
    gl.getUniformLocation(gl.program, 'u_Sampler0');

  u_Sampler1 =
    gl.getUniformLocation(gl.program, 'u_Sampler1');

  u_Sampler2 =
    gl.getUniformLocation(gl.program, 'u_Sampler2');

  let identity = new Matrix4();

  gl.uniformMatrix4fv(
    u_ModelMatrix,
    false,
    identity.elements
  );
}

function initTextures() {

  let image0 = new Image();
  let image1 = new Image();
  let image2 = new Image();

  image0.onload = function() {
    sendTextureToGLSL(image0, 0);
  };

  image1.onload = function() {
    sendTextureToGLSL(image1, 1);
  };

  image2.onload = function() {
    sendTextureToGLSL(image2, 2);
  };

  image0.src = 'grass.jpg';
  image1.src = 'wall.jpg';
  image2.src = 'sky.jpg';
}

function sendTextureToGLSL(image, textureUnit) {

  let texture = gl.createTexture();

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

  if (textureUnit == 0) {
    gl.activeTexture(gl.TEXTURE0);
  }

  else if (textureUnit == 1) {
    gl.activeTexture(gl.TEXTURE1);
  }

  else if (textureUnit == 2) {
    gl.activeTexture(gl.TEXTURE2);
  }

  gl.bindTexture(gl.TEXTURE_2D, texture);

  gl.texParameteri(
    gl.TEXTURE_2D,
    gl.TEXTURE_MIN_FILTER,
    gl.LINEAR
  );

  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGB,
    gl.RGB,
    gl.UNSIGNED_BYTE,
    image
  );

  if (textureUnit == 0) {
    gl.uniform1i(u_Sampler0, 0);
  }

  else if (textureUnit == 1) {
    gl.uniform1i(u_Sampler1, 1);
  }

  else if (textureUnit == 2) {
    gl.uniform1i(u_Sampler2, 2);
  }
}

function addActions() {

  document.onkeydown = keydown;

  canvas.onmousedown = function(ev) {

    mouseDown = true;

    lastMouseX = ev.clientX;
  };

  canvas.onmouseup = function() {

    mouseDown = false;
  };

  canvas.onmousemove = function(ev) {

    if (!mouseDown) {
      return;
    }

    let deltaX = ev.clientX - lastMouseX;

    camera.mousePan(-deltaX);

    lastMouseX = ev.clientX;

    renderScene();
  };
}

function keydown(ev) {

  if (ev.key == 'w' || ev.key == 'W') {
    camera.moveForward();
  }

  else if (ev.key == 's' || ev.key == 'S') {
    camera.moveBackwards();
  }

  else if (ev.key == 'a' || ev.key == 'A') {
    camera.moveLeft();
  }

  else if (ev.key == 'd' || ev.key == 'D') {
    camera.moveRight();
  }

  else if (ev.key == 'q' || ev.key == 'Q') {
    camera.panLeft();
  }

  else if (ev.key == 'e' || ev.key == 'E') {
    camera.panRight();
  }

  else if (ev.key == 'f' || ev.key == 'F') {
    addBlock();
  }

  else if (ev.key == 'g' || ev.key == 'G') {
    removeBlock();
  }

  renderScene();
}

function renderScene() {

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.uniformMatrix4fv(
    u_ViewMatrix,
    false,
    camera.viewMatrix.elements
  );

  gl.uniformMatrix4fv(
    u_ProjectionMatrix,
    false,
    camera.projectionMatrix.elements
  );

  drawWorld();

  if (typeof drawAnimal === 'function') {
    drawAnimal();
  }
}

function tick() {

  renderScene();

  requestAnimationFrame(tick);
}

function main() {

  setupWebGL();

  connectVariablesToGLSL();

  camera = new Camera();

  initTextures();

  generateWorld();

  addActions();

  gl.clearColor(0, 0, 0, 1);

  tick();
}

main();
