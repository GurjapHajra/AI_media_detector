export interface PostUnsignUrlResponse {
  url: string;
}

export function FlattenToPostUnsignUrlResponse(
  object: any
): PostUnsignUrlResponse {
  return {
    url: object['message'],
  };
}
