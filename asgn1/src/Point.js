class Point {
  constructor() {
    this.position = [0, 0];
    this.color = [1, 1, 1];
    this.size = 10;
  }

  render() {
    gl.vertexAttrib3f(gl.a_Position, this.position[0], this.position[1], 0.0);
    gl.uniform4f(gl.u_FragColor, ...this.color, 1.0);
    gl.uniform1f(gl.u_Size, this.size);
    gl.drawArrays(gl.POINTS, 0, 1);
  }
}