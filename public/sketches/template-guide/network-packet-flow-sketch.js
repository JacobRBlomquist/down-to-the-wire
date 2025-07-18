// Network Packet Flow Visualization
// A simple p5.js sketch demonstrating packet routing through network nodes

const networkPacketFlowSketch = (p) => {
  let packets = [];
  let nodes = [];
  let connections = [];
  let canvasWidth = 600;
  let canvasHeight = 400;
  let isRunning = true;
  let speed = 1;
  let maxPackets = 10;
  let currentPackets = 0;

  p.setup = () => {
    // Create canvas and attach it to the container
    p.createCanvas(canvasWidth, canvasHeight);
    
    // Initialize network nodes
    initializeNodes();
    
    // Initialize connections between nodes
    initializeConnections();
    
    // Start with a few packets
    for (let i = 0; i < 3; i++) {
      setTimeout(() => createPacket(), i * 1000);
    }
  };

  p.draw = () => {
    p.background(20, 25, 40); // Dark background
    
    if (isRunning) {
      updatePackets();
      
      // Create new packets periodically
      if (p.frameCount % (120 / speed) === 0 && currentPackets < maxPackets) {
        createPacket();
      }
    }
    
    // Draw network elements
    drawConnections();
    drawNodes();
    drawPackets();
    
    // Draw UI elements
    drawInfo();
  };

  function initializeNodes() {
    nodes = [
      { x: 80, y: 80, id: 'A', type: 'router' },
      { x: 520, y: 80, id: 'B', type: 'router' },
      { x: 80, y: 320, id: 'C', type: 'router' },
      { x: 520, y: 320, id: 'D', type: 'router' },
      { x: 300, y: 200, id: 'E', type: 'switch' }
    ];
  }

  function initializeConnections() {
    connections = [
      { from: 0, to: 4, weight: 1 }, // A to E
      { from: 1, to: 4, weight: 1 }, // B to E
      { from: 2, to: 4, weight: 1 }, // C to E
      { from: 3, to: 4, weight: 1 }, // D to E
      { from: 0, to: 1, weight: 2 }, // A to B
      { from: 2, to: 3, weight: 2 }, // C to D
    ];
  }

  function createPacket() {
    const source = Math.floor(Math.random() * 4); // Random source (A, B, C, or D)
    let destination;
    do {
      destination = Math.floor(Math.random() * 4);
    } while (destination === source);
    
    const packet = {
      id: currentPackets,
      source: source,
      destination: destination,
      currentNode: source,
      targetNode: findNextHop(source, destination),
      progress: 0,
      x: nodes[source].x,
      y: nodes[source].y,
      color: [
        [100, 150, 255], // Blue
        [255, 100, 150], // Pink
        [150, 255, 100], // Green
        [255, 200, 100]  // Orange
      ][source],
      hops: [source]
    };
    
    packets.push(packet);
    currentPackets++;
  }

  function findNextHop(current, destination) {
    // Simple routing: everything goes through the central switch (node 4) first
    if (current === 4) {
      return destination;
    } else if (current !== destination) {
      return 4; // Go to switch first
    }
    return destination;
  }

  function updatePackets() {
    for (let i = packets.length - 1; i >= 0; i--) {
      const packet = packets[i];
      
      // Move packet towards target
      packet.progress += 0.02 * speed;
      
      if (packet.progress >= 1) {
        // Packet reached target node
        packet.currentNode = packet.targetNode;
        packet.progress = 0;
        packet.hops.push(packet.currentNode);
        
        // Update position
        packet.x = nodes[packet.currentNode].x;
        packet.y = nodes[packet.currentNode].y;
        
        if (packet.currentNode === packet.destination) {
          // Packet reached final destination
          packets.splice(i, 1);
          currentPackets--;
        } else {
          // Find next hop
          packet.targetNode = findNextHop(packet.currentNode, packet.destination);
        }
      } else {
        // Interpolate position
        const current = nodes[packet.currentNode];
        const target = nodes[packet.targetNode];
        packet.x = p.lerp(current.x, target.x, packet.progress);
        packet.y = p.lerp(current.y, target.y, packet.progress);
      }
    }
  }

  function drawConnections() {
    p.stroke(60, 80, 120);
    p.strokeWeight(2);
    
    for (const conn of connections) {
      const nodeA = nodes[conn.from];
      const nodeB = nodes[conn.to];
      
      // Draw connection line
      p.line(nodeA.x, nodeA.y, nodeB.x, nodeB.y);
      
      // Draw weight label
      const midX = (nodeA.x + nodeB.x) / 2;
      const midY = (nodeA.y + nodeB.y) / 2;
      
      p.fill(120, 140, 180);
      p.noStroke();
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(12);
      p.text(conn.weight, midX, midY);
    }
  }

  function drawNodes() {
    for (const node of nodes) {
      // Node circle
      p.fill(node.type === 'router' ? p.color(70, 130, 180) : p.color(120, 180, 70));
      p.stroke(255);
      p.strokeWeight(2);
      p.ellipse(node.x, node.y, 40, 40);
      
      // Node label
      p.fill(255);
      p.noStroke();
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(14);
      p.textStyle(p.BOLD);
      p.text(node.id, node.x, node.y);
    }
  }

  function drawPackets() {
    for (const packet of packets) {
      // Packet glow effect
      for (let r = 20; r > 0; r--) {
        p.fill(packet.color[0], packet.color[1], packet.color[2], 255 * (1 - r / 20) * 0.3);
        p.noStroke();
        p.ellipse(packet.x, packet.y, r, r);
      }
      
      // Packet core
      p.fill(packet.color);
      p.stroke(255);
      p.strokeWeight(1);
      p.ellipse(packet.x, packet.y, 8, 8);
      
      // Packet ID
      p.fill(255);
      p.noStroke();
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(8);
      p.text(packet.id, packet.x, packet.y - 15);
    }
  }

  function drawInfo() {
    // Info panel
    p.fill(0, 0, 0, 150);
    p.noStroke();
    p.rect(10, 10, 200, 60);
    
    p.fill(255);
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(12);
    p.text(`Active Packets: ${currentPackets}`, 20, 25);
    p.text(`Status: ${isRunning ? 'Running' : 'Paused'}`, 20, 40);
    p.text(`Speed: ${speed}x`, 20, 55);
  }

  // Control functions (called from HTML buttons)
  window.resetSimulation = () => {
    packets = [];
    currentPackets = 0;
    isRunning = true;
    
    // Start with a few packets
    for (let i = 0; i < 3; i++) {
      setTimeout(() => createPacket(), i * 500);
    }
  };

  window.pauseSimulation = () => {
    isRunning = !isRunning;
  };

  window.updateSpeed = (newSpeed) => {
    speed = parseInt(newSpeed);
  };

  window.updatePacketCount = (newCount) => {
    maxPackets = parseInt(newCount);
  };
};

// Create the sketch instance when p5.js is loaded
function initNetworkPacketFlowSketch() {
  if (typeof p5 !== 'undefined') {
    new p5(networkPacketFlowSketch, 'network-packet-flow-sketch');
  } else {
    // Wait for p5.js to load
    setTimeout(initNetworkPacketFlowSketch, 100);
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initNetworkPacketFlowSketch);
} else {
  initNetworkPacketFlowSketch();
}