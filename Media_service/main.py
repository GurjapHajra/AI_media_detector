import functions_framework
from google.cloud.storage.blob import Blob
from google.cloud import storage
import os

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = r'noaivi-e4f53fa15f55.json'

main_bucket_name = "noaivi-images"
storage_client = storage.Client()

@functions_framework
def upload_blob(source_file_name, destination_blob_name, bucket_name=main_bucket_name):
    """Uploads a file to the bucket."""
    # The ID of your GCS bucket
    # bucket_name = "your-bucket-name"
    # The path to your file to upload
    # source_file_name = "local/path/to/file"
    # The ID of your GCS object
    # destination_blob_name = "storage-object-name"

    storage_client = storage.Client()
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

    blob.upload_from_file(source_file_name, if_generation_match=generation_match_precondition, content_type=source_file_name.content_type)

    print(
        f"File {source_file_name} uploaded to {destination_blob_name}."
    )

@functions_framework.http
def getAssetsList(request):
    
    args = None
    res = []

    if request.args or request.form:
        args = request.args or request.form

    if args and args.get('name'):
        for b in storage_client.list_blobs(main_bucket_name,prefix=f"{args.get('name')}"):
            res.append(b.name)
        return res
    
    for b in (storage_client.list_blobs(main_bucket_name)):
        res.append(b.name)

    return res

@functions_framework.http
def getAssetByName(request):
    if request.args or request.form:
        args = request.args or request.form
    else:
        return ("no asset name provided", 404)

    if args and args.get('name'):
        content = Blob.from_string(f"gs://{main_bucket_name}/{args.get('name')}")
        return content.public_url

    return "no asset name provided"

@functions_framework.http
def uploadAsset(request):
    print(request.files)
    if request.files:
        print(":::",request.files['asset'].content_type)
        upload_blob(request.files['asset'], request.form['name'])
        return f"uploaded!"
    else:
        return f"no files found!"

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

        return f"uploaded!"
    else:
        return f"no files found!"