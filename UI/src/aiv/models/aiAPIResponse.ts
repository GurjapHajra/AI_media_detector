export interface aiApiResponseType {
  status: string;
  request: {
    id: string;
    timestamp: number;
    operations: number;
  };
  type: {
    ai_generated: number;
  };
  media: {
    id: string;
    uri: string;
  };
}

export function FlattenToaiApiResponseType(object: any): aiApiResponseType {
  return {
    status: object['status'],
    request: {
      id: object['request']['id'],
      timestamp: object['request']['timestamp'],
      operations: object['request']['operations'],
    },
    type: {
      ai_generated: object['type']['ai_generated'],
    },
    media: {
      id: object['media']['id'],
      uri: object['media']['uri'],
    },
  };
}
