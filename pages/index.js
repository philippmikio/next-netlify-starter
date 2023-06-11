//IMPORT
import Head from 'next/head';
import Header from '@components/Header';
import Footer from '@components/Footer';
import { useEffect } from 'react';
import * as d3 from 'd3';
import { data } from './data.js';

//DATA PROCESSING AND SETUP
let nodes = data.nodes;
let edges = data.edges;
// Create a map for quick lookup of nodes using ids
let nodeMap = new Map(nodes.map(node => [node.id, node]));
// Replace source and target ids in edges with actual node objects
edges = edges.map(edge => {
  return {
    ...edge,
    source: nodeMap.get(edge.source),
    target: nodeMap.get(edge.target)
  }
});


//SVG RENDERING AND ELEMENTS
export default function Home() {
  useEffect(() => {

    const width = 400;  // width of SVG container
    const height = 400; // height of SVG container
    const radius = 25;  // radius of nodes

    const svg = d3.select('#graph-container')
      .append('svg')
      .attr('width', 500)
      .attr('height', 500)


      const nodeElements = svg.selectAll('circle')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('r', 22)
      .attr('fill', 'red')
      .attr('stroke', 'black')
      .attr('stroke-width', 2);

      const nodeRadius = 20; // Adjust this value to match the radius of your nodes

      const edgeElements = svg
      .selectAll('.edge')
      .data(edges)
      .enter()
      .append('line')
      .attr('class', 'edge')
      .attr('stroke', 'steelblue')
      .attr('marker-end', 'url(#arrowhead)') // Attach the arrowhead marker to the end of the line
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', function(d) {
        let dx = d.target.x - d.source.x;
        let dy = d.target.y - d.source.y;
        let angle = Math.atan2(dy, dx);
        return d.target.x - Math.cos(angle) * radius;
      })
      .attr('y2', function(d) {
        let dx = d.target.x - d.source.x;
        let dy = d.target.y - d.source.y;
        let angle = Math.atan2(dy, dx);
        return d.target.y - Math.sin(angle) * radius;
      });    
    // Create the marker element for the arrowhead
    svg.append('defs').append('marker')
    .attr('id', 'arrowhead')
    .attr('viewBox', '-5 -5 10 10')
    .attr('refX', 10)  // X-coordinate of the reference point of the marker. Adjust as needed.
    .attr('refY', 0)   // Y-coordinate of the reference point of the marker. Adjust as needed.
    .attr('markerWidth', 8)
    .attr('markerHeight', 8)
    .attr('orient', 'auto')
    .append('path')
    .attr('d', 'M 0,0 m -5,-5 L 5,0 L -5,5 Z')  // Path for the arrowhead shape. Adjust as needed.
    .attr('fill', 'steelblue');  // Fill color of the arrowhead. Adjust as needed.

const textElements = svg.selectAll('text')
  .data(nodes)
  .enter()
  .append('text')
  .text(d => d.name)
  .attr('font-size', 15)
  .attr('dx', 25) // change this to adjust the horizontal position
  .attr('dy', -5); // change this to adjust the vertical position


// Edge/Link Setup
  var link = svg.append("g")
  .attr("class", "links")
  .selectAll("line")
  .data(edges)
  .enter().append("line")
  .attr('class', 'edge')
  .attr('stroke', 'steelblue')
  .attr('marker-end', 'url(#arrowhead)');

// Simulation
var simulation = d3.forceSimulation(nodes)
  .force("link", d3.forceLink(edges).distance(30))  // adjust distance as needed
  .force("charge", d3.forceManyBody().strength(-400))  // adjust strength as needed
  .force("center", d3.forceCenter(width / 2, height / 2))
  .force('x', d3.forceX(200).strength(0.1))
  .force('y', d3.forceY(200).strength(0.1))
  .force('collide', d3.forceCollide(55));

// Attach a "tick" handler to the simulation AND Make edges stop at the edge of the nodes.
simulation.on("tick", function() {
  link.attr("x1", function(d) { 
      let dx = d.source.x - d.target.x;
      let dy = d.source.y - d.target.y;
      let angle = Math.atan2(dy, dx);
      return d.source.x - Math.cos(angle) * radius; // 'radius' is the radius of your nodes
    })
    .attr("y1", function(d) { 
      let dx = d.source.x - d.target.x;
      let dy = d.source.y - d.target.y;
      let angle = Math.atan2(dy, dx);
      return d.source.y - Math.sin(angle) * radius; // 'radius' is the radius of your nodes
    })
    .attr("x2", function(d) {
      let dx = d.target.x - d.source.x;
      let dy = d.target.y - d.source.y;
      let angle = Math.atan2(dy, dx);
      return d.target.x - Math.cos(angle) * radius; // 'radius' is the radius of your nodes
    })
    .attr("y2", function(d) {
      let dx = d.target.x - d.source.x;
      let dy = d.target.y - d.source.y;
      let angle = Math.atan2(dy, dx);
      return d.target.y - Math.sin(angle) * radius; // 'radius' is the radius of your nodes
    });
      
  nodeElements
    .attr('cx', d => d.x = Math.max(radius, Math.min(width - radius, d.x)))
    .attr('cy', d => d.y = Math.max(radius, Math.min(height - radius, d.y)));
  
  textElements
    .attr('x', d => d.x)
    .attr('y', d => d.y);
});

    const render = () => {
      nodeElements
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);

      textElements
        .attr('x', d => d.x)
        .attr('y', d => d.y);

      edgeElements
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);
    };




    //DRAG
  // Update Drag handler
  const drag = d3.drag()
  .on('start', (event, d) => {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  })
  .on('drag', (event, d) => {
    d.fx = event.x;
    d.fy = event.y;
  })
  .on('end', (event, d) => {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  });

nodeElements.call(drag);

  nodeElements.call(drag);

}, []);


return (
  <div className="container">
    <Head>
      <title>Next.js Starter!</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <main>
      <Header title="Hey Nora, welcome to my Graph interface!" />
      <p className="description">
        It will get better, don't worry.
      </p>
      <div id="graph-container"></div>
    </main>

    <Footer />
  </div>
);
}