# AI Fiesta Chat Application

[![Status](https://img.shields.io/badge/Deployment-Live-success)](https://ashishgenai.online)
**URL**: https://ashishgenai.online

A multi-model AI chat application built with Next.js, TypeScript, and Tailwind CSS. Chat with multiple AI models simultaneously in a beautiful, modern interface.

## Features

- 🎨 Beautiful, modern UI with purple gradient accents
- 🤖 Multi-model parallel chat (GPT-4, Gemini, DeepSeek)
- ⚡ Real-time responses with loading states
- 📋 Copy, like, dislike, and download responses
- 🔄 Toggle models on/off individually
- 📱 Responsive design
- ✨ Smooth animations with Framer Motion

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Project Structure

```
web/
├── app/
│   ├── api/chat/      # API routes for AI providers
│   ├── globals.css    # Global styles
│   ├── layout.tsx     # Root layout
│   └── page.tsx       # Main chat page
├── components/
│   ├── Sidebar.tsx
│   ├── TopBanner.tsx
│   ├── ChatContainer.tsx
│   ├── ChatColumn.tsx
│   ├── ChatInput.tsx
│   └── ToggleSwitch.tsx
└── lib/
    ├── ai/            # AI provider implementations
    └── utils.ts       # Utility functions
```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## License

MIT
