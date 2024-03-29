import styles from "./FooterButtons.module.css";
import React, {useEffect, useState} from "react";
import {useDownloadChat} from "../../providers/DownloadChatProvider.jsx";
import {useDispatch} from "react-redux";

import {ref, uploadBytes, getDownloadURL} from "firebase/storage";
import {collection} from "firebase/firestore";
import {db, storage} from "../../firebase/firebase";
import {getAuth} from "firebase/auth";
import {doc, setDoc} from "firebase/firestore";
import ChatTags from "../ChatTags/ChatTags.jsx";
import {resetSettings} from "../../reducers/settingsReducer.js";

const FooterButtons = () => {
    const dispatch = useDispatch()
    const [openChatTags, setOpenChatTags] = useState(false)

    const {downloadPng, getShareChatImageURL} = useDownloadChat();

    const handleShareChat = async (tags) => {
        const auth = getAuth();
        const user = auth.currentUser;
        
        const userId = user.uid;
        const shareImageUrl = await getShareChatImageURL();

        // Upload the image to Firebase Storage
        const imageRef = ref(
            storage,
            `shared/${userId}/${new Date().toISOString()}.png`
        );
        const response = await fetch(shareImageUrl);
        const blob = await response.blob();
        await uploadBytes(imageRef, blob);

        // Get the download URL
        const downloadURL = await getDownloadURL(imageRef);
        // Create a new document reference with an ID
        const sharedDocRef = doc(collection(db, "shared"));
        // Save the URL, userId, user's display name, userProfileImage, and docId to Firestore
        await setDoc(sharedDocRef, {
            createdAt: new Date(),
            imageUrl: downloadURL,
            userId: userId,
            userName: user.displayName,
            userProfileImage: user.photoURL,
            docId: sharedDocRef.id,
            tags: tags,
            likes: 0,
            peopleWhoLiked: []
        });
    };

    const handlePermission = () => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            alert('You need to log in first to share a chat.')
            return;
        }

        setOpenChatTags(true)
    }

    return (
        <>
            {openChatTags ?
                <ChatTags handleCloseModal={() => setOpenChatTags(false)}
                          handleShareChat={handleShareChat}/> : null}
            <div className={styles.container}>
                <button className={styles.buttonD} onClick={downloadPng}>
                    <p>Download Chat</p>
                </button>

                <button className={styles.buttonD} onClick={handlePermission}>
                    <p>Share Chat</p>
                </button>

                <button className={styles.buttonD} onClick={() => dispatch(resetSettings())}>
                    <p>Reset Chat</p>
                </button>
            </div>
        </>
    );
};

export default FooterButtons;
