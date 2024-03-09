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
- Tip: set different envs `.env.local`, `.env.dev` and `.env.prod`. These will help store different variables, but only `.env` will be read by the compiler.

### Initialization
Run the following commands to initialize Sequelize:
```bash
pnpm db:migrate
pnpm db:seed:all
```

### Start Local Server
```bash
pnpm run dev
```

### Connect to Frontend
1. Install ngrok (tip: you might need to grab an auth token)
2. Expose the backend port (e.g. `ngrok http 4000`)
3. Set the ngrok url to your frontend `.env` file like `REACT_APP_API_URL="https://3610-63-142-212-64.ngrok-free.app"`
4. Run the ngrok instance while the frontend is up

### Testing
1. Open Postman (or your preferred API platform)
2. Follow [API Docs](https://pylon-api.readme.io/reference/signup) (Tip: Use collections for each development environments (e.g. local, dev and prod))
3. Replace the endpoint with the ngrok endpoint
   
### Account Set-up

#### 1. Sign up `/v2/partners`
```bash
body: {
    firstname, 
    lastname, 
    email, 
    password
}
```
Tip: use a strong password (chars: special, number, small & big letter, min length 8)

Response:
- Click on ToS link and press approve
- **Important:** Don't go thru the KYC steps (prod only)

#### 3. Sign in `/v2/partners/login`
```bash
body: {
    email, 
    password
}
```
Response: 
- JWT (set that in the Auth/Header with Bearer prefix like `Bearer eyJhbGci...BQIZHJK54`).

#### 3. Approve KYB `/v2/partners/kyb_success/sandbox`
```bash
authorization: {
    Bearer eyJhbGci...BQIZHJK54
}
```
#### 4. Create order `/v2/partners/orders`
```bash
authorization: {
    Bearer eyJhbGci...BQIZHJK54
}
body: {
    amount,
    walletAddress
}
```
response:
- click on localhost link (if you set that correct in your `.env` file in `FRONT_END_URI`)


## Staging

### Requirements
- Host the database in the cloud (use details from the Vercel storage section).
- Use the test database.
- Set `NODE_ENV` to `staging` in the `.env` file for secure SSL connection.