const mongoose = require( "mongoose" );

const connectDB = async () => {
  try {
    // mongoose.set('debug', true)
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://sajjadmuhammed:2Bz7LvB0YCbq705J@cluster0.ohgfuez.mongodb.net/snakeAndLadder?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000, // Increased timeout to 30 seconds
    socketTimeoutMS: 45000,
    maxPoolSize: 10, // Added connection pool settings
    retryWrites: true,
    retryReads: true
  });


    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1); // stop app if db fails
  }
};

module.exports = connectDB;
