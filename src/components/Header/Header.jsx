import React, {useEffect, useState} from "react";
import SwitchComponent from "../Switch/SwitchComponent";
import "./Header.css";
import logo from "../../assets/icons/logo.svg";
import {signInWithGoogle} from "../../firebase/handlers/auth";
import {onAuthStateChanged} from "firebase/auth";
import {auth} from "../../firebase/firebase";
import {signOut} from "firebase/auth";
import {useNavigate} from "react-router-dom";


const Header = () => {
    const navigate = useNavigate()
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
        });

        return unsubscribe;
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/')
            setUser(null);
        } catch (error) {
            console.error("Error signing out: ", error);
        }
    };

    return (
        <div>
            <header className="header">
                <div className="logo">
                    <img
                        src={logo}
                        alt="logo"
                        style={{width: "3rem", height: "3rem"}}
                    />
                </div>
                <div className="projectName">
                    <h1>ChatForFun</h1>
                </div>
                {user ? (
                    <div style={{display: 'flex', gap: '12px', margin: '0 24px', alignItems: 'center'}}>
                        <div style={{
                            fontWeight: 'bold',
                            color: 'white',
                            letterSpacing: '1.2px',
                            textTransform: 'uppercase'
                        }}>Welcome, {user.displayName}</div>
                        <button className="signOutBtn" onClick={handleLogout}
                                style={{padding: '12px', borderRadius: '6px', border: 'none', cursor: 'pointer'}}>
                            Logout
                        </button>
                    </div>
                ) : (
                    <div className="signIn" onClick={signInWithGoogle}>
                        <button className="signInBtn">
                            Sign In with
                            <span className="g">G</span>
                            <span className="o">o</span>
                            <span className="o2">o</span>
                            <span className="g2">g</span>
                            <span className="l">l</span>
                            <span className="e">e</span>
                        </button>
                    </div>
                )}
            </header>
            <SwitchComponent/>
        </div>
    );
};

export default Header;
