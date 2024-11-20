import React, { useState } from 'react';

const HomePage = () => {
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleResetCategory = () => {
    setSelectedCategory(''); // Reset the selection to default
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-backgroundLight text-textDark">
      <h1 className="text-4xl font-bold text-primary mb-4">
        Welcome to the Notes App
      </h1>
      <p className="text-lg text-textLight mb-6">
        Here you can access notes for various programming topics such as HTML,
        CSS, JavaScript, React, Python, and Flask.
      </p>
      <div className="note-categories">
        <h2 className="text-2xl font-semibold text-primary mb-4">
          Explore the notes by category:
        </h2>

        {/* Styled Dropdown */}
        <div className="relative inline-block w-64 mb-4">
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-gray-800 text-lg">
            <option value="" disabled>
              Select a category
            </option>
            <option value="HTML">HTML</option>
            <option value="CSS">CSS</option>
            <option value="JavaScript">JavaScript</option>
            <option value="React">React</option>
            <option value="Python">Python</option>
            <option value="Flask">Flask</option>
          </select>
        </div>

        {/* Display Selected Category */}
        {selectedCategory && (
          <p className="text-lg text-secondary mt-4">
            Learn: <span className="font-bold">{selectedCategory}</span>
          </p>
        )}

        {/* Reset button to clear the selection */}
        {selectedCategory && (
          <button
            onClick={handleResetCategory}
            className="mt-4 text-sm text-blue-500 hover:underline">
            cancel
          </button>
        )}
      </div>
    </div>
  );
};

export default HomePage;
