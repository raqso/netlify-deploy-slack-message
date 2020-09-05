import * as functions from "firebase-functions";
import { slackHook } from "./slackHook";

export const notifyTalenoteSlack = functions.https.onRequest(
	slackHook
);

