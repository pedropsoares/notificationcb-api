import { Request, Response } from 'express';

import express from 'express';
import processNotificationCB from './controllers/NotificationsCBController';

const routes = express.Router();

routes.post('/cb/notifications', processNotificationCB);

export default routes;
