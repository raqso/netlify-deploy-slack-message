const SLACK_WEBHOOK_URL =
	"https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX";

enum Colors {
	Success = "#4fa750",
	Progress = "#daa038",
	Error = "#d23b29",
};

enum Titles {
  Success = "Succesful deploy of ",
	Progress = "There is a new deploy in process for",
	Error = "Something went wrong deploying",
}

export { SLACK_WEBHOOK_URL, Colors, Titles };
