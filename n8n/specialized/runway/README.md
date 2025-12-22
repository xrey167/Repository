# Runway

AI video generation and editing.

## Features
- **Gen-3 Alpha**: Text/Image to video
- **Motion Brush**: Selective animation
- **Inpainting**: Video editing
- **Green Screen**: Background removal

## API
```typescript
const response = await fetch("https://api.runwayml.com/v1/generate", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${RUNWAY_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "gen3a_turbo",
    prompt: "A cat walking",
  }),
});
```

## Environment
```bash
RUNWAY_API_KEY=xxx
```

## Links
- Site: https://runwayml.com
- API: https://docs.runwayml.com
