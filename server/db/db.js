import mongoose from 'mongoose';

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Database Connected Successfully');
  } catch (error) {
    console.error('Error while connecting to Database:', error.message);
  }
};

export default dbConnection;
