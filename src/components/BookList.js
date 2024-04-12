import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import Modal from 'react-modal';
import EditBookForm from "./EditBookForm";

function BookList() {
    const [books, setBooks] = useState([]);
    const [editingBookId, setEditingBookId] = useState(null);
    const { auth } = useAuth();
    const [currentPage, setCurrentPage] = useState(1);
    const [booksPerPage, setBooksPerPage] = useState(8);

    const [sortCriteria, setSortCriteria] = useState({ field: 'title', order: 'asc' });
    const sortBooks = (field) => {
        const order = sortCriteria.field === field && sortCriteria.order === 'asc' ? 'desc' : 'asc';
        const sortedBooks = [...books].sort((a, b) => {
            let valueA = field === 'ratings' ? getAverageRating(a[field]) : a[field];
            let valueB = field === 'ratings' ? getAverageRating(b[field]) : b[field];

            if (valueA < valueB) return order === 'asc' ? 1 : -1;
            if (valueA > valueB) return order === 'asc' ? -1 : 1;
            return 0;
        });
        setBooks(sortedBooks);
        setSortCriteria({ field, order });
    };

    const indexOfLastBook = currentPage * booksPerPage;
    const indexOfFirstBook = indexOfLastBook - booksPerPage;
    const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(books.length / booksPerPage); i++) {
        pageNumbers.push(i);
    }

    useEffect(() => {
        fetchBooks();
        const fetchBooksInterval = setInterval(() => {
            fetchBooks();
        }, 10000);


        return () => clearInterval(fetchBooksInterval);
    }, []);

    const fetchBooks = async () => {
        const response = await axios.get('/api/books');
        setBooks(response.data);
    };
    const getAverageRating = (ratings) => {
        return ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length) : 0;
    };

    const rateBook = async (bookId, rating) => {
        try {
            await axios.post(`/api/books/rate/${bookId}`, { rating }, {
                headers: {
                    'Authorization': `Bearer ${auth.token}`
                }
            });
            fetchBooks();
        } catch (error) {
            console.error(error);
        }
    };
    const deleteBook = async (bookId) => {
        try {
            await axios.delete(`/api/books/${bookId}`, {
                headers: {
                    'Authorization': `Bearer ${auth.token}`
                }
            });
            fetchBooks();
        } catch (error) {
            console.error(error);
        }
    };



    const renderRating = (ratings) => {
        const averageRating = ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length) : 0;
        return [...Array(5)].map((_, i) => i < averageRating ? '★' : '☆').join('');
    };

    return (
        <div className="container mt-4">
            <h2>Books</h2>
            <table className="table table-striped">
                <thead className="thead-dark">
                <tr>
                    <th onClick={() => sortBooks('title')}>Title</th>
                    <th onClick={() => sortBooks('author')}>Author</th>
                    <th onClick={() => sortBooks('ratings')}>Ratings</th>
                    <th>Keywords</th>
                    {auth.role === 'admin' && <th>Actions</th>}
                    {(auth.role === 'admin'||auth.role === 'user') && <th>Rate</th>}
                </tr>
                </thead>

                <tbody>
                {currentBooks.map(book => (
                    <tr key={book._id}>
                        <td>{book.title}</td>
                        <td>{book.author}</td>
                        <td>{renderRating(book.ratings)}</td>
                        <td>
                            {book.keywords.length > 0 ? (
                                <button className="btn btn-info btn-sm" onClick={() => alert(book.keywords.join(', '))}>Keywords</button>
                            ) : (
                                <button className="btn btn-secondary btn-sm" disabled>No Keywords</button>
                            )}
                        </td>
                        {auth.role === 'admin' && (
                            <td>
                                <button className="btn btn-primary btn-sm mr-1" onClick={() => setEditingBookId(book._id)}>Edit</button>
                                <button className="btn btn-danger btn-sm" onClick={() => deleteBook(book._id)}>Delete</button>
                            </td>
                        )}

                        {(auth.role === 'admin'||auth.role === 'user') && ( <td>
                                <select className="form-control" onChange={(e) => rateBook(book._id, e.target.value)}>
                                    <option value="">Rate</option>
                                    {[1, 2, 3, 4, 5].map(value => (
                                        <option key={value} value={value}>{value}</option>
                                    ))}
                                </select>
                            </td>
                        )}
                    </tr>
                ))}
                </tbody>
            </table>
            <nav aria-label="Page navigation" style={{ zIndex: 100, position: 'relative' }}>
                <ul className="pagination justify-content-center">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>
                            &laquo;
                        </button>
                    </li>
                    <li className="page-item active">
                        <span className="page-link">{currentPage}</span>
                    </li>
                    <li className={`page-item ${currentPage === pageNumbers.length ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>
                            &raquo;
                        </button>
                    </li>
                </ul>
            </nav>
            <Modal isOpen={!!editingBookId} onRequestClose={() => setEditingBookId(null)}>
                {editingBookId &&
                    <EditBookForm bookId={editingBookId} onClose={() => setEditingBookId(null)} onSave={() => {
                        setEditingBookId(null);
                        fetchBooks();
                    }}/>}
            </Modal>
        </div>
    );
}

export default BookList;