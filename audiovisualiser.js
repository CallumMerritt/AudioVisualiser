//Global Variables
var scl, h, w, cols, rows, BGColour,
  mainColour, offsetColour, SettingsUIState,
  gui, speed, waveform, offsetDistance,
  offsetStroke, minDepth, maxDepth, soundinput, fft, spectrum, sensitivity;
var terrain = [];


//Canvas initailsation
function setup() {
  BGColour = "#ffffff";
  mainColour = '#fff204';
  offsetColour = '#497d7e';
  SettingsUIState = 0;
  createCanvas(windowWidth, windowHeight, WEBGL);
  angleMode(DEGREES);

  /* 
  *Set inital values*
  frameRate = Animation Framerate
  scl = scale of cells in pixels
  h = height of terrain field in pixels
  w = width of terrain field in pixels
  flying = speed of terrain movement
  fft = container for audio spectrum analysis
  offsetDistance = Distance between filled mesh and     stroke mesh
  offsetStroke = Thickness of offset stroke
  minDepth = Minimum vertex height of mesh
  maxDepth = Maximum vertest height of mesh
  BGColour = Background colour
  mainColour = colour of filled mesh
  offsetColour = colour of mesh offset stroke
  SettingUIState = sets visibility of settings UI
  sensitvity = Sets how reactive the animiation is to sound
  */
  frameRate(30);
  scl = 50;
  h = windowHeight / 2;
  w = windowWidth * 1.3;
  cols = w / scl;
  rows = h / scl;
  speed = float(0.01);
  flying = speed;
  fft = new p5.FFT();
  offsetDistance = 10;
  offsetStroke = 1;
  minDepth = -100;
  maxDepth = 200;
  BGColour = "#ffffff";
  mainColour = '#fff204';
  offsetColour = '#497d7e';
  SettingsUIState = 0;
  sensitvity = 0.5

  //setup audio stream container variables
  soundinput = new p5.AudioIn();
  soundinput.start();
  fft = new p5.FFT();
  fft.setInput(soundinput);





  //Settings GUI setup 
  gui = createGui('Visualiser Settings --------                                                                  *This visualiser uses audio from the system microphone.*');
  gui.addGlobals('BGColour', 'mainColour',
    'offsetColour', 'scl', 'offsetStroke');
  gui.hide();
  sliderRange(-0.02, 0.02, 0.0001);
  gui.addGlobals('speed');
  sliderRange(-300, 300, 1);
  gui.addGlobals('minDepth', 'maxDepth', 'offsetDistance');
  sliderRange(-3, 3, 0.01);
  gui.addGlobals('sensitvity')


  //Create button to show/hide settings GUI
  settingsButton = createButton("Settings");
  settingsButton.position(20, height - 60);
  settingsButton.mousePressed(SettingsToggle)

}


//Toggle visibility of settings UI
function SettingsToggle() {
  if (SettingsUIState == 0) {
    SettingsUIState = 1;
    gui.show();
  } else {
    SettingsUIState = 0;
    gui.hide();
  }
}

// Moves terrain values through terrain array
function mapscroll() {

  flying -= speed;
  yoff = float(flying);

  for (y = 0; y < rows; y++) {
    var xoff = float(0)
    terrain[y] = [];

    for (x = 0; x < cols; x++) {
      // Specifiy constraints of terrain generation
      terrain[y][x] = map(noise(yoff, xoff), 0, 1, minDepth - (sensitvity * spectrum[x]), maxDepth + (sensitvity * spectrum[x]))
      xoff += 0.3;
    }
    yoff += 0.1;
  }
}


// Plots terrain array values onto triangle strip shape
function gridmap() {
  mapscroll();

  for (y = 0; y < rows - 1; y++) {
    beginShape(TRIANGLE_STRIP);
    for (x = 0; x < cols; x++) {
      vertex(x * scl, y * scl, terrain[y][x]);
      vertex(x * scl, (y + 1) * scl, terrain[y + 1][x]);
    }
    endShape();
  }
}

//Draw main terrain plane
function drawterrain() {
  fill(mainColour);
  stroke(255, 255, 255);
  strokeWeight(1);
  translate(0, 0, 0);
  rotateX(70);
  translate(-w / 2, -h / 2);
  gridmap();
}

//Create Offset mesh
function offset(x) {
  noFill();
  stroke(offsetColour);
  strokeWeight(offsetStroke);
  translate(0, 0, x);
  gridmap();
}


//Animate Graphic
function draw() {
  background(BGColour);
  spectrum = fft.analyze();
  drawterrain();
  offset(offsetDistance + (sensitvity * spectrum[x]));
  cols = w / scl;
  rows = h / scl;
}