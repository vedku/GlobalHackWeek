import whisper

model = whisper.load_model("turbo")
result = model.transcribe("/Users/vedk/Desktop/audiotobeused.m4a")
print(result["text"])
