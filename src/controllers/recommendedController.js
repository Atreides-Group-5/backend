
import Recommended from '../models/recommendedModel.js';

export const getRecommended = async (req, res) => {
  try {
    const recommended = await Recommended.find();
    res.json(recommended);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createRecommended = async (req, res) => {
  const { imageSrc, altText, title } = req.body;

  const newRecommended = new Recommended({
    imageSrc,
    altText,
    title,
  });

  try {
    const savedRecommended = await newRecommended.save();
    res.status(201).json(savedRecommended);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateRecommended = async (req, res) => {
  const { id } = req.params;
  const { imageSrc, altText, title } = req.body;

  try {
    const updatedRecommended = await Recommended.findByIdAndUpdate(
      id,
      { imageSrc, altText, title },
      { new: true }
    );
    if (!updatedRecommended) {
      return res.status(404).json({ message: 'Recommended not found' });
    }
    res.json(updatedRecommended);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteRecommended = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedRecommended = await Recommended.findByIdAndDelete(id);
    if (!deletedRecommended) {
      return res.status(404).json({ message: 'Recommended not found' });
    }
    res.json({ message: 'Recommended deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
