import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill'; // Import ReactQuill for formattable content
import 'react-quill/dist/quill.snow.css'; // Import default styles for ReactQuill
import DOMPurify from 'dompurify';

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
  const [subtopics, setSubtopics] = useState('');
  const [editNoteId, setEditNoteId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editSubtopics, setEditSubtopics] = useState('');

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
              setComments((prev) => ({ ...prev, [note.id]: commentsData }));
            })
            .catch((error) => console.error('Error fetching comments:', error));
        });
      })
      .catch((error) => console.error('Error fetching notes:', error));
  }, [apiUrl]);

  const handleAddNote = (e) => {
    e.preventDefault();
    const newNote = { title, content, subtopics };

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
        setSubtopics('');
        setShowAddNoteForm(false);
      })
      .catch((error) => console.error('Error adding note:', error));
  };

  const handleEditNote = (noteId) => {
    const noteToEdit = notes.find((note) => note.id === noteId);
    if (noteToEdit) {
      setEditNoteId(noteId);
      setEditTitle(noteToEdit.title);
      setEditContent(noteToEdit.content);
      setEditSubtopics(noteToEdit.subtopics);
    }
  };

  const handleUpdateNote = (e, noteId) => {
    e.preventDefault();
    const updatedNote = {
      title: editTitle,
      content: editContent,
      subtopics: editSubtopics,
    };

    fetch(`http://127.0.0.1:5555/notes/${module}/${noteId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedNote),
    })
      .then((response) => response.json())
      .then((updatedNoteData) => {
        setNotes((prevNotes) =>
          prevNotes.map((note) => (note.id === noteId ? updatedNoteData : note))
        );
        setEditNoteId(null);
      })
      .catch((error) => console.error('Error updating note:', error));
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
      headers: { 'Content-Type': 'application/json' },
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
            <ReactQuill
              value={subtopics}
              onChange={setSubtopics}
              className="w-full mb-4 border border-light rounded bg-white focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Add subtopics (optional)"
              modules={{
                toolbar: [
                  ['bold', 'italic', 'underline'],
                  [{ list: 'ordered' }, { list: 'bullet' }],
                  ['link'],
                ],
              }}
              formats={[
                'bold',
                'italic',
                'underline',
                'list',
                'bullet',
                'link',
              ]}
            />
            <ReactQuill
              value={content}
              onChange={setContent}
              className="border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary focus:border-primary min-h-[150px] p-4"
              placeholder="Content"
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
              {editNoteId === note.id ? (
                <form onSubmit={(e) => handleUpdateNote(e, note.id)}>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full p-2 mb-4 border rounded"
                  />
                  <ReactQuill
                    value={editSubtopics}
                    onChange={setEditSubtopics}
                    className="w-full mb-4 border rounded"
                  />
                  <ReactQuill
                    value={editContent}
                    onChange={setEditContent}
                    className="w-full border rounded"
                  />
                  <button
                    type="submit"
                    className="bg-buttonPrimary text-white px-4 py-2 rounded hover:bg-primary mt-2">
                    Save Changes
                  </button>
                </form>
              ) : (
                <>
                  <h3 className="text-xl font-semibold text-primary">
                    <button
                      onClick={() => toggleContentVisibility(note.id)}
                      className="hover:underline focus:outline-none">
                      {note.title}
                    </button>
                  </h3>
                  {expandedNoteId === note.id && (
                    <div className="mt-2">
                      {note.subtopics && (
                        <div className="mt-2 text-sm text-gray-500">
                          Subtopic: {note.subtopics}
                        </div>
                      )}
                      <div
                        className="mt-2 text-textDark"
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(note.content),
                        }}
                      />
                      <div className="mt-4">
                        <button
                          onClick={() => handleEditNote(note.id)}
                          className="text-secondary underline mt-2 focus:outline-none">
                          Edit Note
                        </button>
                        <button
                          onClick={() => toggleCommentsVisibility(note.id)}
                          className="text-secondary underline ml-4 focus:outline-none">
                          {commentsVisible[note.id]
                            ? 'Hide Comments'
                            : 'View Comments'}
                        </button>
                        <button
                          onClick={() => toggleAddCommentVisibility(note.id)}
                          className="text-secondary underline ml-4 focus:outline-none">
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
                                  className="text-sm text-gray-600">
                                  {comment.content}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p>No comments yet.</p>
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
                            placeholder="Add a comment"
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
                </>
              )}
            </li>
          ))}
        </ul>

        <div className="flex justify-between mt-6">
          <button
            onClick={handlePreviousPage}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary"
            disabled={currentPage === 1}>
            Previous
          </button>
          <button
            onClick={handleNextPage}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary"
            disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notes;
