import React, { useState, useEffect } from 'react';
import './App.css';
import ChecklistItem from './ChecklistItem'; // Import the ChecklistItem component

// Define the 13 video-making steps
const initialSteps = [
  { id: 1, text: '1. Plan your video content', completed: false },
  { id: 2, text: '2. Write a script', completed: false },
  { id: 3, text: '3. Create a storyboard', completed: false },
  { id: 4, text: '4. Set up your equipment (camera, microphone, lighting)', completed: false },
  { id: 5, text: '5. Choose and prepare your location', completed: false },
  { id: 6, text: '6. Record your video footage', completed: false },
  { id: 7, text: '7. Gather or create B-roll footage', completed: false },
  { id: 8, text: '8. Edit your video (cut, arrange clips, add transitions)', completed: false },
  { id: 9, text: '9. Color correct and grade your footage', completed: false },
  { id: 10, text: '10. Add text, graphics, and animations', completed: false },
  { id: 11, text: '11. Mix audio (voiceover, music, sound effects)', completed: false },
  { id: 12, text: '12. Export your final video', completed: false },
  { id: 13, text: '13. Upload and promote your video', completed: false },
];

const praiseMessages = [
  "Great job!",
  "よくできました！",
  "Nice!",
  "Awesome!",
  "Keep it up!",
  "Fantastic!",
  "Well done!",
];

function App() {
  const [steps, setSteps] = useState(() => {
    const savedSteps = localStorage.getItem('videoSteps');
    return savedSteps ? JSON.parse(savedSteps) : initialSteps;
  });

  useEffect(() => {
    localStorage.setItem('videoSteps', JSON.stringify(steps));
  }, [steps]);

  const toggleComplete = (id) => {
    setSteps(
      steps.map((step) =>
        step.id === id ? { ...step, completed: !step.completed, praise: step.completed ? null : praiseMessages[Math.floor(Math.random() * praiseMessages.length)] } : step
      )
    );
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Video Making Checklist</h1>
      </header>
      <div className="checklist-container">
        {steps.map((step) => (
          <ChecklistItem
            key={step.id}
            step={step}
            onToggleComplete={toggleComplete}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
