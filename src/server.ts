import * as express from 'express';
import { slackHook } from './slackHook';

const app = express()
const PORT : string|number = process.env.PORT || 5000;

app.use("/test", (req, res) => res.send("It's working"));
app.use("*", slackHook);

app.listen(PORT,() => console.log(`hosting @${PORT}`));