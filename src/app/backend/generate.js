const Database = require('better-sqlite3');
const path = require('path');

// Forza il percorso del DB nella cartella corrente
const dbPath = path.join(__dirname, 'quotes.db');
const db = new Database(dbPath);

// Assicuriamoci che la tabella esista prima di inserire
db.exec(`
  CREATE TABLE IF NOT EXISTS quotes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    author TEXT NOT NULL,
    content TEXT NOT NULL
  )
`);

const baseQuotes = [
    { author: "Albert Einstein", content: "La logica ti porta da A a B. L'immaginazione ti porta ovunque." },
    { author: "Oscar Wilde", content: "Sii te stesso, tutto il resto è già stato preso." },
    { author: "Steve Jobs", content: "L'unico modo di fare un ottimo lavoro è amare quello che fai." },
    { author: "Leonardo da Vinci", content: "La semplicità è l'ultima sofisticazione." },
    { author: "Dante Alighieri", content: "Considerate la vostra semenza: fatti non foste a viver come bruti, ma per seguir virtute e canoscenza." },
    { author: "Marcus Aurelius", content: "La felicità della tua vita dipende dalla qualità dei tuoi pensieri." },
    { author: "Seneca", content: "Non è perché le cose sono difficili che non osiamo, è perché non osiamo che sono difficili." },
    { author: "Lao Tzu", content: "Un viaggio di mille miglia comincia con un solo passo." },
    { author: "Confucio", content: "La nostra gloria più grande non sta nel non cadere mai, ma nel risollevarsi ogni volta che cadiamo." },
    { author: "Sun Tzu", content: "L'arte suprema della guerra è sottomettere il nemico senza combattere." }
];


const insert = db.prepare('INSERT INTO quotes (author, content) VALUES (@author, @content)');

// Transazione atomica
const insertMany = db.transaction((data) => {
    for (const q of data) insert.run(q);
});

try {
    console.log("Svuoto la tabella per evitare duplicati...");
    db.prepare('DELETE FROM quotes').run();
    
    console.log("Inserimento in corso...");
    insertMany(baseQuotes);
    console.log(`✅ Successo! 100 citazioni inserite in ${dbPath}`);
} catch (err) {
    console.error("❌ Errore:", err.message);
} finally {
    db.close();
}