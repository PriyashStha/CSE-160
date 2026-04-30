class Cone {
  constructor() {
    this.color = [0.1, 0.1, 0.1, 1];
    this.segments = 20;
    this.buffer = null;
  }

  initBuffer() {
    let verts = [];
    let r = 0.5;

    let tip = [0, 0, 1];

    let step = (2 * Math.PI) / this.segments;

    for (let i = 0; i < this.segments; i++) {
      let a1 = i * step;
      let a2 = (i + 1) * step;

      let p1 = [Math.cos(a1) * r, Math.sin(a1) * r, 0];
      let p2 = [Math.cos(a2) * r, Math.sin(a2) * r, 0];

      verts.push(
        tip[0], tip[1], tip[2],
        p1[0], p1[1], p1[2],
        p2[0], p2[1], p2[2]
      );
    }

    this.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
  }

  render(matrix) {
    if (!this.buffer) this.initBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);

    let a_Position = gl.getAttribLocation(gl.program, "a_Position");
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    let u_ModelMatrix = gl.getUniformLocation(gl.program, "u_ModelMatrix");
    gl.uniformMatrix4fv(u_ModelMatrix, false, matrix.elements);

    let u_Color = gl.getUniformLocation(gl.program, "u_Color");
    gl.uniform4fv(u_Color, this.color);

    gl.drawArrays(gl.TRIANGLES, 0, this.segments * 3);
  }
}