import Head from 'next/head';
import Header from '@components/Header';
import Footer from '@components/Footer';
import { useEffect } from 'react';
import * as d3 from 'd3';

export default function Home() {
  useEffect(() => {
    const svg = d3.select('#graph-container')
      .append('svg')
      .attr('width', 400)
      .attr('height', 400)
      .style('border', '1px solid black');

    let nodes = [
      { id: 'node1', name: 'hello', x: 50, y: 100 },
      { id: 'node2', name: 'bye', x: 150, y: 100 }
    ];

    let edges = [
      { source: nodes[0], target: nodes[1] } // Use node references directly
    ];

    const simulation = d3.forceSimulation(nodes)
    .force('charge', d3.forceManyBody().strength(-200)) // Repulsion between nodes
    .force('x', d3.forceX(200).strength(0.1)) // Gradual attraction to the center X
    .force('y', d3.forceY(200).strength(0.1)) // Gradual attraction to the center Y
    .force('collide', d3.forceCollide(25)) // Prevent overlap
    .force('link', d3.forceLink(edges).distance(100)); // Keep a distance between linked nodes

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

    const drag = d3.drag()
      .on('drag', (event, d) => {
        d.x = Math.max(20, Math.min(380, event.x)); // 20 and 380 considering node's radius
        d.y = Math.max(20, Math.min(380, event.y)); // 20 and 380 considering node's radius
        d3.select(event.sourceEvent.target)
        .attr('cx', d.x)
        .attr('cy', d.y);
      render();
    });

  nodeElements.call(drag);

  simulation.on('tick', () => {
    simulation.alpha(1).restart();  // Restart the simulation at every tick
    render();
  });

  render();
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

