import Head from 'next/head';
import Header from '@components/Header';
import Footer from '@components/Footer';
import { useEffect } from 'react';
import * as d3 from 'd3';
import { data } from './data.js';

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



export default function Home() {
  useEffect(() => {
    const svg = d3.select('#graph-container')
      .append('svg')
      .attr('width', 400)
      .attr('height', 400)
      .style('border', '1px solid black');

      
const simulation = d3.forceSimulation(nodes)
.force('charge', d3.forceManyBody().strength(-200))
.force('x', d3.forceX(200).strength(0.1))
.force('y', d3.forceY(200).strength(0.1))
.force('collide', d3.forceCollide(55))
.force('link', d3.forceLink(edges).distance(100)); 

    const nodeElements = svg.selectAll('circle')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('r', 20)
      .attr('fill', 'steelblue')
      .attr('stroke', 'black')
      .attr('stroke-width', 2);

    const textElements = svg.selectAll('text')
      .data(nodes)
      .enter()
      .append('text')
      .text(d => d.name)
      .attr('font-size', 15)
      .attr('dx', 25) // change this to adjust the horizontal position
      .attr('dy', -5); // change this to adjust the vertical position

    const edgeElements = svg.selectAll('line')
      .data(edges)
      .enter()
      .append('line')
      .attr('stroke', 'steelblue');

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

    const width = 400;  // width of SVG container
    const height = 400; // height of SVG container
    const radius = 25;  // radius of nodes

    const drag = d3.drag()
    .on('start', () => {
      svg.attr('pointer-events', 'none');  // Disable pointer events on the SVG during dragging
    })
    .on('drag', (event, d) => {
      d.x = Math.max(radius, Math.min(width - radius, event.x)); // Keep nodes within the SVG bounds
      d.y = Math.max(radius, Math.min(height - radius, event.y)); // Keep nodes within the SVG bounds
      d3.select(event.sourceEvent.target)
        .attr('cx', d.x)
        .attr('cy', d.y);
      render();
    })
    .on('end', () => {
      svg.attr('pointer-events', 'all');  // Re-enable pointer events on the SVG after dragging
    });
  

  nodeElements.call(drag);

  simulation.on('tick', () => {
    nodeElements
      .attr('cx', d => d.x = Math.max(radius, Math.min(width - radius, d.x)))
      .attr('cy', d => d.y = Math.max(radius, Math.min(height - radius, d.y)));
  
      
    edgeElements
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);
  
    textElements
      .attr('x', d => d.x)
      .attr('y', d => d.y);
  
    render();

      // Manually restart the simulation at every tick. This keeps forces from attenuating over time
  simulation.alpha(1).restart();
  });
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