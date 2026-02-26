const express = require('express');
const cors = require('cors');
const db = require('./database.js'); // Importando questo file, eseguiamo anche il setup del DB

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Abilita il Cross-Origin Resource Sharing per permettere la comunicazione con il frontend Angular
app.use(express.json()); // Per parsare il body delle richieste in formato JSON

// --- API CRUD per le Quotes ---

// GET: Recupera tutte le quotes (Read)
app.get('/api/quotes', (req, res) => {
    try {
        const stmt = db.prepare('SELECT * FROM quotes ORDER BY createdAt DESC');
        const quotes = stmt.all();
        res.json(quotes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET: Recupera una singola quote tramite ID (Read)
app.get('/api/randomquote', (req, res) => {
    const stmt = db.prepare('SELECT * FROM quotes ORDER BY createdAt DESC');
    const quotes = stmt.all();
    const quote = quotes[Math.floor(Math.random() * quotes.length)];
    res.json(quote);
});


// GET: Recupera una singola quote tramite ID (Read)
app.get('/api/quotes/:id', (req, res) => {
    try {
        const stmt = db.prepare('SELECT * FROM quotes WHERE id = ?');
        const quote = stmt.get(req.params.id);
        if (quote) {
            res.json(quote);
        } else {
            res.status(404).json({ message: 'Quote non trovata' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST: Crea una nuova quote (Create)
app.post('/api/quotes', (req, res) => {
    const { author, content } = req.body;
    if (!author || !content) {
        return res.status(400).json({ message: 'I campi "author" e "content" sono obbligatori' });
    }

    try {
        const stmt = db.prepare('INSERT INTO quotes (author, content) VALUES (?, ?)');
        const info = stmt.run(author, content);
        // Restituisce la quote appena creata
        const newQuote = db.prepare('SELECT * FROM quotes WHERE id = ?').get(info.lastInsertRowid);
        res.status(201).json(newQuote);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT: Aggiorna una quote esistente (Update)
app.put('/api/quotes/:id', (req, res) => {
    const { author, content } = req.body;
    if (!author || !content) {
        return res.status(400).json({ message: 'I campi "author" e "content" sono obbligatori' });
    }

    try {
        const stmt = db.prepare('UPDATE quotes SET author = ?, content = ? WHERE id = ?');
        const info = stmt.run(author, content, req.params.id);
        if (info.changes > 0) {
            const updatedQuote = db.prepare('SELECT * FROM quotes WHERE id = ?').get(req.params.id);
            res.json(updatedQuote);
        } else {
            res.status(404).json({ message: 'Quote non trovata' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE: Cancella una quote
app.delete('/api/quotes/:id', (req, res) => {
    try {
        const stmt = db.prepare('DELETE FROM quotes WHERE id = ?');
        const info = stmt.run(req.params.id);
        if (info.changes > 0) {
            res.status(200).json({ message: 'Quote cancellata con successo' });
        } else {
            res.status(404).json({ message: 'Quote non trovata' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Avvia il server
app.listen(PORT, () => {
    console.log(`Server in ascolto su http://localhost:${PORT}`);
});
