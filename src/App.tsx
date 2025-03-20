import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { Sub, SubsResponseFromApi } from './types';
import Form from './components/Form/Form';
import SubsList from './components/SubsList/SubsList';
import { fetchSubs, mapFromApiToSubs } from './services/subsService';

interface AppState {
    subs: Sub[];
    newSubsNumber: number;
}

function App() {
    const [subs, setSubs] = useState<AppState["subs"]>([]);
    const [newSubsNumber, setNewSubsNumber] = useState<AppState["newSubsNumber"]>(0);
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
    const divRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchSubs()
            .then(mapFromApiToSubs)
            .then(setSubs);
    }, []);

    const handleNewSub = (newSub: Sub): void => {
        setSubs(subs => [...subs, newSub]);
        setNewSubsNumber(n => n + 1);
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
                <SubsList subs={subs} />
                New subs: {newSubsNumber}
                <Form onNewSub={handleNewSub} />
            </div>
        </div>
    );
}

export default App;