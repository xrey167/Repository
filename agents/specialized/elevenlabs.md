# ElevenLabs

## Overview
ElevenLabs provides AI-powered voice synthesis and text-to-speech. Known for natural-sounding voices, voice cloning, and real-time audio generation.

## Key Features
- Natural text-to-speech
- Voice cloning
- Voice design
- Real-time streaming
- Multiple languages (29+)
- Dubbing/localization
- Sound effects generation

## Products

| Product | Description |
|---------|-------------|
| Text to Speech | Generate speech from text |
| Voice Cloning | Clone any voice |
| Voice Design | Create new voices |
| Dubbing | Video localization |
| Audio Isolation | Remove background noise |
| Sound Effects | Generate audio effects |

## Pricing

| Tier | Price | Characters/month |
|------|-------|------------------|
| Free | $0 | 10,000 |
| Starter | $5/month | 30,000 |
| Creator | $22/month | 100,000 |
| Pro | $99/month | 500,000 |
| Scale | $330/month | 2,000,000 |

## Installation

```bash
pip install elevenlabs
```

## Example

```python
from elevenlabs import ElevenLabs

client = ElevenLabs(api_key="...")
audio = client.text_to_speech.convert(
    text="Hello, how are you?",
    voice_id="21m00Tcm4TlvDq8ikWAM",
    model_id="eleven_multilingual_v2"
)
```

## Models
- **Multilingual v2**: Best quality, 29 languages
- **Turbo v2.5**: Fast, low latency
- **English v1**: Original model

## Use Cases
- Audiobook narration
- Podcast production
- Video voiceovers
- Voice assistants
- Accessibility tools
- Game characters

## Links
- [Website](https://elevenlabs.io)
- [Documentation](https://docs.elevenlabs.io)
- [API Reference](https://docs.elevenlabs.io/api-reference)
- [Voice Library](https://elevenlabs.io/voice-library)
- [Pricing](https://elevenlabs.io/pricing)
