import Head from 'next/head'
import Header from '@components/Header'
import Footer from '@components/Footer'
import { useEffect } from 'react'
import * as d3 from 'd3'

export default function Home() {
  useEffect(() => {
    const svg = d3.select('#graph-container')
      .append('svg')
      .attr('width', 200)
      .attr('height', 200)
      
    const nodes = [
      { id: 'node1' },
      { id: 'node2' }
    ]
    
    const edges = [
      { source: 'node1', target: 'node2' }
    ]
    
    svg.selectAll('circle')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('cx', (d, i) => 50 + i * 100)
      .attr('cy', 100)
      .attr('r', 10)
      .attr('fill', 'steelblue')
    
    svg.selectAll('line')
      .data(edges)
      .enter()
      .append('line')
      .attr('x1', d => d.source === 'node1' ? 55 : 155)
      .attr('y1', 100)
      .attr('x2', d => d.target === 'node1' ? 55 : 155)
      .attr('y2', 100)
      .attr('stroke', 'steelblue')
  }, [])

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
  )
}
