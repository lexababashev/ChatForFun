import React, { useState } from 'react';
import styles from './DateMessage.module.css';

import { useSelector } from 'react-redux';


const DateMessage = ({id, mesDate}) => {
    const darkTheme = useSelector((state)=>state.settings.theme);
    const [isHovered, setIsHovered] = useState(false);





    return (
        <div className={styles.container}>
            <div className={`${styles.dateMessage} ${darkTheme ? styles.dark : ''}`}
            onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
                <p>{mesDate}</p>
                {isHovered && (
                        <div className={styles.popup_buttons}>
                            <button className={styles.ed}>e</button>
                            <button className={styles.ans}>a</button>
                            <button className={styles.del}>d</button>
                        </div>
                    )}
            </div>

        </div>
    )
};

export default DateMessage;