"""service_handler.py: contains the main functions for the media service"""

import json
import logging
import boto3
from botocore.exceptions import ClientError

BUCKET_NAME = "media-service-737855111243-us-east-1"


def get_handler(event, context):  # pylint: disable=unused-argument
    """Media Service Post Handler Lambda function

    :param event: dict, required
        API Gateway Lambda Proxy Input Format
    :return: API Gateway Lambda Proxy Output Format: dict
    """

    if isinstance(event["queryStringParameters"], dict):
        if "file_name" in event["queryStringParameters"]:
            file_name = event["queryStringParameters"]["file_name"]
            url = get_file(object_name=file_name)
            return {
                "statusCode": 200,
                "body": json.dumps(
                    {
                        "file": f"{file_name}",
                        "url": f"{url}",
                    }
                ),
            }
        if "prefix" in event["queryStringParameters"]:
            prefix = event["queryStringParameters"]["prefix"]
            files = get_matching_files(prefix=prefix)
            return {
                "statusCode": 200,
                "body": json.dumps(
                    {
                        "prefix": f"{prefix}",
                        "files": f"{files}",
                    }
                ),
            }

    res = get_all_files()
    for ele in res:
        ele["LastModified"] = f"{ele.get('LastModified').isoformat()}"
    return {
        "statusCode": 200,
        "body": json.dumps(
            {
                "message": json.dumps(res),
            }
        ),
    }


def post_handler(event, context):  # pylint: disable=unused-argument
    """Media Service Post Handler Lambda function

    :param event: dict, required
        API Gateway Lambda Proxy Input Format
    :return: API Gateway Lambda Proxy Output Format: dict
    """

    if not event["queryStringParameters"] or not (
        "file_name" in event["queryStringParameters"]
        and "file_type" in event["queryStringParameters"]
    ):
        return {
            "statusCode": 400,
            "body": json.dumps(
                {
                    "message": "missing file_type or file_name parameter",
                }
            ),
        }

    file_name = event["queryStringParameters"]["file_name"]
    file_type = event["queryStringParameters"]["file_type"]

    url = create_presigned_post(object_name=f"{file_name}", file_type=f"{file_type}")

    return {
        "statusCode": 200,
        "body": json.dumps(
            {
                "url": f"{url.get('url')}",
                "fields": json.dumps(url.get("fields")),
            }
        ),
    }


def create_presigned_post(
    bucket=BUCKET_NAME, object_name=None, file_type=None
):  # pylint: disable=unused-argument
    """Upload a file to an S3 bucket

    :param file_name: File to upload
    :param bucket: Bucket to upload to
    :param object_name: S3 object name. If not specified then file_name is used
    :return: True if file was uploaded, else False
    """

    # Upload the file
    s3_client = boto3.client("s3")

    return s3_client.generate_presigned_post(
        Bucket=bucket, Key=f"{object_name}", ExpiresIn=300
    )


def get_all_files(bucket=BUCKET_NAME):
    """Get all files in an S3 bucket

    :param bucket: Bucket to get files from
    :return: List of files in bucket. If error, return None
    """

    # Retrieve the list of bucket objects
    s3_client = boto3.client("s3")
    try:
        response = s3_client.list_objects_v2(Bucket=bucket)
    except ClientError as e:
        logging.error(e)
        return e
    return response["Contents"]


def get_file(bucket=BUCKET_NAME, object_name=None):
    """Get a file from an S3 bucket

    :param bucket: Bucket to get file from
    :param object_name: S3 object name
    :return: True if file was uploaded, else False
    """

    # Upload the file
    s3_client = boto3.client("s3")

    url = s3_client.generate_presigned_url(
        "get_object", Params={"Bucket": bucket, "Key": object_name}, ExpiresIn=300
    )
    return url


def get_matching_files(bucket=BUCKET_NAME, prefix=None):
    """Get files from an S3 bucket that closely match an input string

    :param bucket: Bucket to get files from
    :param input_string: Input string to match against file names
    :return: List of matching files in bucket. If error, return None
    """

    # Retrieve the list of bucket objects
    s3_client = boto3.client("s3")
    try:
        return s3_client.list_objects_v2(Bucket=bucket, Prefix=prefix)["Contents"]
    except ClientError as e:
        logging.error(e)
        return None
