import fetch from 'node-fetch';
import { Colors, Titles } from '../functions/src/consts';
import { config } from '../functions/src/config';
import { Request, Response } from 'express';

export const slackHook = (request: Request, response: Response) => {
  const slackMessageToSend = getBuildMessage(request.body);

  if (!slackMessageToSend) {
    response.status(406).send();
    return;
  }

  const body = JSON.stringify(slackMessageToSend);

  //@TODO Add retrying on error
  fetch(config.slackWebhookUrl, {
    body,
    method: 'POST',
  })
    .then(() => response.send(200))
    .catch((error: Error) => {
      console.error(error);
      response.status(500).send(JSON.stringify(error));
    });
};

type DeployState = 'ready' | 'building' | 'error';

function getBuildMessage({
  id,
  deploy_ssl_url,
  branch,
  published_at,
  admin_url,
  state,
  error_message,
}: {
  id: string;
  deploy_ssl_url: string;
  branch: string;
  published_at: string;
  admin_url: string;
  state: DeployState;
  error_message?: string;
}) {
  if (!deploy_ssl_url) {
    return;
  }

  const buildLogUrl = `${admin_url}/deploys/${id}`;

  return {
    text: `${getDeployTitle(state)} *${branch}*`,
    attachments: [
      {
        mrkdwn_in: ['text'],
        color: getDeployColor(state),
        title:
          state === 'ready' ? `Visit the changes live` : `Visit the build log`,
        title_link: state === 'ready' ? deploy_ssl_url : buildLogUrl,
        text: getDeployText(state, buildLogUrl, error_message),
        footer: `Using git branch ${branch}`,
        ts: new Date(published_at).getTime(),
      },
    ],
  };
}

function getDeployColor(state: DeployState) {
  switch (state) {
    case 'building':
      return Colors.Progress;
    case 'ready':
      return Colors.Success;
    case 'error':
    default:
      return Colors.Error;
  }
}

function getDeployTitle(state: DeployState) {
  switch (state) {
    case 'building':
      return Titles.Progress;
    case 'ready':
      return Titles.Success;
    case 'error':
    default:
      return Titles.Error;
  }
}

function getDeployText(
  state: DeployState,
  buildLogUrl: string,
  errorMessage?: string
) {
  switch (state) {
    case 'building':
      return undefined;
    case 'ready':
      return `Or check out the <${buildLogUrl}|build log>`;
    case 'error':
      return `The last message we got from the build was \`${
        errorMessage || ''
      }\``;
    default:
      return '';
  }
}
