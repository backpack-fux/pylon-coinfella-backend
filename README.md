# pylon-backend

## Installation

### Prerequisites
- Node.js (version 18.0.0 or higher)
- PostgreSQL (locally or cloud-based)
- pnpm, yarn, or npm installed globally

### Install Dependencies
Choose one of the following package managers to install project dependencies:

```bash
pnpm install
# or
yarn
# or
npm install
```

### Configuration
Make sure to set up the `.env` file with the required variables. You can find an example in `env.example`.

## Local Development

### Requirements
- Locally spawn a PostgreSQL database.
- Set `NODE_ENV` to `development` in the `.env` file.

### Initialization
Run the following commands to initialize Sequelize:
```bash
pnpm db:migrate
pnpm db:seed:all
```

### Start Local Server
```bash
pnpm run start-local
```

## Staging

### Requirements
- Host the database in the cloud (use details from the Vercel storage section).
- Use the test database.
- Set `NODE_ENV` to `staging` in the `.env` file for secure SSL connection.