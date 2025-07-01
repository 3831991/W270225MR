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
    isDeleted: { type: Boolean, default: false },
});

const Article = mongoose.model("articles", schema);

export const router = Router();

// Get all articles
router.get('/', guard, async (req, res) => {
    const data = await Article.find({ isDeleted: false });
    res.send(data);
});

// Get the articles from the recycling basket
router.get('/recycle-bin', guard, async (req, res) => {
    const data = await Article.find({ isDeleted: true });
    res.send(data);
});

// Get one article
router.get('/:id', guard, async (req, res) => {
    const item = await Article.findById(req.params.id);
    res.send(item);
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
    const { publishDate, headline, description, content, imgUrl } = req.body;

    const article = await Article.findById(req.params.id);

    if (!article) {
        return res.status(403).send({ message: "article not found" });
    }

    article.publishDate = publishDate;
    article.headline    = headline;
    article.description = description;
    article.content     = content;
    article.imgUrl      = imgUrl;

    await article.save();
    res.end();
});

// Remove article
router.delete('/:id', guard, async (req, res) => {
    const article = await Article.findById(req.params.id);

    if (!article) {
        return res.status(403).send({ message: "article not found" });
    }

    article.isDeleted = true;
    await article.save();
    res.end();
});

// Restore article
router.patch('/restore/:id', guard, async (req, res) => {
    const article = await Article.findById(req.params.id);

    if (!article) {
        return res.status(403).send({ message: "article not found" });
    }

    article.isDeleted = false;
    await article.save();
    res.end();
});

export default router;