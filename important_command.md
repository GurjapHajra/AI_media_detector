# get into the virtual python envirment

.\env\Scripts\activate

# get out of the virtual envirment

deactivate

# install all dependencies

pip install -r ./Media_service/requirements.txt

# run a function locally with Functions Framework (must be in Media_service dir)

functions-framework-python --target {function name} --debug

# run the UI

ng serve

# local authentication for gcp

gcloud auth application-default login

# or

gcloud auth application-default login --impersonate-service-account read-write-noaivi-bucket@noaivi.iam.gserviceaccount.com