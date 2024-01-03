import React from "react";
import styles from "./NoPage.module.css";

import { BrowserRouter as Router, Link } from 'react-router-dom';

const NoPage = () => {

    return (<div className={styles.container}>
        <h1 className={styles.noPageTitle}>404 not found</h1>
        <p className={styles.noPageSubtitle}>Your visited page not found.</p>
        <Link to="/" className={styles.link}>
        <button className={styles.buttonBack}>GO BACK</button>
        </Link>
        </div>
    )

};

export default NoPage;