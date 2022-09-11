import { Express, Request, Response, NextFunction } from 'express';
import { Blog } from '@omewa/api-interfaces';
import * as jwt from 'jsonwebtoken';

export interface UserRequest extends Request {
  token: string | jwt.JwtPayload;
}

const blogs: Blog[] = [
  {
    id: 1,
    title: 'Blog 1',
    content: 'Blog 1 content',
  },
  {
    id: 2,
    title: 'Blog 2',
    content: 'Blog 2 content',
  },
  {
    id: 3,
    title: 'Blog 3',
    content: 'Blog 3 content',
  },
];

const users = [
  {
    id: 1,
    username: 'admin',
    password: 'admin',
  },
];

// ==============================
// Routes
// ==============================

export function BlogRoutes(app: Express) {
  app.get('/api/blog', authenticateToken, (req: Request, resp: Response) =>
    resp.send(blogs)
  );

  // Add a new blog
  app.post('/api/blog',authenticateToken, (req: Request, resp: Response) => {
    const blog = {
      id: blogs.length + 1,
      title: req.body.title,
      content: req.body.content,
    };
    blogs.push(blog);
    console.log(req.body);
    resp.send(req.body);
  });

  // Get a blog by id
  app.get('/api/blog/:id', authenticateToken, (req: Request, resp: Response) => {
    const id: number = parseInt(req.params.id);
    const blog = blogs.find((b) => b.id == id);
    resp.send(blog);
  });

  // Edit
  app.put('/api/blog/:id',authenticateToken, (req: Request, resp: Response) => {
    const id: number = parseInt(req.params.id);
    const blog = blogs.find((blog) => blog.id == id);
    blog.title = req.body.title;
    blog.content = req.body.content;
    resp.send(blog);
  });

  // Delete
  app.delete('/api/blog/:id', authenticateToken, (req: Request, resp: Response) => {
    const id: number = parseInt(req.params.id);
    const blog = blogs.find((blog) => blog.id == id);
    const index = blogs.indexOf(blog);
    blogs.splice(index, 1);
    resp.send(blog);
  });
}

export function AuthRoutes(app: Express) {
  app.post('/api/login', (req: Request, resp: Response) => {
    const user = users.find(
      (user) =>
        user.username == req.body.username && user.password == req.body.password
    );
    if (user) {
      const token = generateToken(user);
      resp.send({ token });
    } else {
      resp.status(401).send({
        message: 'Invalid username or password',
      });
    }
  });
}

// ==============================
// Middleware
// ==============================

function generateToken(user: object) {
  return jwt.sign(user, 'secret', { expiresIn: '1h' });
}

function authenticateToken(req: Request, resp: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return resp.status(401).send({ message: 'Unauthorized' });

  jwt.verify(token, 'secret', (err, user) => {
    if (err) return resp.status(403).send({ message: 'Forbidden' });
    (req as UserRequest).token = user;
    next();
  });
}