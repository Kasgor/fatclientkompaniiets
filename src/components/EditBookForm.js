import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

function EditBookForm({ bookId, onClose, onSave }) {
    const [bookData, setBookData] = useState({
        title: '',
        author: '',
        keywords: ''
    });
    const { auth } = useAuth();

    useEffect(() => {
        const fetchBook = async () => {
            const response = await axios.get(`/api/books/${bookId}`);
            setBookData({
                title: response.data.title,
                author: response.data.author,
                keywords: response.data.keywords.join(' ')
            });
        };
        fetchBook();
    }, [bookId]);

    const handleChange = (e) => {
        setBookData({ ...bookData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const keywordsArray = bookData.keywords.split(' ').map(keyword => keyword.trim());
        const updatedBook = { ...bookData, keywords: keywordsArray };

        try {
            await axios.put(`/api/books/${bookId}`, updatedBook, {
                headers: {
                    'Authorization': `Bearer ${auth.token}`
                }
            });
            onSave();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="modal-content p-4">
            <form onSubmit={handleSubmit}>
                <h2 className="mb-3">Edit Book</h2>
                <div className="form-group">
                    <label htmlFor="title">Title:</label>
                    <input type="text" id="title" name="title" className="form-control" value={bookData.title} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="author">Author:</label>
                    <input type="text" id="author" name="author" className="form-control" value={bookData.author} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="keywords">Keywords (space-separated):</label>
                    <input type="text" id="keywords" name="keywords" className="form-control" value={bookData.keywords} onChange={handleChange} />
                </div>
                <button type="submit" className="btn btn-primary mr-2">Update Book</button>
                <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
            </form>
        </div>
    );
}

export default EditBookForm;