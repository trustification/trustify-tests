# End-to-end tests for trustify-ui

### Requirements

- NodeJS 21
- A running instance of Trustify

### Running the tests

- Install dependencies:

```shell
npm ci
```

- Point the tests to a running instance of trustify:

```shell
export TRUSTIFY_URL=http://localhost:8080
```

- Run tests:

```shell
npm run test
```

## Environment Variables

General:

| Variable       | Default Value | Description                                     |
| -------------- | ------------- | ----------------------------------------------- |
| LOG_LEVEL      | info          | Possible values: debug, info, warn, error, none |
| SKIP_INGESTION | false         | If to skip initial data ingestion / cleanup     |

For UI tests:

| Variable               | Default Value         | Description                              |
| ---------------------- | --------------------- | ---------------------------------------- |
| TRUSTIFY_URL           | http://localhost:8080 | The UI URL                               |
| TRUSTIFY_AUTH_ENABLED  | false                 | Whether or not auth is enabled in the UI |
| TRUSTIFY_AUTH_USER     | admin                 | User name to be used when authenticating |
| TRUSTIFY_AUTH_PASSWORD | admin                 | Password to be used when authenticating  |

For API tests:

| Variable                    | Default Value         | Description                                                                                                    |
| --------------------------- | --------------------- | -------------------------------------------------------------------------------------------------------------- |
| TRUSTIFY_URL                | http://localhost:8080 | The UI URL                                                                                                     |
| TRUSTIFY_AUTH_ENABLED       | false                 | Whether or not auth is enabled in the UI                                                                       |
| TRUSTIFY_AUTH_URL           |                       | OIDC Base URL E.g. http://localhost:9090/realms/trustd . If not set we will try to discover it from index.html |
| TRUSTIFY_AUTH_CLIENT_ID     | cli                   | OIDC Client ID                                                                                                 |
| TRUSTIFY_AUTH_CLIENT_SECRET | secret                | OIDC Client Secret                                                                                             |

## Available commands

There are come preconfigured commands you can use:

| Variable              | Description                                       |
| --------------------- | ------------------------------------------------- |
| npm run test          | Execute tests                                     |
| npm run test:ui:trace | Execute tests and take screenshots                |
| npm run test:ui:host  | Opens the Playwright UI in the browser of your OS |

You can also execute any playwright or [playwright-bdd](https://vitalets.github.io/playwright-bdd) command directly in your terminal.
