# OpenAI Whisper

## Overview
Whisper is OpenAI's open-source speech recognition model. Provides accurate transcription and translation across 100+ languages, available both as API and self-hosted.

## Key Features
- Speech-to-text transcription
- 100+ language support
- Translation to English
- Timestamp generation
- Speaker diarization (API)
- Open-source weights
- Multiple model sizes

## Models

| Model | Parameters | VRAM | Speed | Accuracy |
|-------|------------|------|-------|----------|
| tiny | 39M | ~1GB | Fastest | Lower |
| base | 74M | ~1GB | Fast | Good |
| small | 244M | ~2GB | Medium | Better |
| medium | 769M | ~5GB | Slow | High |
| large-v3 | 1.5B | ~10GB | Slowest | Best |

## Pricing (OpenAI API)

| Feature | Price |
|---------|-------|
| Transcription | $0.006/minute |
| Translation | $0.006/minute |

## Installation (Local)

```bash
pip install openai-whisper
```

## Example (Local)

```python
import whisper

model = whisper.load_model("base")
result = model.transcribe("audio.mp3")
print(result["text"])
```

## Example (API)

```python
from openai import OpenAI

client = OpenAI()
with open("audio.mp3", "rb") as file:
    transcript = client.audio.transcriptions.create(
        model="whisper-1",
        file=file
    )
```

## Output Options
- Plain text
- JSON with timestamps
- SRT subtitles
- VTT subtitles
- Verbose JSON

## Use Cases
- Podcast transcription
- Meeting notes
- Video subtitles
- Voice assistants
- Accessibility
- Content indexing

## Links
- [OpenAI API](https://platform.openai.com/docs/guides/speech-to-text)
- [GitHub](https://github.com/openai/whisper)
- [Paper](https://arxiv.org/abs/2212.04356)
- [Hugging Face](https://huggingface.co/openai/whisper-large-v3)
