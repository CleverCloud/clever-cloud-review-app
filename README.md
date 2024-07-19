
# Review Apps on Clever Cloud

This GitHub Action does the following

1. **A PR is opened:** it deploys the branch to be reviewed on Clever Cloud and posts a comment with the review app link
2. **The PR is updated:** it deploys last pushed commit and post a comment to confirm the redeployment
3. **The PR is closed (merged or not):** it deletes app and post a comment to confirm the job has been done.

The action will consider both branches on the same repository, and pull requests from forks.

## Requirements for this Action

- A [Clever Cloud](https://www.clever-cloud.com) account
- An [organisation](https://developers.clever-cloud.com/doc/account/administrate-organization/) in Clever Cloud
- [Clever Cloud CLI](https://developers.clever-cloud.com/doc/cli/getting_started/) installed in your machine to inject your tokens

### Mandatory configuration

Add the following secrets to your repository, in **Settings > Secrets and variables**:

- `CLEVER_SECRET` and `CLEVER_TOKEN`: find them in your `clever-tools.json` after installing the CLI (example path on Mac: `~/.config/clever-cloud/clever-tools.json`)
- `ORGA_ID`: the organisation in which your app is created

For better security, we advise generating a specific `CLEVER_SECRET` and `CLEVER_TOKEN` for GitHub Actions. Follow these steps to do so:

1. Create a new user with a new email adress on Clever Cloud
2. Create a specific organization for deploying review apps
3. From your terminal, run `clever logout` and `clever login` right after
4. Log into the Console with your new user credetials
5. Get the generated  `CLEVER_SECRET` and `CLEVER_TOKEN` and inject it into your repository secrets

Run `clever login` again and connect from your main account to set your personal tokens. Your GitHub Acction user's tokens won't be revoked and will be used only from GitHub.

## How to Use this Action

1. In your `.github/workflow/review-app.yml`, define the event trigger for running the action:

```yaml
on:
  pull_request_target:
    types: [opened, closed, synchronize, reopened]
    branches: [ main ]
```

2. Then, define the mandatory input:

```yaml
- name: Create review app
        uses: CleverCloud/clever-cloud-review-app@latest
        env:
          CLEVER_SECRET: ${{ secrets.CLEVER_SECRET }}
          CLEVER_TOKEN: ${{ secrets.CLEVER_TOKEN }}
          ORGA_ID: ${{ secrets.ORGA_ID }}
        with:
          type: '<type-of-app>'
```

### Values for `--type`

- `docker`: for Docker-based applications
- `go`: for Go applications
- `gradle`: for applications launched with gradle
- `haskell`: for haskell applications
- `jar`: for applications deployed as standalone jar files
- `maven`: for applications launched with maven
- `meteor`: for Meteor applications launched with Node.js
- `node`: for Node.js applications
- `php`: for PHP applications
- `play1`: for Play1 applications
- `play2`: for Play2 applications
- `python`: for python27 and python3 applications
- `ruby`: for ruby applications
- `rust`: for rust applications
- `sbt`: for applications launched with SBT
- `static-apache`: for static (HTML only) websites
- `war`: for applications deployed as war files

### Inject secrets and variables

To inject your app secrets and environment variables on Clever Cloud, add them to your GitHub repository in **Settings > Secrets and variables**, then add them with an `GH_` prefix in your workflow file. Finally, enable the injection with `set-env: true`:

```yaml
name: Create review app
        uses: CleverCloud/clever-cloud-review-app@latest
        env:
          CLEVER_SECRET: ${{ secrets.CLEVER_SECRET }}
          CLEVER_TOKEN: ${{ secrets.CLEVER_TOKEN }}
          ORGA_ID: ${{ secrets.ORGA_ID }}
          GH_CC_RUN_SUCCEEDED_HOOK: ${{ secrets. CC_RUN_SUCCEEDED_HOOK }} # This environment variable will be set on Clever Cloud
        with:
          type: '<type-of-app>'
          set-env: true # Enables the command to set en vars on Clever Cloud
```

## Options

You can override default options by defining `region`, `domain`, `name`, and `alias`. Default values are:

- `region`=`par` (Paris)
- `domain`=`<repo-name>-PR-#.cleverapps.io`
- `name`=`<repo-name>-PR-#>`
- `alias`=`<repo-name>-PR-#>`

### Values for `--region`

- `par` (Paris, [Clever Cloud](https://www.clever-cloud.com/infrastructure/))
- `rbx` (Roubaix, OVHcloud)
- `rbxhds` (Roubaix, HDS servers, OVHcloud)
- `scw` (Paris, [Scaleway DC5](https://www.clever-cloud.com/blog/press/2023/01/17/clever-cloud-and-scaleway-join-forces-to-unveil-a-sovereign-european-paas-offering/))
- `jed` (Jeddah, Oracle Cloud)
- `mtl` (Montreal, OVHcloud)
- `sgp` (Singapore, OVHcloud)
- `syd` (Sydney, OVHcloud)
- `wsw` (Warsaw, OVHcloud)
