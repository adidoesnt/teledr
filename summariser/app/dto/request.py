from pydantic import BaseModel

class SummariseChatRequest(BaseModel):
    content: str