import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import ProjectList from './components/Project';
import TaskManager from './components/Login'; 
import Homepage from './components/Homepage';

const App = () => {
    return (
        <HashRouter>
            <Routes>
                <Route path="/projects" element={<ProjectList />} />
                <Route path="/tasks" element={<TaskManager />} />
                <Route path="/" element={<Homepage />} />
            </Routes>
        </HashRouter>
    );
};
export default App;