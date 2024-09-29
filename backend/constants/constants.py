import environ,os
from ARS.settings import BASE_DIR
env = environ.Env()
environ.Env.read_env(os.path.join(BASE_DIR,'ARS','.env'))


CLIENT_ID = env('CLIENT_ID')
REDIRECT_URI = env('REDIRECT_URI')
AUTH_URL = env('AUTH_URL')
CLIENT_SECRET = env('CLIENT_SECRET')
AUTH_POST_URL = env('AUTH_POST_URL')
USER_DATA_URL = env('USER_DATA_URL')