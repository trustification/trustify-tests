# Developing `trustify-tests`

This document describes how to setup your environment to run the `trustify-tests`
on your local environment.

## System Requirements

Playwright is officially [supported](https://playwright.dev/docs/intro#system-requirements)
to:

- Windows 10+, Windows Server 2016+ or Windows Subsystem for Linux (WSL)
- macOS 13 Ventura, or later
- Debian 12, Ubuntu 22.04, Ubuntu 24.04, on x86-64 and arm64 architecture

To run Playwright on [unsupported Linux distributions](https://github.com/microsoft/playwright/issues/26482)
like Fedora, Playwright can be configured on docker/podman and the tests can be
executed from the client (local machine). To do this, follow the section below.

## Running Playwright as Docker/Podman Container

First, clean-install the requirements:

```shell
npm ci
```

Then, get the Playwright version (it is important that client and server
versions of Playwright must match, otherwise you get `<ws unexpected response>
ws://localhost:5000/ 428 Precondition Required`-like error when you try to run
tests):

```shell
export PLAYWRIGHT_VERSION="v$(npx playwright --version | cut -d' ' -f2)"
```

By default, Playwright is listening on port `5000` (the default value of
`PLAYWRIGHT_PORT` from `etc/playwright-compose/.env`). You can override this
value if it is already taken by the system or other application:

```shell
export PLAYWRIGHT_PORT=<your choice of port number>
```

Then, start the Playwright service (you can override `etc/playwright-compose/.env`
by exporting environment variables with your own values as demonstrated above or
you can just pass to `{docker,podman}-compose` your own `.env` file via
`--env-file <env_file>` CLI option):

```shell
podman-compose -f etc/playwright-compose/compose.yaml up
```

After a while, the container should be in `Ready` state and you should see the
output (replace `5000` by the value of `PLAYWRIGHT_PORT`):

```
Listening on ws://127.0.0.1:5000/
```

Now you can execute the Playwright tests (again, replace `5000` by the value of
`PLAYWRIGHT_PORT`):

```shell
TRUSTIFY_URL=http://localhost:8080 PW_TEST_CONNECT_WS_ENDPOINT=ws://localhost:5000/ npm run test
```

When you are finished with testing, you can shut down the container by `Ctrl+C`
and:

```shell
podman-compose -f etc/playwright-compose/compose.yaml down
```
