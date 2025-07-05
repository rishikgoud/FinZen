import React from 'react';

const QuestionChips = ({ suggestions, onSelect }) => (
  <div className="flex gap-2 flex-wrap mt-4">
    {suggestions.map(q => (
      <button
        key={q}
        onClick={() => onSelect(q)}
        className="bg-cyan-700 hover:bg-cyan-500 text-white px-4 py-2 rounded-full text-sm transition"
      >
        {q}
      </button>
    ))}
  </div>
);

export default QuestionChips; 