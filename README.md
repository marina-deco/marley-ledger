# Marley's Ledger

A spooky-themed todo application inspired by Charles Dickens' "A Christmas Carol" meets Halloween aesthetics. Tasks manifest as floating ghosts that orbit your screen, waiting to be saved or lost to the void.

## Features

- **Ghost Tasks** - Tasks appear as animated ghosts floating in orbital paths
- **Subtasks with Chains** - Break down tasks into subtasks; incomplete ones show Marley's chains
- **Soul Tracking** - Save or lose souls when completing tasks, tracked on a tilting scale
- **Spirit Consultation** - AI-powered task suggestions from goal descriptions
- **Persistent Storage** - All data saved to localStorage

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Vercel AI SDK

## Getting Started

1. Install dependencies:

```bash
pnpm install
```

2. Set up environment variables:

```bash
cp .env.example .env
```

Add your OpenAI API key to `.env`:

```
OPENAI_API_KEY=your_key_here
```

3. Run the development server:

```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## Color Palette

The app uses a distinctive palette: gold, pale yellow, deep purple, coral, sage, brown, dark green, and pale pink.

## License

MIT
