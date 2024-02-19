---
title: Testing a Visual Studio Code Extension inside GitHub Actions
slug: /2024-02-12-testing-a-visual-studio-code-extension-inside-github-actions
author: Kevin Hakanson
date: 2024-02-12
tags: ["vscode","github","codequality"]
---

Visual Studio Code can be customized and enhanced through the [Extension API](https://code.visualstudio.com/api), as I have done with the [Cedar policy language for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=cedar-policy.vscode-cedar).

Running automated tests using [GitHub Actions](https://github.com/features/actions) gave me errors like these:

> Failed to connect to the bus: Could not parse server address: Unknown address type (examples of valid types are "tcp" and on UNIX "unix")

> Exiting GPU process due to errors during initialization

Below are select sections from my [build_and_test.yml](https://github.com/cedar-policy/vscode-cedar/blob/main/.github/workflows/build_and_test.yml) that removed these error messages.

The GitHub Action is running on `ubuntu-latest`.

```yaml
    runs-on: ubuntu-latest
```

Running tests requires downloading a version of Visual Studio Code, so I called the REST API to get the latest stable version.

```yaml
      - name: Find VS Code stable release version
        id: code-stable
        run: |
          echo "VSCODE_VERSION=`curl --silent https://update.code.visualstudio.com/api/releases/stable | jq -r '.[0]'`" >> "$GITHUB_OUTPUT"
```

Then I used the [Cache action](https://github.com/actions/cache) to cache that download and improve workflow execution time on subsequent runs.

```yaml
      - name: Cache VS Code download
        uses: actions/cache@v4
        with:
          path: |
            .vscode-test
          key: vscode-test-cache-${{ steps.code-stable.outputs.VSCODE_VERSION }}
```

I don't know much about D-Bus (short for "Desktop Bus") other that it gave me a lot of errors.  I searched and eventually a `dbus-daemon` command that worked.  Then I found how to [disable GPU acceleration](https://code.visualstudio.com/updates/v1_40#_disable-gpu-acceleration) by adding `"disable-hardware-acceleration": true` to an `argv.json` file.

```yaml
      - name: Test using VS Code
        # commands before `xvfb-run -a npm run test` avoid these ERROR messages:
        # - Failed to connect to the bus: Could not parse server address: Unknown address type (examples of valid types are "tcp" and on UNIX "unix")
        # - Exiting GPU process due to errors during initialization
        run: |
          export XDG_RUNTIME_DIR=/run/user/$(id -u)
          export DBUS_SESSION_BUS_ADDRESS=unix:path=$XDG_RUNTIME_DIR/bus
          dbus-daemon --session --address=$DBUS_SESSION_BUS_ADDRESS --nofork --nopidfile --syslog-only &
          mkdir ~/.vscode && echo '{ "disable-hardware-acceleration": true }' > ~/.vscode/argv.json
          xvfb-run -a npm run test
```

Now I get clean runs, and if you are reading this, I hope you do as well.
