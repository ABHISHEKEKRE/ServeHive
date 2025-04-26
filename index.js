const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
require('dotenv').config();
const connectDB = require('./config/db');
const companyRoutes = require('./routes/companyRoutes');
const freelancerRoutes = require('./routes/freelancerRoutes');
const projectRoutes = require('./routes/projectRoutes');
const bidRoutes = require('./routes/bidRoutes');
const messageRoutes= require('./routes/messageRoutes');
const authRoutes=require('./routes/authRoutes');

const app = express();
const port = process.env.PORT || 3560;
const cookieParser = require('cookie-parser');




// Middleware
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get("/about-us",(req,res)=>{
     res.render("about-us");
});
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
    },(err) => {
    if (err) {
        console.error('Session store error:', err);
    } else {
        console.log('Session store connected successfully');
    }
}),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        secure: false,
        sameSite: 'lax'
    }
}));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unexpected Error:', err);
    res.status(500).send('Something went wrong! Check server logs.');
});

// Connect to MongoDB
connectDB();

// Routes
app.use('/', companyRoutes);
app.use('/', freelancerRoutes);
app.use('/', projectRoutes);
app.use('/', bidRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/messages',messageRoutes);

// Start server
app.listen(port, () => {
    console.log(` Server Running on Port ${port}`);
});

module.exports = app;
