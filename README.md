# Tansweeper

A unique implementation of Minesweeper built with TanStack Start that works without JavaScript! The game state is entirely managed through URL search parameters, making it fully functional even with JavaScript disabled.

## How It Works

This implementation takes advantage of TanStack Router's powerful search parameter capabilities to store the entire game state in the URL. Every interaction (revealing cells, placing flags, etc.) is handled through `<Link>` components that update the URL state, making the game playable even with JavaScript disabled.

### Technical Details

- Built with [TanStack Start](https://tanstack.com/start/latest/docs/framework/react/overview)
- Uses URL search parameters as the source of truth for:
  - Board configuration (size, mine locations)
  - Revealed cells
  - Flagged cells
  - Game status (in progress, won, lost)
- All interactive elements are `<Link>` components that modify the URL state
- Progressive enhancement: Works without JavaScript, enhanced experience with JavaScript enabled

## Features

- 🎮 Fully playable without JavaScript
- 🔗 Shareable game states via URL
- 📱 Responsive design
- 🎯 Classic Minesweeper gameplay
- 🚀 Progressive enhancement

## Development

1. Clone the repository
2. `bun install`
3. `bun run dev`
