const Note = require('../models/Note');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const aiService = require('../services/aiService');

// Helper function to generate random strings for IDs and Passwords
const generateRandomString = (length) => {
  return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
};

// @desc    Create a new private note
// @route   POST /api/notes
exports.createNote = async (req, res) => {
  try {
    // 1. Grab content AND expiresIn from the frontend
    const { content, expiresIn } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'Note cannot be empty' }); 
    }
    if (content.length > 500) {
      return res.status(400).json({ message: 'Note must be under 500 characters' }); 
    }

    // 2. Calculate the exact Expiry Date based on user selection
    let expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // Default to 24 hours
    if (expiresIn === '1h') expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    if (expiresIn === '7d') expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const noteId = generateRandomString(8);
    const rawPassword = generateRandomString(10);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(rawPassword, salt);

    // 3. Save to Database with the expiration timestamp
    const newNote = await Note.create({
      _id: noteId,
      content: content,
      password: hashedPassword,
      expiresAt: expiresAt
    });

    res.status(201).json({
      message: 'Note created successfully',
      urlId: noteId,
      password: rawPassword 
    });

  } catch (error) {
    console.error('Create Note Error:', error);
    res.status(500).json({ message: 'Server error creating note' });
  }
};
// @desc    Unlock and view a note
// @route   POST /api/notes/:id/unlock
exports.unlockNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    // 1. Check if note exists
    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' }); 
    }

    // 2. Verify password
    const isMatch = await bcrypt.compare(password, note.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    // 3. Return the unlocked content
    res.status(200).json({
      message: 'Note unlocked successfully',
      content: note.content
    });

  } catch (error) {
    console.error('Unlock Note Error:', error);
    res.status(500).json({ message: 'Server error unlocking note' });
  }
};

// @desc    Draft a note using AI
// @route   POST /api/notes/draft
exports.draftNote = async (req, res) => {
  try {
    const { topic } = req.body;

    if (!topic) {
      return res.status(400).json({ message: 'Topic is required to draft a note' });
    }

    const draftedContent = await aiService.draftNoteWithAI(topic);
    
    res.status(200).json({
      message: 'Note drafted successfully',
      content: draftedContent
    });

  } catch (error) {
    console.error('Draft Note Error:', error);
    res.status(500).json({ message: 'Server error while drafting note' });
  }
};

// @desc    Summarize an unlocked note using AI
// @route   POST /api/notes/:id/summarize
exports.summarizeNote = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Fetch the note to confirm it exists
    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // 2. Pass the content directly to Gemini (Frontend already unlocked it)
    const summary = await aiService.summarizeText(note.content);

    res.status(200).json({
      message: 'Summary generated successfully',
      summary: summary
    });

  } catch (error) {
    console.error('Summarize Note Error:', error);
    res.status(500).json({ message: 'Server error while summarizing note' });
  }
};