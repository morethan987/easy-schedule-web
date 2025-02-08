# Quick Start
### Local Development
Run the following instruction:
```bash
pnpm install

# This command is for the database initialization.
# I've run it. Don't run again!
# If you want to use your own database instance, you should run this.
# pnpm tsx lib/db/migrate.ts && pnpm run build

pnpm dev
```
The chatbot template will be available at `http://localhost:3000`.

For the first usage, you should sign up an account with your own email.