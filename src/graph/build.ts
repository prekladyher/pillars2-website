import { ConversationType } from "@/types.js";
import { Position } from "@vue-flow/core";
import { layoutNodes } from "./layout";
import { GraphType } from "./types";

export function buildConversationGraph(conversation: ConversationType): GraphType {
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
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
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