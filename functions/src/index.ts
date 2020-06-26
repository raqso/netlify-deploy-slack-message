import * as functions from "firebase-functions";
import fetch from 'node-fetch';
import { SLACK_WEBHOOK_URL, Colors } from "./consts";

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
}: {
	id: string;
	deploy_ssl_url: string;
	branch: string;
	published_at: string;
	admin_url: string;
	state: DeployState;
}) {
	if (!deploy_ssl_url) {
		return;
	}

	const buildLogUrl = `${admin_url}/deploys/${id}`;

	if (state === "ready") {
		return {
			attachments: [
				{
					mrkdwn_in: ["pretext", "text"],
					color: getDeployColor(state),
					pretext: `Succesful deploy of *${branch}*`,
					title: `Visit the changes live`,
					title_link: deploy_ssl_url,
					text: `Or check out the <${buildLogUrl}|build log>`,
					footer: `Using git branch ${branch}`,
					ts: new Date(published_at).getTime(),
				},
			],
		};
	}

	return { text: `Build state ${state}` };
};

function getDeployColor(state: DeployState) {
  switch (state) {
    case 'building': return Colors.Progress
    case 'ready': return Colors.Success
    case 'error' : return Colors.Error
  }
};
