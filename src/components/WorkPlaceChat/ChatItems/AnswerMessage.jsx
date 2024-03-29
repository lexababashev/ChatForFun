import React, {useState} from 'react';
import styles from './AnswerMessage.module.css';
import checkmarkread from '../../../assets/icons/Read.svg'
import checkmarkreceive from '../../../assets/icons/Receive.svg'
import checkmarksend from '../../../assets/icons/Send.svg'
import checkmarkreceiveDark from '../../../assets/icons/ReceiveDark.svg'
import checkmarksendDark from '../../../assets/icons/SendDark.svg'

import {useDispatch, useSelector} from 'react-redux';
import {handleDeleteMessage} from "../../../reducers/settingsReducer.js";

const AnswerMessage = ({
                           id,
                           mesText,
                           mesTime,
                           mesStatus,
                           isSender,
                           mesAnsweredId,
                           mesAnsweredName,
                           mesAnsweredText,
                           handleChangeMessageType
                       }) => {
    const dispatch = useDispatch()

    const darkTheme = useSelector((state) => state.settings.theme);
    const [isHovered, setIsHovered] = useState(false);

    let checkmarkImage;
    if (mesStatus === 'received' && darkTheme) {
        checkmarkImage = checkmarkreceiveDark;
    } else if (mesStatus === 'sent' && darkTheme) {
        checkmarkImage = checkmarksendDark;
    } else if (mesStatus === 'received' && !darkTheme) {
        checkmarkImage = checkmarkreceive;
    } else if (mesStatus === 'sent' && !darkTheme) {
        checkmarkImage = checkmarksend;
    } else {
        checkmarkImage = checkmarkread
    }


    return (
        <div className={styles.container}>
            <div className={`${styles.sender_message} ${darkTheme ? styles.dark : ''}`}
                 onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}

            >

                <div className={`${styles.answer_sender}`}>
                    <div className={`${styles.leftLine} ${darkTheme ? styles.darkLine : ''}`}></div>
                    <div className={`${styles.answer_sender_message} ${darkTheme ? styles.darkASM : ''}`}>
                        <span
                            className={`${styles.receiver_name} ${darkTheme ? styles.darkRN : ''}`}>{mesAnsweredName}</span>
                        <p>{mesAnsweredText}</p>
                    </div>
                </div>
                <p>{mesText}</p>
                <div className={styles.status_message}>
                    <span className={`${styles.time_message} ${darkTheme ? styles.darkt : ''}`}>{mesTime}</span>
                    <img src={checkmarkImage} className={styles.checkmark}></img>
                </div>
                {isHovered && (
                    <div className={styles.popup_buttons}>
                        <button className={styles.ed} onClick={() => handleChangeMessageType('edit')}>edit</button>
                        <button className={styles.ans} onClick={() => handleChangeMessageType('reply')}>answer</button>
                        <button className={styles.del} onClick={() => dispatch(handleDeleteMessage(id))}>delete</button>
                    </div>
                )}
            </div>
        </div>
    )
};

export default AnswerMessage;
