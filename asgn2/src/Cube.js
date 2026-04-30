class Cube {
  constructor() {
    this.color = [1, 1, 1, 1];
    this.matrix = new Matrix4();

    if (!Cube.buffer) {
      Cube.initBuffer();
    }
  }

  static initBuffer() {
    const vertices = new Float32Array([
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
    ]);

    Cube.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, Cube.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  }

  render() {
    gl.bindBuffer(gl.ARRAY_BUFFER, Cube.buffer);

    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
    gl.uniform4fv(u_Color, this.color);

    gl.drawArrays(gl.TRIANGLES, 0, 36);
  }
}