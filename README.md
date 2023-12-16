
# Review apps on Clever Cloud

This script does the following

1. **A PR is opened:** it deploys the branch to be reviewed on Clever Cloud and posts a comment with the link
2. **The PR is updated:** it deploys last pushed commit and post a comment to confirm the redeployment
3. **The PR is closed (merged or not):** it deletes app and post a comment to confirm the job has been done.

Currently [WIP](https://docs.github.com/en/actions/creating-actions/publishing-actions-in-github-marketplace?learn=create_actions&learnProduct=actions) (but usable).
