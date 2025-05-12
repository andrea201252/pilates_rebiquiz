const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'public', 'questions.json');
const outputPath = path.join(__dirname, 'public', 'questions_fixed.json');

const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
const questions = Array.isArray(data) ? data : data.questions;

const fixedQuestions = questions.map((q) => ({
  ...q,
  correctAnswer: q.answer || '',
}));

fs.writeFileSync(outputPath, JSON.stringify({ questions: fixedQuestions }, null, 2), 'utf8');
console.log(`✅ File convertito e salvato in: ${outputPath}`); 