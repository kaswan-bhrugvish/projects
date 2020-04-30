/*
t1 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.Charset;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Scanner;

/**
*
* @author maverick
*/


public class Main {
	private HashMap<String, Vertex> nodes;
	private List<Edge> edges;

	public static void main(String args[]) throws IOException {
		long beforeUsedMem = Runtime.getRuntime().totalMemory() - Runtime.getRuntime().freeMemory();
		Main d = new Main();
		d.execute();
		long afterUsedMem = Runtime.getRuntime().totalMemory() - Runtime.getRuntime().freeMemory();
		long actualMemUsed = afterUsedMem - beforeUsedMem;
		System.out.println("Actual Memory Used " + actualMemUsed);
	}

	public void execute() throws IOException {
		nodes = new HashMap<String, Vertex>();
		edges = new ArrayList<Edge>();
		Path currentRelativePath = Paths.get("");
		System.out.println("Please enter the file name t1 or t2");
		Scanner scanner = new Scanner(System.in);
		String inputFile = scanner.nextLine();
		String s = currentRelativePath.toAbsolutePath().toString() + "/" + inputFile + ".txt";
		int lineNumber = 0;
		int faultLine = 2;
		String line = "";
		String edgeNodeSplit[] = new String[2];
		String sourceDestinationSplit[] = new String[2];
		try (InputStream fis = new FileInputStream(s);
				InputStreamReader isr = new InputStreamReader(fis, Charset.forName("UTF-8"));
				BufferedReader br = new BufferedReader(isr);) {
			while ((line = br.readLine()) != null) {
				if (lineNumber < 1) {
					if (line != " " || line != "") {
						edgeNodeSplit = line.trim().split(" ");
					}
				}
				int temp = Integer.parseInt(edgeNodeSplit[0].trim()) + faultLine;
				int temp2 = temp + Integer.parseInt(edgeNodeSplit[1].trim()) + faultLine - 1;
				// Vertexes || Nodes
				if (lineNumber > 1 && lineNumber < temp) {
					if (line != " " || line != "") {
						String[] lineSplit = line.trim().split(" ");
						Vertex v = new Vertex(lineSplit[0], lineSplit[0], Integer.parseInt(lineSplit[1].trim()),
								Integer.parseInt(lineSplit[2].trim()));
						nodes.put(lineSplit[0], v);
					}
				}
				// Edges
				if (lineNumber > temp && lineNumber < temp2) {
					String[] lineSplit = line.trim().split(" ");
					Vertex source = nodes.get(lineSplit[0].trim());
					Vertex destination = nodes.get(lineSplit[1].trim());
					double weight = Math.sqrt((destination.getPointY() - source.getPointY())
							* (destination.getPointY() - source.getPointY())
							+ (destination.getPointX() - source.getPointX())
									* (destination.getPointX() - source.getPointX()));
					Edge e = new Edge(lineSplit[0] + " " + lineSplit[1], source, destination, weight);
					edges.add(e);
				}
				if (lineNumber > temp2) {
					System.out.println("Taking Source Destination in....");
					sourceDestinationSplit = line.trim().split(" ");
				}
				lineNumber++;
			}
			// Graph
			Graph graph = new Graph(nodes, edges);
			DijkstraAlgorithm dijkstra = new DijkstraAlgorithm(graph);
			dijkstra.execute(nodes.get(sourceDestinationSplit[0].trim()));
			LinkedList<Vertex> path = dijkstra.getPath(nodes.get(sourceDestinationSplit[1].trim()));

			try {
				for (Vertex vertex : path) {
					System.out.println(vertex);
				}
			} catch (NullPointerException e) {
				System.out.println("Destination is not reachable");
			}

		} catch (ArrayIndexOutOfBoundsException ex) {
			ex.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}

	}

}