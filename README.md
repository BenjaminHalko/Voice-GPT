# Voice-GPT

A small experiment involving ChatGPT and ElevenLabs

## How to setup

### Required Packages
The required packages can be installed by running `pip install -r requirements.txt`.

### API Tokens
Add `.flaskcfg` to the root directory and enter in your tokens:
```
OPENAI_API_KEY="sk-yourkey"
ELEVENLABS_API_KEY="dQw4w9WgXcQ"
```

### Configuration:
General settings such as voice and models used can be found in [config.json](config/config.json).

The prompt given to ChatGPT can be changed in [prompt.txt](config/prompt.txt).

## How to run

Run `flask run` in the root directory, then goto `localhost:5000` in your browser.
