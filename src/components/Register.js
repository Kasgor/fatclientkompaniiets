import React, { useState } from 'react';
import axios from 'axios';

function Register({ onClose }) {
    const [formData, setFormData] = useState({ username: '', password: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/auth/register', formData);
            onClose();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="modal-content p-4">
            <form onSubmit={handleSubmit}>
                <h2 className="mb-3">Register</h2>
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input type="text" id="username" name="username" className="form-control" value={formData.username} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password" className="form-control" value={formData.password} onChange={handleChange} />
                </div>
                <button type="submit" className="btn btn-primary mr-2">Register</button>
                <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
            </form>
        </div>
    );
}

export default Register;