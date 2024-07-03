import express from 'express';
import tempRoutes from './routes/temp.js';

const app = express();

app.use(express.json());
app.use('/api', tempRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
