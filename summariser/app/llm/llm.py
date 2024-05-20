from langchain_experimental.llms import ChatLlamaAPI
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate

from llamaapi import LlamaAPI

from app.llm.llm_config import llama_config

class LlamaBot:
    def __init__(self, config):
        self.config = config

        llama_api_key = self.config["llama_api_key"]
        llama = LlamaAPI(llama_api_key)
        model = ChatLlamaAPI(client=llama)

        summarise_prompt = ChatPromptTemplate.from_template(self.config["summariser_prompt"])
        output_parser = StrOutputParser()

        self.chain = summarise_prompt | model | output_parser

    def query(self, groupchat_history: str) -> str:
        return self.chain.invoke({"groupchat_history": groupchat_history})


llamabot = LlamaBot(llama_config)
