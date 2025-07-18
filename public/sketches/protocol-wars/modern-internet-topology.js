// Modern Internet Topology Visualization
// Interactive visualization showing modern internet architecture vs alternative protocol architectures

const modernInternetTopology = (p) => {
  let nodes = [];
  let connections = [];
  let packets = [];
  let currentTopology = 'modern';
  let transitionProgress = 0;
  let isTransitioning = false;
  let isRunning = true;
  let speed = 1;
  let packetId = 0;
  let showLabels = true;
  
  const canvasWidth = 800;
  const canvasHeight = 500;
  
  // Modern internet topology configuration
  const modernTopology = {
    nodes: [
      // IoT Devices
      { id: 'iot1', x: 80, y: 100, type: 'iot', label: 'IoT Device 1' },
      { id: 'iot2', x: 80, y: 180, type: 'iot', label: 'IoT Device 2' },
      { id: 'iot3', x: 80, y: 260, type: 'iot', label: 'IoT Device 3' },
      
      // MQTT Broker
      { id: 'mqtt', x: 200, y: 180, type: 'mqtt', label: 'MQTT Broker' },
      
      // Load Balancer
      { id: 'lb1', x: 350, y: 120, type: 'loadbalancer', label: 'Load Balancer' },
      { id: 'lb2', x: 350, y: 240, type: 'loadbalancer', label: 'Load Balancer' },
      
      // Data Centers
      { id: 'dc1', x: 500, y: 80, type: 'datacenter', label: 'Data Center 1' },
      { id: 'dc2', x: 500, y: 180, type: 'datacenter', label: 'Data Center 2' },
      { id: 'dc3', x: 500, y: 280, type: 'datacenter', label: 'Data Center 3' },
      
      // CDN/Edge
      { id: 'cdn1', x: 650, y: 120, type: 'cdn', label: 'CDN Edge 1' },
      { id: 'cdn2', x: 650, y: 240, type: 'cdn', label: 'CDN Edge 2' },
      
      // End Users
      { id: 'user1', x: 750, y: 100, type: 'user', label: 'User 1' },
      { id: 'user2', x: 750, y: 180, type: 'user', label: 'User 2' },
      { id: 'user3', x: 750, y: 260, type: 'user', label: 'User 3' }
    ],
    connections: [
      // IoT to MQTT
      { from: 'iot1', to: 'mqtt', protocol: 'MQTT' },
      { from: 'iot2', to: 'mqtt', protocol: 'MQTT' },
      { from: 'iot3', to: 'mqtt', protocol: 'MQTT' },
      
      // MQTT to Load Balancers
      { from: 'mqtt', to: 'lb1', protocol: 'HTTP/TCP' },
      { from: 'mqtt', to: 'lb2', protocol: 'HTTP/TCP' },
      
      // Load Balancers to Data Centers
      { from: 'lb1', to: 'dc1', protocol: 'HTTP/TCP' },
      { from: 'lb1', to: 'dc2', protocol: 'HTTP/TCP' },
      { from: 'lb2', to: 'dc2', protocol: 'HTTP/TCP' },
      { from: 'lb2', to: 'dc3', protocol: 'HTTP/TCP' },
      
      // Data Centers to CDN
      { from: 'dc1', to: 'cdn1', protocol: 'HTTP/TCP' },
      { from: 'dc2', to: 'cdn1', protocol: 'HTTP/TCP' },
      { from: 'dc2', to: 'cdn2', protocol: 'HTTP/TCP' },
      { from: 'dc3', to: 'cdn2', protocol: 'HTTP/TCP' },
      
      // CDN to Users
      { from: 'cdn1', to: 'user1', protocol: 'HTTP/TCP' },
      { from: 'cdn1', to: 'user2', protocol: 'HTTP/TCP' },
      { from: 'cdn2', to: 'user2', protocol: 'HTTP/TCP' },
      { from: 'cdn2', to: 'user3', protocol: 'HTTP/TCP' }
    ]
  };
  
  // Alternative OSI-based centralized topology
  const osiTopology = {
    nodes: [
      // End Devices
      { id: 'term1', x: 80, y: 100, type: 'terminal', label: 'Terminal 1' },
      { id: 'term2', x: 80, y: 180, type: 'terminal', label: 'Terminal 2' },
      { id: 'term3', x: 80, y: 260, type: 'terminal', label: 'Terminal 3' },
      
      // Session Layer Controllers
      { id: 'session1', x: 200, y: 140, type: 'session', label: 'Session Control' },
      { id: 'session2', x: 200, y: 220, type: 'session', label: 'Session Control' },
      
      // Presentation Layer
      { id: 'present', x: 350, y: 180, type: 'presentation', label: 'Presentation Layer' },
      
      // Application Layer Gateway
      { id: 'gateway', x: 500, y: 180, type: 'gateway', label: 'OSI Gateway' },
      
      // Centralized Services
      { id: 'service1', x: 650, y: 120, type: 'service', label: 'Service 1' },
      { id: 'service2', x: 650, y: 180, type: 'service', label: 'Service 2' },
      { id: 'service3', x: 650, y: 240, type: 'service', label: 'Service 3' }
    ],
    connections: [
      // Terminals to Session Controllers
      { from: 'term1', to: 'session1', protocol: 'OSI L5' },
      { from: 'term2', to: 'session1', protocol: 'OSI L5' },
      { from: 'term3', to: 'session2', protocol: 'OSI L5' },
      
      // Session to Presentation
      { from: 'session1', to: 'present', protocol: 'OSI L6' },
      { from: 'session2', to: 'present', protocol: 'OSI L6' },
      
      // Presentation to Gateway
      { from: 'present', to: 'gateway', protocol: 'OSI L7' },
      
      // Gateway to Services
      { from: 'gateway', to: 'service1', protocol: 'OSI L7' },
      { from: 'gateway', to: 'service2', protocol: 'OSI L7' },
      { from: 'gateway', to: 'service3', protocol: 'OSI L7' }
    ]
  };
  
  // Node type configurations
  const nodeTypes = {
    iot: { color: [100, 200, 100], size: 25, shape: 'circle' },
    mqtt: { color: [255, 150, 50], size: 35, shape: 'rect' },
    loadbalancer: { color: [50, 150, 255], size: 30, shape: 'diamond' },
    datacenter: { color: [200, 50, 200], size: 40, shape: 'rect' },
    cdn: { color: [255, 200, 50], size: 30, shape: 'hexagon' },
    user: { color: [150, 150, 255], size: 25, shape: 'circle' },
    terminal: { color: [100, 100, 100], size: 25, shape: 'rect' },
    session: { color: [200, 100, 50], size: 30, shape: 'circle' },
    presentation: { color: [50, 200, 150], size: 35, shape: 'rect' },
    gateway: { color: [200, 200, 50], size: 40, shape: 'hexagon' },
    service: { color: [150, 50, 200], size: 30, shape: 'circle' }
  };
  
  p.setup = () => {
    p.createCanvas(canvasWidth, canvasHeight);
    initializeTopology();
    
    // Start with some initial packets
    setTimeout(() => createPacket(), 1000);
    setTimeout(() => createPacket(), 2000);
    setTimeout(() => createPacket(), 3000);
  };
  
  p.draw = () => {
    p.background(15, 20, 35);
    
    // Handle transitions
    if (isTransitioning) {
      updateTransition();
    }
    
    // Update packets
    if (isRunning) {
      updatePackets();
      
      // Create new packets periodically
      if (p.frameCount % (180 / speed) === 0) {
        createPacket();
      }
    }
    
    // Draw network elements
    drawConnections();
    drawNodes();
    drawPackets();
    
    // Draw UI
    drawTopologyInfo();
    drawStats();
  };
  
  function initializeTopology() {
    const topology = currentTopology === 'modern' ? modernTopology : osiTopology;
    nodes = [...topology.nodes];
    connections = [...topology.connections];
    packets = [];
    packetId = 0;
  }
  
  function createPacket() {
    // Define flow patterns for each topology
    const flowPatterns = currentTopology === 'modern' ? [
      ['iot1', 'mqtt', 'lb1', 'dc1', 'cdn1', 'user1'],
      ['iot2', 'mqtt', 'lb2', 'dc2', 'cdn2', 'user2'],
      ['iot3', 'mqtt', 'lb1', 'dc2', 'cdn1', 'user1'],
      ['iot1', 'mqtt', 'lb2', 'dc3', 'cdn2', 'user3'],
      ['user1', 'cdn1', 'dc1', 'lb1', 'mqtt'],
      ['user2', 'cdn2', 'dc2', 'lb2', 'mqtt'],
      ['user3', 'cdn2', 'dc3', 'lb1', 'mqtt']
    ] : [
      ['term1', 'session1', 'present', 'gateway', 'service1'],
      ['term2', 'session1', 'present', 'gateway', 'service2'],
      ['term3', 'session2', 'present', 'gateway', 'service3'],
      ['service1', 'gateway', 'present', 'session1', 'term1'],
      ['service2', 'gateway', 'present', 'session2', 'term3'],
      ['service3', 'gateway', 'present', 'session1', 'term2']
    ];
    
    const pattern = flowPatterns[Math.floor(Math.random() * flowPatterns.length)];
    const sourceNode = nodes.find(n => n.id === pattern[0]);
    const targetNode = nodes.find(n => n.id === pattern[1]);
    
    if (!sourceNode || !targetNode) return;
    
    const connection = connections.find(c => c.from === sourceNode.id && c.to === targetNode.id);
    if (!connection) return;
    
    const packet = {
      id: packetId++,
      sourceId: sourceNode.id,
      targetId: targetNode.id,
      protocol: connection.protocol,
      x: sourceNode.x,
      y: sourceNode.y,
      targetX: targetNode.x,
      targetY: targetNode.y,
      progress: 0,
      trail: [],
      color: getProtocolColor(connection.protocol),
      speed: 0.015 * speed,
      flowPattern: pattern,
      patternIndex: 1
    };
    
    packets.push(packet);
  }
  
  function getProtocolColor(protocol) {
    const colors = {
      'MQTT': [100, 255, 100],
      'HTTP/TCP': [100, 150, 255],
      'OSI L5': [255, 200, 100],
      'OSI L6': [255, 150, 200],
      'OSI L7': [200, 100, 255]
    };
    return colors[protocol] || [150, 150, 150];
  }
  
  function updatePackets() {
    for (let i = packets.length - 1; i >= 0; i--) {
      const packet = packets[i];
      
      // Add current position to trail
      packet.trail.push({ x: packet.x, y: packet.y });
      if (packet.trail.length > 15) {
        packet.trail.shift();
      }
      
      // Update position
      packet.progress += packet.speed;
      
      if (packet.progress >= 1) {
        // Packet reached destination - continue along flow pattern
        if (packet.patternIndex < packet.flowPattern.length - 1) {
          // Move to next node in the pattern
          packet.patternIndex++;
          const nextNodeId = packet.flowPattern[packet.patternIndex];
          const nextNode = nodes.find(n => n.id === nextNodeId);
          const currentNode = nodes.find(n => n.id === packet.targetId);
          
          if (nextNode && currentNode) {
            const connection = connections.find(c => c.from === packet.targetId && c.to === nextNodeId);
            
            if (connection) {
              // Update packet for next hop
              packet.sourceId = packet.targetId;
              packet.targetId = nextNode.id;
              packet.x = currentNode.x;
              packet.y = currentNode.y;
              packet.targetX = nextNode.x;
              packet.targetY = nextNode.y;
              packet.progress = 0;
              packet.protocol = connection.protocol;
              packet.color = getProtocolColor(connection.protocol);
              packet.trail = [];
              continue;
            }
          }
        }
        
        // End of pattern or no valid connection - remove packet
        packets.splice(i, 1);
      } else {
        // Interpolate position
        const sourceNode = nodes.find(n => n.id === packet.sourceId);
        const targetNode = nodes.find(n => n.id === packet.targetId);
        if (sourceNode && targetNode) {
          packet.x = p.lerp(sourceNode.x, targetNode.x, packet.progress);
          packet.y = p.lerp(sourceNode.y, targetNode.y, packet.progress);
        }
      }
    }
  }
  
  function drawConnections() {
    for (const conn of connections) {
      const fromNode = nodes.find(n => n.id === conn.from);
      const toNode = nodes.find(n => n.id === conn.to);
      
      if (fromNode && toNode) {
        // Draw connection line
        p.stroke(60, 80, 120, 150);
        p.strokeWeight(2);
        p.line(fromNode.x, fromNode.y, toNode.x, toNode.y);
        
        // Draw protocol label
        if (showLabels) {
          const midX = (fromNode.x + toNode.x) / 2;
          const midY = (fromNode.y + toNode.y) / 2;
          
          // Add background for better text readability
          p.fill(0, 0, 0, 120);
          p.noStroke();
          p.rectMode(p.CENTER);
          p.rect(midX, midY, p.textWidth(conn.protocol) + 4, 12);
          
          // Draw text
          p.fill(200, 200, 200, 255);
          p.textAlign(p.CENTER, p.CENTER);
          p.textSize(9);
          p.text(conn.protocol, midX, midY);
        }
      }
    }
  }
  
  function drawNodes() {
    for (const node of nodes) {
      const config = nodeTypes[node.type] || { color: [150, 150, 150], size: 25, shape: 'circle' };
      
      p.fill(config.color);
      p.stroke(255, 255, 255, 200);
      p.strokeWeight(2);
      
      // Draw node shape
      switch (config.shape) {
        case 'circle':
          p.ellipse(node.x, node.y, config.size, config.size);
          break;
        case 'rect':
          p.rectMode(p.CENTER);
          p.rect(node.x, node.y, config.size, config.size);
          break;
        case 'diamond':
          drawDiamond(node.x, node.y, config.size);
          break;
        case 'hexagon':
          drawHexagon(node.x, node.y, config.size);
          break;
      }
      
      // Draw node label
      if (showLabels) {
        p.fill(255);
        p.noStroke();
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(10);
        p.text(node.id.toUpperCase(), node.x, node.y);
        
        // Draw full label below
        p.textSize(8);
        p.text(node.label, node.x, node.y + config.size/2 + 12);
      }
    }
  }
  
  function drawDiamond(x, y, size) {
    p.beginShape();
    p.vertex(x, y - size/2);
    p.vertex(x + size/2, y);
    p.vertex(x, y + size/2);
    p.vertex(x - size/2, y);
    p.endShape(p.CLOSE);
  }
  
  function drawHexagon(x, y, size) {
    p.beginShape();
    for (let i = 0; i < 6; i++) {
      const angle = p.TWO_PI / 6 * i;
      const px = x + p.cos(angle) * size/2;
      const py = y + p.sin(angle) * size/2;
      p.vertex(px, py);
    }
    p.endShape(p.CLOSE);
  }
  
  function drawPackets() {
    for (const packet of packets) {
      // Draw trail
      p.noFill();
      p.strokeWeight(3);
      
      for (let i = 0; i < packet.trail.length - 1; i++) {
        const alpha = (i / packet.trail.length) * 100;
        p.stroke(packet.color[0], packet.color[1], packet.color[2], alpha);
        
        if (i < packet.trail.length - 1) {
          p.line(packet.trail[i].x, packet.trail[i].y, 
                packet.trail[i + 1].x, packet.trail[i + 1].y);
        }
      }
      
      // Draw packet
      p.fill(packet.color);
      p.stroke(255, 255, 255, 200);
      p.strokeWeight(2);
      p.ellipse(packet.x, packet.y, 12, 12);
      
      // Draw packet ID
      p.fill(255);
      p.noStroke();
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(8);
      p.text(packet.id, packet.x, packet.y - 16);
    }
  }
  
  function drawTopologyInfo() {
    // Info panel
    p.fill(0, 0, 0, 180);
    p.noStroke();
    p.rect(10, 10, 280, 80);
    
    p.fill(255);
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(14);
    p.textStyle(p.BOLD);
    p.text(currentTopology === 'modern' ? 'Modern Internet (TCP/IP)' : 'OSI-based Architecture', 20, 25);
    
    p.textSize(11);
    p.textStyle(p.NORMAL);
    if (currentTopology === 'modern') {
      p.text('Distributed, end-to-end intelligence', 20, 45);
      p.text('Protocols: MQTT, HTTP/TCP, CDN', 20, 60);
    } else {
      p.text('Centralized, layer-by-layer processing', 20, 45);
      p.text('Protocols: OSI L5/L6/L7 with strict layering', 20, 60);
    }
  }
  
  function drawStats() {
    // Stats panel
    p.fill(0, 0, 0, 180);
    p.noStroke();
    p.rect(canvasWidth - 180, 10, 170, 60);
    
    p.fill(255);
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(11);
    p.text(`Active Packets: ${packets.length}`, canvasWidth - 170, 25);
    p.text(`Status: ${isRunning ? 'Running' : 'Paused'}`, canvasWidth - 170, 40);
    p.text(`Speed: ${speed}x`, canvasWidth - 170, 55);
  }
  
  function updateTransition() {
    transitionProgress += 0.05;
    
    if (transitionProgress >= 1) {
      transitionProgress = 0;
      isTransitioning = false;
      initializeTopology();
    }
  }
  
  function switchTopology() {
    if (isTransitioning) return;
    
    currentTopology = currentTopology === 'modern' ? 'osi' : 'modern';
    isTransitioning = true;
    transitionProgress = 0;
    
    // Clear existing packets during transition
    packets = [];
  }
  
  // Control functions
  window.switchProtocols = () => {
    switchTopology();
  };
  
  window.resetNetworkSimulation = () => {
    packets = [];
    packetId = 0;
    isRunning = true;
    
    // Start with some initial packets
    setTimeout(() => createPacket(), 500);
    setTimeout(() => createPacket(), 1000);
    setTimeout(() => createPacket(), 1500);
  };
  
  window.pauseNetworkSimulation = () => {
    isRunning = !isRunning;
  };
  
  window.updateNetworkSpeed = (newSpeed) => {
    speed = parseFloat(newSpeed);
  };
  
  window.toggleLabels = () => {
    showLabels = !showLabels;
  };
};

// Initialize the sketch
function initModernInternetTopology() {
  if (typeof p5 !== 'undefined') {
    new p5(modernInternetTopology, 'modern-internet-topology');
  } else {
    setTimeout(initModernInternetTopology, 100);
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initModernInternetTopology);
} else {
  initModernInternetTopology();
}