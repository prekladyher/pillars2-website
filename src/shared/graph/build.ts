import type { ConversationType, GraphType, StringTable } from "../types";
import { layoutNodes } from "./layout";

export function buildConversationGraph(
  conversation: ConversationType,
  stringtable: StringTable
): GraphType {
  const nodes: GraphType["nodes"] = [];
  const edges: GraphType["edges"] = [];

  for (const node of conversation.Nodes) {
    nodes.push({
      id: `${node.NodeID}`,
      label: `${node.NodeID}`,
      position: {
        x: 0,
        y: 0
      },
      sourcePosition: "right",
      targetPosition: "left",
      data: node,
    });

    for (const link of node.Links) {
      edges.push({
        id: `${link.FromNodeID}-${link.ToNodeID}`,
        source: `${link.FromNodeID}`,
        target: `${link.ToNodeID}`,
        data: link
      })
    }
  }

  const graph = {
    nodes,
    edges
  };

  layoutNodes(graph);

  return graph;
}