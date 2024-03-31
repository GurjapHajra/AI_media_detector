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
  key: string;
  LastModified: string;
  ETag: string;
  Size: number;
  StorageClass: string;
}

export function FlattenToGetMediaListResponse(
  object: any
): GetMediaListResponse {
  return {
    key: object['Key'],
    LastModified: object['LastModified'],
    ETag: object['ETag'],
    Size: object['Size'],
    StorageClass: object['StorageClass'],
  };
}
