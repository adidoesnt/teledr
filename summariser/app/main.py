from logging.config import dictConfig
import logging
from logconfig import LogConfig

import os
from pydantic import BaseModel

from fastapi import FastAPI, HTTPException, Request, Depends, Security, status
from fastapi.security import APIKeyHeader

from llamaapi import LlamaAPI

from langchain_experimental.llms import ChatLlamaAPI
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate

from dotenv import load_dotenv

load_dotenv()
env = os.getenv('ENV', 'dev')

dictConfig(LogConfig().model_dump())
logger = logging.getLogger(os.getenv('LOGGER_NAME'))

llama_api_key = os.getenv('LLAMA_API_KEY', 'DUMMY-API-KEY')
server_api_key = os.getenv('SERVER_API_KEY', 'DUMMY-API-KEY')
api_key_header = APIKeyHeader(name="X-API-Key")

llama = LlamaAPI(llama_api_key)
model = ChatLlamaAPI(client=llama)
app = FastAPI()


class SummariserInput(BaseModel):
    content: str


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
async def summarise(summariser_input: SummariserInput):
    
    content = summariser_input.content

    prompt_str = """You are a llama assistant that helps summarise conversations, \
could you summarise the following conversation? Do not include anything except the summarised content:
{content}."""
    prompt_template = ChatPromptTemplate.from_template(prompt_str)
    output_parser = StrOutputParser()

    chain = prompt_template | model | output_parser
    summary = chain.invoke({"content": content})

    logger.debug(content)

    return { "summary": summary }
