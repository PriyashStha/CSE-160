class Cube {

  constructor() {

    this.matrix = new Matrix4();

    this.textureNum = 0;

    if (!Cube.vertexBuffer) {
      Cube.initBuffers();
    }
  }

  static initBuffers() {

    const vertices = new Float32Array([

      // FRONT
      -0.5,-0.5,0.5,
       0.5,-0.5,0.5,
       0.5, 0.5,0.5,

      -0.5,-0.5,0.5,
       0.5, 0.5,0.5,
      -0.5, 0.5,0.5,

      // BACK
      -0.5,-0.5,-0.5,
      -0.5, 0.5,-0.5,
       0.5, 0.5,-0.5,

      -0.5,-0.5,-0.5,
       0.5, 0.5,-0.5,
       0.5,-0.5,-0.5,

      // LEFT
      -0.5,-0.5,-0.5,
      -0.5,-0.5, 0.5,
      -0.5, 0.5, 0.5,

      -0.5,-0.5,-0.5,
      -0.5, 0.5, 0.5,
      -0.5, 0.5,-0.5,

      // RIGHT
       0.5,-0.5,-0.5,
       0.5, 0.5,-0.5,
       0.5, 0.5, 0.5,

       0.5,-0.5,-0.5,
       0.5, 0.5, 0.5,
       0.5,-0.5, 0.5,

      // TOP
      -0.5, 0.5,-0.5,
      -0.5, 0.5, 0.5,
       0.5, 0.5, 0.5,

      -0.5, 0.5,-0.5,
       0.5, 0.5, 0.5,
       0.5, 0.5,-0.5,

      // BOTTOM
      -0.5,-0.5,-0.5,
       0.5,-0.5,-0.5,
       0.5,-0.5, 0.5,

      -0.5,-0.5,-0.5,
       0.5,-0.5, 0.5,
      -0.5,-0.5, 0.5
    ]);

    const uv = new Float32Array([

      0,0, 1,0, 1,1,
      0,0, 1,1, 0,1,

      0,0, 1,0, 1,1,
      0,0, 1,1, 0,1,

      0,0, 1,0, 1,1,
      0,0, 1,1, 0,1,

      0,0, 1,0, 1,1,
      0,0, 1,1, 0,1,

      0,0, 1,0, 1,1,
      0,0, 1,1, 0,1,

      0,0, 1,0, 1,1,
      0,0, 1,1, 0,1
    ]);

    Cube.vertexBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, Cube.vertexBuffer);

    gl.bufferData(
      gl.ARRAY_BUFFER,
      vertices,
      gl.STATIC_DRAW
    );

    Cube.uvBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, Cube.uvBuffer);

    gl.bufferData(
      gl.ARRAY_BUFFER,
      uv,
      gl.STATIC_DRAW
    );
  }

  render() {

    gl.uniform1i(
      u_whichTexture,
      this.textureNum
    );

    gl.uniformMatrix4fv(
      u_ModelMatrix,
      false,
      this.matrix.elements
    );

    gl.bindBuffer(
      gl.ARRAY_BUFFER,
      Cube.vertexBuffer
    );

    gl.vertexAttribPointer(
      a_Position,
      3,
      gl.FLOAT,
      false,
      0,
      0
    );

    gl.enableVertexAttribArray(a_Position);

    gl.bindBuffer(
      gl.ARRAY_BUFFER,
      Cube.uvBuffer
    );

    gl.vertexAttribPointer(
      a_UV,
      2,
      gl.FLOAT,
      false,
      0,
      0
    );

    gl.enableVertexAttribArray(a_UV);

    gl.drawArrays(gl.TRIANGLES, 0, 36);
  }
}
