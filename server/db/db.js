import mongoose from 'mongoose';

const dbConnection = async () => {
  try {
    // Connect to MongoDB using the connection string from environment variables
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Database Connected Successfully');
  } catch (error) {
    console.error('Error while connecting to Database:', error.message);
    process.exit(1); // Exit process with failure
  }
};

export default dbConnection;
