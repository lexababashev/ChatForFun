import React, {useState} from 'react';
import styles from './SwitchComponent.module.css';

import {BrowserRouter as Router, Link, useLocation} from 'react-router-dom';


const SwitchComponent = () => {
    const location = useLocation();

    const isConstructorPageSelected = location.pathname === '/';
    const isFeedPageSelected = location.pathname === '/feed'

    return (
        <div className={styles.container}>

            <Link to="/" className={styles.link}>
                <button
                    className={`${styles.button} ${isConstructorPageSelected ? styles.active : ''}`}
                >
                    <span>Constructor</span>
                </button>
            </Link>

            <Link to="/feed" className={styles.link}>
                <button
                    className={`${styles.button} ${isFeedPageSelected ? styles.active : ''}`}
                >
                    <span>Feed</span>
                </button>
            </Link>

        </div>
    );
};

export default SwitchComponent;
