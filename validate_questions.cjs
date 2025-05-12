const fs = require('fs');
const path = require('path');

// Modifica qui il percorso se necessario
const filePath = path.join(__dirname, 'public', 'questions.json');
const outputPath = path.join(__dirname, 'public', 'questions_fixed.json');

const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
const questions = Array.isArray(data) ? data : data.questions;

let errors = 0;
let fixed = 0;

const fixedQuestions = questions.map((q, idx) => {
  if (!q.options || !Array.isArray(q.options)) {
    console.log(`Domanda ${idx + 1} (ID: ${q.id}): manca il campo options o non è un array.`);
    errors++;
    return q;
  }
  if (!q.correctAnswer) {
    console.log(`Domanda ${idx + 1} (ID: ${q.id}): manca il campo correctAnswer.`);
    errors++;
    return q;
  }
  if (!q.options.includes(q.correctAnswer)) {
    console.log(`❌ Domanda ${idx + 1} (ID: ${q.id}):`);
    console.log(`   - correctAnswer: "${q.correctAnswer}"`);
    console.log(`   - options: [${q.options.map(o => `"${o}"`).join(', ')}]`);
    // Auto-correzione: imposta la prima opzione come risposta corretta
    const newAnswer = q.options[0];
    console.log(`   → Corretto: imposto correctAnswer = "${newAnswer}"`);
    fixed++;
    return { ...q, correctAnswer: newAnswer };
  }
  return q;
});

if (errors === 0 && fixed === 0) {
  console.log('✅ Tutte le domande sono coerenti!');
} else {
  if (errors > 0) {
    console.log(`\nTrovate ${errors} domande con errori strutturali!`);
  }
  if (fixed > 0) {
    fs.writeFileSync(outputPath, JSON.stringify({ questions: fixedQuestions }, null, 2), 'utf8');
    console.log(`\n🔧 Salvato file corretto in: ${outputPath}`);
    console.log(`Domande auto-corrette: ${fixed}`);
  }
} 