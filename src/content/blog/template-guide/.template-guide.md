---
title: 'Blog Post Template Guide'
description: 'A comprehensive template showcasing all available features for creating technical blog posts about networking algorithms and system design'
pubDate: 'Jul 18 2025'
heroImage: '../../../assets/blog-placeholder-1.jpg'
---

# Blog Post Template Guide

This comprehensive template demonstrates all the features available for creating technical blog posts about networking algorithms and system design. Use this as a reference when drafting your own posts.

## Typography and Text Formatting

### Headings

The theme supports six levels of headings. Use them to create a clear hierarchy:

# H1 - Main Title (Reserved for Post Title)
## H2 - Major Sections
### H3 - Subsections
#### H4 - Sub-subsections
##### H5 - Minor Headings
###### H6 - Smallest Headings

### Text Styling

You can use **bold text** for emphasis, *italic text* for subtle emphasis, and ***bold italic*** for strong emphasis.

Use `inline code` for variable names, function names, and short code snippets.

## Lists and Structure

### Unordered Lists

- First item
- Second item
  - Nested item
  - Another nested item
- Third item

### Ordered Lists

1. First step
2. Second step
   1. Nested step
   2. Another nested step
3. Third step

### Task Lists

- [x] Completed task
- [ ] Incomplete task
- [x] Another completed task

## Code Examples

### Inline Code

Use `inline code` for short snippets like variable names: `packetSize`, function calls: `calculateRTT()`, or file paths: `/etc/network/interfaces`.

### Code Blocks

Here's a simple Python function:

```python
def dijkstra(graph, start):
    """
    Dijkstra's algorithm for finding shortest paths
    in a weighted graph - essential for network routing.
    """
    distances = {node: float('infinity') for node in graph}
    distances[start] = 0
    visited = set()
    
    while len(visited) < len(graph):
        current = min(
            [node for node in distances if node not in visited],
            key=lambda node: distances[node]
        )
        visited.add(current)
        
        for neighbor, weight in graph[current].items():
            if neighbor not in visited:
                new_distance = distances[current] + weight
                if new_distance < distances[neighbor]:
                    distances[neighbor] = new_distance
    
    return distances
```

### JavaScript Example

```javascript
// TCP Congestion Control Simulation
class TCPCongestionControl {
    constructor() {
        this.cwnd = 1; // Congestion window
        this.ssthresh = 16; // Slow start threshold
        this.state = 'slow_start';
    }
    
    onAckReceived() {
        if (this.state === 'slow_start') {
            this.cwnd += 1;
            if (this.cwnd >= this.ssthresh) {
                this.state = 'congestion_avoidance';
            }
        } else if (this.state === 'congestion_avoidance') {
            this.cwnd += 1 / this.cwnd;
        }
    }
    
    onPacketLoss() {
        this.ssthresh = Math.max(this.cwnd / 2, 2);
        this.cwnd = 1;
        this.state = 'slow_start';
    }
}
```

### Rust Example

```rust
// High-performance packet parser
use std::net::Ipv4Addr;

#[derive(Debug)]
pub struct PacketHeader {
    pub version: u8,
    pub header_length: u8,
    pub total_length: u16,
    pub ttl: u8,
    pub protocol: u8,
    pub source_addr: Ipv4Addr,
    pub dest_addr: Ipv4Addr,
}

impl PacketHeader {
    pub fn parse(data: &[u8]) -> Result<Self, &'static str> {
        if data.len() < 20 {
            return Err("Packet too short");
        }
        
        let version = (data[0] >> 4) & 0x0F;
        let header_length = (data[0] & 0x0F) * 4;
        
        if version != 4 {
            return Err("Not IPv4");
        }
        
        Ok(PacketHeader {
            version,
            header_length,
            total_length: u16::from_be_bytes([data[2], data[3]]),
            ttl: data[8],
            protocol: data[9],
            source_addr: Ipv4Addr::from([data[12], data[13], data[14], data[15]]),
            dest_addr: Ipv4Addr::from([data[16], data[17], data[18], data[19]]),
        })
    }
}
```

## Blockquotes

Use blockquotes for important notes, citations, or emphasis:

> "The Internet is not a single network but a network of networks, each maintaining its own identity while being able to communicate with other networks."
> 
> — The fundamental principle of internetworking

> **Note:** Always consider the trade-offs between latency and throughput when designing network protocols.

## Tables

| Algorithm | Time Complexity | Space Complexity | Use Case |
|-----------|----------------|------------------|----------|
| Dijkstra | O(V²) | O(V) | Shortest path in weighted graphs |
| Bellman-Ford | O(VE) | O(V) | Shortest path with negative weights |
| Floyd-Warshall | O(V³) | O(V²) | All-pairs shortest paths |
| A* | O(b^d) | O(b^d) | Heuristic shortest path |

## Mathematical Expressions

You can include mathematical expressions using LaTeX syntax:

The bandwidth-delay product is calculated as:
$$BDP = Bandwidth \\times RTT$$

For TCP window scaling:
$$Window\\_Size = min(Advertised\\_Window, Congestion\\_Window)$$

## Images and Media

![Network Topology Example](../../../assets/template-guide/blog-placeholder-3.jpg)
*Figure 1: Example network topology showing interconnected routers*

### Images with Captions

You can add descriptive captions to help explain complex diagrams or screenshots.

## Interactive Elements

### P5.js Sketch Container

Here's how to embed interactive p5.js sketches for visualizing network algorithms. Multiple sketches can be included in the same post:

#### Network Packet Flow Visualization

<div class="p5-container">
    <h4 class="sketch-title">Network Packet Flow Visualization</h4>
    <div id="network-packet-flow-sketch"></div>
    <div class="sketch-controls">
        <button onclick="resetSimulation()">Reset</button>
        <button onclick="pauseSimulation()">Pause/Resume</button>
        <div class="control-group">
            <label>Speed:</label>
            <input type="range" min="1" max="10" value="1" onchange="updateSpeed(this.value)">
        </div>
        <div class="control-group">
            <label>Max Packets:</label>
            <input type="number" min="1" max="20" value="10" onchange="updatePacketCount(this.value)">
        </div>
    </div>
</div>

<script src="/sketches/template-guide/network-packet-flow-sketch.js"></script>

This interactive visualization shows how packets flow through a network topology. The sketch demonstrates:

- **Packet Routing**: Packets travel from source to destination through intermediate nodes
- **Network Topology**: Shows routers (blue) and switches (green) with weighted connections
- **Real-time Animation**: Watch packets move through the network with visual trails
- **Interactive Controls**: Adjust speed, pause/resume, and control packet generation

#### TCP Congestion Control Visualization

<div class="p5-container">
    <h4 class="sketch-title">TCP Congestion Control Algorithm</h4>
    <div id="tcp-congestion-sketch"></div>
    <div class="sketch-controls">
        <button onclick="resetTCPSimulation()">Reset</button>
        <button onclick="pauseTCPSimulation()">Pause/Resume</button>
        <button onclick="addPacketLoss()">Add Packet Loss</button>
        <div class="control-group">
            <label>Speed:</label>
            <input type="range" min="1" max="5" value="1" onchange="updateTCPSpeed(this.value)">
        </div>
    </div>
</div>

<script src="/sketches/template-guide/tcp-congestion-sketch.js"></script>

This visualization demonstrates TCP's congestion control algorithm:

- **Slow Start**: Exponential growth phase (green indicator)
- **Congestion Avoidance**: Linear growth phase (red indicator)
- **Packet Loss Events**: Trigger multiplicative decrease
- **Dynamic Threshold**: SSThresh adapts based on network conditions

**How to use p5.js sketches with external script files:**

Organize your sketches in the `public/sketches/` directory for proper serving:

```
public/sketches/your-post-name/
├── sketch-1.js                    # First sketch
├── sketch-2.js                    # Second sketch
└── additional-sketch.js           # Additional sketches

src/content/blog/your-post-name/
└── your-post-name.md              # Your blog post content
```

**Steps to add sketches:**

1. **Create your sketch file** in `public/sketches/your-post-name/` directory
2. **Add the HTML container** with a unique ID in your markdown
3. **Include the script tag** right after the container with the correct path
4. **Make sure your sketch uses the correct parent ID**

**Example implementation:**
```html
<!-- In your markdown content -->
<div class="p5-container">
    <h4 class="sketch-title">Your Sketch Title</h4>
    <div id="your-sketch-container"></div>
    <div class="sketch-controls">
        <button onclick="resetYourSketch()">Reset</button>
    </div>
</div>

<script src="/sketches/your-post-name/your-sketch-file.js"></script>
```

**Your sketch JavaScript file** (`your-sketch-file.js`):
```javascript
// Use p5.js instance mode to avoid variable conflicts
const yourSketchName = (p) => {
  let myVariable = 0;
  let isRunning = true;
  
  p.setup = () => {
    p.createCanvas(600, 400);
    
    // Your sketch setup code
  };

  p.draw = () => {
    p.background(20, 25, 40);
    
    // Your sketch drawing code
    // Use p.function() for all p5.js functions
    p.fill(255);
    p.ellipse(p.width/2, p.height/2, 50, 50);
  };

  // Control functions (make globally available for onclick handlers)
  window.resetYourSketch = () => {
    myVariable = 0;
    isRunning = true;
    // Reset logic
  };
  
  window.pauseYourSketch = () => {
    isRunning = !isRunning;
  };
};

// Create the sketch instance when p5.js is loaded
function initYourSketch() {
  if (typeof p5 !== 'undefined') {
    new p5(yourSketchName, 'your-sketch-container');
  } else {
    // Wait for p5.js to load
    setTimeout(initYourSketch, 100);
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initYourSketch);
} else {
  initYourSketch();
}
```

**Key points:**
- **Use p5.js instance mode** to avoid variable conflicts between multiple sketches
- **Prefix all p5.js functions** with `p.` (e.g., `p.createCanvas()`, `p.fill()`, `p.ellipse()`)
- **Wait for p5.js to load** before creating sketch instances to avoid undefined errors
- **Use absolute paths** like `/sketches/your-post-name/your-sketch-file.js` 
- **Store sketch files** in the `public/sketches/` directory for proper serving
- **Make control functions global** via `window.functionName` for onclick handlers
- **Organize by post name** for easy management
- **Multiple sketches per post** work without conflicts thanks to instance mode

## Horizontal Rules

Use horizontal rules to separate major sections:

---

## Links and References

- [RFC 793 - TCP Protocol](https://tools.ietf.org/html/rfc793)
- [Network Algorithms Research](https://example.com/network-algorithms)
- [Protocol Design Patterns](https://example.com/protocol-patterns)

Internal links to other posts:
- [Previous post about routing algorithms](/blog/routing-algorithms)
- [Next post about congestion control](/blog/congestion-control)

## Advanced Features

### Nested Lists with Code

1. **Setup Phase**
   ```bash
   # Initialize network interface
   sudo ip link set eth0 up
   sudo ip addr add 192.168.1.100/24 dev eth0
   ```

2. **Configuration Phase**
   - Edit configuration files
   - Update routing tables
   - Test connectivity

3. **Monitoring Phase**
   ```bash
   # Monitor network traffic
   tcpdump -i eth0 -n
   ```

### Definition Lists

TCP
: Transmission Control Protocol - A reliable, connection-oriented protocol

UDP
: User Datagram Protocol - A fast, connectionless protocol

BGP
: Border Gateway Protocol - The routing protocol of the Internet

## Best Practices

### Code Comments

Always include clear comments in your code examples:

```python
# Calculate network latency using ping
def measure_latency(host, count=4):
    """
    Measure network latency to a host using ping.
    
    Args:
        host (str): Target hostname or IP address
        count (int): Number of ping packets to send
    
    Returns:
        float: Average latency in milliseconds
    """
    import subprocess
    import re
    
    try:
        # Execute ping command
        result = subprocess.run(
            ['ping', '-c', str(count), host], 
            capture_output=True, 
            text=True, 
            timeout=30
        )
        
        # Parse output for latency statistics
        if result.returncode == 0:
            output = result.stdout
            # Extract average latency using regex
            match = re.search(r'rtt min/avg/max/mdev = [\d.]+/([\d.]+)', output)
            if match:
                return float(match.group(1))
        
        return None
        
    except subprocess.TimeoutExpired:
        return None
```

### Diagrams and Flowcharts

Use ASCII art or describe complex network diagrams:

```
Network Topology:
    
    [Router A] ---- [Switch] ---- [Router B]
        |                           |
    [Host 1]                   [Host 2]
        |                           |
    192.168.1.10              192.168.2.10
```

## Conclusion

This template demonstrates all the key features available for creating comprehensive technical blog posts about networking algorithms and system design. Use these elements to create engaging, informative content that helps readers understand complex networking concepts.

Remember to:
- Use clear, descriptive headings
- Include practical code examples
- Add interactive elements where appropriate
- Provide proper citations and references
- Test all code snippets before publishing

---

*This template serves as a starting point for creating high-quality technical content. Customize it according to your specific needs and the complexity of the topics you're covering.*