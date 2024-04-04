# ------------------------------------ UI ------------------------------------

# run the UI

ng serve

# ------------------------------------ Google Cloud ------------------------------------

# get into the virtual python envirment

.\env\Scripts\activate

# get out of the virtual envirment

deactivate

# install all dependencies

pip install -r ./Media_service/requirements.txt

# run a function locally with Functions Framework (must be in Media_service dir)

functions-framework-python --target {function name} --debug

# local authentication for gcp

gcloud auth application-default login

# or

gcloud auth application-default login --impersonate-service-account read-write-noaivi-bucket@noaivi.iam.gserviceaccount.com

# ------------------------------------ AWS ------------------------------------

# build

sam build

# deploy initial

sam deploy --guided

# deploy

sam deploy

# run the api gateway locally

sam local start-api

# api with hot-reload

sam local start-api -t template.yaml --skip-pull-image

# ------------------------------------ amplify ------------------------------------

# deploy

amplify push
