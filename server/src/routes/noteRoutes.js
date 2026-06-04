const express = require('express');
const router = express.Router();
const { 
  createNote, 
  unlockNote, 
  draftNote, 
  summarizeNote 
} = require('../controllers/noteController');

// map the POST request to draft a note with AI
// IMPORTANT: Put this BEFORE /:id so Express doesn't confuse 'draft' for an ID
router.post('/draft', draftNote);

// map the POST request to create a new note
router.post('/', createNote);

// map the POST request to unlock a specific note by ID
router.post('/:id/unlock', unlockNote);

// map the POST request to summarize a specific note
router.post('/:id/summarize', summarizeNote);

module.exports = router;