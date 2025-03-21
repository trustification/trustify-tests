# End-to-End Tests for `trustify-ui`

## Requirements

- NodeJS 21
- A running instance of Trustify

## Running the Tests

- Install dependencies:

  ```shell
  npm ci
  ```

- Point the tests to a running instance of Trustify:

  ```shell
  export TRUSTIFY_URL=http://localhost:8080
  ```

- Run the tests:

  ```shell
  npm run test
  ```

- For other methods and operating systems, see [Developing `trustify-tests`](DEVELOPING.md)

## Environment Variables

General:

| Variable       | Default Value | Description                                     |
| -------------- | ------------- | ----------------------------------------------- |
| LOG_LEVEL      | info          | Possible values: debug, info, warn, error, none |
| SKIP_INGESTION | false         | If to skip initial data ingestion/cleanup       |

For UI tests:

| Variable               | Default Value         | Description                              |
| ---------------------- | --------------------- | ---------------------------------------- |
| TRUSTIFY_URL           | http://localhost:8080 | The UI URL                               |
| TRUSTIFY_AUTH_ENABLED  | false                 | Whether or not auth is enabled in the UI |
| TRUSTIFY_AUTH_USER     | admin                 | User name to be used when authenticating |
| TRUSTIFY_AUTH_PASSWORD | admin                 | Password to be used when authenticating  |

For API tests:

| Variable                    | Default Value         | Description                                                                                                         |
| --------------------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------- |
| TRUSTIFY_URL                | http://localhost:8080 | The UI URL                                                                                                          |
| TRUSTIFY_AUTH_ENABLED       | false                 | Whether or not auth is enabled in the UI                                                                            |
| TRUSTIFY_AUTH_URL           |                       | OIDC Base URL, e.g. `http://localhost:9090/realms/trustd`. If not set, we will try to discover it from `index.html` |
| TRUSTIFY_AUTH_CLIENT_ID     | cli                   | OIDC Client ID                                                                                                      |
| TRUSTIFY_AUTH_CLIENT_SECRET | secret                | OIDC Client Secret                                                                                                  |

## Available Commands

There are some pre-configured commands you can use:

| Variable              | Description                                                                          |
| --------------------- | ------------------------------------------------------------------------------------ |
| npm run test          | Execute tests                                                                        |
| npm run test:ui:trace | Execute tests and take screenshots                                                   |
| npm run test:ui:host  | Opens the Playwright UI in the browser of your OS                                    |
| npm run test:api      | Execute API test                                                                     |
| npm run openapi       | Generate API client code from `config/openapi.yaml`                                  |
| npm run format:fix    | Reformat source code according using `prettier` (use before committing code changes) |

You can also execute any `playwright` or [`playwright-bdd`](https://vitalets.github.io/playwright-bdd)
command directly in your terminal.
