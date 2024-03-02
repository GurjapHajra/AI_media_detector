'''main.py: contains the main functions for the media service'''

import functions_framework
from google.cloud.storage.blob import Blob
from google.cloud import storage
from werkzeug.utils import secure_filename

MAIN_BUCKET_NAME = "noaivi-images"
storage_client = storage.Client()

@functions_framework
def upload_blob(source_file_name, destination_blob_name, bucket_name=MAIN_BUCKET_NAME):
    """Uploads a file to the bucket."""
    # The ID of your GCS bucket
    # bucket_name = "your-bucket-name"
    # The path to your file to upload
    # source_file_name = "local/path/to/file"
    # The ID of your GCS object
    # destination_blob_name = "storage-object-name"

    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(destination_blob_name)
    print(":::", source_file_name)
    # Optional: set a generation-match precondition to avoid potential race conditions
    # and data corruptions. The request to upload is aborted if the object's
    # generation number does not match your precondition. For a destination
    # object that does not yet exist, set the if_generation_match precondition to 0.
    # If the destination object already exists in your bucket, set instead a
    # generation-match precondition using its generation number.
    generation_match_precondition = 0

    blob.upload_from_file(source_file_name,
                          if_generation_match=generation_match_precondition,
                          content_type=source_file_name.content_type)

    print(
        f"File {source_file_name} uploaded to {destination_blob_name}."
    )

@functions_framework.http
def get_assets_list(request):
    '''get_assets_list: returns a list of all assets in the bucket
        request: flask.Request
        name: str - optional - the name of the asset to search for'''
    args = None
    res = []

    if request.args or request.form:
        args = request.args or request.form

    if args and args.get('name'):
        for b in storage_client.list_blobs(MAIN_BUCKET_NAME,prefix=f"{args.get('name')}"):
            res.append(b.name)
        return res

    for b in (storage_client.list_blobs(MAIN_BUCKET_NAME)):
        res.append(b.name)

    return res

@functions_framework.http
def get_asset_by_name(request):
    '''getAssetByName: returns the public url of the asset
        request: flask.Request
        name: str - required - the name of the asset to search for'''
    if request.args or request.form:
        args = request.args or request.form
    else:
        return ("no asset name provided", 404)

    if args and args.get('name'):
        content = Blob.from_string(f"gs://{MAIN_BUCKET_NAME}/{args.get('name')}")
        return content.public_url

    return "no asset name provided"

@functions_framework.http
def upload_asset(request):
    '''uploadAsset: uploads an asset to the bucket
        request: flask.Request
        name: str - required - the name of the asset to upload
        asset: file - required - the asset to upload'''
    if request.files:
        upload_blob(request.files['asset'], request.form['name'])
        return "uploaded!"
    return "no files found!"

@functions_framework.http
def hello_http(request):
    """HTTP Cloud Function.
    Args:
        request (flask.Request): The request object.
        <https://flask.palletsprojects.com/en/1.1.x/api/#incoming-request-data>
    Returns:
        The response text, or any set of values that can be turned into a
        Response object using `make_response`
        <https://flask.palletsprojects.com/en/1.1.x/api/#flask.make_response>.
    """

    file = request.files['asset']
    if request.files:
        filename = secure_filename(file.filename)

        tmp_file = f'/tmp/{filename}'

        file.save(tmp_file)

        return "uploaded!"
    return "no files found!"
