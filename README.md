# Review Apps on Clever Cloud

This GitHub Action does the following

1. **A PR is opened:** it deploys the branch to be reviewed on Clever Cloud and posts a comment with the review app link
2. **The PR is updated:** it deploys last pushed commit and post a comment to confirm the redeployment
3. **The PR is closed (merged or not):** it deletes app and post a comment to confirm the job has been done.

The action will consider both branches on the same repository, and pull requests from forks.

## Requirements for this Action

- [A Clever Cloud account](https://www.clever-cloud.com)
- [Clever Tools](https://developers.clever-cloud.com/doc/cli) installed in your machine to get your tokens

### Mandatory configuration

You need to add tokens as secrets in your GitHub repository settings (**Secrets and variables > Actions**):

- `CLEVER_SECRET` and `CLEVER_TOKEN`: find them in your `~/.config/clever-cloud/clever-tools.json` if you're logged in
- `ORGA_ID`: the organisation in which the review apps should be created
- `GITHUB_TOKEN`: implicit, to enable comments on the PR

For better security, we advise generating a specific `CLEVER_SECRET` and `CLEVER_TOKEN` for GitHub Actions, following these steps:

1. Create a new user with a new e-mail address on Clever Cloud
2. Create a specific organisation for deploying review apps
3. From your terminal, run `clever logout` and `clever login` right after
4. Log into the Console with your new user credentials
5. Get the generated `CLEVER_SECRET` and `CLEVER_TOKEN` and inject it into your repository secrets

Run `clever login` again and connect from your main account to set your personal tokens. Your GitHub Action user's tokens won't be revoked and will be used only from GitHub.

- View and revoke OAuth tokens [from the Clever Cloud Console](https://console.clever-cloud.com/users/me/oauth-tokens)

### Permissions

At job level, set the appropriate permissions to enable comments on PRs:

```yaml
jobs:
  deploy:
    name: Deploy/redeploy review app
    runs-on: ubuntu-latest
    permissions:
        issues: write
        pull-requests: write
        contents: read
```

## How to Use this Action

1. In your `.github/workflow/review-app.yml`, define the event trigger for running the action:

```yaml
on:
  pull_request:
    types: [opened, closed, synchronize, reopened]
    branches: [ main ]
```

2. Then, define the mandatory input:

```yaml
- name: Create review app
        uses: CleverCloud/clever-cloud-review-app@v2.0.1
        env:
          CLEVER_SECRET: ${{ secrets.CLEVER_SECRET }}
          CLEVER_TOKEN: ${{ secrets.CLEVER_TOKEN }}
          ORGA_ID: ${{ secrets.ORGA_ID }}
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          type: '<type-of-app>'
```

### Values for `type`

Choose one [of the runtimes that Clever Cloud support](https://www.clever-cloud.com/developers/doc/applications/) to deploy your review app:

- `docker`
- `elixir`
- `frankenphp`
- `go`
- `gradle`
- `haskell`
- `jar`
- `linux`
- `maven`
- `meteor`
- `node`
- `php`
- `play1`
- `play2`
- `python`
- `ruby`
- `rust`
- `sbt`
- `static`
- `static-apache`
- `v`
- `war`

### Application scaling

Use a specific `flavor` to scale your review app, and `build-flavor` to use a dedicated build instance on a different flavor:

```yaml
- name: Create review app
        uses: CleverCloud/clever-cloud-review-app@v2.0.1
        with:
          type: '<type-of-app>'
          flavor: '<flavor>'
          build-flavor: '<build-flavor>'
```

Available flavors: `pico`, `nano`, `XS`, `S`, `M`, `L`, `XL`, `2XL`, `3XL`

Flavor pico is not available for the following instances: `docker`, `frankenphp`, `php`, `static-apache`

### Inject secrets and variables

To inject your app secrets and environment variables on Clever Cloud, add them to your GitHub repository settings in **Secrets and variables > Actions**, then add them with a `GH_` prefix in your workflow file. Finally, enable the injection with `set-env: true`:

```yaml
name: Create review app
        uses: CleverCloud/clever-cloud-review-app@v2.0.1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }} # To enable comments on the PR
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

### Values for `--region`

- `par` (Paris, [Clever Cloud](https://www.clever-cloud.com/infrastructure/))
- `parhds` (Paris, HDS infrastructure, [Clever Cloud](https://www.clever-cloud.com/infrastructure/))
- `scw` (Paris, [Scaleway DC5](https://www.clever-cloud.com/blog/press/2023/01/17/clever-cloud-and-scaleway-join-forces-to-unveil-a-sovereign-european-paas-offering/))
- `grahds` (Gravelines, HDS infrastructure, OVHcloud)
- `ldn` (London, Ionos)
- `mtl` (Montreal, OVHcloud)
- `rbx` (Roubaix, OVHcloud)
- `rbxhds` (Roubaix, HDS infrastructure, OVHcloud)
- `sgp` (Singapore, OVHcloud)
- `syd` (Sydney, OVHcloud)
- `wsw` (Warsaw, OVHcloud)
