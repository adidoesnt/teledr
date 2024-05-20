## Setup venv

```
python3 -m venv venv
source venv/bin/activate
pip install - requirements.txt
```

## Run backend
```
uvicorn app.main:app --host $HOST --port $PORT --loop asyncio --reload
```