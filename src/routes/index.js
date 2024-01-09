import meRouter from './me.route.js';

function route(app) {
  app.use('/api/me', meRouter);
}

export default route;
