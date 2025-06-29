import mongoose from "mongoose";
import { Router } from 'express';
import guard from '../guard.js';

const schema = new mongoose.Schema({
    addedTime: { type: Date, default: Date.now },
    publishDate: Date,
    headline: String,
    description: String,
    content: String,
    imgUrl: String,
});

const Article = mongoose.model("articles", schema);

export const router = Router();

// Get all articles
router.get('/', guard, async (req, res) => {
    const data = await Article.find();
    res.send(data);
});

// Get one article
router.get('/:id', guard, async (req, res) => {
    const item = await Article.findById(req.params.id);
    res.send(item);
});

// Get the articles from the recycling basket
router.get('/recycle-bin', guard, async (req, res) => {

});

// Add article
router.post('/', guard, async (req, res) => {
    const { publishDate, headline, description, content, imgUrl } = req.body;

    const article = new Article({
        publishDate,
        headline,
        description,
        content,
        imgUrl,
    });

    const newArticle = await article.save();

    res.send(newArticle);
});

// Edit article
router.put('/:id', guard, async (req, res) => {

});

// Remove article
router.delete('/:id', guard, async (req, res) => {

});

// Restore article
router.patch('/restore/:id', guard, async (req, res) => {

});

export default router;