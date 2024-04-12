import React, { useState } from 'react';
import axios from 'axios';
import {useAuth} from "./AuthContext";

function BookForm({ onClose, onSave }) {
    const [bookData, setBookData] = useState({
        title: '',
        author: '',
        keywords: ''
    }
    );
    const { auth } = useAuth();
    const handleChange = (e) => {
        setBookData({ ...bookData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const keywordsArray = bookData.keywords.split(' ').map(keyword => keyword.trim());
        const newBook = { ...bookData, keywords: keywordsArray };

        try {
            await axios.post('/api/books', newBook, {
                headers: {
                    'Authorization': `Bearer ${auth.token}`
                }
            });
            onClose();
            onSave();
        } catch (error) {
            throw error;
        }
    };

    return (
        <div className="modal-content p-4">
            <form onSubmit={handleSubmit}>
                <h2 className="mb-3">Add a New Book</h2>
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
                <button type="submit" className="btn btn-primary mr-2" >Add Book</button>
                <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
            </form>
        </div>
    );
}

export default BookForm;