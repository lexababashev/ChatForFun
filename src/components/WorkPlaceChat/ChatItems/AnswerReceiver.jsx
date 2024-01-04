import React, { useState } from 'react';
import styles from './AnswerReceiver.module.css';
import { useSelector } from 'react-redux';


const AnswerReceiver = ({ id, mesText,mesTime, mesName, mesAnsweredId, mesAnsweredName, mesAnsweredText}) => {
    const darkTheme = useSelector((state) => state.settings.theme);
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div className={styles.container}>
            <div className={`${styles.receiver_message} ${darkTheme ? styles.dark : ''}`}
            onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
            <h1 style={{fontWeight: 'bold', marginBottom:'7px'}}>{mesName}</h1>
                <div className={`${styles.answer_receiver}`}>
                <div className={styles.leftLine}></div>
                    <div className={`${styles.answer_receiver_message} ${darkTheme ? styles.darkARM : ''}`}>
                    <span className={styles.receiver_name}>{mesAnsweredName}</span>
                    <p>{mesAnsweredText}</p>
                    </div>
                </div>
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
    )
};

export default AnswerReceiver;
