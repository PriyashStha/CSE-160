class Triangle {
  constructor() {
    this.position = [0, 0];
    this.color = [1, 1, 1];
    this.size = 10;
    this.rotation = 0; // NEW
  }

  render() {
    let d = this.size / 200;

    let cosB = Math.cos(this.rotation);
    let sinB = Math.sin(this.rotation);

    function rotate(x, y) {
      return [
        x * cosB - y * sinB,
        x * sinB + y * cosB
      ];
    }

    let p1 = rotate(0, d);
    let p2 = rotate(-d, -d);
    let p3 = rotate(d, -d);

    let vertices = new Float32Array([
      this.position[0] + p1[0], this.position[1] + p1[1],
      this.position[0] + p2[0], this.position[1] + p2[1],
      this.position[0] + p3[0], this.position[1] + p3[1]
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