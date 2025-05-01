import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProjectList from './components/Project';
import TaskManager from './components/Login'; 
import Homepage from './components/Homepage';

const App = () => {
    return (
        <BrowserRouter basename='/'>
            <Routes>
                <Route path="/projects" element={<ProjectList/>} />
                <Route path="/tasks" element={<TaskManager/>} />
                <Route path="/" element={<Homepage/>} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;