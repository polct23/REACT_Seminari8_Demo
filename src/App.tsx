import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { User } from './types';
import Form from './components/Form/Form';
import UsersList from './components/UsersList/UsersList';
import { fetchUsers, LogIn } from './services/usersService'; // Importa LogIn
import Login from './components/Login';

interface AppState {
    users: User[];
    newUsersNumber: number;
}

function App() {
    const [users, setUsers] = useState<AppState['users']>([]);
    const [newUsersNumber, setNewUsersNumber] = useState<AppState['newUsersNumber']>(0);
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); // Estado para manejar el login
    const [currentUser, setCurrentUser] = useState<User | null>(null); // Estado para el usuario actual
    const divRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const fetchedUsers = await fetchUsers();
                setUsers(fetchedUsers);
            } catch (error) {
                console.error('Error loading users:', error);
                setUsers([]);
            }
        };
        if (isLoggedIn) {
            loadUsers();
        }
    }, [newUsersNumber, isLoggedIn]);

    const handleNewUser = (newUser: User): void => {
        setNewUsersNumber((n) => n + 1);
    };

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
        if (divRef.current) {
            divRef.current.style.backgroundColor = isDarkMode ? '#ffffff' : '#333333';
            divRef.current.style.color = isDarkMode ? '#000000' : '#ffffff';
        }
    };

    const handleLogin = async (email: string, password: string) => {
        try {
            const user = await LogIn(email, password); // Llama a la función LogIn
            console.log('User logged in:', user);
            setCurrentUser(user); // Guarda el usuario actual
            setIsLoggedIn(true); // Cambia el estado a "logueado"
        } catch (error) {
            console.error('Login failed:', error);
            alert('Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="App" ref={divRef}>
            <button onClick={toggleDarkMode} className="toggleButton">
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
            <div className="content">
                {!isLoggedIn ? (
                    <Login
                        onLogin={({ email, password }) => handleLogin(email, password)} // Pasa la función handleLogin
                    />
                ) : (
                    <>
                        <h2>Bienvenido, {currentUser?.name}!</h2>
                        <UsersList users={users} />
                        <p>New users: {newUsersNumber}</p>
                        <Form onNewUser={handleNewUser} />
                    </>
                )}
            </div>
        </div>
    );
}

export default App;