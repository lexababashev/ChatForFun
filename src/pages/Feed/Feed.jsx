import React, {useEffect, useState} from "react";
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
    increment
} from "firebase/firestore";
import {db} from "../../firebase/firebase";
import {getAuth, onAuthStateChanged, deleteUser} from "firebase/auth";
import {useNavigate} from "react-router-dom";
import {ref, deleteObject, getStorage, list} from "firebase/storage";


const Feed = () => {
    const [allUsersData, setAllUsersData] = useState([]);
    const [userNames, setUserNames] = useState([]);
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
            // Check if any tag includes the search query
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
                fetchUserNames();
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

            // Delete each document
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

            // Check if the current user already liked the post
            if (postData.peopleWhoLiked && postData.peopleWhoLiked.includes(getCurrentUser.uid)) {
                // If user already liked, remove like
                await updateDoc(docRef, {
                    likes: increment(-1),
                    peopleWhoLiked: postData.peopleWhoLiked.filter(uid => uid !== getCurrentUser.uid)
                });
            } else {
                // If user hasn't liked, add like
                await updateDoc(docRef, {
                    likes: increment(1),
                    peopleWhoLiked: [...(postData.peopleWhoLiked || []), getCurrentUser.uid]
                });
            }

            // Fetch data again after updating likes
            fetchData(selectedUser);
        } catch (error) {
            console.error("Error updating likes: ", error);
        }
    };

    const fetchUserNames = async () => {
        const sharedCollectionRef = collection(db, "shared");
        const querySnapshot = await getDocs(sharedCollectionRef);
        const users = new Set(); // Using Set to ensure uniqueness
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            users.add({
                userId: data.userId,
                userName: data.userName,
                userProfileImage: data.userProfileImage,
            });
        });
        setUserNames(Array.from(users));
    };


    const handleUserFilterChange = (e) => {
        setSelectedUser(e.target.value);
        fetchData(e.target.value);
    };

    const handleUserSelect = (user, userId) => {
        setSelectedUser(user);
        fetchData(userId);
    };

    const uniqueUserNames = Array.from(
        new Set(userNames.map((user) => user.userId))
    ).map((userId) => {
        // Find the first user object with this unique userName
        const user = userNames.find((user) => user.userId === userId);

        return user;
    }).filter(u => user ? u.userId === user.uid : false)

    if (!getCurrentUser && allUsersData.length === 0) {
        return <div className={styles.loginMessage}>You need to log in</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.container}>
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
                    />
                </div> : <div className={styles.leftBlock} style={{height: '60vh'}}>Please, add some publications</div>}

                {selectedUser === 'My Profile' ?
                    <div style={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        gap: '12px'
                    }}>
                        <button onClick={handleDeleteCurrentUser}
                                style={{
                                    padding: '16px 12px',
                                    borderRadius: '6px',
                                    border: 'none',
                                    background: 'indianred',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    textTransform: 'uppercase',
                                    cursor: 'pointer'
                                }}>Delete
                            Profile
                        </button>
                        {filteredData.length > 0 ? <button onClick={() => deleteDocumentsForUserId(getCurrentUser.uid)}
                                                           style={{
                                                               padding: '16px 12px',
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

                {allUsersData.length > 0 ? <div
                    className={`${styles.cardsList} ${selectedUser === 'All Users' ? styles.cardsListAllUsers : styles.cardsListMyProfile}`}>
                    {filteredData.map((data) => (
                        <div key={data.docId} className={styles.card}>
                            <div className={styles.userInfo}>
                                <img
                                    src={data.userProfileImage}
                                    alt={data.userName}
                                    className={styles.userImage}
                                />
                                <p className={styles.userName}>{data.userName}</p>
                            </div>
                            <img
                                src={data.imageUrl}
                                alt="Shared content"
                                className={styles.image}
                            />
                            {selectedUser === "All Users" ? <div className={styles.likeSection}>
                                <button onClick={() => handleLike(data.docId)}>
                                    <span className={styles.likeIcon}>👍</span> Like
                                </button>
                                <span className={styles.likeCount}>{data.likes || 0}</span>
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
