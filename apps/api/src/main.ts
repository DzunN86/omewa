import * as express from 'express';
import * as cors from 'cors';
import { Message } from '@omewa/api-interfaces';
import { BlogRoutes, AuthRoutes } from './app/blog';
import path = require('path');

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false, limit: "50mb" }));

const greeting: Message = { message: 'Welcome to api!' };

app.get('/api', (req, res) => {
  res.send(greeting);
});

BlogRoutes(app);
AuthRoutes(app);

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log('Listening at http://localhost:' + port + '/api');
});
// Serve built frontend app
app.use(express.static(path.join(__dirname, '../bookstore')))
// Handle browser-side routes
app.get('*', function(req, res) {
res.sendFile('index.html', {root: path.join(__dirname, '../bookstore')});
});
server.on('error', console.error);
