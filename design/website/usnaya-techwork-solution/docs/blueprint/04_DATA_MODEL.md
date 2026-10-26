# Data Model

``` ts
type Department = {
  id: string; name: string; description: string; roomId: string;
  destinationId: string; characterIds: string[]; conversationIds: string[];
  assetBundleId: string; access: "public" | "guided" | "restricted";
};

type Destination = {
  id: string; label: string; departmentId: string;
  entryWaypointId: string; cameraMode: string;
  introConversationId?: string; requiresGuidance?: boolean;
};

type CharacterDefinition = {
  id: string; displayName: string; role: string; departmentId: string;
  modelAssetId: string; animationProfileId: string; conversationId?: string;
  movementProfile: "stationary" | "patrol" | "guided"; aiEnabled: boolean;
};

type DialogueChoice = {
  id: string; label: string; nextNodeId?: string;
  action?: { type: "navigate" | "startTour" | "endConversation"; targetId?: string };
};
type DialogueNode = {
  id: string; speakerId: string; text: string;
  choices?: DialogueChoice[]; nextNodeId?: string;
};
type ConversationDefinition = {
  id: string; startNodeId: string; nodes: Record<string, DialogueNode>;
};

type AssetManifestItem = {
  id: string; path: string; kind: "model" | "texture" | "audio" | "environment";
  requiredForMvp: boolean; source: string; license: string; estimatedBytes?: number;
};
```

## Validation

IDs must be unique; all department, room, destination, character,
waypoint, conversation, speaker, node and asset references must resolve.
Invalid dialogue graphs should fail validation during development, not
mid-visit.
