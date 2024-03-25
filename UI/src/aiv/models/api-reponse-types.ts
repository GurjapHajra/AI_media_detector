export interface PostUnsignUrlResponse {
  url: string;
  fields: PostUnsignUrlResponseFields;
}

export interface PostUnsignUrlResponseFields {
  key: string;
  AWSAccessKeyId: string;
  'x-amz-security-token': string;
  policy: string;
  signature: string;
}

export function FlattenToPostUnsignUrlResponse(
  object: any
): PostUnsignUrlResponse {
  return {
    url: object['url'],
    fields: FlattenToPostUnsignUrlResponseFields(JSON.parse(object['fields'])),
  };
}

export function FlattenToPostUnsignUrlResponseFields(
  object: any
): PostUnsignUrlResponseFields {
  return {
    key: object['key'],
    AWSAccessKeyId: object['AWSAccessKeyId'],
    'x-amz-security-token': object['x-amz-security-token'],
    policy: object['policy'],
    signature: object['signature'],
  };
}
