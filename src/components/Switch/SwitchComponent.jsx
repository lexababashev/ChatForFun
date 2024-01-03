import React, { useState } from 'react';
import styles from './SwitchComponent.module.css';

import { BrowserRouter as Router, Link } from 'react-router-dom';


const SwitchComponent = () => {
  const [currentPage, setCurrentPage] = useState('Constructor');

  const handlePageChange = (pageName) => {
    setCurrentPage(pageName);
  };

  return (
    <div className={styles.container}>

      <Link to="/" className={styles.link}>
        <button
          onClick={() => handlePageChange('Constructor')}
          className={`${styles.button} ${currentPage === 'Constructor' ? styles.active : ''}`}
        >
          <span>Constructor</span>
        </button>
      </Link>

      <Link to="/feed" className={styles.link}>
        <button
          onClick={() => handlePageChange('Feed')}
          className={`${styles.button} ${currentPage === 'Feed' ? styles.active : ''}`}
        >
          <span>Feed</span>
        </button>
      </Link>

    </div>
  );
};

export default SwitchComponent;
