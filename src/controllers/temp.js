import { connectToDatabase } from '../services/database.js';

export const exampleControllerFunction = async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('random'); // Replace with your collection name
        const data = await collection.find({}).toArray();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
