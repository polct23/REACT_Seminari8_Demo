import React from "react";
import { User } from '../../types';
import styles from './UsersList.module.css'; // Import CSS module

interface Props {
    users: User[];
    onEditUser: (user: User) => void; // Añadimos la función para manejar la edición
}

const UsersList: React.FC<Props> = ({ users, onEditUser }) => {
    const renderList = (): React.ReactNode[] => {
        console.log('Users:', users); // Verifica los datos que llegan al componente
        return users.map((user) => (
            <li key={user.id} className={styles.listItem}>
                <div className={styles.userInfo}>
                    <h2 className={styles.user}>{user.name}</h2>
                    <h3 className={styles.age}>Age: {user.age}</h3>
                    <p className={styles.email}>Email: {user.email}</p>
                    <p className={styles.id}>ID: {user.id || 'No ID'}</p> {/* Mostramos el ID o un mensaje */}
                </div>
                <button
                    className={styles.editButton}
                    onClick={() => onEditUser(user)}
                >
                    Edit
                </button>
            </li>
        ));
    };
    return (
        <ul className={styles.list}>
            {renderList()}
        </ul>
    );
};

export default UsersList;