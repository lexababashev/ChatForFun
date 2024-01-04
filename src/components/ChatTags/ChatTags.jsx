import styles from "../MessageRedactor/MessageRedactor.module.css";
import crossimg from "../../assets/icons/cross-close.svg";
import React, {useState} from "react";

const ChatTags = ({handleCloseModal, handleShareChat}) => {
    const [tags, setTags] = useState("")

    const handleApplyTags = () => {
        const pattern = new RegExp(/^#[\wа-яА-ЯіїєґІЇЄҐ]+(?:#[\wа-яА-ЯіїєґІЇЄҐ]+)?$/);
        const validateTags = pattern.test(tags);

        if (validateTags) {
            handleShareChat(tags.split('#').filter(Boolean))
            handleCloseModal();
        } else {
            alert('Invalid format. Please use #word#word2 or #word#word2#word3 format.')
        }
    }


    return <div className={styles.container_modal}>
        <div className={styles.redactor_content}>
            <button className={styles.close_button} onClick={handleCloseModal}>
                <img src={crossimg} alt="close" style={{width: '16px', height: '16px',}}/>
            </button>
            <h1 style={{fontSize: '2em', color: 'white'}}>Write tags</h1>
            <div className={styles.editortextDiv}>
                <textarea
                    name="text"
                    value={tags}
                    onChange={(e) => {
                        setTags(e.target.value)
                    }}
                    className={styles.editortext}
                    style={{width: '100%'}}
                    placeholder="Enter tags..."/>
            </div>
            <button onClick={handleApplyTags}
                    style={{
                        padding: '12px 8px',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer',
                        textTransform: 'uppercase',
                        fontWeight: 'bold'
                    }}>
                Apply tags & Share Chat
            </button>


        </div>
    </div>

}

export default ChatTags;
