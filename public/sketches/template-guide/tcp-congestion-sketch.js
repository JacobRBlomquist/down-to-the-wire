// TCP Congestion Control Visualization
// Demonstrates how TCP adjusts its sending rate based on network conditions

const tcpCongestionSketch = (p) => {
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

  p.setup = () => {
    p.createCanvas(canvasWidth, canvasHeight);
    
    // Initialize history
    history = [];
    events = [];
    
    // Add some initial events
    addEvent(50, 'timeout', 'Packet Loss');
    addEvent(120, 'timeout', 'Packet Loss');
    addEvent(200, 'timeout', 'Packet Loss');
  };

  p.draw = () => {
    p.background(15, 20, 30);
    
    if (isRunning) {
      updateCongestionControl();
    }
    
    drawGraph();
    drawCurrentState();
    drawEvents();
    drawLegend();
  };

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
    if (p.frameCount % 2 === 0) {
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
    p.stroke(100, 120, 140);
    p.strokeWeight(1);
    
    // X-axis
    p.line(50, p.height - 50, p.width - 50, p.height - 50);
    // Y-axis
    p.line(50, 50, 50, p.height - 50);
    
    // Draw grid
    p.stroke(40, 50, 60);
    for (let i = 0; i <= 10; i++) {
      let x = p.map(i, 0, 10, 50, p.width - 50);
      p.line(x, 50, x, p.height - 50);
    }
    
    for (let i = 0; i <= 5; i++) {
      let y = p.map(i, 0, 5, p.height - 50, 50);
      p.line(50, y, p.width - 50, y);
    }
    
    // Draw cwnd line
    if (history.length > 1) {
      p.stroke(100, 150, 255);
      p.strokeWeight(2);
      p.noFill();
      
      p.beginShape();
      for (let point of history) {
        let x = p.map(point.time, time - 200, time, 50, p.width - 50);
        let y = p.map(point.cwnd, 0, 40, p.height - 50, 50);
        if (x >= 50 && x <= p.width - 50) {
          p.vertex(x, y);
        }
      }
      p.endShape();
    }
    
    // Draw ssthresh line
    if (history.length > 0) {
      p.stroke(255, 150, 100);
      p.strokeWeight(1);
      strokeDashArray([5, 5]);
      
      for (let point of history) {
        let x = p.map(point.time, time - 200, time, 50, p.width - 50);
        let y = p.map(point.ssthresh, 0, 40, p.height - 50, 50);
        if (x >= 50 && x <= p.width - 50) {
          p.line(x, y, x + 1, y);
        }
      }
      strokeDashArray([]);
    }
    
    // Draw labels
    p.fill(200, 220, 240);
    p.noStroke();
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(12);
    p.text('Time', p.width / 2, p.height - 20);
    
    p.push();
    p.translate(25, p.height / 2);
    p.rotate(-p.PI / 2);
    p.text('Window Size', 0, 0);
    p.pop();
  }

  function drawCurrentState() {
    // Current values panel
    p.fill(0, 0, 0, 150);
    p.noStroke();
    p.rect(p.width - 200, 10, 180, 80);
    
    p.fill(255);
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(12);
    p.text(`CWND: ${cwnd.toFixed(1)}`, p.width - 190, 25);
    p.text(`SSThresh: ${ssthresh.toFixed(1)}`, p.width - 190, 40);
    p.text(`State: ${state}`, p.width - 190, 55);
    p.text(`Time: ${time.toFixed(1)}`, p.width - 190, 70);
    
    // Color indicator for state
    p.fill(state === 'slow_start' ? p.color(150, 255, 150) : p.color(255, 150, 150));
    p.ellipse(p.width - 25, 55, 8, 8);
  }

  function drawEvents() {
    // Draw event markers
    for (let event of events) {
      let x = p.map(event.time, time - 200, time, 50, p.width - 50);
      if (x >= 50 && x <= p.width - 50) {
        // Event line
        p.stroke(255, 100, 100);
        p.strokeWeight(2);
        p.line(x, 50, x, p.height - 50);
        
        // Event label
        p.fill(255, 100, 100);
        p.noStroke();
        p.textAlign(p.CENTER, p.BOTTOM);
        p.textSize(10);
        p.text(event.label, x, 45);
      }
    }
  }

  function drawLegend() {
    // Legend
    p.fill(0, 0, 0, 150);
    p.noStroke();
    p.rect(60, 60, 150, 60);
    
    // CWND line
    p.stroke(100, 150, 255);
    p.strokeWeight(2);
    p.line(70, 75, 90, 75);
    p.fill(100, 150, 255);
    p.noStroke();
    p.textAlign(p.LEFT, p.CENTER);
    p.textSize(10);
    p.text('CWND', 95, 75);
    
    // SSThresh line
    p.stroke(255, 150, 100);
    p.strokeWeight(1);
    strokeDashArray([3, 3]);
    p.line(70, 90, 90, 90);
    strokeDashArray([]);
    p.fill(255, 150, 100);
    p.noStroke();
    p.text('SSThresh', 95, 90);
    
    // Loss events
    p.stroke(255, 100, 100);
    p.strokeWeight(2);
    p.line(70, 105, 90, 105);
    p.fill(255, 100, 100);
    p.noStroke();
    p.text('Packet Loss', 95, 105);
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
      p.drawingContext.setLineDash([]);
    } else {
      p.drawingContext.setLineDash(arr);
    }
  }
};

// Create the sketch instance when p5.js is loaded
function initTcpCongestionSketch() {
  if (typeof p5 !== 'undefined') {
    new p5(tcpCongestionSketch, 'tcp-congestion-sketch');
  } else {
    // Wait for p5.js to load
    setTimeout(initTcpCongestionSketch, 100);
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTcpCongestionSketch);
} else {
  initTcpCongestionSketch();
}