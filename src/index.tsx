import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { App } from './App';
import Wallet from './Context/Wallet';
import { StoreProvider } from './Context/Store';

ReactDOM.render(
    <StrictMode>
        <Wallet>
            <StoreProvider>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </StoreProvider>
        </Wallet>
    </StrictMode>,
    document.getElementById('app')
);
