import React from 'react';
import { useNavigate } from 'react-router-dom';
import './401Page.css';

const UnauthorizedPage = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <div className="unauthorized-container">
            <div className="unauthorized-content">
                <h1>401</h1>
                <h2>Không đủ quyền hạn</h2>
                <p>Bạn không có quyền truy cập trang này.</p>
                <button onClick={handleGoHome} className="home-button">
                    Về Trang chủ
                </button>
            </div>
        </div>
    );
};

export default UnauthorizedPage;
