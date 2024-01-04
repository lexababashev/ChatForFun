import React, {useState} from 'react';
import styles from './DateMessage.module.css';

import {useDispatch, useSelector} from 'react-redux';
import {handleDeleteMessage} from "../../../reducers/settingsReducer.js";


const DateMessage = ({id, mesDate, handleChangeMessageType}) => {
    const dispatch = useDispatch()
    const darkTheme = useSelector((state) => state.settings.theme);
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div className={styles.container}>
            <div className={`${styles.dateMessage} ${darkTheme ? styles.dark : ''}`}
                 onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
                <p>{mesDate}</p>
                {isHovered && (
                    <div className={styles.popup_buttons}>
                        <button className={styles.ed} onClick={() => handleChangeMessageType('edit')}>e</button>
                        <button className={styles.del} onClick={() => dispatch(handleDeleteMessage(id))}>d</button>
                    </div>
                )}
            </div>

        </div>
    )
};

export default DateMessage;
