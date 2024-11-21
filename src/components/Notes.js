import React, { useState, useEffect } from 'react';

const Notes = ({ module }) => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [expandedNoteId, setExpandedNoteId] = useState(null);
  const [showAddNoteForm, setShowAddNoteForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [comments, setComments] = useState({});
  const [commentsVisible, setCommentsVisible] = useState({});
  const [addCommentVisible, setAddCommentVisible] = useState({});
  const [newComments, setNewComments] = useState({});

  const notesPerPage = 4;
  const apiUrl = `http://127.0.0.1:5555/notes/${module}`;

  // Fetch notes and comments on component mount
  useEffect(() => {
    fetch(apiUrl)
      .then((response) =>
        response.ok ? response.json() : Promise.reject('Failed to fetch notes')
      )
      .then((data) => {
        setNotes(data);
        data.forEach((note) => {
          fetch(`http://127.0.0.1:5555/notes/${note.id}/comments`)
            .then((response) =>
              response.ok
                ? response.json()
                : Promise.reject('Failed to fetch comments')
            )
            .then((commentsData) => {
              setComments((prev) => ({
                ...prev,
                [note.id]: commentsData,
              }));
            })
            .catch((error) => console.error('Error fetching comments:', error));
        });
      })
      .catch((error) => console.error('Error fetching notes:', error));
  }, [apiUrl]);

  const handleAddNote = (e) => {
    e.preventDefault();
    const newNote = { title, content };

    fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newNote),
    })
      .then((response) =>
        response.ok ? response.json() : Promise.reject('Failed to add note')
      )
      .then((createdNote) => {
        setNotes((prevNotes) => [...prevNotes, createdNote]);
        setTitle('');
        setContent('');
        setShowAddNoteForm(false);
      })
      .catch((error) => console.error('Error adding note:', error));
  };

  const indexOfLastNote = currentPage * notesPerPage;
  const indexOfFirstNote = indexOfLastNote - notesPerPage;
  const currentNotes = notes.slice(indexOfFirstNote, indexOfLastNote);
  const totalPages = Math.ceil(notes.length / notesPerPage);

  const handleNextPage = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);
  const handlePreviousPage = () =>
    currentPage > 1 && setCurrentPage(currentPage - 1);

  const toggleContentVisibility = (id) =>
    setExpandedNoteId((prevId) => (prevId === id ? null : id));

  const toggleCommentsVisibility = (id) =>
    setCommentsVisible((prev) => ({ ...prev, [id]: !prev[id] }));

  const toggleAddCommentVisibility = (id) =>
    setAddCommentVisible((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleAddComment = (e, noteId) => {
    e.preventDefault();
    const commentContent = newComments[noteId]?.trim();
    if (!commentContent) return;

    const newComment = { content: commentContent };

    fetch(`http://127.0.0.1:5555/notes/${noteId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newComment),
    })
      .then((response) => {
        if (!response.ok) throw new Error('Failed to add comment');
        return response.json();
      })
      .then((createdComment) => {
        setComments((prev) => ({
          ...prev,
          [noteId]: [...(prev[noteId] || []), createdComment],
        }));
        setNewComments((prev) => ({ ...prev, [noteId]: '' }));
      })
      .catch((error) => console.error('Error adding comment:', error));
  };

  return (
    <div className="bg-backgroundLight text-textDark min-h-screen">
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold text-primary mb-6">{module} Notes</h1>
        <button
          onClick={() => setShowAddNoteForm(!showAddNoteForm)}
          className="text-secondary underline mb-6 focus:outline-none">
          {showAddNoteForm ? 'Cancel Add Note' : 'Add Note'}
        </button>
        {showAddNoteForm && (
          <form
            onSubmit={handleAddNote}
            className="bg-backgroundDark p-6 rounded shadow-md mb-6">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 mb-4 border border-light rounded focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
            <textarea
              placeholder="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-2 mb-4 border border-light rounded focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
            <button
              type="submit"
              className="bg-buttonPrimary text-white px-4 py-2 rounded hover:bg-primary">
              Submit
            </button>
          </form>
        )}
        <ul className="mt-6 space-y-4">
          {currentNotes.map((note) => (
            <li key={note.id} className="bg-light p-4 rounded shadow">
              <h3 className="text-xl font-semibold text-primary">
                <button
                  onClick={() => toggleContentVisibility(note.id)}
                  className="hover:underline focus:outline-none">
                  {note.title}
                </button>
              </h3>
              {expandedNoteId === note.id && (
                <div className="mt-2">
                  <p className="text-textDark">{note.content}</p>
                  <div className="mt-4">
                    <button
                      onClick={() => toggleCommentsVisibility(note.id)}
                      className="text-secondary underline mr-4 focus:outline-none">
                      {commentsVisible[note.id]
                        ? 'Hide Comments'
                        : 'View Past Comments'}
                    </button>
                    <button
                      onClick={() => toggleAddCommentVisibility(note.id)}
                      className="text-secondary underline focus:outline-none">
                      {addCommentVisible[note.id]
                        ? 'Cancel Add Comment'
                        : 'Add a Comment'}
                    </button>
                  </div>
                  {commentsVisible[note.id] && (
                    <div className="mt-4">
                      <h4 className="text-lg font-bold text-secondary">
                        Comments
                      </h4>
                      {comments[note.id]?.length > 0 ? (
                        <ul className="mt-2 space-y-2">
                          {comments[note.id].map((comment) => (
                            <li
                              key={comment.id}
                              className="bg-backgroundDark p-2 rounded text-white">
                              <p>{comment.content}</p>
                              <span className="text-sm text-gray-400">
                                {new Date(comment.timestamp).toLocaleString()}
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="mt-2 text-textDark">No comments yet.</p>
                      )}
                    </div>
                  )}
                  {addCommentVisible[note.id] && (
                    <form
                      onSubmit={(e) => handleAddComment(e, note.id)}
                      className="mt-4">
                      <textarea
                        value={newComments[note.id] || ''}
                        onChange={(e) =>
                          setNewComments((prev) => ({
                            ...prev,
                            [note.id]: e.target.value,
                          }))
                        }
                        className="w-full p-2 border border-light rounded focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Add your comment"
                      />
                      <button
                        type="submit"
                        className="bg-buttonPrimary text-white px-4 py-2 rounded hover:bg-primary mt-2">
                        Submit Comment
                      </button>
                    </form>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
        <div className="mt-6 flex justify-between">
          <button
            onClick={handlePreviousPage}
            className="bg-buttonSecondary text-white px-4 py-2 rounded hover:bg-secondary"
            disabled={currentPage === 1}>
            Previous
          </button>
          <button
            onClick={handleNextPage}
            className="bg-buttonSecondary text-white px-4 py-2 rounded hover:bg-secondary"
            disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notes;
