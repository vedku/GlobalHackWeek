import openai

openai.api_key = '#apikeylololol'

try:
    audio_file = open("/Users/vedk/Desktop/audiotobeused.m4a", "rb")
    transcription = openai.Audio.transcribe("whisper-1", audio_file)
    print(transcription['text'])
except Exception as e:
    print(f"An error occurred: {e}")
