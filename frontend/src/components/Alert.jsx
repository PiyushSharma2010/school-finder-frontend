import React from 'react';
import { useAlert } from '../context/AlertContext';
import '../styles/components/alert.css';

const Alert = () => {
    const { alerts, removeAlert } = useAlert();

    if (alerts.length === 0) return null;

    return (
        <div className="alert-container">
            {alerts.map((alert) => (
                <div key={alert.id} className={`alert alert--${alert.type}`}>
                    <span className="alert-msg">{alert.msg}</span>
                    <button onClick={() => removeAlert(alert.id)} className="alert-close">
                        &times;
                    </button>
                </div>
            ))}
        </div>
    );
};

export default Alert;
