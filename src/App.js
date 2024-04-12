import React from 'react';
import {AuthProvider} from "./components/AuthContext";
import BooksPage from "./components/BooksPage";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    return (
        <AuthProvider>
        <div>
            <BooksPage>
            </BooksPage>
        </div>
        </AuthProvider>
    );
}

export default App;