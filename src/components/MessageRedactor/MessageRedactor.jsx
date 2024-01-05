import React, {useEffect, useState} from "react";
import styles from './MessageRedactor.module.css';
import crossimg from '../../assets/icons/cross-close.svg';

import checkmarkread from '../../assets/icons/Read.svg'
import checkmarkreceive from '../../assets/icons/ReceiveDark.svg'
import checkmarksend from '../../assets/icons/SendDark.svg'
import {useDispatch, useSelector} from "react-redux";
import {
    handleAddNewDateMessage,
    handleAddNewMessage,
    handleEditMessage,
    handleReplyOnMessage
} from "../../reducers/settingsReducer.js";
import {useNavigate} from "react-router-dom";
import LIST_OF_BAD_WORDS from '../../constants/listOfBadWords.js'

const MessageRedactor = ({active, setActive, messageAction, setMessageAction}) => {
    const navigate = useNavigate()

    const groupName = useSelector((state) => state.settings.name);
    const messages = useSelector((state) => state.settings.messages)


    const [currentPage, setCurrentPage] = useState(() => {
        if (!messageAction) return 'Sender'
        if (messageAction[1].date.isDate) return 'Date'
        if (messageAction[1].isSender) return 'Sender'
        if (!messageAction[1].isSender) return 'Receiver'
    });

    const [message, setMessage] = useState(() => ({
        id: messageAction ? messageAction[1].id : null,
        text: messageAction ? messageAction[1].text : '',
        time: messageAction ? messageAction[1].time : '',
        isSender: messageAction ? messageAction[1].isSender : false,
        status: messageAction ? messageAction[1].status : 'sent',
        receiverName: messageAction ? messageAction[1].receiverName : '',
        answer: {
            isAnswer: messageAction ? messageAction[1].answer.isAnswer : false,
            answerId: messageAction ? messageAction[1].answer.answerId : null,
            name: messageAction ? messageAction[1].answer.name : '',
            answerText: messageAction ? messageAction[1].answer.answerText : ''
        },
        date: {
            isDate: messageAction ? messageAction[1].date.isDate : false,
            date: messageAction ? messageAction[1].date.date : ''
        }
    }))

    const isMessageInMode = !!messageAction

    const dispatch = useDispatch()


    const handlePageChange = (pageName) => {
        setCurrentPage(pageName);
    };

    const handleCloseModal = () => {
        setActive(false);
        setMessageAction(null)
    };

    const handleMessageChange = (event) => {
        const {name, value} = event.target;

        if (value.length >= 120) {
            alert('You have reached maximum limit of 120 characters')
            return;
        }

        if (name === 'date') {
            setMessage(prevMessageInfo => ({...prevMessageInfo, date: {isDate: true, date: value}}))
            return;
        } else {
            setMessage(prevMessageInfo => ({...prevMessageInfo, [name]: value}))
        }
    }

    const handleSaveModal = () => {

        const {text, status, time, receiverName, date, id, answer} = message;

        if (LIST_OF_BAD_WORDS.some(badWord => (text || '').toLowerCase().includes(badWord.toLowerCase()))
            || LIST_OF_BAD_WORDS.some(badWord => (receiverName || '').toLowerCase().includes(badWord.toLowerCase()))) {
            alert('Please use appropriate language')
            return;
        }

        switch (currentPage) {
            case "Sender": {
                let isError = false;
                let errorMessage = 'Please fill in: '
                if (text.trim().length === 0) {
                    errorMessage += "Message Text, "
                    isError = true;
                }
                if (time === '') {
                    errorMessage += "Time"
                    isError = true;
                }
                if (isError) {
                    alert(errorMessage)
                    return
                }
                break;
            }
            case "Receiver": {
                let isError = false;
                let errorMessage = 'Please fill in: '
                if (text.trim() === "") {
                    errorMessage += "Message Text, "
                    isError = true;
                }
                if (receiverName.trim().length === 0) {
                    errorMessage += "Receiver Name, "
                    isError = true;
                }
                if (time === '') {
                    errorMessage += "Time"
                    isError = true;
                }
                if (isError) {
                    alert(errorMessage)
                    return
                }
                break;
            }
            case "Date": {
                let isError = false;
                let errorMessage = 'Please fill in: '
                if (date.date.trim() === "") {
                    errorMessage += "Date"
                    isError = true;
                }
                if (isError) {
                    alert(errorMessage)
                    return
                }
                break;
            }
        }

        if (isMessageInMode) {
            const isReplyType = messageAction[0] === 'reply'

            switch (currentPage) {
                case "Sender": {
                    const editedNewSenderMessage = {
                        text, isSender: true, status, receiverName: '', time, answer,
                        id,
                        date: {isDate: false, date: ''}
                    }

                    if (isReplyType) {
                        console.log('here')
                        dispatch(handleReplyOnMessage({
                            ...editedNewSenderMessage, answer: {
                                isAnswer: true,
                                answerId: id,
                                name: receiverName ? receiverName : 'You',
                                answerText: messageAction[1].text,
                            }
                        }))
                    } else {
                        dispatch(handleEditMessage(editedNewSenderMessage))
                    }
                    break;
                }
                case "Receiver": {
                    const editedNewSenderMessage = {
                        text, isSender: false, status: '', receiverName, time, answer,
                        id,
                        date: {isDate: false, date: ''}
                    }

                    if (isReplyType) {
                        if (message.receiverName.trim() === "") {
                            dispatch(handleReplyOnMessage({
                                ...editedNewSenderMessage, answer: {
                                    isAnswer: true,
                                    answerId: id,
                                    name: groupName,
                                    answerText: messageAction[1].text,
                                }
                            }))
                        } else {
                            dispatch(handleReplyOnMessage({
                                ...editedNewSenderMessage, answer: {
                                    isAnswer: true,
                                    answerId: id,
                                    name: messageAction[1].receiverName,
                                    answerText: messageAction[1].text,
                                }
                            }))
                        }
                    } else {
                        dispatch(handleEditMessage(editedNewSenderMessage))
                    }
                    break;
                }
                case "Date": {
                    const editedNewSenderMessage = {
                        text: '', isSender: false, status: '', receiverName: '', time: '', answer: {
                            isAnswer: false,
                            answerId: null,
                            name: '',
                            answerText: '',
                        },
                        id,
                        date: {isDate: true, date: date.date}
                    }

                    if (isReplyType) {
                        dispatch(handleReplyOnMessage({
                            ...editedNewSenderMessage, answer: {
                                isAnswer: true,
                                answerId: id,
                                name: messageAction[1].receiverName,
                                answerText: messageAction[1].text,
                            }
                        }))
                    } else {
                        dispatch(handleEditMessage(editedNewSenderMessage))
                    }
                    break;
                }
                default:
                    console.log("Not suitable type of the selected type")
            }
        } else {
            if (messages.length >= 5) {
                alert('You have reached maximum limit of 5 messages. Please delete some, so you can add new ones.')
            } else {
                switch (currentPage) {
                    case "Sender":
                        dispatch(handleAddNewMessage({
                            text,
                            isSender: true,
                            status,
                            time
                        }))
                        break;
                    case "Receiver":
                        dispatch(handleAddNewMessage({
                            text,
                            isSender: false,
                            receiverName,
                            time,
                        }))
                        break;
                    case "Date":
                        dispatch(handleAddNewDateMessage({date: date.date}))
                        break;
                    default:
                        console.log("Not suitable type of the selected type")
                }
            }

        }
        handleCloseModal()
        setMessageAction(null)
        setMessage({
            id: null,
            text: '',
            time: '',
            isSender: false,
            status: 'sent',
            receiverName: '',
            answer: {
                isAnswer: false,
                answerId: null,
                name: '',
                answerText: ''
            },
            date: {
                isDate: false,
                date: ''
            }
        })
    }

    return (
        <div className={styles.container_modal}>
            <div className={styles.redactor_content}>
                <button className={styles.close_button} onClick={() => handleCloseModal()}>
                    <img src={crossimg} alt="close" style={{width: '16px', height: '16px',}}/>
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
                        disabled={messageAction && messageAction[0] === 'reply'}
                        onClick={() => handlePageChange('Date')}
                        className={`${styles.buttons} ${currentPage === 'Date' ? styles.active : ''}`}
                        style={{cursor: messageAction && messageAction[0] === 'reply' ? 'not-allowed' : 'initial'}}
                    >
                        <span>Date</span>
                    </button>
                </div>


                {(currentPage === 'Sender' || currentPage === 'Receiver') && (
                    <div className={styles.editortextDiv}>
                        <textarea name="text" value={message.text} onChange={handleMessageChange}
                                  className={styles.editortext}
                                  placeholder="Enter message text..."/>
                    </div>

                )}
                {(currentPage === 'Receiver') && (

                    <input type='text' name="receiverName" value={message.receiverName} onChange={handleMessageChange}
                           className={styles.receiverName} placeholder="Receiver`s name..."/>

                )}


                <div className={styles.setElemnets}>

                    {(currentPage === 'Sender') && (
                        <div className={styles.settingMark}>
                            <label>
                                <input
                                    type="radio"
                                    name="status"
                                    checked={message.status === 'read'}
                                    value={'read'}
                                    onChange={handleMessageChange}/>
                                Read
                                <img src={checkmarkread} alt="close" style={{width: '14px', height: '14px',}}/>
                            </label>
                            <label>
                                <input
                                    type="radio" name="status"
                                    checked={message.status === 'received'}
                                    value={'received'}
                                    onChange={handleMessageChange}/>
                                Received
                                <img src={checkmarkreceive} alt="close" style={{width: '14px', height: '14px',}}/>
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="status"
                                    checked={message.status === 'sent'}
                                    value={'sent'}
                                    onChange={handleMessageChange}/>
                                Send
                                <img src={checkmarksend} alt="close" style={{width: '14px', height: '14px',}}/>
                            </label>
                        </div>
                    )}


                    {(currentPage === 'Sender' || currentPage === 'Receiver') && (
                        <input className={styles.timeInput} type="time" value={message.time} name="time"
                               onChange={handleMessageChange}
                               max={"23:59"} min={"00:01"}/>

                    )}

                    {(currentPage === 'Date') && (
                        <input className={styles.dateInput} type="date" name="date" value={message.date.date}
                               onChange={handleMessageChange}
                               placeholder="YYYY/MM/DD"/>

                    )}
                    <button className={styles.lowButton} onClick={handleSaveModal}>Send</button>
                </div>


            </div>
        </div>
    );
};

export default MessageRedactor;

