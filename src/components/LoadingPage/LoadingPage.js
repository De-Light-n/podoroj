import React from 'react';
import './LoadingPage.css';

const LoadingPage = () => {
    return (
        <div className="loading-container">
            <div className="spinner"></div>
            <p className="loading-text">Завантаження...</p>
        </div>
    );
};

export default LoadingPage;
