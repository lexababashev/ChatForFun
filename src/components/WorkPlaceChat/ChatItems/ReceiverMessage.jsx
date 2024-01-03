import styles from './ReceiverMessage.module.css';
import React, { useState } from 'react';

import { useSelector } from 'react-redux';

const ReceiverMessage = ({id, mesText, mesTime, mesName}) => {

    const darkTheme = useSelector((state) => state.settings.theme);
    const [isHovered, setIsHovered] = useState(false);





    return (
        <>
            <div className={styles.container}>
            
                <div className={`${styles.receiver_message} ${darkTheme ? styles.dark : ''}`}
                onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
                <h1 style={{fontWeight: 'bold'}}>{mesName}</h1>
                    <p>{mesText}</p>
                    <span className={`${styles.time_message} ${darkTheme ? styles.darkt : ''}`}>{mesTime}</span>
                    {isHovered && (
                        <div className={styles.popup_buttons}>
                            <button className={styles.ed}>edit</button>
                            <button className={styles.ans}>answer</button>
                            <button className={styles.del}>delete</button>
                        </div>
                    )}
                </div>

            </div>
        </>
    )
}
export default ReceiverMessage;