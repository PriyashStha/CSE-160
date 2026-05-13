const WORLD_SIZE = 32;

let worldMap = [];

function generateWorld() {

  for (let x = 0; x < WORLD_SIZE; x++) {

    worldMap[x] = [];

    for (let z = 0; z < WORLD_SIZE; z++) {

      if (
        x === 0 ||
        z === 0 ||
        x === WORLD_SIZE - 1 ||
        z === WORLD_SIZE - 1
      ) {
        worldMap[x][z] = 4;
      }
      else {
        worldMap[x][z] = Math.floor(Math.random() * 3);
      }
    }
  }

  for (let i = 5; i < 27; i++) {
    worldMap[10][i] = 4;
    worldMap[20][i] = 3;
  }
}

function drawWorld() {

  drawGround();
  drawSky();

  for (let x = 0; x < WORLD_SIZE; x++) {

    for (let z = 0; z < WORLD_SIZE; z++) {

      let height = worldMap[x][z];

      for (let y = 0; y < height; y++) {

        let wall = new Cube();

        wall.textureNum = 1;

        wall.matrix.translate(x, y, z);

        wall.render();
      }
    }
  }
}

function drawGround() {

  let ground = new Cube();

  ground.textureNum = 0;

  ground.matrix.translate(WORLD_SIZE / 2, -0.75, WORLD_SIZE / 2);
  ground.matrix.scale(WORLD_SIZE, 0.1, WORLD_SIZE);

  ground.render();
}

function drawSky() {

  let sky = new Cube();

  sky.textureNum = 2;

  sky.matrix.translate(WORLD_SIZE / 2, WORLD_SIZE / 2, WORLD_SIZE / 2);

  sky.matrix.scale(100, 100, 100);

  sky.render();
}

function addBlock() {

  let forward = new Vector3();

  forward.set(camera.at);

  forward.sub(camera.eye);

  forward.normalize();

  let x = Math.floor(
    camera.eye.elements[0] + forward.elements[0] * 2
  );

  let z = Math.floor(
    camera.eye.elements[2] + forward.elements[2] * 2
  );

  if (
    x >= 0 &&
    x < WORLD_SIZE &&
    z >= 0 &&
    z < WORLD_SIZE
  ) {

    if (worldMap[x][z] < 4) {
      worldMap[x][z]++;
    }
  }
}

function removeBlock() {

  let forward = new Vector3();

  forward.set(camera.at);

  forward.sub(camera.eye);

  forward.normalize();

  let x = Math.floor(
    camera.eye.elements[0] + forward.elements[0] * 2
  );

  let z = Math.floor(
    camera.eye.elements[2] + forward.elements[2] * 2
  );

  if (
    x >= 0 &&
    x < WORLD_SIZE &&
    z >= 0 &&
    z < WORLD_SIZE
  ) {

    if (worldMap[x][z] > 0) {
      worldMap[x][z]--;
    }
  }
}