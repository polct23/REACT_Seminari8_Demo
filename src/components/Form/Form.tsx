import React, { useReducer } from 'react';
import { Sub } from '../../types';
import styles from './Form.module.css'; // Import CSS module

interface FormState {
    inputValues: Sub;
}

interface FormProps {
    onNewSub: (newSub: Sub) => void;
}

const INITIAL_STATE = {
    nick: '',
    edad: 0,
    correo: ''
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

const Form = ({ onNewSub }: FormProps) => {
    const [inputValues, dispatch] = useReducer(formReducer, INITIAL_STATE);

    const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        if (!inputValues.nick || !inputValues.edad || !inputValues.correo) {
            alert('Please fill out all fields.');
            return;
        }
        onNewSub(inputValues);
        handleClear();
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
                    <label htmlFor="nick" className={styles.label}>Nick</label>
                    <input
                        onChange={handleChange}
                        value={inputValues.nick}
                        type='text'
                        name="nick"
                        id="nick"
                        placeholder="Enter your nickname"
                        className={styles.input}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="edad" className={styles.label}>Age</label>
                    <input
                        onChange={handleChange}
                        value={inputValues.edad || ''}
                        type='number'
                        name="edad"
                        id="edad"
                        placeholder="Enter your age"
                        className={styles.input}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="correo" className={styles.label}>Email</label>
                    <input
                        onChange={handleChange}
                        value={inputValues.correo}
                        type='email'
                        name="correo"
                        id="correo"
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