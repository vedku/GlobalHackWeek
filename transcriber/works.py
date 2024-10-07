import whisper

model = whisper.load_model("turbo")
result = model.transcribe("audiofilepath")
print(result["text"])
