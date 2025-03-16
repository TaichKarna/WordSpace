const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const userRouter = require('./routes/user.route');
const authRouter = require('./routes/auth.route');
const postRouter = require('./routes/post.route');
const commentRouter = require('./routes/comment.route');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();

mongoose.connect(process.env.MONGODB_URL).then(() => {
  console.log('database is connected');
});

app.listen(3000, () => {
  console.log('listening to this server');
});

const __location = path.resolve();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/post', postRouter);
app.use('/api/comment', commentRouter);

app.use(express.static(path.join(__location, '/client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__location, 'client', 'dist', 'index.html'));
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
