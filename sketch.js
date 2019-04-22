// LSTM setup
let charRNN;
let startBtn;
let generating = false;
// let canvasHeight = 100;
let period = 0;
let seed = "tell me about you.";

// speech setup
var myRec = new p5.SpeechRec(); // new P5.SpeechRec object
myRec.continuous = true; // do continuous recognition
myRec.interimResults = false; // allow partial recognition (faster, less accurate)


function setup() {
  // noCanvas();
  // Create the LSTM Generator passing it the model directory
  charRNN = ml5.charRNN('./models/woolf/', modelReady);
  startBtn = select('#start');
  // DOM element events
  startBtn.mousePressed(generate);

  //speech setup
  createCanvas(800, 400);
  background(255, 255, 255);
  fill(0, 0, 0, 255);
  fill(0, 0, 0, 255);
  // instructions:
  textSize(32);
  textAlign(CENTER);
  text("say something", width / 2, height / 2);
  myRec.onResult = showResult;
  myRec.start();
}

//speech result
function showResult() {
  if (myRec.resultValue == true) {
    background(192, 255, 192);
    text(myRec.resultString, width / 2, height / 2);
    console.log("resultingString", myRec.resultString);
    updateSeed();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, canvasHeight);
}

function updateSeed(){
  seed = myRec.resultString;
  // console.log("seed", seed);
  generate();
}

async function modelReady() {
  // select('#status').html('Model Loaded');
  resetModel();
}

function resetModel() {
  charRNN.reset();
  // const seed = select('#textInput').value();
  // const seed = "tell me about yourself";
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
