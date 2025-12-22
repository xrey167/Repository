# Google (Gemini)

## API Reference
- Docs: https://ai.google.dev/docs

## Models
| Model | Context | Use Case |
|-------|---------|----------|
| gemini-2.0-flash | 1M | Fast, multimodal |
| gemini-1.5-pro | 2M | Long context |

## Quick Start
```typescript
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
const result = await model.generateContent("Hello");
```

## Environment
```bash
GOOGLE_API_KEY=xxx
```
