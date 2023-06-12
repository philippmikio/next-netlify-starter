import Head from 'next/head';
import Header from '@components/Header';
import Footer from '@components/Footer';
import { useEffect, useState } from 'react';
import * as d3 from 'd3';
import { data } from '../data.js';
import { getDatabase, ref, push } from 'firebase/database';
import { initializeApp } from "firebase/app";

console.log("Firebase config string: ", process.env.NEXT_PUBLIC_FIREBASE_CONFIG);

let nodes = data.nodes;
let edges = data.edges;
let nodeMap = new Map(nodes.map(node => [node.id, node]));
edges = edges.map(edge => ({
  ...edge,
  source: nodeMap.get(edge.source),
  target: nodeMap.get(edge.target),
  visible: true
}));
nodes.forEach(node => node.visible = true);

// Initialize Firebase outside of the component
const firebaseConfig = JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_CONFIG);
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export default function Home() {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const dbRef = ref(db, 'inputValues');
    push(dbRef, inputValue)
      .then(() => {
        console.log('Submitted:', inputValue);
        setInputValue(''); // Clear the input value
      })
      .catch((error) => {
        console.error('Error saving input value:', error);
      });
  };
  
  useEffect(() => {

    const width = 400;
    const height = 400;
    const radius = 25;

    const handleAddNode = (nodeName, nodeId) => {
      // Add node to nodes array
      nodes.push({ id: nodeId, name: nodeName });
    }
    
    const svg = d3.select('#graph-container')
      .append('svg')
      .attr('width', 500)
      .attr('height', 500)
      .call(d3.zoom().on("zoom", function (event) {
        svg.attr("transform", event.transform);
      }))
      .append('g');

    // Unified edge definition
    const edgeElements = svg
      .selectAll('.edge')
      .data(edges)
      .enter()
      .append('line')
      .attr('class', 'edge')
      .attr('stroke', 'darkblue')
      .attr('stroke-width', 2)
      .attr('marker-end', 'url(#arrowhead)');

    // Unified node definition
    const nodeElements = svg.selectAll('circle')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('r', 22)
      .attr('fill', 'red')
      .attr('stroke', 'black')
      .attr('stroke-width', 2)
      nodeElements.on('dblclick', (event, clickedNode) => {
        // Check if all target nodes are currently visible
        let allTargetVisible = true;
        edges.forEach(edge => {
          if (edge.source === clickedNode) {
            allTargetVisible = allTargetVisible && edge.target.visible;
          }
        });
      
        // If all target nodes are visible, make them invisible, otherwise make them visible
        edges.forEach(edge => {
          if (edge.source === clickedNode) {
            edge.target.visible = !allTargetVisible;
            edge.visible = edge.target.visible;
          }
        });
      
        // Update the graph to reflect the changes
        render();
      });

    svg.append('defs').append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '-5 -5 10 10')
      .attr('refX', 0)
      .attr('refY', 0)
      .attr('markerWidth', 8)
      .attr('markerHeight', 8)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M 0,0 m -5,-5 L 5,0 L -5,5 Z')
      .attr('fill', 'darkblue');

    const textElements = svg.selectAll('text')
      .data(nodes)
      .enter()
      .append('text')
      .text(d => d.name)
      .attr('font-size', 15)
      .attr('dx', 25)
      .attr('dy', -5);

      var simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(edges).distance(30))  // adjust distance as needed
      .force("charge", d3.forceManyBody().strength(-400))  // adjust strength as needed
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force('x', d3.forceX(200).strength(0.1))
      .force('y', d3.forceY(200).strength(0.1))
      .force('collide', d3.forceCollide(55));
      
      simulation.on("tick", function() {
        edgeElements
          .attr("x1", function(d) {
            let dx = d.source.x - d.target.x;
            let dy = d.source.y - d.target.y;
            let angle = Math.atan2(dy, dx);
            return d.source.x - Math.cos(angle) * radius;
          })
          .attr("y1", function(d) {
            let dx = d.source.x - d.target.x;
            let dy = d.source.y - d.target.y;
            let angle = Math.atan2(dy, dx);
            return d.source.y - Math.sin(angle) * radius;
          })
          .attr("x2", function(d) {
            let dx = d.target.x - d.source.x;
            let dy = d.target.y - d.source.y;
            let angle = Math.atan2(dy, dx);
            let offset = 5; // Adjust this value as needed
            return d.target.x - Math.cos(angle) * (radius + offset);
          })
          .attr("y2", function(d) {
            let dx = d.target.x - d.source.x;
            let dy = d.target.y - d.source.y;
            let angle = Math.atan2(dy, dx);
            let offset = 5; // Adjust this value as needed
            return d.target.y - Math.sin(angle) * (radius + offset);
          });
        
        nodeElements
          .attr('cx', d => d.x = Math.max(radius, Math.min(width - radius, d.x)))
          .attr('cy', d => d.y = Math.max(radius, Math.min(height - radius, d.y)));
        
        textElements
          .attr('x', d => d.x)
          .attr('y', d => d.y);
      });
      
      const render = () => {
        // Show/hide the nodes, edges, and labels based on their visibility status
        nodeElements.attr('display', d => d.visible ? null : 'none');
        textElements.attr('display', d => d.visible ? null : 'none');
        edgeElements.attr('display', d => d.visible && d.source.visible && d.target.visible ? null : 'none');
      
        // Update the position of nodes, edges, and labels
        nodeElements.attr('cx', d => d.x).attr('cy', d => d.y);
        textElements.attr('x', d => d.x).attr('y', d => d.y);
        edgeElements.attr('x1', d => d.source.x)
          .attr('y1', d => d.source.y)
          .attr('x2', d => d.target.x)
          .attr('y2', d => d.target.y);
      };
      
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
      
}, []);
      
return (
  <div className="container">
    <Head>
      <title>Next.js Starter!</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <main>
      <Header title="Hey Nora, welcome to my Graph interface!" />
      <p className="description">It will get better, don't worry.</p>
      <div id="graph-container"></div>

      <form onSubmit={handleSubmit}>
        <input type="text" value={inputValue} onChange={handleInputChange} />
        <button type="submit">Submit</button>
      </form>
    </main>

    <Footer />
  </div>
);
}