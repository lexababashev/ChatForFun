import styles from './IOSChatSettings.module.css'
import React from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { changeName, changeStatus, changeNumberOfMessages } from '../../reducers/settingsReducer';

const IOSChatSettings = () => {
    const dispatch = useDispatch();

    const userName = useSelector((state) => state.settings.name);
    const userStatus = useSelector((state) => state.settings.status);
    const numberOfMessages = useSelector((state) => state.settings.numberOfMessages);
    const darkTheme = useSelector((state) => state.settings.theme);

    const handleNameChange = (event) => {
        const sanitizedInput = event.target.value;
        if (sanitizedInput.length > 14) {
            return;
        }
        dispatch(changeName(sanitizedInput));
    };

    const handleStatusChange = (event) => {
        const sanitizedInput = event.target.value;
        if (/[^A-Za-zА-Яа-я]/g.test(sanitizedInput) || sanitizedInput.length > 11) {
            return;
        }
        dispatch(changeStatus(sanitizedInput));
    };

    const handleNumberOfMessages = (event) => {
        let sanitizedInput = event.target.value;
        if (/\D/g.test(sanitizedInput.toString())) {
            return;
        }
        else if (sanitizedInput.startsWith('00')) {
            return;

        } else if (sanitizedInput.startsWith('0') && sanitizedInput.length > 1) {
            return;
        }
        else if (sanitizedInput.length > 3) {
            return;
        }
        dispatch(changeNumberOfMessages(sanitizedInput));
    };


    const handleEnterKey = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            event.target.blur();
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const button = document.querySelector('.user_avatar');
                if (button) {
                    button.style.backgroundImage = `url(${reader.result})`;
                    button.style.backgroundSize = 'cover';
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleClick = () => {
        const fileInput = document.getElementById('fileInput');
        if (fileInput) {
            fileInput.click();
        }
    };


    return (
        <div className={styles.container}>
            <input
                className={styles.number_of_messages}
                type="text"
                placeholder="N"
                value={numberOfMessages}
                onChange={(e) => handleNumberOfMessages(e)}
                onKeyDown={handleEnterKey}
            />

            <div className={styles.user_avatar}>
                <input
                    id="fileInput"
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleImageUpload}
                />
                <button
                    className={styles.user_avatar_button}
                    onClick={handleClick}
                ></button>
            </div>


            <div className={styles.user_data}>
                <input
                    className={`${styles.inputName} ${darkTheme ? styles.DarkName : ''}`}
                    type="text"
                    placeholder="Name"
                    value={userName}
                    onChange={(e) => handleNameChange(e)}
                    onKeyDown={handleEnterKey}
                />

                <input
                    className={styles.inputStatus}
                    type="text"
                    placeholder="Status"
                    value={userStatus}
                    onChange={(e) => handleStatusChange(e)}
                    onKeyDown={handleEnterKey}
                />
            </div>

        </div>
    );
};

export default IOSChatSettings;