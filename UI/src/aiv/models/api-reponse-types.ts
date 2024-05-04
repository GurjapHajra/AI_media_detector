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
  try {
    return {
      asset_id: object['asset_id']['S'] ?? 'unknown',
      asset_name: object['asset_name']['S'] ?? 'unknown',
      asset_type: object['asset_type']['S'] ?? 'unknown',
      asset_size: object['asset_size']['N'] ?? 0,
      upvotes: object['upvotes']['N'] ?? 'unknown',
      downvotes: object['downvotes']['N'] ?? 'unknown',
      p_hash: object['p_hash']['S'] ?? 'unknown',
      verified: object['verified']['BOOL'] ?? false,
      last_modified: object['last_modified']['S'] ?? 'unknown',
    };
  } catch (error) {
    console.error("FlattenToGetMediaListResponse: couldn't convert", object);
    return {
      asset_id: 'unknown',
      asset_name: 'unknown',
      asset_type: 'unknown',
      asset_size: 0,
      upvotes: 0,
      downvotes: 0,
      p_hash: 'unknown',
      verified: false,
      last_modified: 'unknown',
    };
  }
}
