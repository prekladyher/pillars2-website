import type { ConversationModel } from "@/stores/conversation";
import type { GraphType, StringTable } from "@/types";
import { layoutNodes } from "./layout";

export function buildConversationGraph(
  conversation: ConversationModel,
  stringtable: StringTable
): GraphType {
  const nodes: GraphType["nodes"] = [];
  const edges: GraphType["edges"] = [];

  const strings = new Map(stringtable.Entries.map(entry => [entry.id, entry]));

  for (const node of conversation.nodesById.values()) {
    if (node.NodeID < 0) {
      continue; // script node
    }

    const string = strings.get(node.NodeID);

    nodes.push({
      id: `${node.NodeID}`,
      label: `${string?.default || node.NodeID}`,
      position: {
        x: 0,
        y: 0
      },
      sourcePosition: "right",
      targetPosition: "left",
      style: { width: "200px", "line-height": "1.3", "text-align": "left" },
      data: node,
    });

    for (const link of node.Links) {
      edges.push({
        id: `${link.FromNodeID}-${link.ToNodeID}`,
        source: `${link.FromNodeID}`,
        target: `${link.ToNodeID}`,
        data: link
      });
    }
  }

  const graph = {
    nodes,
    edges
  };

  layoutNodes(graph);

  return graph;
}