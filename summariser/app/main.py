from app.routers import summariser
from app.dependencies import verify_api_key

from fastapi import Depends, FastAPI

app = FastAPI()

@app.get("/")
def health():
    return 'server is running!'


app.include_router(
    summariser.router,
    dependencies=[Depends(verify_api_key)]
)
