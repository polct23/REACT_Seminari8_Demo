import React from "react";
import { Sub } from '../../types';
import styles from './SubsList.module.css'; // Import CSS module

interface Props {
    subs: Sub[];
}

const SubsList: React.FC<Props> = ({ subs }) => {
    const renderList = (): React.ReactNode[] => {
        return subs.map((sub) => (
            <li key={sub.nick} className={styles.listItem}>
                <div className={styles.subInfo}>
                    <h2 className={styles.nick}>{sub.nick}</h2>
                    <h3 className={styles.age}>Age: {sub.edad}</h3>
                    <p className={styles.email}>{sub.correo}</p>
                </div>
            </li>
        ));
    };

    return (
        <ul className={styles.list}>
            {renderList()}
        </ul>
    );
};

export default SubsList;