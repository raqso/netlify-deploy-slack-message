# Netlify deploy slack notification

## Get your slack webhook URL

From Slack [documentation](https://slack.com/intl/en-pl/help/articles/115005265063-Incoming-webhooks-for-Slack):
> 1. [Create a new Slack app](https://api.slack.com/apps?new_app=1) in the workspace where you want to post messages.
> 2. From the Features page, toggle Activate Incoming Webhooks on.
> 3. Click Add New Webhook to Workspace.
> 4. Pick a channel that the app will post to, then click Authorize.
> 5. Use your [Incoming Webhook URL](https://api.slack.com/incoming-webhooks#posting_with_webhooks) to post a message to Slack. 

## Deploying to Heroku

```
$ heroku create
$ git push heroku master
$ heroku open
```
or

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)