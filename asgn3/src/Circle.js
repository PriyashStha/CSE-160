class Circle {
  constructor() {
    this.position = [0, 0];
    this.color = [1, 1, 1];
    this.size = 10;
    this.segments = 10;
  }

  render() {
    let angleStep = 360 / this.segments;
    let d = this.size / 200;

    for (let angle = 0; angle < 360; angle += angleStep) {
      let rad1 = angle * Math.PI / 180;
      let rad2 = (angle + angleStep) * Math.PI / 180;

      let x1 = this.position[0];
      let y1 = this.position[1];
      let x2 = x1 + Math.cos(rad1) * d;
      let y2 = y1 + Math.sin(rad1) * d;
      let x3 = x1 + Math.cos(rad2) * d;
      let y3 = y1 + Math.sin(rad2) * d;

      let vertices = new Float32Array([x1,y1, x2,y2, x3,y3]);

      let buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

      gl.vertexAttribPointer(gl.a_Position, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(gl.a_Position);

      gl.uniform4f(gl.u_FragColor, ...this.color, 1.0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
  }
}