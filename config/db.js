// const mongoose = require('mongoose');
// require('dotenv').config();
// const connectDB = async () => {
//     try {
//         await mongoose.connect(process.env.MONGO_URI, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true
//         });
//         console.log('Connected to MongoDB');
//     } catch (err) {
//         console.error('MongoDB Connection Error:', err);
//         process.exit(1);
//     }
// };

// module.exports = connectDB;
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 50000, // Wait up to 50 seconds for server selection
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      maxPoolSize: 10, // Limit connection pool size
      family: 4, // Force IPv4 to avoid DNS resolution issues
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB Connection Error:', {
      message: err.message,
      code: err.code,
      name: err.name,
    });
    process.exit(1);
  }
};

module.exports = connectDB;
