import os
from flask import Flask, request
from llamaapi import LlamaAPI
import json

env = os.environ.get('ENV', 'dev')
llama_api_key = os.environ.get('LLAMA_API_KEY', 'DUMMY-API-KEY')
server_api_key = os.environ.get('SERVER_API_KEY', 'DUMMY-API-KEY')

llama = LlamaAPI(llama_api_key) 
app = Flask(__name__)

@app.route('/')
def health():
    return 'server is running!'

@app.before_request
def authorize():
    received_server_api_key = request.headers.get('X-API-KEY')
    if request.path == '/':
        return
    elif received_server_api_key is None:
        return { "error": "Missing API key" }, 401
    elif received_server_api_key != server_api_key:
        return { "error": "Invalid API key" }, 403

@app.route('/summarise', methods=['POST'])
def summarise():
    data = request.get_json()
    content_to_summarise = data.get('content')
    prompt = f"""You are a llama assistant that helps summarise conversations,
                    could you summarise the following conversation? Do not include anything except the summarised content:
                    {content_to_summarise}."""
    print(f"prompt: {prompt}")
    print(f"content_to_summarise: {content_to_summarise}")
    api_request_json = {
        "model": "llama3-70b",
        "messages": [
            {
                "role": "system", 
                "content": prompt
            },
        ]
    }
    response = llama.run(api_request_json)
    response_json = response.json()
    summary = response_json['choices'][0]['message']['content']
    return { "summary": summary }

if __name__ == '__main__':
    debug = env == 'dev'
    app.run(debug=debug)