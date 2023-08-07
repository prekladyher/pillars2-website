import type { GraphType } from "./types";

interface LayoutEntry {
  node: GraphType["nodes"][number],
  links: string[],
  order: number
}

export function layoutNodes(graph: GraphType) {
  const linkData: Map<string, string[]> = new Map();
  for (const edge of graph.edges) {
    let links = linkData.get(edge.source);
    if (!links) {
      linkData.set(edge.source, links = []);
    }
    links.push(edge.target);
  }

  const nodeData: Map<string, LayoutEntry> = new Map();
  for (const node of graph.nodes) {
    nodeData.set(node.id, {
      node,
      links: linkData.get(node.id) || [],
      order: -1
    });
  }

  const columnData: Map<number, LayoutEntry[]> = new Map();
  const assignColumn = (entry: LayoutEntry, order: number) => {
    if (entry.order >= 0) {
      return;
    }
    entry.order = order;

    let column = columnData.get(order);
    if (!column) {
      columnData.set(order, column = []);
    }
    column.push(entry);

    for (const link of entry.links || []) {
      assignColumn(nodeData.get(link) as LayoutEntry, order + 1);
    }
  }

  assignColumn(nodeData.get("0") as LayoutEntry, 0);
  for (const [order, column] of columnData.entries()) {
    column.forEach((entry, index) => {
      entry.node.position = {
        x: order * 200,
        y: index * 50
      };
    });
  }
}
