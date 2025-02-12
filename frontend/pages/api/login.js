import { connectToDB } from '../../lib/db';

export default async function handler(req, res) {
  const { db } = await connectToDB();

  if (req.method === 'GET') {
    try {
      const { userName, password } = req.body;
      console.log('userName', userName);
      console.log('password', password);
      debugger;

      const user = await db.collection('users').findOne({ userName, password });
      console.log('user', user);

      if (!user) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }

      //   const isMatch = await bcrypt.compare(password, user.password);
      //   if (!isMatch) {
      //     return new Response(
      //       JSON.stringify({ message: 'Invalid credentials' }),
      //       {
      //         status: 401,
      //       }
      //     );
      //   }

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch user' });
      console.log(error.message);
    }
  }

  if (req.method === 'POST') {
    try {
      const { userName, password } = req.body;
      console.log('userName', userName);
      console.log('password', password);
      debugger;
      const user = await db
        .collection('users')
        .insertOne({ userName, password, createdAt: new Date() });
      console.log('user', user);
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create user' });
      console.log(error.message);
    }
  }
}
