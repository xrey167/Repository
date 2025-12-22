# ElevenLabs

AI voice synthesis and cloning.

## Installation
```bash
npm install elevenlabs
```

## Features
- Text-to-Speech
- Voice Cloning
- Voice Library
- Audio Isolation

## Quick Start
```typescript
import { ElevenLabsClient } from "elevenlabs";

const client = new ElevenLabsClient();

const audio = await client.generate({
  voice: "Rachel",
  text: "Hello, world!",
  model_id: "eleven_multilingual_v2",
});
```

## Environment
```bash
ELEVENLABS_API_KEY=xxx
```

## Links
- Site: https://elevenlabs.io
- Docs: https://docs.elevenlabs.io
