import * as express from 'express';
import { slackHook } from './slackHook';

const app = express()
const PORT : string|number = process.env.PORT || 5000;

app.use(express.json());

app.use(`/${process.env.URL_TOKEN}`, slackHook);

app.listen(PORT,() => console.log(`hosting @${PORT}`));