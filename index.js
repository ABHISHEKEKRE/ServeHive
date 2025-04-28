const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const { Server } = require('socket.io');
const http = require('http');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const connectDB = require('./config/db');
const companyRoutes = require('./routes/companyRoutes');
const freelancerRoutes = require('./routes/freelancerRoutes');
const projectRoutes = require('./routes/projectRoutes');
const bidRoutes = require('./routes/bidRoutes');
const authRoutes = require('./routes/authRoutes');
const messageRoutes = require('./routes/messageRoutes');
const Conversation=require('./models/conversationSchema');
const Message=require('./models/messageSchema');
const messageController = require('./controllers/messageController');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http//localhost:4000",
    methods: ['GET', 'POST']
  }
});
let port = process.env.PORT || 4000;
const authenticateToken = (req, res, next) => {
    const token = req.cookies.jwt || req.headers.authorization?.split(' ')[1];
    console.log('Authenticating with token:', token);
    if (!token) {
      console.error('No token provided');
      const redirectPath = req.path.includes('freelancer') ? '/freelancer-login' : '/company-login';
      return res.redirect(redirectPath);
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = {
        _id: decoded.id,
        role: decoded.userType || decoded.role,
        ...decoded
      };
      console.log('User authenticated:', req.user);
      next();
    } catch (err) {
      console.error('Token verification error:', err.message);
      const redirectPath = req.path.includes('freelancer') ? '/freelancer-login' : '/company-login';
      return res.redirect(redirectPath);
    }
  };
// Socket.IO authentication
const onlineUsers = new Map();
io.use((socket, next) => {
    const token = socket.handshake.auth.token;
  console.log('Socket.IO auth token:', token);
  if (!token) {
    console.error('Socket.IO auth error: No token provided');
    return next(new Error('Authentication error: No token provided'));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Map decoded token to expected structure
    socket.user = {
      _id: decoded.id,  // Map id to _id
      role: decoded.userType,  // Map userType to role if needed
      ...decoded  // Include any other properties
    };
    console.log('Socket.IO user configured:', socket.user);
    next();
  } catch (err) {
    console.error('Socket.IO auth error:', err.message);
    next(new Error('Authentication error: Invalid token'));
  }

});

io.on('connection', (socket) => {
  // Ensure socket.user is defined before proceeding
  if (!socket.user || !socket.user._id) {
    console.error('Socket.IO connection rejected: No user data');
    socket.disconnect(true);
    return;
  }

  console.log(`User connected: ${socket.user._id}, Socket ID: ${socket.id}`);
  onlineUsers.set(socket.user._id.toString(), socket.id);
  socket.join(socket.user._id.toString());
  io.emit('onlineUsers', Array.from(onlineUsers.keys()));

  socket.on('sendMessage', async (data) => {
    const { receiverId, message } = data;
    const senderId = socket.user._id;

    try {
      // Mock req and res objects
      const req = {
        body: { message },
        params: { id: receiverId },
        user: { _id: senderId, userType: socket.user.userType }
      };
      const res = {
        status: (code) => ({
          json: (response) => {
            if (code >= 400) {
              throw new Error(response.error || 'Failed to send message');
            }
            return response;
          }
        })
      };

      // Call the controller's sendMessage function
      await messageController.sendMessage(req, res,io);

      console.log('Message sent successfully via controller:', { senderId, receiverId, message });
    } catch (err) {
      console.error('Error sending message:', err.message);
      socket.emit('messageError', { error: 'Failed to send message' });
    }
  });



  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.user._id}`);
    onlineUsers.delete(socket.user._id.toString());
    io.emit('onlineUsers', Array.from(onlineUsers.keys()));
  });
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback_secret_key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: 'sessions',
    autoRemove: 'interval',
    autoRemoveInterval: 24 * 60
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict'
  }
}));

// Debug session
app.use((req, res, next) => {
  console.log('Session ID:', req.sessionID);
  console.log('Session Data:', req.session);
  next();
});

// CSRF middleware
app.use(csrf({ cookie: true }));
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken ? req.csrfToken() : '';
  console.log(`CSRF Token for ${req.method}:`, res.locals.csrfToken);
  next();
});

// Routes
app.use('/', companyRoutes);
app.use('/', freelancerRoutes);
app.use('/', projectRoutes);
app.use('/', bidRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    console.error('CSRF Error:', err);
    const isAuthRoute = req.path === '/api/auth/company-login' || req.path === '/api/auth/company-signup' ||
                        req.path === '/api/auth/freelancer-login' || req.path === '/api/auth/freelancer-signup';
    if (isAuthRoute) {
      const view = req.path.includes('freelancer') ? 'freelancer-login.ejs' : 'company-login.ejs';
      return res.render(view, {
        errors: [{ msg: 'Invalid CSRF token, please try again' }],
        email: req.body.email || req.body.freelancerEmail || '',
        csrfToken: req.csrfToken ? req.csrfToken() : ''
      });
    }
    return res.status(403).json({ error: 'Invalid CSRF token' });
  }
  console.error('Unexpected Error:', err);
  res.status(500).json({ error: 'Something went wrong! Check server logs.' });
});

// Start server with port retry
async function startServer(attemptPort, maxRetries = 5) {
  try {
    await connectDB();
    server.listen(attemptPort, () => {
      console.log(`Server Running on Port ${attemptPort}`);
    });

    server.on('error', async (err) => {
      if (err.code === 'EADDRINUSE' && maxRetries > 0) {
        console.log(`Port ${attemptPort} in use, trying ${attemptPort + 1}`);
        server.close();
        await new Promise(resolve => setTimeout(resolve, 1000));
        startServer(attemptPort + 1, maxRetries - 1);
      } else {
        console.error('Server Error:', err);
        process.exit(1);
      }
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer(port);

module.exports = { app, io, server };
