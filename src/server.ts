import * as express from 'express';
import * as helmet from 'helmet';
import { slackHook } from './slackHook';

// file deepcode ignore UseCsurfForExpress: <It's only webhook app, no browser will be involved>
const app = express();
const PORT : string|number = process.env.PORT || 5000;

app.use(helmet());
app.use(express.json());

app.use(`/${process.env.URL_TOKEN}`, slackHook);

app.listen(PORT,() => console.log(`hosting @${PORT}`));