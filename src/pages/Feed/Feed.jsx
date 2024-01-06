import React, { useEffect, useRef, useState } from "react";
import styles from "./Feed.module.css";
import {
    collection,
    getDocs,
    query,
    where,
    getDoc,
    doc,
    deleteDoc,
    updateDoc,
    increment,
    limit,
    startAfter,
    endBefore
} from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { getAuth, onAuthStateChanged, deleteUser } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { ref, deleteObject, getStorage, list } from "firebase/storage";


const Feed = () => {
    const [allUsersData, setAllUsersData] = useState([]);
    const [selectedUser, setSelectedUser] = useState("All Users");
    const navigate = useNavigate();

    const auth = getAuth();
    const [user, setUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const handleSearchInputChange = (e) => {
        setSearchQuery(e.target.value);
    };


    const getCurrentUser = auth.currentUser;


    const filterDataByTags = (data) => {

        const sortedData = data.sort((a, b) => {
            const timeA = a.createdAt.seconds * 1000 + a.createdAt.nanoseconds / 1e6;
            const timeB = b.createdAt.seconds * 1000 + b.createdAt.nanoseconds / 1e6;
            return timeB - timeA;
        });

        if (!searchQuery) {
            return data;
        }

        return sortedData.filter((item) => {
            return item.tags !== null && item.tags.some((tag) =>
                tag.toLowerCase().includes(searchQuery.toLowerCase())
            );
        });
    };

    const filteredData = filterDataByTags(allUsersData);


    useEffect(() => {
        onAuthStateChanged(auth, (authUser) => {
            setUser(authUser);
            if (authUser) {
                fetchData();
            }
        });
    }, [auth]);

    const removeAllTheStorageImageByUserId = async (userId) => {
        const storage = getStorage();
        const imagesFolderRef = ref(storage, `shared/${userId}/`);

        await list(imagesFolderRef).then((result) => {
            result.items.forEach((itemRef) => {
                deleteObject(itemRef).then(() => {
                    console.log(`File ${itemRef.fullPath} deleted successfully`);
                }).catch((error) => {
                    console.error(`Error deleting file ${itemRef.fullPath}: `, error);
                });
            });
        })
    }

    const handleDelete = async (docId, userId) => {
        const docRef = doc(db, "shared", docId);
        try {
            await removeAllTheStorageImageByUserId(userId)
            await deleteDoc(docRef);
            setAllUsersData(allUsersData.filter((item) => item.docId !== docId));
            if (allUsersData.filter((item) => item.docId !== docId).length === 0) {
                handleUserSelect("All Users")
            }
        } catch (error) {
            console.error("Error deleting document: ", error);
        }
    };

    const deleteDocumentsForUserId = async (userId) => {
        try {
            const sharedCollectionRef = collection(db, 'shared');
            const q = query(sharedCollectionRef, where('userId', '==', userId));
            const querySnapshot = await getDocs(q);

            querySnapshot.forEach(async (doc) => {
                await deleteDoc(doc.ref);
            });
            await removeAllTheStorageImageByUserId(userId)
            setAllUsersData(allUsersData.filter((item) => item.userId !== userId));

            console.log(`Documents for userId ${userId} deleted successfully.`);
        } catch (error) {
            console.error('Error deleting documents:', error);
        }
    };

    const deleteSingleUserByUid = async (uid) => {
        try {
            const usersCollectionRef = collection(db, 'users');
            const q = query(usersCollectionRef, where('uid', '==', uid));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                // If there's at least one document, delete the first one
                const firstDoc = querySnapshot.docs[0];
                await deleteDoc(firstDoc.ref);
                console.log(`User with uid ${uid} deleted successfully.`);
            } else {
                console.log(`No user found with uid ${uid}.`);
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleDeleteCurrentUser = async () => {
        try {
            await deleteUser(getCurrentUser)
            await deleteSingleUserByUid(getCurrentUser.uid)
            await deleteDocumentsForUserId(getCurrentUser.uid)
            navigate('/')
        } catch {
            alert('Please re-login and try again. To delete a user, the user must have signed in recently.')
        }
    }

    const fetchData = async (userId = null) => {
        let q = query(collection(db, "shared"));
        if (userId && userId !== "All Users") {
            q = query(collection(db, "shared"), where("userId", "==", userId));
        }
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => ({
            docId: doc.id,
            ...doc.data(),
        }));


        setAllUsersData(data);
    };


    const handleLike = async (docId) => {
        const docRef = doc(db, "shared", docId);

        try {
            const docSnapshot = await getDoc(docRef);
            const postData = docSnapshot.data();

            if (postData.peopleWhoLiked && postData.peopleWhoLiked.includes(getCurrentUser.uid)) {
                await updateDoc(docRef, {
                    likes: increment(-1),
                    peopleWhoLiked: postData.peopleWhoLiked.filter(uid => uid !== getCurrentUser.uid)
                });
            } else {
                await updateDoc(docRef, {
                    likes: increment(1),
                    peopleWhoLiked: [...(postData.peopleWhoLiked || []), getCurrentUser.uid]
                });
            }

            await fetchData(selectedUser);
        } catch (error) {
            console.error("Error updating likes: ", error);
        }
    };

    const handleUserSelect = async (user, userId) => {
        setSelectedUser(user);
        await fetchData(userId);
    };

    if (!getCurrentUser && allUsersData.length === 0) {
        return <div className={styles.loginMessage}>You need to log in</div>;
    }

    console.log(allUsersData, 'filteredData')

    return (
        <div className={styles.container} style={{ minHeight: '180px' }}>
            <div className={styles.container} style={{ minWidth: '300px' }}>
                <div className={styles.dropdownContainer}>
                    <ul className={styles.dropdownList}>
                        <li
                            className={`${styles.dropdownItem} ${selectedUser === "All Users" ? styles.activeDropdownItem : ""}`}
                            onClick={() => handleUserSelect("All Users")}
                        >
                            <span className={styles.userName}>All Publications</span>
                        </li>
                        <li
                            className={`${styles.dropdownItem} ${selectedUser === "My Profile" ? styles.activeDropdownItem : ""}`}
                            onClick={() => handleUserSelect("My Profile", getCurrentUser.uid)}
                        >
                            <span className={styles.userName}>My Profile</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div className={styles.leftBlock}>
                {allUsersData.length > 0 ? <div className={styles.searchContainer}>
                    <input
                        type="text"
                        placeholder="Search by tags..."
                        value={searchQuery}
                        onChange={handleSearchInputChange}
                        className={styles.searchInput}
                        style={{
                            maxWidth: '600px',
                            height: '60px',
                            borderRadius: '6px'
                        }}
                    />
                </div> : selectedUser === "All Users" ?
                    <span className={styles.addSomePublication}>Please, add some publications</span> : null}

                <div style={{
                    width: '100%',
                    display: 'flex',
                    gap: '40px',
                    margin: selectedUser === "My Profile" ? "24px" : '0px'
                }}>
                    {selectedUser === 'My Profile' && getCurrentUser ?
                        <div style={{ display: 'flex', alignItems: 'center', padding: '16px 0', gap: '6px' }}>
                            <img
                                src={getCurrentUser.photoURL}
                                alt={getCurrentUser.displayName}
                                className={styles.userImage}
                                style={{
                                    width: '75px',
                                    height: '75px',
                                }}
                            />
                            <div className={styles.userName}
                                style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}
                            >
                                <div style={{ fontSize: '32px' }}>
                                    {getCurrentUser.displayName}
                                </div>
                                <div style={{ fontSize: '14px' }}>
                                    All
                                    likes: {allUsersData ? allUsersData.reduce((a, b) => a + b.likes, 0) : null}</div>
                            </div>
                        </div> : null}
                    {selectedUser === 'My Profile' ?
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            gap: '12px',
                        }}>
                            <button onClick={handleDeleteCurrentUser}
                                style={{
                                    padding: '12px 14px',
                                    borderRadius: '6px',
                                    border: 'none',
                                    background: 'indianred',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    textTransform: 'uppercase',
                                    cursor: 'pointer'
                                }}>
                                Delete Profile
                            </button>
                            {filteredData.length > 0 ?
                                <button onClick={() => deleteDocumentsForUserId(getCurrentUser.uid)}
                                    style={{
                                        padding: '12px 14px',
                                        borderRadius: '6px',
                                        border: 'none',
                                        background: 'indianred',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        textTransform: 'uppercase',
                                        cursor: 'pointer'
                                    }}>Delete All
                                    Publications
                                </button> : null}
                        </div> : null}
                </div>

                {selectedUser === "My Profile" && allUsersData.length === 0 ? <div className={styles.addSomePublication}
                    style={{
                        width: '100%',
                        justifyContent: 'flex-start'
                    }}>Please, add
                    some
                    publications
                </div> : null}

                {allUsersData.length > 0 ? <div
                    className={`${styles.cardsList} ${selectedUser === 'All Users' ? styles.cardsListAllUsers : styles.cardsListMyProfile}`}>
                    {filteredData.map((data) => (
                        <div key={data.docId} className={styles.card}>
                            {selectedUser === "All Users" ? <div className={styles.userInfo}>
                                <img
                                    src={data.userProfileImage}
                                    alt={data.userName}
                                    className={styles.userImage}
                                />
                                <p className={styles.userName}>{data.userName}</p>
                            </div> : null}
                            <img
                                src={data.imageUrl}
                                alt="Shared content"
                                className={styles.image}
                            />
                            {selectedUser === "All Users" ?
                                <div className={styles.likeSection}>
                                    <div onClick={() => handleLike(data.docId)}>
                                        <svg xmlns="http://www.w3.org/2000/svg"
                                            xmlns:xlink="http://www.w3.org/1999/xlink"
                                            version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 -40 112.88 170.41"
                                            style={{
                                                fill: data.peopleWhoLiked.includes(getCurrentUser.uid) ? 'red' : 'none',
                                                width: '35px',
                                                height: '35px',
                                                cursor: 'pointer'
                                            }} xml:space="preserve">
                                            <g><path style={{
                                                stroke: 'black',
                                                strokeWidth: data.peopleWhoLiked.includes(getCurrentUser.uid) ? '0px' : '6px'
                                            }} d="M60.83,17.19C68.84,8.84,74.45,1.62,86.79,0.21c23.17-2.66,44.48,21.06,32.78,44.41 c-3.33,6.65-10.11,14.56-17.61,22.32c-8.23,8.52-17.34,16.87-23.72,23.2l-17.4,17.26L46.46,93.56C29.16,76.9,0.95,55.93,0.02,29.95 C-0.63,11.75,13.73,0.09,30.25,0.3C45.01,0.5,51.22,7.84,60.83,17.19L60.83,17.19L60.83,17.19z" /></g></svg>
                                    </div>
                                    <span
                                        style={{ fontWeight: 'bold', fontSize: '16px' }}
                                        className={styles.likeCount}>
                                        {data.likes || 0} Likes
                                    </span>
                                </div> : null}
                            {selectedUser === "My Profile" && user && user.uid === data.userId && (
                                <button
                                    onClick={() => handleDelete(data.docId, user.uid)}
                                    className={styles.deleteButton}
                                >
                                    Delete
                                </button>
                            )}
                        </div>
                    ))}
                </div> : null}
            </div>
        </div>
    );
};

export default Feed;
