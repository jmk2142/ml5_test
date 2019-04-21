let charRNN;
let textInput;

let startBtn;
let generating = false;

let canvasHeight = 100;

function setup() {
  noCanvas();
  // Create the LSTM Generator passing it the model directory
  charRNN = ml5.charRNN('./models/woolf/', modelReady);
  // Grab the DOM elements
  textInput = select('#textInput');
  startBtn = select('#start');



  // DOM element events
  startBtn.mousePressed(generate);
}

function windowResized() {
  resizeCanvas(windowWidth, canvasHeight);
}


async function modelReady() {
  // select('#status').html('Model Loaded');
  resetModel();
}

function resetModel() {
  charRNN.reset();
  const seed = select('#textInput').value();
  charRNN.feed(seed);
  select('#result').html(seed);
}

function generate() {
  if (generating) {
    generating = false;
    startBtn.html('Start');
  } else {
    resetModel();
    generating = true;
    startBtn.html('Pause');
    loopRNN();
  }
}

async function loopRNN() {
  while (generating) {
    await predict();
  }
}

async function predict() {
  let par = select('#result');
  // range is 0 to 1
  let temperature = 0.8;
  let next = await charRNN.predict(temperature);
  await charRNN.feed(next.sample);
  par.html(par.html() + next.sample);
}
