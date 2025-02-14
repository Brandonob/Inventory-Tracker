import { MongoClient } from 'mongodb';
// import {
//   setToConnecting,
//   setToConnected,
//   setToDisconnected,
//   setError,
// } from '../src/app/redux/slices/databaseSlice';

const { MONGODB_DB, MONGODB_URI } = process.env;

if (!MONGODB_URI || !MONGODB_DB) {
  throw new Error('MONGO URI OR DB Not Found!');
}

// const options = {
//   hydrate: true,
//   lazy: true,
//   prefetch: false,
//   ssr: false,
// };
// let cachedClient = null;
// let cachedDb = null;
console.log('>>>>>>>MONGO DB URI<<<<<<<<', MONGODB_URI);
console.log('>>>>>>>MONGO DB DB<<<<<<<<', MONGODB_DB);

export async function connectToDB() {
  try {
    // setToConnecting();
    // console.log('>>>>>>>CONNECTING TO DB<<<<<<<<');
    const client = await MongoClient.connect(MONGODB_URI);

    // client.on('connected', () => {
    //   console.log('MongoDB connected successfully');
    //   setToConnected();
    // });

    // client.on('disconnected', () => {
    //   console.log('MongoDB disconnected');
    //   setToDisconnected();
    // });

    // client.on('error', (error) => {
    //   console.error('MongoDB connection error:', error);
    //   setError(error.message);
    // });

    return client;
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
  // store.dispatch(setConnectionStatus('connecting'));

  // Replace this with your actual MongoDB connection logic

  //   hydrate: true,
  //   cache: 'memory',
  //   lazy: true,
  //   prefetch: false,
  //   ssr: false,
  //   useNewUrlParser: true,
  //   useUnifiedTopology: true,
  // });

  // mongoClient
  //   .connect()
  //   .then(() => {
  //     // store.dispatch(setConnectionStatus('connected'));
  //     const db = mongoClient.db(MONGODB_DB);

  //     return { mongoClient, db };
  //   })
  //   .catch((error) => {
  //     // store.dispatch(setConnectionError(error.message));
  //     setError(error.message);
  //   });

  // // Handle disconnection events
  // mongoClient.on('disconnected', () => {
  //   // store.dispatch(setConnectionStatus('disconnected'));
  //   setToDisconnected();
  // });

  // mongoClient.on('reconnect', () => {
  //   // store.dispatch(setConnectionStatus('connected'));
  //   setToConnected();
  // });

  // try {
  //   // if (cachedClient && cachedDb) {
  //   //   return { client: cachedClient, db: cachedDb };
  //   // }

  //   const client = new MongoClient(MONGODB_URI, {
  //     hydrate: true,
  //     cache: 'memory',
  //     lazy: true,
  //     prefetch: false,
  //     ssr: false,
  //     // useNewUrlParser: true,
  //     // useUnifiedTopology: true,
  //   });
  //   // debugger;
  //   await client.connect();

  //   console.log('>>>>>>>>>>Connected to DB<<<<<<<<<<');
  //   const db = client.db(MONGODB_DB);

  //   // cachedClient = client;
  //   // cachedDb = db;

  //   return { client, db };
  // } catch (error) {
  //   console.log('>>>>>DB IS NOT CONNECTED<<<<<');
  //   console.log(error.message);
  // }
}
export async function getDB() {
  try {
    const client = await connectToDB();

    return client.db(MONGODB_DB);
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
}
