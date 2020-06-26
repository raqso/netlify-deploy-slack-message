import * as dotenv from "dotenv-safe";

dotenv.config();

export const config = {
  slackWebhookUrl: process.env.SLACK_WEBHOOK_URL || '',
};
