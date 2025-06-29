import mongoose from "mongoose";
import { Router } from 'express';

export const router = Router();

// Get all articles
router.get('/', (req, res) => {

});

// Get one article
router.get('/:id', (req, res) => {

});

// Get the articles from the recycling basket
router.get('/recycle-bin', (req, res) => {

});

// Add article
router.post('/', (req, res) => {

});

// Edit article
router.put('/:id', (req, res) => {

});

// Remove article
router.delete('/:id', (req, res) => {

});

// Restore article
router.patch('/restore/:id', (req, res) => {

});

export default router;