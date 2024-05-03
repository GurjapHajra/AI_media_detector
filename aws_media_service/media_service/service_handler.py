"""service_handler.py: contains the main functions for the media service"""

import hashlib
import json
import logging
import os

import boto3
from botocore.exceptions import ClientError

BUCKET_NAME = "media-service-737855111243-us-east-1"
DB_NAME = "MediaServiceAssets"

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
}


def get_asset_url_handler(event, context):  # pylint: disable=unused-argument
    """returns the url of the asset"""
    if isinstance(event["queryStringParameters"], dict):
        if "asset_name" in event["queryStringParameters"]:
            asset_name = event["queryStringParameters"]["asset_name"]
            url = get_asset_url(object_name=asset_name)

            if isinstance(url, Exception):
                return {
                    "statusCode": 404,
                    "body": json.dumps(
                        {
                            "error": "file_name not found in S3 bucket",
                        }
                    ),
                    "headers": CORS_HEADERS,
                }
            return {
                "statusCode": 200,
                "body": json.dumps(
                    {
                        "asset_name": f"{asset_name}",
                        "url": f"{url}",
                    }
                ),
                "headers": CORS_HEADERS,
            }
    return {
        "statusCode": 400,
        "body": json.dumps(
            {
                "error": "missing file_name parameter",
            }
        ),
        "headers": CORS_HEADERS,
    }


def get_s3_assest_list_handler(event, context):  # pylint: disable=unused-argument
    """returns the list of assets in the s3 bucket"""
    if isinstance(event["queryStringParameters"], dict):
        if "prefix" in event["queryStringParameters"]:
            prefix = event["queryStringParameters"]["prefix"]
            files = get_matching_assets(prefix=prefix)

            for ele in files:
                ele["LastModified"] = f"{ele.get('LastModified').isoformat()}"

            if isinstance(files, Exception):
                return {
                    "statusCode": 500,
                    "body": json.dumps(
                        {
                            "error": "unexpected error occurred while fetching files",
                        }
                    ),
                    "headers": CORS_HEADERS,
                }
            return {
                "statusCode": 200,
                "body": json.dumps(
                    {
                        "prefix": f"{prefix}",
                        "assets": json.dumps(files),
                    }
                ),
                "headers": CORS_HEADERS,
            }
    res = get_all_files()
    for ele in res:
        ele["LastModified"] = f"{ele.get('LastModified').isoformat()}"
    return {
        "statusCode": 200,
        "body": json.dumps(
            {
                "prefix": "",
                "files": json.dumps(res),
            }
        ),
        "headers": CORS_HEADERS,
    }


def get_upload_url_handler(event, context):  # pylint: disable=unused-argument
    """returns the url(pre-signed url) to upload the asset"""

    if not isinstance(event["queryStringParameters"], dict) or not (
        "asset_name" in event["queryStringParameters"]
        and "asset_type" in event["queryStringParameters"]
    ):
        return {
            "statusCode": 400,
            "body": json.dumps(
                {
                    "error": "missing asset_type or asset_name parameter",
                }
            ),
            "headers": CORS_HEADERS,
        }

    asset_name = event["queryStringParameters"]["asset_name"]
    asset_type = event["queryStringParameters"]["asset_type"]

    url = create_presigned_post(object_name=f"{asset_name}", asset_type=f"{asset_type}")

    return {
        "statusCode": 200,
        "body": json.dumps(
            {
                "url": f"{url.get('url')}",
                "fields": json.dumps(url.get("fields")),
            }
        ),
        "headers": CORS_HEADERS,
    }


def delete_handler(event, context):  # pylint: disable=unused-argument
    """delete the asset from the s3 bucket and database given the asset_id"""

    if not isinstance(event["queryStringParameters"], dict) or not (
        "asset_id" in event["queryStringParameters"]
    ):
        return {
            "statusCode": 404,
            "body": json.dumps(
                {
                    "error": "missing asset_id parameter",
                }
            ),
            "headers": CORS_HEADERS,
        }

    asset_id = event["queryStringParameters"]["asset_id"]

    asset = db_item_by_id(asset_id)

    if asset == Exception:
        return {
            "statusCode": 404,
            "body": json.dumps(
                {
                    "error": "asset_id not found in database",
                }
            ),
            "headers": CORS_HEADERS,
        }

    if isinstance(get_asset_s3_info(object_name=asset["asset_name"]["S"]), Exception):
        return {
            "statusCode": 404,
            "body": json.dumps(
                {
                    "error": "asset_name not found in S3 bucket",
                }
            ),
            "headers": CORS_HEADERS,
        }

    try:
        db_client = boto3.client("dynamodb")
        db_client.delete_item(
            TableName=DB_NAME,
            Key={
                "asset_id": {"S": asset_id},
                "asset_name": {"S": asset["asset_name"]["S"]},
            },
        )

        s3_client = boto3.client("s3")
        s3_client.delete_object(Bucket=BUCKET_NAME, Key=asset["asset_name"]["S"])
    except Exception as e:  # pylint: disable=broad-except
        logging.error(e)
        return {
            "statusCode": 200,
            "body": {
                "error": str(e),
            },
            "headers": CORS_HEADERS,
        }

    return {
        "statusCode": 200,
        "body": json.dumps(
            {
                "asset_id": f"{asset_id}",
                "message": "asset deleted successfully",
            }
        ),
        "headers": CORS_HEADERS,
    }


def db_get_handler(event, context):  # pylint: disable=unused-argument
    """returns the assets from the database based on the page number and filter value"""

    target_page = (
        0
        if (
            not event["queryStringParameters"]
            or not ("page" in event["queryStringParameters"])
        )
        else int(event["queryStringParameters"]["page"])
    )

    filter_value = (
        ""
        if not event["queryStringParameters"]
        or not ("filter" in event["queryStringParameters"])
        else event["queryStringParameters"]["filter"]
    )

    db_client = boto3.client("dynamodb")

    paginator = db_client.get_paginator("scan")

    res = paginator.paginate(
        TableName=DB_NAME,
        Select="ALL_ATTRIBUTES",
        PaginationConfig={"PageSize": 20},
        FilterExpression="contains(#asset_name, :asset_name)",
        ExpressionAttributeNames={"#asset_name": "asset_name"},
        ExpressionAttributeValues={":asset_name": {"S": filter_value}},
    )

    curr_page = 0
    for page in res:
        if curr_page == target_page:
            return {
                "statusCode": 200,
                "body": json.dumps(
                    {
                        "assets": json.dumps(page["Items"]),
                    }
                ),
                "headers": CORS_HEADERS,
            }
        curr_page += 1

    return {
        "statusCode": 404,
        "body": json.dumps(
            {
                "error": "No more pages",
            }
        ),
        "headers": CORS_HEADERS,
    }


def db_update_handler(event, context):  # pylint: disable=unused-argument
    """update the database with the asset details, must upload to s3 first"""

    db_client = boto3.client("dynamodb")

    if not event["queryStringParameters"] or not (
        "asset_id" in event["queryStringParameters"]
        and "asset_name" in event["queryStringParameters"]
    ):
        return {
            "statusCode": 400,
            "body": json.dumps(
                {
                    "message": "missing asset_id or asset_name parameter",
                }
            ),
            "headers": CORS_HEADERS,
        }

    file_name = event["queryStringParameters"]["asset_name"]

    file_info = get_asset_s3_info(object_name=file_name)

    data = {
        "asset_id": {"S": event["queryStringParameters"]["asset_id"]},
        "asset_name": {"S": event["queryStringParameters"]["asset_name"]},
        "asset_type": {"S": os.path.splitext(file_name)[1]},
        "asset_size": {"N": str(file_info["ContentLength"])},
        "last_modified": {"S": file_info["LastModified"].isoformat()},
        "verified": {"BOOL": False},
        "upvotes": {"N": "0"},
        "downvotes": {"N": "0"},
        "p_hash": {"S": "0"},
    }

    # Update the database
    res = db_client.put_item(
        TableName=DB_NAME,
        Item=data,
    )
    return {
        "statusCode": 200,
        "body": json.dumps(
            {
                "message": f"{res}",
            }
        ),
        "headers": CORS_HEADERS,
    }


def db_reader():
    """return all the items in the database"""
    db_client = boto3.client("dynamodb")

    # Get all items in the database
    response = db_client.scan(TableName="MediaServiceAssets")

    return response["Items"]


def db_item_by_id(asset_id):
    """returns the asset from the database based on the asset_id"""
    db_client = boto3.client("dynamodb")

    res_asset = None

    for asset in db_reader():
        if asset["asset_id"]["S"] == asset_id:
            res_asset = asset

    if res_asset is None:
        return Exception

    try:
        # Get all items in the database
        response = db_client.get_item(
            TableName=DB_NAME,
            Key={
                "asset_id": {"S": asset_id},
                "asset_name": {"S": res_asset["asset_name"]["S"]},
            },
        )
    except Exception as e:  # pylint: disable=broad-except
        return e

    return response["Item"]


def create_presigned_post(
    bucket=BUCKET_NAME, object_name=None, asset_type=None
):  # pylint: disable=unused-argument
    """returns the pre-signed url to upload the asset to the s3 bucket"""

    # Upload the file
    s3_client = boto3.client("s3")

    return s3_client.generate_presigned_post(
        Bucket=bucket, Key=f"{object_name}", ExpiresIn=300
    )


def get_all_files(bucket=BUCKET_NAME):
    """Get all files from an S3 bucket"""

    # Retrieve the list of bucket objects
    s3_client = boto3.client("s3")
    try:
        response = s3_client.list_objects_v2(Bucket=bucket)
    except ClientError as e:
        logging.error(e)
        return e
    return response["Contents"]


def get_asset_url(bucket=BUCKET_NAME, object_name=None):
    """return the url for an asset from an S3 bucket"""

    # Upload the file
    s3_client = boto3.client("s3")
    s3_info = get_asset_s3_info(object_name=object_name)

    if isinstance(s3_info, Exception):
        return s3_info

    try:
        url = s3_client.generate_presigned_url(
            "get_object", Params={"Bucket": bucket, "Key": object_name}, ExpiresIn=300
        )
    except Exception as e:  # pylint: disable=broad-except
        return e
    return url


def get_matching_assets(bucket=BUCKET_NAME, prefix=None):
    """Get all asssets from an S3 bucket that match a prefix"""

    # Retrieve the list of bucket objects
    s3_client = boto3.client("s3")
    try:
        return s3_client.list_objects_v2(Bucket=bucket, Prefix=prefix)["Contents"]
    except Exception as e:  # pylint: disable=broad-except
        return e


def get_asset_s3_info(bucket=BUCKET_NAME, object_name=None):
    """returns the asset info from the s3 bucket"""

    # Upload the file
    s3_client = boto3.client("s3")
    try:
        res = s3_client.get_object(
            Bucket=bucket,
            Key=object_name,
        )
    except Exception as e:  # pylint: disable=broad-except
        return e

    return res


def db_updater_with_s3():
    """Update the database based on the files in the S3 bucket"""
    db_client = boto3.client("dynamodb")

    # Get all files in the S3 bucket
    files = get_all_files()

    # Update the database
    for file in files:
        # Get the file name
        file_name = file["Key"]

        # Get the file type
        file_type = file_name.split(".")[-1]

        # Get the file size
        file_size = file["Size"]

        # Get the last modified date
        last_modified = file["LastModified"]

        data = {
            "asset_id": {"S": hashlib.md5(file_name.encode()).hexdigest()},
            "asset_name": {"S": file_name},
            "asset_type": {"S": file_type},
            "asset_size": {"N": str(file_size)},
            "last_modified": {"S": last_modified.isoformat()},
            "verified": {"BOOL": False},
            "upvotes": {"N": "0"},
            "downvotes": {"N": "0"},
            "p_hash": {"S": "0"},
        }

        # Update the database
        db_client.put_item(
            TableName=DB_NAME,
            Item=data,
        )
