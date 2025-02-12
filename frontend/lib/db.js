const { MongoClient, ServerApiVersion } = require('mongodb');

const MONGODB_DB = process.env.MONGODB_DB;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI || !MONGODB_DB) {
  throw new Error('MONGO URI OR DB Not Found!');
}

// let cachedClient = null;
// let cachedDb = null;
console.log('>>>>>>>MONGO DB URI<<<<<<<<', MONGODB_URI);
console.log('>>>>>>>MONGO DB DB<<<<<<<<', MONGODB_DB);

export async function connectToDB() {
  try {
    // if (cachedClient && cachedDb) {
    //   return { client: cachedClient, db: cachedDb };
    // }

    const client = new MongoClient(MONGODB_URI, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    // debugger;
    await client.connect();

    console.log('>>>>>>>>>>Connected to DB<<<<<<<<<<');
    const db = client.db(MONGODB_DB);

    // cachedClient = client;
    // cachedDb = db;

    return { client, db };
  } catch (error) {
    console.log('>>>>>DB IS NOT CONNECTED<<<<<');
    console.log(error.message);
  }
}
