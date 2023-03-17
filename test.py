import os
from dotenv import load_dotenv

from subprocess import call

import gradio as gr
import openai

load_dotenv()

openai.api_key = os.environ.get('OPENAI_API_KEY')

messages = [{"role": "system", "content": "You are a helpful assistent, who is always positive. Respond to all input in 25 words or less."}]

def transcribe(audio):
    print(audio)

    fileout = audio + '.wav'

    if os.path.isfile(fileout):
        os.remove(fileout)
    
    call(["ffmpeg", "-i", audio, fileout])

    audio_file = open(fileout, "rb")
    transcript = openai.Audio.transcribe("whisper-1", audio_file)

    messages.append({"role": "user", "content": transcript["text"]})

    response = openai.ChatCompletion.create(model="gpt-3.5-turbo",messages=messages)

    system_message = response["choices"][0]["message"]
    messages.append(system_message)

    return system_message["content"]

ui = gr.Interface(fn=transcribe, inputs=gr.Audio(source="microphone", type="filepath"), outputs="text").launch()

ui.launch()   