# GitHub Actions / CI

Use CI to run quality checks on pull requests and pushes. Verify actual
package scripts and package manager first.

Example `.github/workflows/ci.yml` for an npm project; adjust Node
version/scripts to the repository:

``` yaml
name: CI
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run lint --if-present
      - run: npm run typecheck --if-present
      - run: npm test -- --run
      - run: npm run build
```

Do not commit a workflow that uses nonexistent scripts or wrong package
manager. Keep provider secrets in server-only environment
variables/GitHub secrets as needed. Do not automate production deploy
until platform and release process are confirmed.
