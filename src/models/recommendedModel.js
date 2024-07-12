import mongoose from 'mongoose';

const recommendedSchema = new mongoose.Schema({
  imageSrc: { type: String, required: true },
  altText: { type: String, required: true },
  title: { type: String, required: true },
});

const Recommended = mongoose.model('Recommended', recommendedSchema);

export default Recommended;
