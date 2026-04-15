class Triangle {
  constructor() {
    this.position = [0, 0];
    this.color = [1, 1, 1];
    this.size = 10;
  }

  render() {
    let d = this.size / 200;

    let vertices = new Float32Array([
      this.position[0], this.position[1] + d,
      this.position[0] - d, this.position[1] - d,
      this.position[0] + d, this.position[1] - d
    ]);

    let buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    gl.vertexAttribPointer(gl.a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(gl.a_Position);

    gl.uniform4f(gl.u_FragColor, ...this.color, 1.0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
}