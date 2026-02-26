const Database = require('better-sqlite3');
const path = require('path');

// Creiamo il file del database direttamente nella cartella 'backend'.
const db = new Database(path.resolve(__dirname, 'main.db'), { fileMustExist: false });

function setupDatabase() {
    // Usiamo 'run' per istruzioni che non restituiscono dati.
    const stmt = db.prepare(`
        CREATE TABLE IF NOT EXISTS quotes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            author TEXT NOT NULL,
            content TEXT NOT NULL,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);
    stmt.run();
    console.log('Setup del database completato. La tabella "quotes" è pronta.');

    // Opzionale: popoliamo con dati iniziali se la tabella è vuota.
    const { count } = db.prepare('SELECT COUNT(*) as count FROM quotes').get();
    if (count === 0) {
        const insert = db.prepare('INSERT INTO quotes (author, content) VALUES (?, ?)');
        const quotesToSeed = [
            { author: 'Arthur C. Clarke', content: 'Qualsiasi tecnologia sufficientemente avanzata è indistinguibile dalla magia.' },
            { author: 'Douglas Adams', content: 'Le astronavi pendevano nel cielo più o meno nello stesso modo in cui i mattoni non lo fanno.' },
            { author: 'Isaac Asimov', content: 'L\'aspetto più triste della vita in questo momento è che la scienza raccoglie conoscenza più velocemente di quanto la società raccolga saggezza.' }
        ];
        const insertMany = db.transaction((quotes) => {
            for (const quote of quotes) insert.run(quote.author, quote.content);
        });
        insertMany(quotesToSeed);
        console.log('Popolamento iniziale delle "quotes" completato.');
    }
}
// Eseguiamo il setup
setupDatabase();
// Esportiamo la connessione al database
module.exports = db;
