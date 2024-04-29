export interface PostUnsignUrlResponse {
  url: string;
  fields: PostUnsignUrlResponseFields;
}

export function FlattenToPostUnsignUrlResponse(
  object: any
): PostUnsignUrlResponse {
  return {
    url: object['url'],
    fields: FlattenToPostUnsignUrlResponseFields(JSON.parse(object['fields'])),
  };
}

export interface PostUnsignUrlResponseFields {
  key: string;
  AWSAccessKeyId: string;
  'x-amz-security-token': string;
  policy: string;
  signature: string;
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

export interface GetMediaListResponse {
  asset_id: string;
  asset_name: string;
  asset_type: string;
  asset_size: number;
  upvotes: number;
  downvotes: number;
  p_hash: string;
  verified: boolean;
  last_modified: string;
}

export function FlattenToGetMediaListResponse(
  object: any
): GetMediaListResponse {
  return {
    asset_id: object['asset_id']['S'],
    asset_name: object['asset_name']['S'],
    asset_type: object['asset_type']['S'],
    asset_size: object['asset_size']['N'],
    upvotes: object['upvotes']['N'],
    downvotes: object['downvotes']['N'],
    p_hash: object['p_hash']['S'],
    verified: object['verified']['BOOL'],
    last_modified: object['last_modified']['S'],
  };
}
