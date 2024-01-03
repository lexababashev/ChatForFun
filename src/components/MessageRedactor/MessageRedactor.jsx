import React, { useState } from "react";
import styles from './MessageRedactor.module.css';
import crossimg from '../../assets/icons/cross-close.svg';

import checkmarkread from '../../assets/icons/Read.svg'
import checkmarkreceive from '../../assets/icons/ReceiveDark.svg'
import checkmarksend from '../../assets/icons/SendDark.svg'

const MessageRedactor = ({ active, setActive }) => {

    const [currentPage, setCurrentPage] = useState('Sender');

    const handlePageChange = (pageName) => {
        setCurrentPage(pageName);
    };

    const handleCloseModal = () => {
        setActive(false);
    };

    return (
        <div className={styles.container_modal}>
            <div className={styles.redactor_content}>
                <button className={styles.close_button} onClick={()=>handleCloseModal()}>
                    <img src={crossimg} alt="close" style={{ width: '16px', height: '16px', }} />
                </button>
                <div className={styles.buttonsDiv}>
                    <button
                        onClick={() => handlePageChange('Sender')}
                        className={`${styles.buttons} ${currentPage === 'Sender' ? styles.active : ''}`}
                    >
                        <span>Sender</span>
                    </button>

                    <button
                        onClick={() => handlePageChange('Receiver')}
                        className={`${styles.buttons} ${currentPage === 'Receiver' ? styles.active : ''}`}
                    >
                        <span>Receiver</span>
                    </button>

                    <button
                        onClick={() => handlePageChange('Date')}
                        className={`${styles.buttons} ${currentPage === 'Date' ? styles.active : ''}`}
                    >
                        <span>Date</span>
                    </button>
                </div>


                {(currentPage === 'Sender' || currentPage === 'Receiver') && (
                    <div className={styles.editortextDiv}>
                        <textarea className={styles.editortext} placeholder="Enter message text..." />
                    </div>

                )}
                {(currentPage === 'Receiver') && (
                    
                        <input type='text' className={styles.receiverName} placeholder="Receiver`s name..." />
                    
                )}


                <div className={styles.setElemnets}>

                    {(currentPage === 'Sender') && (
                        <div className={styles.settingMark}>
                            <label>
                                <input type="radio" />
                                Read
                                <img src={checkmarkread} alt="close" style={{ width: '14px', height: '14px', }} />
                            </label>
                            <label>
                                <input type="radio" />
                                Received
                                <img src={checkmarkreceive} alt="close" style={{ width: '14px', height: '14px', }} />
                            </label>
                            <label>
                                <input type="radio" />
                                Send
                                <img src={checkmarksend} alt="close" style={{ width: '14px', height: '14px', }} />
                            </label>
                        </div>
                    )}


                    {(currentPage === 'Sender' || currentPage === 'Receiver') && (
                        <input className={styles.timeInput} type="time" max={"23:59"} min={"00:01"} />

                    )}

                    {(currentPage === 'Date') && (
                        <input className={styles.dateInput} type="date" placeholder="DD/MM/YYYY" />

                    )}

                    <button className={styles.lowButton}>Send</button>
                </div>


            </div>
        </div>
    );
};

export default MessageRedactor;

