// TCP/IP Packet Flow Visualization
// Interactive visualization showing packet encapsulation and transmission

const tcpIpPacketFlow = (p) => {
  let packet = null;
  let animationState = 'idle'; // idle, wrapping, transmitting, unwrapping
  let animationProgress = 0;
  let selectedLayer = null;
  let showDetails = false;
  let packetId = 1;
  
  const canvasWidth = 800;
  const canvasHeight = 600;
  
  // Layer definitions with detailed header information
  const layers = [
    {
      id: 'application',
      name: 'Application Layer',
      color: [100, 200, 100],
      y: 450,
      headerInfo: {
        title: 'HTTP Request',
        fields: [
          'Method: GET',
          'URL: /api/users',
          'Host: example.com',
          'User-Agent: Browser/1.0',
          'Accept: application/json'
        ],
        description: 'Your application creates the actual data to be sent. In this example, an HTTP GET request to fetch user data.'
      }
    },
    {
      id: 'transport',
      name: 'Transport Layer (TCP)',
      color: [100, 150, 255],
      y: 350,
      headerInfo: {
        title: 'TCP Header',
        fields: [
          'Source Port: 54321',
          'Dest Port: 80 (HTTP)',
          'Sequence Number: 12345',
          'Window Size: 65535',
          'Flags: SYN, ACK'
        ],
        description: 'TCP adds reliability, flow control, and port numbers. It ensures your data arrives intact and in order.'
      }
    },
    {
      id: 'internet',
      name: 'Internet Layer (IP)',
      color: [255, 200, 100],
      y: 250,
      headerInfo: {
        title: 'IP Header',
        fields: [
          'Version: 4 (IPv4)',
          'Source IP: 192.168.1.100',
          'Dest IP: 203.0.113.1',
          'TTL: 64',
          'Protocol: 6 (TCP)'
        ],
        description: 'IP handles addressing and routing. It knows how to get your packet from your computer to the destination across the Internet.'
      }
    },
    {
      id: 'link',
      name: 'Link Layer (Ethernet)',
      color: [255, 150, 200],
      y: 150,
      headerInfo: {
        title: 'Ethernet Header',
        fields: [
          'Dest MAC: AA:BB:CC:DD:EE:FF',
          'Source MAC: 11:22:33:44:55:66',
          'EtherType: 0x0800 (IP)',
          'Frame Check: CRC32',
          'Preamble: 10101010...'
        ],
        description: 'Ethernet handles the physical transmission over your local network. MAC addresses identify network cards.'
      }
    }
  ];
  
  // Network elements
  const sourceHost = { x: 280, y: 300, label: 'Your Computer' };
  const destHost = { x: 650, y: 300, label: 'Web Server' };
  const networkPath = { startX: 380, endX: 550, y: 50 };
  
  p.setup = () => {
    p.createCanvas(canvasWidth, canvasHeight);
    initializePacket();
  };
  
  p.draw = () => {
    p.background(15, 20, 35);
    
    // Draw network infrastructure
    drawNetworkElements();
    
    // Draw layers
    drawLayers();
    
    // Draw packet
    if (packet) {
      drawPacket();
    }
    
    // Update animation
    updateAnimation();
    
    // Draw details panel
    if (showDetails && selectedLayer) {
      drawDetailsPanel();
    }
    
    // Draw controls
    drawControls();
    
    // Draw status
    drawStatus();
  };
  
  function initializePacket() {
    packet = {
      id: packetId++,
      x: sourceHost.x,
      y: sourceHost.y,
      layers: [],
      currentLayer: -1,
      size: 20,
      maxSize: 80
    };
    animationState = 'idle';
    animationProgress = 0;
  }
  
  function startPacketFlow() {
    if (animationState !== 'idle') return;
    
    initializePacket();
    animationState = 'wrapping';
    animationProgress = 0;
  }
  
  function updateAnimation() {
    const speed = 0.02;
    
    switch (animationState) {
      case 'wrapping':
        animationProgress += speed;
        
        // Add layers progressively
        const layerIndex = Math.floor(animationProgress * layers.length);
        if (layerIndex > packet.currentLayer && layerIndex < layers.length) {
          packet.currentLayer = layerIndex;
          packet.layers.push({
            ...layers[layerIndex],
            added: true
          });
          
          // Grow packet size
          packet.size = Math.min(packet.maxSize, 20 + (packet.layers.length * 15));
        }
        
        if (animationProgress >= 1) {
          animationState = 'transmitting';
          animationProgress = 0;
        }
        break;
        
      case 'transmitting':
        animationProgress += speed * 0.8;
        
        // Move packet along network path
        packet.x = p.lerp(sourceHost.x, destHost.x, animationProgress);
        packet.y = p.lerp(sourceHost.y, networkPath.y, Math.sin(animationProgress * p.PI));
        
        if (animationProgress >= 1) {
          packet.x = destHost.x;
          packet.y = destHost.y;
          animationState = 'unwrapping';
          animationProgress = 0;
        }
        break;
        
      case 'unwrapping':
        animationProgress += speed;
        
        // Remove layers progressively
        const remainingLayers = layers.length - Math.floor(animationProgress * layers.length);
        if (remainingLayers !== packet.layers.length) {
          packet.layers.pop();
          packet.size = Math.max(20, 20 + (packet.layers.length * 15));
        }
        
        if (animationProgress >= 1) {
          animationState = 'idle';
          animationProgress = 0;
        }
        break;
    }
  }
  
  function drawNetworkElements() {
    // Draw hosts
    p.fill(80, 80, 120);
    p.stroke(255);
    p.strokeWeight(2);
    p.rectMode(p.CENTER);
    p.rect(sourceHost.x, sourceHost.y, 60, 40);
    p.rect(destHost.x, destHost.y, 60, 40);
    
    // Host labels
    p.fill(255);
    p.noStroke();
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(12);
    p.text(sourceHost.label, sourceHost.x, sourceHost.y + 30);
    p.text(destHost.label, destHost.x, destHost.y + 30);
    
    // Network path
    p.stroke(100, 100, 150, 100);
    p.strokeWeight(3);
    p.line(sourceHost.x + 30, sourceHost.y, networkPath.startX, networkPath.y);
    p.line(networkPath.startX, networkPath.y, networkPath.endX, networkPath.y);
    p.line(networkPath.endX, networkPath.y, destHost.x - 30, destHost.y);
    
    // Network cloud
    p.fill(50, 50, 80, 100);
    p.noStroke();
    p.ellipse((networkPath.startX + networkPath.endX) / 2, networkPath.y, 150, 60);
    
    p.fill(150, 150, 200);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(14);
    p.text('Internet', (networkPath.startX + networkPath.endX) / 2, networkPath.y);
  }
  
  function drawLayers() {
    // Draw layer stack on the left
    p.textAlign(p.LEFT, p.CENTER);
    p.textSize(14);
    
    for (let i = 0; i < layers.length; i++) {
      const layer = layers[i];
      const isActive = packet && packet.currentLayer >= i;
      const isSelected = selectedLayer === layer.id;
      
      // Layer box
      p.fill(isActive ? layer.color : [layer.color[0] * 0.3, layer.color[1] * 0.3, layer.color[2] * 0.3]);
      p.stroke(isSelected ? 255 : 150);
      p.strokeWeight(isSelected ? 3 : 1);
      p.rectMode(p.CORNER);
      p.rect(20, layer.y - 25, 240, 50);
      
      // Layer name
      p.fill(255);
      p.noStroke();
      p.text(layer.name, 30, layer.y);
      
      // Click indicator
      if (isActive) {
        p.fill(255, 255, 255, 100);
        p.textSize(10);
        p.text('(click for details)', 30, layer.y + 15);
      }
    }
  }
  
  function drawPacket() {
    // Packet visualization
    p.stroke(255);
    p.strokeWeight(2);
    
    // Draw packet layers as concentric rectangles
    for (let i = packet.layers.length - 1; i >= 0; i--) {
      const layer = packet.layers[i];
      const size = packet.size + (packet.layers.length - i - 1) * 8;
      
      p.fill(layer.color[0], layer.color[1], layer.color[2], 180);
      p.rectMode(p.CENTER);
      p.rect(packet.x, packet.y, size, size * 0.6);
    }
    
    // Core data
    if (packet.layers.length === 0 || animationState === 'unwrapping') {
      p.fill(255, 255, 255);
      p.rectMode(p.CENTER);
      p.rect(packet.x, packet.y, 20, 12);
      
      p.fill(0);
      p.noStroke();
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(8);
      p.text('DATA', packet.x, packet.y);
    }
    
    // Packet ID
    p.fill(255);
    p.noStroke();
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(10);
    p.text(`Packet ${packet.id}`, packet.x, packet.y - packet.size/2 - 15);
  }
  
  function drawDetailsPanel() {
    const layer = layers.find(l => l.id === selectedLayer);
    if (!layer) return;
    
    // Panel background
    p.fill(0, 0, 0, 200);
    p.stroke(layer.color);
    p.strokeWeight(2);
    p.rectMode(p.CORNER);
    p.rect(300, 400, 480, 180);
    
    // Title
    p.fill(255);
    p.noStroke();
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(16);
    p.textStyle(p.BOLD);
    p.text(layer.headerInfo.title, 320, 420);
    
    // Header fields
    p.textSize(12);
    p.textStyle(p.NORMAL);
    p.fill(200, 255, 200);
    
    let yPos = 450;
    for (const field of layer.headerInfo.fields) {
      p.text(field, 320, yPos);
      yPos += 18;
    }
    
    // Description
    p.fill(220, 220, 220);
    p.textSize(11);
    const words = layer.headerInfo.description.split(' ');
    let line = '';
    yPos = 540;
    
    for (const word of words) {
      const testLine = line + word + ' ';
      if (p.textWidth(testLine) > 440 && line !== '') {
        p.text(line, 320, yPos);
        line = word + ' ';
        yPos += 15;
      } else {
        line = testLine;
      }
    }
    if (line !== '') {
      p.text(line, 320, yPos);
    }
    
    // Close button
    p.fill(255, 100, 100);
    p.stroke(255);
    p.strokeWeight(1);
    p.rectMode(p.CENTER);
    p.rect(760, 420, 20, 20);
    
    p.fill(255);
    p.noStroke();
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(12);
    p.text('×', 760, 420);
  }
  
  function drawControls() {
    // Control buttons
    p.fill(animationState === 'idle' ? [80, 150, 80] : [60, 60, 60]);
    p.stroke(255);
    p.strokeWeight(2);
    p.rectMode(p.CENTER);
    p.rect(400, 50, 120, 40);
    
    p.fill(255);
    p.noStroke();
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(14);
    p.text(animationState === 'idle' ? 'Send Packet' : 'Sending...', 400, 50);
    
    // Reset button
    p.fill(150, 80, 80);
    p.stroke(255);
    p.strokeWeight(2);
    p.rect(550, 50, 80, 40);
    
    p.fill(255);
    p.noStroke();
    p.text('Reset', 550, 50);
  }
  
  function drawStatus() {
    // Status panel
    p.fill(0, 0, 0, 150);
    p.noStroke();
    p.rectMode(p.CORNER);
    p.rect(20, 20, 250, 60);
    
    p.fill(255);
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(12);
    p.text(`Status: ${getStatusText()}`, 30, 35);
    p.text(`Layers: ${packet ? packet.layers.length : 0}/4`, 30, 55);
  }
  
  function getStatusText() {
    switch (animationState) {
      case 'idle': return 'Ready to send';
      case 'wrapping': return 'Adding headers...';
      case 'transmitting': return 'Transmitting over network';
      case 'unwrapping': return 'Removing headers...';
      default: return 'Unknown';
    }
  }
  
  // Mouse interaction
  p.mousePressed = () => {
    // Check layer clicks
    for (const layer of layers) {
      if (packet && packet.currentLayer >= layers.indexOf(layer) &&
          p.mouseX >= 20 && p.mouseX <= 260 &&
          p.mouseY >= layer.y - 25 && p.mouseY <= layer.y + 25) {
        selectedLayer = layer.id;
        showDetails = true;
        return;
      }
    }
    
    // Check close button
    if (showDetails && 
        p.mouseX >= 750 && p.mouseX <= 770 &&
        p.mouseY >= 410 && p.mouseY <= 430) {
      showDetails = false;
      selectedLayer = null;
      return;
    }
    
    // Check send button
    if (p.mouseX >= 340 && p.mouseX <= 460 &&
        p.mouseY >= 30 && p.mouseY <= 70) {
      startPacketFlow();
      return;
    }
    
    // Check reset button
    if (p.mouseX >= 510 && p.mouseX <= 590 &&
        p.mouseY >= 30 && p.mouseY <= 70) {
      initializePacket();
      showDetails = false;
      selectedLayer = null;
      return;
    }
    
    // Click elsewhere to close details
    if (showDetails) {
      showDetails = false;
      selectedLayer = null;
    }
  };
  
  // Control functions
  window.sendTCPPacket = () => {
    startPacketFlow();
  };
  
  window.resetTCPPacket = () => {
    initializePacket();
    showDetails = false;
    selectedLayer = null;
  };
};

// Initialize the sketch
function initTcpIpPacketFlow() {
  if (typeof p5 !== 'undefined') {
    new p5(tcpIpPacketFlow, 'tcp-ip-packet-flow');
  } else {
    setTimeout(initTcpIpPacketFlow, 100);
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTcpIpPacketFlow);
} else {
  initTcpIpPacketFlow();
}