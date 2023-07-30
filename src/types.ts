
export interface ConversationMetaType {
  Component: string,
  ID: string,
  Name: string,
  Filename: string
}

export interface ConversationType {
  ID: string,
  Filename: string,
  ConversationType: number,
  CharacterMapping: {
    Guid: string,
    InstanceTag: string
  }[],
  Nodes: ConversationNodeType[]
}

export interface ConversationNodeType {
  $type: string,
  NodeID: number,
  SpeakerGuid: string,
  ListenerGuid: string,
  IsQuestionNode: boolean,
  Links: ConversationLinkType[]
  ClassExtender: {
    ExtendedProperties: string[]
  },
  [key: string]: any
}

export interface ConversationLinkType {
  $type: string,
  FromNodeID: number,
  ToNodeID: number,
  ClassExtender: {
    ExtendedProperties: string[]
  },
  [key: string]: any
}
