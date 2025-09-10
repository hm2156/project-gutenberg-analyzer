import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const CharacterNetwork = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || !data.characters || !data.interactions) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); 

    const width = 900;
    const height = 700;
    const margin = 60;
    
    svg.attr("width", width).attr("height", height);


    const nodes = data.characters.map(char => ({
      id: char.name,
      mentions: char.mentions,
      description: char.description,
      radius: Math.max(20, Math.min(50, Math.sqrt(char.mentions) * 3 + 15)),
      interactions: data.interactions.filter(i => 
        i.character1 === char.name || i.character2 === char.name
      ).length
    }));


    const links = [];
    data.interactions.forEach(interaction => {

      links.push({
        source: interaction.character1,
        target: interaction.character2,
        strength: interaction.strength,
        description: interaction.description,
        bidirectional: true
      });
      links.push({
        source: interaction.character2,
        target: interaction.character1,
        strength: interaction.strength,
        description: interaction.description,
        bidirectional: true
      });
    });


    const nodeColor = "#60A5FA"; 


    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id).distance(120).strength(0.8))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(d => d.radius + 15))
      .force("x", d3.forceX(width / 2).strength(0.1))
      .force("y", d3.forceY(height / 2).strength(0.1));

  
    svg.append("defs").append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "0 0 10 10")
      .attr("refX", 15)
      .attr("refY", 0)
      .attr("orient", "auto")
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .append("path")
      .attr("d", "M 0,0 L 6,3 L 0,6 L 1.5,3 Z")
      .attr("fill", "#9CA3AF")
      .attr("stroke", "none");


    const container = svg.append("g");


    const zoom = d3.zoom()
      .scaleExtent([0.5, 3])
      .on("zoom", (event) => {
        container.attr("transform", event.transform);
      });
    
    svg.call(zoom);


    const link = container.append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "#9CA3AF")
      .attr("stroke-opacity", 0.8)
      .attr("stroke-width", 1.5) 
      .attr("marker-end", "url(#arrowhead)")
      .style("cursor", "pointer");

  
    const node = container.append("g")
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", d => d.radius)
      .attr("fill", nodeColor)
      .attr("stroke", "#1F2937")
      .attr("stroke-width", 2)
      .style("cursor", "pointer")
      .style("filter", "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))")
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));


    const label = container.append("g")
      .selectAll("text")
      .data(nodes)
      .join("text")
      .text(d => d.id)
      .attr("font-size", "14px")
      .attr("font-weight", "600")
      .attr("text-anchor", "middle")
      .attr("dy", 5)
      .attr("fill", "#F9FAFB")
      .style("pointer-events", "none")
      .style("user-select", "none")
      .style("filter", "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.5))");

    const tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("background", "rgba(0, 0, 0, 0.8)")
      .style("color", "white")
      .style("padding", "8px")
      .style("border-radius", "4px")
      .style("font-size", "12px")
      .style("pointer-events", "none")
      .style("opacity", 0);

    node
      .on("mouseover", (event, d) => {
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip.html(`
          <strong>${d.id}</strong><br/>
          Mentions: ${d.mentions}<br/>
          ${d.description}
        `)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 28) + "px");
        
      
        node.style("opacity", 0.3);
        link.style("opacity", 0.1);
        
        d3.select(event.target).style("opacity", 1);
        
        link.filter(l => l.source.id === d.id || l.target.id === d.id)
          .style("opacity", 1)
          .style("stroke", "#ff6b6b")
          .style("stroke-width", l => l.width + 1);
          
        node.filter(n => {
          return links.some(l => 
            (l.source.id === d.id && l.target.id === n.id) ||
            (l.target.id === d.id && l.source.id === n.id)
          );
        }).style("opacity", 1);
      })
      .on("mouseout", () => {
        tooltip.transition().duration(500).style("opacity", 0);
        
        
        node.style("opacity", 1);
        link.style("opacity", 0.8)
          .style("stroke", "#999")
          .style("stroke-width", d => d.width);
      });

    
    link.on("mouseover", (event, d) => {
      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip.html(`
        <strong>${d.source.id} ↔ ${d.target.id}</strong><br/>
        Strength: ${d.strength}<br/>
        ${d.description}
      `)
      .style("left", (event.pageX + 10) + "px")
      .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", () => {
      tooltip.transition().duration(500).style("opacity", 0);
    });

    
    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);

      label
        .attr("x", d => d.x)
        .attr("y", d => d.y);
    });

   
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    
    return () => {
      d3.select("body").selectAll(".tooltip").remove();
    };

  }, [data]);

  if (!data) return null;

  return (
    <div className="bg-gray-800 rounded-xl shadow-xl p-8 mb-8 border border-gray-700">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">Character Interaction Network</h3>
        <p className="text-gray-400 text-sm">
          Interactive visualization showing character relationships and interaction strengths
        </p>
      </div>
      
      <div className="bg-gray-700 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-400 rounded-full mr-2"></div>
            <span className="text-gray-300">Uniform blue nodes</span>
          </div>
          <div className="flex items-center">
            <div className="w-8 h-1 bg-gray-400 rounded mr-2"></div>
            <span className="text-gray-300">Bidirectional relationships</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 border-2 border-gray-400 rounded-full mr-2"></div>
            <span className="text-gray-300">Drag to rearrange</span>
          </div>
          <div className="flex items-center">
            <div className="text-gray-400 mr-2">🔍</div>
            <span className="text-gray-300">Hover for details</span>
          </div>
        </div>
      </div>
      
      <div className="w-full flex justify-center bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg p-4">
        <svg ref={svgRef} className="border border-gray-600 rounded-lg shadow-sm bg-gray-900"></svg>
      </div>
    </div>
  );
};

export default CharacterNetwork;