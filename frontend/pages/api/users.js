// import clientPromise from '../../lib/db';
import { connectToDB } from '../../lib/db';

export default async function handler(req, res) {
  const { db } = await connectToDB();

  if (req.method === 'GET') {
    try {
      const users = await db.collection('users').find({}).toArray();
      res.status(200).json(users);
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ error: 'Failed to fetch users' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { userName, password } = req.body;
      console.log('THIS IS THE REQ BODY',req.body);

      console.log('userName', req.body['userName']);
      console.log('password', req.body['password']);
      
      debugger;
      if (!userName || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const newUser = { userName, password, createdAt: new Date() };
      await db.collection('users').insertOne(newUser);
      res.status(201).json({ message: 'User added' });
    } catch (error) {
      console.log('Cant create user', error.message);
      return res.status(500).json({ error: 'Failed to create user' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).json({ message: 'Method not allowed' });
}
