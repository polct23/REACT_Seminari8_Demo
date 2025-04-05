import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { User } from './types';
import Form from './components/Form';
import UsersList from './components/UsersList';
import { fetchUsers, LogIn } from './services/usersService';
import Login from './components/Login';

interface AppState {
    users: User[];
    newUsersNumber: number;
}

function App() {
    const [users, setUsers] = useState<AppState['users']>([]);
    const [newUsersNumber, setNewUsersNumber] = useState<AppState['newUsersNumber']>(0);
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [showNotification, setShowNotification] = useState<boolean>(false);
    const [newUserName, setNewUserName] = useState<string>('');
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
        setNewUserName(newUser.name);
        setShowNotification(true);
        
        // Hide the notification after 3 seconds
        setTimeout(() => {
            setShowNotification(false);
        }, 3000);
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
            const user = await LogIn(email, password);
            console.log('User logged in:', user);
            setCurrentUser(user);
            setIsLoggedIn(true);
        } catch (error) {
            console.error('Login failed:', error);
            alert('Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="App" ref={divRef}>
            {/* Notification Popup */}
            {showNotification && (
                <div className={`notification ${isDarkMode ? 'dark' : 'light'}`}>
                    User <strong>{newUserName}</strong> has been created successfully!
                </div>
            )}

            <button onClick={toggleDarkMode} className="toggleButton">
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
            <div className="content">
                {!isLoggedIn ? (
                    <Login
                        onLogin={({ email, password }) => handleLogin(email, password)}
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