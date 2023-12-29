const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
let pixels = imageData.data;
let depthes = pixels.map(i => Infinity);

function pixel(x, y, z, red, green, blue, alpha) {
  if (x >= 0 && x < imageData.width && y >= 0 && y < imageData.height) {
    let index = x + y * imageData.width;
    if (z <= depthes[index]) {
      depthes[index] = z;
      pixels[index * 4 + 0] = red;
      pixels[index * 4 + 1] = green;
      pixels[index * 4 + 2] = blue;
      pixels[index * 4 + 3] = alpha;
    }
  }
}

function dot(x, y, z, width, red, green, blue, alpha) {
  let r = Math.floor(width / 2);
  if (width % 2 === 0) {
    for (let i = -r; i < r; ++i) {
      for (let j = -r; j < r; ++j) {
        pixel(x + i, y + j, z, red, green, blue, alpha);
      }
    }
  } else {
    for (let i = -r; i <= r; ++i) {
      for (let j = -r; j <= r; ++j) {
        pixel(x + i, y + j, z, red, green, blue, alpha);
      }
    }
  }
}

function line(x1, y1, x2, y2, z, width, red, green, blue, alpha) {
  let dx = x2 - x1;
  let dy = y2 - y1;
  let xs = Math.sign(dx);
  let ys = Math.sign(dy);
  for (let i = 0; i <= Math.abs(dx); ++i) {
    dot(x1 + i * xs, y1 + Math.round(i * Math.abs(dy / dx)) * ys, z, width, red, green, blue, alpha);
  }
  for (let i = 0; i <= Math.abs(dy); ++i) {
    dot(x1 + Math.round(i * Math.abs(dx / dy)) * xs, y1 + i * ys, z, width, red, green, blue, alpha);
  }
}

function update() {
  context.putImageData(imageData, 0, 0);
  pixels = imageData.data;
}

let x1 = 0;
let y1 = 0;
let x2 = 0;
let y2 = 0;
let x3 = 0;
let y3 = 0;
let x4 = 0;
let y4 = 0;
let time = 0;

function draw(event) {
  if (event.buttons === 1) {
    if (time === 0) {
      x1 = event.offsetX;
      y1 = event.offsetY;
      x2 = x1;
      y2 = y1;
      x3 = x1;
      y3 = y1;
      x4 = x1;
      y4 = y1;
    } else {
      if (time % 2 === 0) {
        x1 = event.offsetX;
        y1 = event.offsetY;
        x4 = x1;
        y4 = y1;
        line(x3, y3, x4, y4, 0, 5, 255, 255, 255, 255);
      } else {
        x2 = event.offsetX;
        y2 = event.offsetY;
        x3 = x2;
        y3 = y2;
        line(x1, y1, x2, y2, 0, 5, 255, 255, 255, 255);
      }
    }
    ++time;
  }
}

canvas.addEventListener("mousemove", event => {
  draw(event);
});

canvas.addEventListener("mouseup", event => {
  time = 0;
});

canvas.addEventListener("mouseout", event => {
  time = 0;
});

setInterval(() => {
  update();
}, 1000 / 60);
