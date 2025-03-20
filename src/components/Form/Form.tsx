import React, { useReducer } from 'react';
import { User } from '../../types';
import styles from './Form.module.css';
import { addUser } from '../../services/usersService'; // Import CSS module

interface FormState {
    inputValues: User;
}

interface FormProps {
    onNewUser: (newUser: User) => void;
}

const INITIAL_STATE = {
    name: '',
    age: 0,
    email: ''
};

type FormReducerAction = {
    type: "change_value", 
    payload: { inputName: string, inputValue: string };
} | {
    type: "clear";
};

const formReducer = (state: FormState["inputValues"], action: FormReducerAction) => {
    switch (action.type) {
        case "change_value":
            const { inputName, inputValue } = action.payload;
            return {
                ...state,
                [inputName]: inputValue
            };
        case "clear":
            return INITIAL_STATE;
        default:
            return state;
    }
};

const Form = ({ onNewUser: onNewUser }: FormProps) => {
    const [inputValues, dispatch] = useReducer(formReducer, INITIAL_STATE);

    const handleSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        if (!inputValues.name || !inputValues.age || !inputValues.email) {
            alert('Please fill out all fields.');
            return;
        }
        try {
            const addedUser = await addUser(inputValues);
            onNewUser(addedUser);
            handleClear();
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleChange = (evt: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        dispatch({
            type: "change_value",
            payload: {
                inputName: evt.target.name,
                inputValue: evt.target.value
            }
        });
    };

    const handleClear = () => {
        dispatch({
            type: "clear"
        });
    };

    return (
        <div className={styles.formContainer}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label htmlFor="name" className={styles.label}>Name</label>
                    <input
                        onChange={handleChange}
                        value={inputValues.name}
                        type='text'
                        name="name"
                        id="name"
                        placeholder="Enter your name"
                        className={styles.input}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="age" className={styles.label}>Age</label>
                    <input
                        onChange={handleChange}
                        value={inputValues.age || ''}
                        type='number'
                        name="age"
                        id="age"
                        placeholder="Enter your age"
                        className={styles.input}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="email" className={styles.label}>Email</label>
                    <input
                        onChange={handleChange}
                        value={inputValues.email}
                        type='email'
                        name="email"
                        id="email"
                        placeholder="Enter your email"
                        className={styles.input}
                    />
                </div>
                <div className={styles.buttonGroup}>
                    <button type="button" onClick={handleClear} className={styles.button}>
                        Clear
                    </button>
                    <button type="submit" className={styles.button}>
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Form;