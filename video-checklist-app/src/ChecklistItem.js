import React from 'react';

function ChecklistItem({ step, onToggleComplete }) {
  return (
    <div className={`checklist-item ${step.completed ? 'completed' : ''}`}>
      <span>{step.text}</span>
      {!step.completed ? (
        <button onClick={() => onToggleComplete(step.id)}>Complete</button>
      ) : (
        <span className="praise-message">{step.praise}</span>
      )}
    </div>
  );
}

export default ChecklistItem;
