// TCP Congestion Control Visualization
// Demonstrates how TCP adjusts its sending rate based on network conditions

let cwnd = 1; // Congestion window
let ssthresh = 16; // Slow start threshold
let state = 'slow_start';
let time = 0;
let history = [];
let events = [];
let canvasWidth = 600;
let canvasHeight = 300;
let isRunning = true;
let animationSpeed = 1;

function setup() {
  let sketch = createCanvas(canvasWidth, canvasHeight);
  sketch.parent('tcp-congestion-sketch');
  
  // Initialize history
  history = [];
  events = [];
  
  // Add some initial events
  addEvent(50, 'timeout', 'Packet Loss');
  addEvent(120, 'timeout', 'Packet Loss');
  addEvent(200, 'timeout', 'Packet Loss');
}

function draw() {
  background(15, 20, 30);
  
  if (isRunning) {
    updateCongestionControl();
  }
  
  drawGraph();
  drawCurrentState();
  drawEvents();
  drawLegend();
}

function updateCongestionControl() {
  time += 0.5 * animationSpeed;
  
  // Check for events
  for (let event of events) {
    if (Math.abs(time - event.time) < 0.5 && !event.triggered) {
      handleEvent(event);
      event.triggered = true;
    }
  }
  
  // Normal operation - increase cwnd based on state
  if (state === 'slow_start') {
    cwnd += 0.02 * animationSpeed; // Exponential growth
    if (cwnd >= ssthresh) {
      state = 'congestion_avoidance';
    }
  } else if (state === 'congestion_avoidance') {
    cwnd += 0.005 * animationSpeed; // Linear growth
  }
  
  // Record history
  if (frameCount % 2 === 0) {
    history.push({
      time: time,
      cwnd: cwnd,
      ssthresh: ssthresh,
      state: state
    });
    
    // Keep history manageable
    if (history.length > 400) {
      history.shift();
    }
  }
  
  // Reset if we've gone too far
  if (time > 300) {
    resetTCPSimulation();
  }
}

function handleEvent(event) {
  if (event.type === 'timeout') {
    // Multiplicative decrease
    ssthresh = Math.max(cwnd / 2, 2);
    cwnd = 1;
    state = 'slow_start';
  }
}

function addEvent(time, type, label) {
  events.push({
    time: time,
    type: type,
    label: label,
    triggered: false
  });
}

function drawGraph() {
  // Draw axes
  stroke(100, 120, 140);
  strokeWeight(1);
  
  // X-axis
  line(50, height - 50, width - 50, height - 50);
  // Y-axis
  line(50, 50, 50, height - 50);
  
  // Draw grid
  stroke(40, 50, 60);
  for (let i = 0; i <= 10; i++) {
    let x = map(i, 0, 10, 50, width - 50);
    line(x, 50, x, height - 50);
  }
  
  for (let i = 0; i <= 5; i++) {
    let y = map(i, 0, 5, height - 50, 50);
    line(50, y, width - 50, y);
  }
  
  // Draw cwnd line
  if (history.length > 1) {
    stroke(100, 150, 255);
    strokeWeight(2);
    noFill();
    
    beginShape();
    for (let point of history) {
      let x = map(point.time, time - 200, time, 50, width - 50);
      let y = map(point.cwnd, 0, 40, height - 50, 50);
      if (x >= 50 && x <= width - 50) {
        vertex(x, y);
      }
    }
    endShape();
  }
  
  // Draw ssthresh line
  if (history.length > 0) {
    stroke(255, 150, 100);
    strokeWeight(1);
    strokeDashArray([5, 5]);
    
    for (let point of history) {
      let x = map(point.time, time - 200, time, 50, width - 50);
      let y = map(point.ssthresh, 0, 40, height - 50, 50);
      if (x >= 50 && x <= width - 50) {
        line(x, y, x + 1, y);
      }
    }
    strokeDashArray([]);
  }
  
  // Draw labels
  fill(200, 220, 240);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(12);
  text('Time', width / 2, height - 20);
  
  push();
  translate(25, height / 2);
  rotate(-PI / 2);
  text('Window Size', 0, 0);
  pop();
}

function drawCurrentState() {
  // Current values panel
  fill(0, 0, 0, 150);
  noStroke();
  rect(width - 200, 10, 180, 80);
  
  fill(255);
  textAlign(LEFT, TOP);
  textSize(12);
  text(`CWND: ${cwnd.toFixed(1)}`, width - 190, 25);
  text(`SSThresh: ${ssthresh.toFixed(1)}`, width - 190, 40);
  text(`State: ${state}`, width - 190, 55);
  text(`Time: ${time.toFixed(1)}`, width - 190, 70);
  
  // Color indicator for state
  fill(state === 'slow_start' ? color(150, 255, 150) : color(255, 150, 150));
  ellipse(width - 25, 55, 8, 8);
}

function drawEvents() {
  // Draw event markers
  for (let event of events) {
    let x = map(event.time, time - 200, time, 50, width - 50);
    if (x >= 50 && x <= width - 50) {
      // Event line
      stroke(255, 100, 100);
      strokeWeight(2);
      line(x, 50, x, height - 50);
      
      // Event label
      fill(255, 100, 100);
      noStroke();
      textAlign(CENTER, BOTTOM);
      textSize(10);
      text(event.label, x, 45);
    }
  }
}

function drawLegend() {
  // Legend
  fill(0, 0, 0, 150);
  noStroke();
  rect(60, 60, 150, 60);
  
  // CWND line
  stroke(100, 150, 255);
  strokeWeight(2);
  line(70, 75, 90, 75);
  fill(100, 150, 255);
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(10);
  text('CWND', 95, 75);
  
  // SSThresh line
  stroke(255, 150, 100);
  strokeWeight(1);
  strokeDashArray([3, 3]);
  line(70, 90, 90, 90);
  strokeDashArray([]);
  fill(255, 150, 100);
  noStroke();
  text('SSThresh', 95, 90);
  
  // Loss events
  stroke(255, 100, 100);
  strokeWeight(2);
  line(70, 105, 90, 105);
  fill(255, 100, 100);
  noStroke();
  text('Packet Loss', 95, 105);
}

// Control functions
function resetTCPSimulation() {
  cwnd = 1;
  ssthresh = 16;
  state = 'slow_start';
  time = 0;
  history = [];
  
  // Reset events
  events = [];
  addEvent(50, 'timeout', 'Packet Loss');
  addEvent(120, 'timeout', 'Packet Loss');
  addEvent(200, 'timeout', 'Packet Loss');
}

function pauseTCPSimulation() {
  isRunning = !isRunning;
}

function updateTCPSpeed(newSpeed) {
  animationSpeed = parseInt(newSpeed);
}

function addPacketLoss() {
  addEvent(time + 10, 'timeout', 'Manual Loss');
}

// Make functions globally available
window.resetTCPSimulation = resetTCPSimulation;
window.pauseTCPSimulation = pauseTCPSimulation;
window.updateTCPSpeed = updateTCPSpeed;
window.addPacketLoss = addPacketLoss;

// Fix for p5.js strokeDashArray
function strokeDashArray(arr) {
  if (arr.length === 0) {
    drawingContext.setLineDash([]);
  } else {
    drawingContext.setLineDash(arr);
  }
}