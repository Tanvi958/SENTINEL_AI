interface Node {
  id: string;
  type: string;
  properties: Record<string, unknown>;
}

interface Edge {
  source: string;
  target: string;
  type: string;
  weight: number;
}

export class KnowledgeGraph {
  private nodes: Map<string, Node>;
  private edges: Edge[];

  constructor() {
    this.nodes = new Map();
    this.edges = [];
  }

  public addNode(node: Node): void {
    this.nodes.set(node.id, node);
  }

  public addEdge(edge: Edge): void {
    this.edges.push(edge);
  }

  public findRelatedThreats(nodeId: string): Node[] {
    const relatedNodes: Node[] = [];
    const visited = new Set<string>();

    const traverse = (currentId: string, depth: number) => {
      if (depth > 3 || visited.has(currentId)) return;
      visited.add(currentId);

      const connectedEdges = this.edges.filter(
        edge => edge.source === currentId || edge.target === currentId
      );

      for (const edge of connectedEdges) {
        const nextId = edge.source === currentId ? edge.target : edge.source;
        const node = this.nodes.get(nextId);
        if (node) {
          relatedNodes.push(node);
          traverse(nextId, depth + 1);
        }
      }
    };

    traverse(nodeId, 0);
    return relatedNodes;
  }

  public calculateThreatScore(nodeId: string): number {
    const relatedThreats = this.findRelatedThreats(nodeId);
    let score = 0;

    for (const threat of relatedThreats) {
      const edges = this.edges.filter(
        edge => edge.source === threat.id || edge.target === threat.id
      );
      
      score += edges.reduce((acc, edge) => acc + edge.weight, 0);
    }

    return Math.min(1, score / (relatedThreats.length || 1));
  }
}