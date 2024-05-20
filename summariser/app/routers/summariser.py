from logging.config import dictConfig
import logging
from app.logconfig import LogConfig

import os

from app.dependencies import verify_api_key
from app.llm.llm import llamabot

from fastapi import APIRouter, Depends, HTTPException

from app.dto.request import SummariseChatRequest

from dotenv import load_dotenv

load_dotenv()
dictConfig(LogConfig().model_dump())
logger = logging.getLogger(os.getenv('LOGGER_NAME'))


router = APIRouter(
    dependencies=[Depends(verify_api_key)],
    responses={404: {"description": "Not found"}},
)


@router.post("/summarise")
async def summarise(summariser_input: SummariseChatRequest):
    
    groupchat_history = summariser_input.content
    logger.debug(groupchat_history)

    summary = llamabot.query(groupchat_history)

    return { "summary": summary }
