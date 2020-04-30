/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
import java.util.HashMap;
import java.util.List;

/**
*
* @author maverick
*/


public class Graph {
        private final HashMap<String,Vertex> vertexes;
        private final List<Edge> edges;

        public Graph(HashMap<String, Vertex> vertexes, List<Edge> edges) {
                this.vertexes = vertexes;
                this.edges = edges;
        }

       public HashMap<String, Vertex> getVertexes() {
              return vertexes;
        }

        public List<Edge> getEdges() {
                return edges;
        }
}