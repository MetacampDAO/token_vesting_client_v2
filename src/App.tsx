import React, { FC, useEffect, useState } from 'react';

import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/home';
import NavBar from './components/common/NavBar';
import Main from './components/common/Main';
import ReviewContract from './components/reviewContract';
import CreateContract from './components/createContract';

export const App: FC = () => {
    return (
        <>
            <NavBar />
            <Main
                childComp={
                    <Routes>
                        <Route path="/create-contract" element={<CreateContract />} />
                        <Route path="/review-contract" element={<ReviewContract />} />
                        <Route path="/" element={<Home />} />
                    </Routes>
                }
            />
        </>
    );
};
