# VGReborn

VGReborn is an open-source project dedicated to reviving and enhancing the Vainglory Community Edition (CE) experience. By leveraging accelerator services(VPN) and Man-in-the-Middle(MITM) technology, we bind player IDs to VGReborn account system to provide enhanced features.

## Project Introduction

VGReborn is a third-party game matching platform for the Vainglory Community Edition. It aims to achieve the following:

- **State Tracking**: Capture player states such as online, accepted match, declined match, and game finished. Calculate player rank tiers based on match records.
- **Real-time Statistics**: View the number of online players, players matching in 3v3/5v5 modes, and players currently in-game.
- **Room Management**: Browse game room lists (grouped by code prefix), view room capacity, and support creating, joining, and leaving rooms.
- **Member Insights**: Room members can see other members' IDs, levels, reputation, and states (ready, accepted, declined).
- **Behavior Monitoring**: Record malicious match-declining behaviors and introduce a reporting system.

*The above features are part of the Phase 1 roadmap.*

### Future Possibilities

If we can decrypt game match network data (requiring community expertise or official technical support), we could further:
- Obtain match data including hero selection, KDA, game duration, and results.

If we can simulate data transmission to the server, we could enable:
- **Custom Modes**: 1v1 SOLO, 2v2, 4v4 modes. This works by simulating AFK players to fill the lobby, allowing the game to start with fewer real players.

## Project Structure

This project is organized as a monorepo using [pnpm workspaces](https://pnpm.io/workspaces).

- **[web](./web)**: The frontend application.
- **[mitm-monitor](./mitm-monitor)**: Packet sniffer and MITM proxy.
- **[supabase](./supabase)**: Backend infrastructure configuration.

## Getting Started

### Prerequisites

- Node.js (v18+)
- pnpm (v8+)
- Supabase CLI (for backend development)

### Installation

```bash
# Install dependencies for all packages
pnpm install
```

### Development

Please refer to [DEVELOPMENT.md](./DEVELOPMENT.md) for detailed setup and development instructions.

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for details on how to get started.

## Contributors

- [@Jarvis](https://github.com/jaweii)

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
