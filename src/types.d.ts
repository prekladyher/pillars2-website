/**
 * Conversation types.
 */

export interface ConversationMetaType {
  Component: string;
  ID: string;
  Name: string;
  Filename: string;
}

export interface ConversationType {
  ID: string;
  Filename: string;
  ConversationType: number;
  CharacterMapping: {
    Guid: string;
    InstanceTag: string;
  }[];
  Nodes: ConversationNodeType[];
}

export interface ConversationNodeType {
  $type: string;
  NodeID: number;
  SpeakerGuid: string;
  ListenerGuid: string;
  IsQuestionNode: boolean;
  Links: ConversationLinkType[];
  ClassExtender: {
    ExtendedProperties: string[];
  };
  [key: string]: any;
}

export interface ConversationLinkType {
  $type: string;
  FromNodeID: number;
  ToNodeID: number;
  ClassExtender: {
    ExtendedProperties: string[];
  };
  [key: string]: any;
}


/**
 * String table types.
 */

export interface StringTable {
  Component: string;
  Name: string;
  Entries: { id: number, default: string, female: string }[];
}


/**
 * Asset data types.
 */

export interface GameDataBundle<T> {
  GameDataObjects: T[];
}

export interface SpeakerType {
  $type: string;
  DebugName: string;
  ID: string;
  Components: Record<string, any>[]
}


/**
 * Graph types.
 */

export interface NodeType {
  id: string;
  label?: string;
  position: {
    x: number;
    y: number;
  };
  [key: string]: any;
}

export interface EdgeType {
  id: string;
  source: string;
  target: string;
  [key: string]: any;
}

export interface GraphType {
  nodes: NodeType[];
  edges: EdgeType[];
}
