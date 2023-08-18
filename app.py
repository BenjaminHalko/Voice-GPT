from os import environ, path
from base64 import b64encode
from json import load
from flask import Flask, render_template, request, jsonify
from elevenlabs import set_api_key, generate
import openai

# Load Keys
try:
    set_api_key(environ.get('ELEVENLABS_API_KEY'))
    openai.api_key = environ.get('OPENAI_API_KEY')
except:
    print('~ Keys not found! ~')
    print('1. Make sure you run \'flask run\' from the root directory.')
    print('2. Please set the environment variables within \'.flaskcfg\':')
    print('   ELEVENLABS_API_KEY, OPENAI_API_KEY')
    exit(1)

# Load Config
def loadConfig():
    global config
    with open(path.join(path.dirname(__file__),'config.json')) as f:
        config = load(f)

# Load prompt
def loadPrompt():
    global prompt
    with open(path.join(path.dirname(__file__),'prompt.txt')) as f:
        prompt = f.read()

# AI
def askChatGPT(messageHistory):
    messagesFormatted = [{"role": "system", "content": prompt}]

    for(i,message) in enumerate(messageHistory):
        messagesFormatted.append({"role": "user" if (i % 2) else "assistant", "content": message})

    chat = openai.ChatCompletion.create(model=config['chatgpt_model'], messages=messagesFormatted)
    reply = chat.choices[0].message.content
    return reply

def voiceMessage(message):
    audio = generate(
        text=message,
        voice=config['elevenlabs_voice']
    )

    return audio

# Initialize Flask
app = Flask(__name__)

# Route
@app.route('/', methods=['GET', 'POST'])
def index():
    if (request.method == 'POST'):
        try:
            messageHistory = request.json["messageHistory"]
            print('generating reply')
            reply = askChatGPT(messageHistory)
            print('generating audio')
            audio = str(b64encode(voiceMessage(reply)))[2:-1]
            print('sending reply')
            return jsonify({"message": reply, "audio": audio})
        except Exception:
            return jsonify({"message": "Error: Something went wrong!", "audio": ""})
    
    # Load Config and Prompt on GET
    loadConfig()
    loadPrompt()
    return render_template('index.html')

if __name__ == '__main__':
    print('Run \'flask run\' to start the server.')