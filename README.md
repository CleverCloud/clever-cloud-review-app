
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

## How to Use this Action

Place this script in your repository in `.github/workflows/` and modify the following values:

- `<type>` for the type of app
- `<app-name>` for the name of your app
- `region` for where you want the app to be deployed
- `<VARIABLE_NAME>` and `variable_value` for your environment variables

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

## Secrets You'll Need

- `CLEVER_SECRET` and `CLEVER_TOKEN`: find them in your `clever-tools.json` after installing the CLI (example path on Mac: `~/.config/clever-cloud/clever-tools.json`)
- `ORGA_ID`: the organisation in which your app is created

Generally speaking, forks won't have access to secrets [from any base repository](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#workflows-in-forked-repositories-1). This is a GitHub Action security measure and there isn't any way of overriding this using GitHub Actions. **Any pull request from a fork will therefore fail**, consider warning your contributors about this.

## Inject App Secrets

You can pass more secrets in your app by setting them in your GitHub repository and listing them in `env` and adding them like this : `<A_SECRET>: ${{ secrets.<A_SECRET> }}`.

Then when injecting environment variables in `Set evironment variables` step, add `clever env set <A_SECRET> ${{env.<A_SECRET>}}`.

### Example Script

```yaml
env:
  ...
  HUGO_VERSION: ${{ secrets.HUGO_VERSION }}

...
- name: Set evironment variables
  run: |
    clever env set HUGO_VERSION ${{env.HUGO_VERSION}}
```
