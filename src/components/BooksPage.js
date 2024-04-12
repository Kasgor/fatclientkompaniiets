import React, {useEffect, useState} from 'react';
import Modal from 'react-modal';
import BookList from './BookList';
import BookForm from './BookForm';
import Login from './Login';
import Register from './Register';
import { useAuth } from './AuthContext';
import axios from "axios";

// Налаштування для доступності модальних вікон
Modal.setAppElement('#root');

function BooksPage() {
    const { auth, logout } = useAuth();
    const [isLoginModalOpen, setLoginModalOpen] = useState(false);
    const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
    const [isBookFormOpen, setBookFormOpen] = useState(false);

    const [books, setBooks] = useState([]);

    const fetchBooks = async () => {
        const response = await axios.get('/api/books');
        setBooks(response.data);
    };


        useEffect(() => {
            const interval = setInterval(() => {
                fetchBooks();
            }, 1000);

            return () => clearInterval(interval);
        }, []);
    const onClose = () => {
        setBookFormOpen(false);
        fetchBooks();
    };

    return (
        <div className="container mt-4">
            <h1>BooksRate</h1>

            <BookList/>
            {auth.role === 'admin' && (
                <button className="btn btn-primary mb-3" onClick={() => setBookFormOpen(true)}>Add Book</button>
            )}
            <Modal isOpen={isBookFormOpen} onRequestClose={() => setBookFormOpen(false)}>
                <BookForm onClose={onClose} onSave={fetchBooks}/>
            </Modal>
            {!auth.isAuthenticated && (
                <div>
                    <button className="btn btn-secondary mr-2" onClick={() => setLoginModalOpen(true)}>Login</button>
                    <button className="btn btn-secondary" onClick={() => setRegisterModalOpen(true)}>Register</button>
                </div>
            )}
            {auth.isAuthenticated && (
                <div>
                    <button className="btn btn-danger" onClick={logout}>Logout</button>
                </div>
            )}
            <Modal isOpen={isLoginModalOpen} onRequestClose={() => setLoginModalOpen(false)}>
                <Login onClose={() => setLoginModalOpen(false)}/>
            </Modal>
            <Modal isOpen={isRegisterModalOpen} onRequestClose={() => setRegisterModalOpen(false)}>
                <Register onClose={() => setRegisterModalOpen(false)}/>
            </Modal>
        </div>
    );
}

export default BooksPage;