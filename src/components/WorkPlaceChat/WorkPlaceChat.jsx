import styles from './WorkPlaceChat.module.css'
import React from 'react';
import Chat from './Chat'


const WorkPlaceChat = () => {


    return (
        <div className={styles.maincontainer}>
            <div className={styles.container}>
                <Chat/>
            </div>
        </div>
    );
};

export default WorkPlaceChat;
