import React, { useState } from 'react';
import { User } from '../../types';
import { updateUser } from '../../services/usersService'; // Importamos la función updateUser

interface EditUserFormProps {
    user: User;
    onSave: (updatedUser: User) => void;
    onCancel: () => void;
}

const EditUserForm: React.FC<EditUserFormProps> = ({ user, onSave, onCancel }) => {
    const [formData, setFormData] = useState<User>(user);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.id) {
            console.error('Error: ID is missing.');
            alert('Cannot update user without a valid ID.');
            return;
        }
        try {
            const updatedUser = await updateUser(formData.id, formData); // Usamos updateUser
            onSave(updatedUser);
        } catch (error) {
            console.error('Error updating user:', error);
            alert('Failed to update user.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Name:
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                />
            </label>
            <label>
                Age:
                <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                />
            </label>
            <label>
                Email:
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                />
            </label>
            <button type="submit">Save</button>
            <button type="button" onClick={onCancel}>
                Cancel
            </button>
        </form>
    );
};

export default EditUserForm;