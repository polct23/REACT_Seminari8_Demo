import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { User} from './types';
import Form from './components/Form/Form';
import UsersList from './components/UsersList/UsersList';
import { fetchUsers} from './services/usersService';

interface AppState {
    users: User[];
    newUsersNumber: number;
}

function App() {
    const [users, setUsers] = useState<AppState["users"]>([]);
    const [newUsersNumber, setNewUsersNumber] = useState<AppState["newUsersNumber"]>(0);
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
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
        loadUsers();
    }, [newUsersNumber]);

    const handleNewUser = (newUser: User): void => {
        setNewUsersNumber(n => n + 1);
    };

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
        if (divRef.current) {
            divRef.current.style.backgroundColor = isDarkMode ? '#ffffff' : '#333333';
            divRef.current.style.color = isDarkMode ? '#000000' : '#ffffff';
        }
    };

    return (
        <div className="App" ref={divRef}>
            <button onClick={toggleDarkMode} className="toggleButton">
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
            <div className="content">
                <UsersList users={users} />
                New users: {newUsersNumber}
                <Form onNewUser={handleNewUser} />
            </div>
        </div>
    );
}

export default App;