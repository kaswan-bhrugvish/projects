/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 *
 * @author maverick
 */


public class Edge {
	private final String id;
	private final Vertex source;
	private final Vertex destination;
	private final double weight;

	public Edge(String id, Vertex source, Vertex destination, double weight) {
		this.id = id;
		this.source = source;
		this.destination = destination;
		this.weight = weight;
	}

	public String getId() {
		return id;
	}

	public Vertex getDestination() {
		return destination;
	}

	public Vertex getSource() {
		return source;
	}

	public double getWeight() {
		return weight;
	}

	@Override
        public String toString() {
                return source + " " + destination;
        }

}