import styles from './Chat.module.css'
import React from 'react';
import Message from './ChatItems/Message';
import ReceiverMessage from './ChatItems/ReceiverMessage';
import AnswerMessage from './ChatItems/AnswerMessage';
import AnswerReceiver from './ChatItems/AnswerReceiver';
import DateMessage from './ChatItems/DateMessage';
import IOSSettings from './IOSSettings';
import { useSelector } from 'react-redux';
import IOSChatSettings from './IOSChatSettings';
import { useState, useEffect } from "react";
import MessageRedactor from '../MessageRedactor/MessageRedactor';




const Chat = () => {

    const darkTheme = useSelector((state) => state.settings.theme)
    const messages = useSelector((state) => state.settings.messages)

    const [modalActive, setModalActive] = useState(false);

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


    return (<>
        {modalActive && <MessageRedactor active={modalActive} setActive={setModalActive} />}

        <div className={styles.container}>
            <header className={`${styles.header} ${darkTheme ? styles.darkH : ''}`}>
                <IOSSettings />
                <IOSChatSettings />
            </header>
            <main className={`${styles.chatbackground} ${darkTheme ? styles.darkC : ''}`}>

                {messages.map(message => {

                    return <Message key={message.id} mesText={message.text} mesTime={message.time} mesStatus={message.status} />;

                })}

                {messages.map(message => {

                    return <ReceiverMessage key={message.id} mesText={message.text} mesTime={message.time} mesName={message.receiverName} />;

                })}

                {messages.map(message => {
                    return <AnswerMessage key={message.id}
                        mesText={message.text}
                        mesTime={message.time}
                        mesStatus={message.status}
                        mesAnsweredId={null}
                        mesAnsweredName={message.answer.name}
                        mesAnsweredText={message.answer.answerText} />;
                })}

                {messages.map(message => {
                    return <AnswerReceiver key={message.id}
                        mesText={message.text}
                        mesTime={message.time}
                        mesName={message.receiverName}
                        mesAnsweredId={null}
                        mesAnsweredName={message.answer.name}
                        mesAnsweredText={message.answer.answerText} />;
                })}

                {messages.map(message => {
                    return <DateMessage key={message.id}
                        mesDate={message.date.date} />;
                })}

            </main>
            <footer>
                <button
                    className={`${styles.footerbutton} ${darkTheme ? styles.darkB : ''}`}
                    onClick={handleModalOpen}></button>
            </footer>
        </div>



    </>
    );
};

export default Chat;