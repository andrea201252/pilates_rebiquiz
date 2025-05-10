# Pilates Quiz App

Un'applicazione web per testare le conoscenze di Pilates attraverso un quiz interattivo.

## Caratteristiche

- Quiz con 20 domande casuali selezionate da un pool di 100 domande
- Interfaccia utente moderna e reattiva
- Feedback immediato sulle risposte
- Riepilogo finale con punteggio e statistiche
- Salvataggio delle risposte in localStorage

## Tecnologie Utilizzate

### Frontend
- React
- TypeScript
- TailwindCSS
- Zustand (State Management)

### Backend
- FastAPI
- Python 3.12+

## Installazione

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # su Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

## Utilizzo

1. Apri il browser e vai a `http://localhost:5173`
2. Clicca su "Inizia Quiz" per iniziare
3. Rispondi alle domande selezionando l'opzione corretta
4. Al termine del quiz, visualizza il tuo punteggio e le statistiche

## Licenza

MIT
