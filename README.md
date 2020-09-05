# Netlify deploy slack notification

## Get your slack webhook URL

From Slack [documentation](https://slack.com/intl/en-pl/help/articles/115005265063-Incoming-webhooks-for-Slack):
> 1. [Create a new Slack app](https://api.slack.com/apps?new_app=1) in the workspace where you want to post messages.
> 2. From the Features page, toggle Activate Incoming Webhooks on.
> 3. Click Add New Webhook to Workspace.
> 4. Pick a channel that the app will post to, then click Authorize.
> 5. Use your [Incoming Webhook URL](https://api.slack.com/incoming-webhooks#posting_with_webhooks) to post a message to Slack. 

## Deploy to Heroku

```
$ heroku create
$ git push heroku master
$ heroku open
```
or

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

## Set up deploy notification in [Netlify](https://netlify.com)

1. Go to your project netlify dashbord, then 'Deploys' >> 'Notifications'.
2. Click 'Add notification' and 'Outgoing webhook'.
3. This app support webhooks for 3 events you can add  - **Deploy started**, **Deploy succeded** or **Deploy failed**.
4. 'URL to notify' will be `YOUR_DEPLOYED_APP_ADDRESS/$URL_TOKEN`, e.g. `https://awesome-notification.herokuapp.com/fb80d69a`
5. Save webhooks for all desired events and you should start getting Slack messages about your netlify app deploys.