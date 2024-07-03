
## Tech Stack

TypeScript
Node.js
Jest (for testing)
Web3.js
Postgres

## Dependencies
Production Dependencies

postgres: ^3.4.4
web3: ^4.10.0

## Development Dependencies

@types/jest: ^29.5.12
@types/node: 20.12.7
gts: ^5.3.1
jest: ^29.7.0
ts-jest: ^29.1.5
ts-node: ^10.9.2
typescript: ^5.4.3

## Setup

Clone the repository
Install dependencies:

``` npm install ```


### Running the Project

run the database

```
docker compose up -d
```

For development:

``` npm run dev ```

For production:
```
npm run build
npm start
```

Testing
Run tests using Jest:
```npm test```
Other Scripts

Additional Information

This project uses gts (Google TypeScript Style) for code style and linting.
