from logging.config import dictConfig
import logging
from logconfig import LogConfig

import os
from fastapi import FastAPI, HTTPException, Request, Depends, Security, status
from pydantic import BaseModel
from fastapi.security import APIKeyHeader
from llamaapi import LlamaAPI
from dotenv import load_dotenv

load_dotenv()
env = os.getenv('ENV', 'dev')

dictConfig(LogConfig().model_dump())
logger = logging.getLogger("mycoolapp")

llama_api_key = os.getenv('LLAMA_API_KEY', 'DUMMY-API-KEY')
llama = LlamaAPI(llama_api_key)
server_api_key = os.getenv('SERVER_API_KEY', 'DUMMY-API-KEY')


api_key_header = APIKeyHeader(name="X-API-Key")
app = FastAPI()


@app.get("/")
def health():
    return 'server is running!'

async def verify_api_key(api_key: str = Security(api_key_header)):
    if api_key == server_api_key:
        return True
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Missing or invalid API key"
    )

@app.post("/summarise/", dependencies=[Depends(verify_api_key)])
async def summarise(content: str):
    prompt = f"""You are a llama assistant that helps summarise conversations,
                    could you summarise the following conversation? Do not include anything except the summarised content:
                    {content}."""

    api_request_json = {
        "model": "llama3-70b",
        "messages": [
            {
                "role": "system", 
                "content": prompt
            },
        ]
    }

    logger.debug(prompt)
    logger.debug(content)

    response = llama.run(api_request_json)
    response_json = response.json()
    summary = response_json['choices'][0]['message']['content']

    return { "summary": summary }
