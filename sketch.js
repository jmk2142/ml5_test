let charRNN;
let startBtn;
let generating = false;
let canvasHeight = 100;
let period = 0;




function setup() {
  noCanvas();
  // Create the LSTM Generator passing it the model directory
  charRNN = ml5.charRNN('./models/woolf/', modelReady);
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
  // const seed = select('#textInput').value();
  const seed = "tell me about yourself";
  charRNN.feed(seed);
  // select('#result').html(seed);
  select('#result').html("");
}

function generate() {
    resetModel();
    generating = true;
    startBtn.html('Pause');
    loopRNN();
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

  if(next.sample=="."){
    period++;
    console.log(period);
  }

  if(period>1){
    generating = false;
    startBtn.html('Start');
    period = 0;
  }
}
