import styles from './Chat.module.css'
import React, {useRef} from 'react';
import Message from './ChatItems/Message';
import ReceiverMessage from './ChatItems/ReceiverMessage';
import AnswerMessage from './ChatItems/AnswerMessage';
import AnswerReceiver from './ChatItems/AnswerReceiver';
import DateMessage from './ChatItems/DateMessage';
import IOSSettings from './IOSSettings';
import {useSelector} from 'react-redux';
import IOSChatSettings from './IOSChatSettings';
import {useState, useEffect} from "react";
import MessageRedactor from '../MessageRedactor/MessageRedactor';
import {useDownloadChat} from "../../providers/DownloadChatProvider.jsx";
import {
    isMessageDate,
    isMessageFromReceiver,
    isMessageFromSender,
    isMessageReply
} from "../../utils/handleMessagesTypes.js";


const Chat = () => {
    const darkTheme = useSelector((state) => state.settings.theme)
    const messages = useSelector((state) => state.settings.messages)

    const [modalActive, setModalActive] = useState(false);

    // HINT: return type [actionType, messageInfo] | null. Action type can be: edit | reply
    const [messageAction, setMessageAction] = useState(null)

    const ref = useRef(null);

    const {onSetChatRef} = useDownloadChat();

    useEffect(() => {
        onSetChatRef(ref)
    }, [onSetChatRef])

    useEffect(() => {
        if (modalActive) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [modalActive]);

    const handleModalOpen = () => {
        setModalActive(true);
    }

    const renderMessagesTypes = () => {
        return messages.map(message => {
            if (isMessageDate(message)) {
                return <DateMessage
                    id={message.id}
                    key={message.id}
                    mesDate={message.date.date}
                    handleChangeMessageType={(actionType) => {
                        setMessageAction([actionType, message])
                        setModalActive(true)
                    }}
                />;
            }

            if (isMessageReply(message)) {
                if (message.isSender) {
                    return <AnswerMessage
                        id={message.id}
                        isSender={message.isSender}
                        key={message.id}
                        mesText={message.text}
                        mesTime={message.time}
                        mesStatus={message.status}
                        mesAnsweredId={null}
                        mesAnsweredName={message.answer.name}
                        mesAnsweredText={message.answer.answerText}
                        handleChangeMessageType={(actionType) => {
                            setMessageAction([actionType, message])
                            setModalActive(true)
                        }}
                    />;
                }
                return <AnswerReceiver
                    id={message.id}
                    isSender={message.isSender}
                    key={message.id}
                    mesText={message.text}
                    mesTime={message.time}
                    mesStatus={message.status}
                    mesAnsweredId={null}
                    mesAnsweredName={message.answer.name}
                    mesAnsweredText={message.answer.answerText}
                    handleChangeMessageType={(actionType) => {
                        setMessageAction([actionType, message])
                        setModalActive(true)
                    }}/>

            }


            if (isMessageFromSender(message)) {
                return <Message
                    id={message.id}
                    key={message.id}
                    mesText={message.text}
                    mesTime={message.time}
                    mesStatus={message.status}
                    handleChangeMessageType={(actionType) => {
                        setMessageAction([actionType, message])
                        setModalActive(true)
                    }}
                />
            }

            if (isMessageFromReceiver(message)) {
                return <ReceiverMessage
                    id={message.id}
                    key={message.id}
                    mesText={message.text}
                    mesTime={message.time}
                    mesName={message.receiverName}
                    handleChangeMessageType={(actionType) => {
                        setMessageAction([actionType, message])
                        setModalActive(true)
                    }}
                />
            }

            return <div>wrong message type</div>
        })
    }

    return (<>
            {modalActive &&
                <MessageRedactor
                    active={modalActive} setActive={setModalActive} messageAction={messageAction}
                    setMessageAction={setMessageAction}
                />}

            <div className={styles.container} ref={ref}>
                <header className={`${styles.header} ${darkTheme ? styles.darkH : ''}`}>
                    <IOSSettings/>
                    <IOSChatSettings/>
                </header>
                <main className={`${styles.chatbackground} ${darkTheme ? styles.darkC : ''}`}>
                    {renderMessagesTypes()}
                </main>
                <footer>
                    <button className={`${styles.footerbutton} ${darkTheme ? styles.darkB : ''}`}
                            onClick={handleModalOpen}/>
                </footer>
            </div>


        </>
    );
};

export default Chat;
