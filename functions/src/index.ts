import * as functions from "firebase-functions";
import fetch from 'node-fetch';
import { SLACK_WEBHOOK_URL, Colors, Titles } from "./consts";

export const notifyTalenoteSlack = functions.https.onRequest(
	(request, response) => {
	const slackMessageToSend = getBuildMessage(request.body);

  if (!slackMessageToSend) {
		response.status(406).send();
		return;
  }


  const body = JSON.stringify(slackMessageToSend);

  fetch(SLACK_WEBHOOK_URL, {
    body,
    method: 'POST'
  })
		.then(() => response.send(200))
		.catch((error: Error) => {
      console.error(error);
      response.status(500).send(JSON.stringify(error));
    })
  }
);

type DeployState = "ready" | "building" | "error";

function getBuildMessage({
	id,
	deploy_ssl_url,
	branch,
	published_at,
	admin_url,
	state,
	summary: { messages },
}: {
	id: string;
	deploy_ssl_url: string;
	branch: string;
	published_at: string;
	admin_url: string;
	state: DeployState;
	summary: {
		status: DeployState;
		messages: BuildMessage[];
	};
}) {
	if (!deploy_ssl_url) {
		return;
	}

	const buildLogUrl = `${admin_url}/deploys/${id}`;

  return {
    attachments: [
      {
        mrkdwn_in: ["pretext", "text"],
        color: getDeployColor(state),
        pretext: `${getDeployTitle(state)} *${branch}*`,
        title:
          state === "ready"
            ? `Visit the changes live`
            : `Visit the build log`,
        title_link:
          state === "ready" ? deploy_ssl_url : buildLogUrl,
        text: getDeployText(state, buildLogUrl, messages),
        footer: `Using git branch ${branch}`,
        ts: new Date(published_at).getTime(),
      },
    ],
  };
};

function getDeployColor(state: DeployState) {
  switch (state) {
    case 'building': return Colors.Progress
    case 'ready': return Colors.Success
    case 'error' : return Colors.Error
  }
};

function getDeployTitle(state: DeployState) {
  switch (state) {
    case 'building': return Titles.Progress
    case 'ready': return Titles.Success;
    case 'error' : return Titles.Error;
  }
};

function getDeployText(state: DeployState, buildLogUrl: string, messages: BuildMessage[]) {
	switch (state) {
		case "building":
			return undefined;
		case "ready":
			return `Or check out the <${buildLogUrl}|build log>`;
		case "error": {
      const [firstMessage] = messages;
      return `The last message we got from the build was \`${firstMessage.title}\``;
    }
	}
};

type BuildMessage = {
  type: string,
  title: string,
  description: string;
  details: string | null;
}
