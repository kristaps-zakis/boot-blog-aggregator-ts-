# Gator - RSS Feed Aggregator

A command-line RSS feed aggregator built with TypeScript. Follow your favorite blogs and aggregate their posts into a single feed.

## Prerequisites

- **Node.js** (v18 or higher recommended)
- **PostgreSQL** database
- **npm** package manager

## Installation

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd boot-blog-aggregator-ts
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the database migrations:
   ```bash
   npm run generate
   npm run migrate
   ```

## Configuration

Create a config file at `~/.gatorconfig.json` with the following structure:

```json
{
  "db_url": "postgres://username:password@localhost:5432/gator",
  "current_user_name": ""
}
```

- `db_url`: Your PostgreSQL connection string
- `current_user_name`: Will be set automatically when you log in

## Usage

Run commands using:
```bash
npm start -- <command> [args]
```

### User Commands

| Command | Description |
|---------|-------------|
| `register <name>` | Create a new user account |
| `login <name>` | Log in as an existing user |
| `users` | List all registered users |

### Feed Commands

| Command | Description |
|---------|-------------|
| `addfeed <name> <url>` | Add a new RSS feed (automatically follows it) |
| `feeds` | List all available feeds |
| `follow <url>` | Follow an existing feed by URL |
| `unfollow <url>` | Unfollow a feed |
| `following` | List feeds you're following |

### Aggregation Commands

| Command | Description |
|---------|-------------|
| `agg <interval>` | Start the feed aggregator (e.g., `agg 1m`, `agg 30s`) |
| `browse [limit]` | Browse your latest posts (default: 2) |

### Admin Commands

| Command | Description |
|---------|-------------|
| `reset` | Reset the database (deletes all data) |

## Examples

```bash
# Register and log in
npm start -- register alice
npm start -- login alice

# Add and follow feeds
npm start -- addfeed "Boot.dev Blog" "https://blog.boot.dev/index.xml"
npm start -- addfeed "Wagslane" "https://wagslane.dev/index.xml"

# Start aggregating (fetches every 30 seconds)
npm start -- agg 30s

# Browse your feed (in another terminal)
npm start -- browse 10
```

## Tech Stack

- **TypeScript** - Type-safe JavaScript
- **Drizzle ORM** - Database toolkit
- **PostgreSQL** - Database
- **fast-xml-parser** - RSS/XML parsing
