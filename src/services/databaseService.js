import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://monton:IB7LWqFXhGgikihQ@cluster0.uaz0sbi.mongodb.net/voyage?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let db;

export const connectToDatabase = async () => {
    try {
        if (!db) {
            await client.connect();
            db = client.db('voyage'); // Replace with your database name
            console.log("Connected to MongoDB");
        }
        return db;
    } catch (error) {
        console.error("Could not connect to MongoDB", error);
        throw error;
    }
};
