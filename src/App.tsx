import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { User } from './types';
import Form from './components/Form';
import UsersList from './components/UsersList';
import EditUserForm from './components/UpdateUser/EditUserForm';
import { fetchUsers, LogIn } from './services/usersService';
import Login from './components/Login';

interface AppState {
    currentUser: User | null;
    users: User[];
    newUsersNumber: number;
    isLoggedIn: boolean;
}

interface UIState {
    isDarkMode: boolean;
    showNotification: boolean;
    newUserName: string;
}

function App() {
    const [users, setUsers] = useState<AppState['users']>([]);
    const [newUsersNumber, setNewUsersNumber] = useState<AppState['newUsersNumber']>(0);
    const [isLoggedIn, setIsLoggedIn] = useState<AppState['isLoggedIn']>(false);
    const [currentUser, setCurrentUser] = useState<AppState['currentUser']>(null);

    const [uiState, setUiState] = useState<UIState>({
        isDarkMode: false,
        showNotification: false,
        newUserName: '',
    });

    const [editingUser, setEditingUser] = useState<User | null>(null); // Nuevo estado para el usuario en edición

    const divRef = useRef<HTMLDivElement>(null); // Mantenemos el useRef como ejemplo

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const fetchedUsers = await fetchUsers();
                console.log('Fetched Users:', fetchedUsers); // Verifica los datos obtenidos
                setUsers(fetchedUsers); // Aquí se asignan los usuarios al estado
                console.log('Updated Users State:', fetchedUsers); // Verifica el estado actualizado
            } catch (error) {
                console.error('Error loading users:', error);
                setUsers([]);
            }
        };
        if (isLoggedIn) {
            loadUsers();
        }
    }, [newUsersNumber, isLoggedIn]);

    useEffect(() => {
        if (uiState.showNotification) {
            const timer = setTimeout(() => {
                setUiState((prev) => ({
                    ...prev,
                    showNotification: false,
                }));
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [uiState.showNotification]);

    const handleNewUser = (newUser: User): void => {
        setNewUsersNumber((n) => n + 1);
        setUiState((prev) => ({
            ...prev,
            newUserName: newUser.name,
            showNotification: true,
        }));
    };

    const toggleDarkMode = () => {
        setUiState((prev) => {
            const newMode = !prev.isDarkMode;

            // Ejemplo de uso de useRef para cambiar estilos directamente
            if (divRef.current) {
                divRef.current.style.backgroundColor = newMode ? '#333333' : '#ffffff';
                divRef.current.style.color = newMode ? '#ffffff' : '#000000';
            }

            return { ...prev, isDarkMode: newMode };
        });
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

    const handleEditUser = (user: User) => {
        setEditingUser(user); // Establece el usuario en edición
    };

    return (
        <div className="App" ref={divRef}>
            {/* Notification Popup */}
            {uiState.showNotification && (
                <div className={`notification ${uiState.isDarkMode ? 'dark' : 'light'}`}>
                    User <strong>{uiState.newUserName}</strong> has been created successfully!
                </div>
            )}

            <button onClick={toggleDarkMode} className="toggleButton">
                {uiState.isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </button>

            <div className="content">
    {!isLoggedIn ? (
        <Login
            onLogin={({ email, password }) => handleLogin(email, password)}
        />
    ) : editingUser ? ( // Mostrar el formulario de edición si hay un usuario en edición
        <EditUserForm
        user={editingUser}
        onSave={async (updatedUser: User) => {
            try {
                // Vuelve a cargar los usuarios desde el backend
                const updatedUsers = await fetchUsers();
                setUsers(updatedUsers); // Actualiza el estado con los datos más recientes
                setEditingUser(null); // Salir del modo de edición
            } catch (error) {
                console.error('Error fetching updated users:', error);
                alert('Failed to refresh user list.');
            }
        }}
        onCancel={() => setEditingUser(null)} // Cancelar edición
    />
    ) : (
        <>
            <h2>Bienvenido, {currentUser?.name}!</h2>
            {users.length > 0 ? ( // Renderizar UsersList solo si hay usuarios
                <UsersList
                    users={users}
                    onEditUser={handleEditUser} // Pasar la función de edición
                />
            ) : (
                <p>Cargando usuarios...</p> // Mensaje mientras se cargan los usuarios
            )}
            <p>New users: {newUsersNumber}</p>
            <Form onNewUser={handleNewUser} />
        </>
    )}
</div>
        </div>
    );
}

export default App;