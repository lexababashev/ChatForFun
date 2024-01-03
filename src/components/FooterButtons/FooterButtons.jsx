import styles from './FooterButtons.module.css';
import React from 'react';
const FooterButtons = () => {


    return (
        <div className={styles.container}>
            
            <button className={styles.buttonD}><p>Download Chat</p></button>
            <button className={styles.buttonD}><p>Share Chat</p></button>
            <button className={styles.buttonD}><p>Reset Chat</p></button>
            
        </div>
    )
};

export default FooterButtons;