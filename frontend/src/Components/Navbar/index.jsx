import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import styles from "./styles.module.css"

export default function NavbarComponent() {
    const router = useRouter();
    const authState = useSelector((state) => state.auth);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const isLoggedIn = isMounted && (authState.loggedIn || (typeof window !== 'undefined' && Boolean(localStorage.getItem("token"))));

    return (
        <header className={styles.container}>
            <div className={styles.navbar}>
                <div className={styles.logoContainer} onClick={() => router.push(isLoggedIn ? "/dashboard" : "/login")}>
                    <div className={styles.logoBadge}>in</div>
                    <span className={styles.brandTitle}>ProConnect</span>
                </div>

                <div className={styles.navbarOptionContainer}>
                    {isLoggedIn ? (
                        <div 
                            onClick={() => router.push("/profile")}
                            className={styles.profileBadge}
                            title="View My Profile"
                        >
                            <img 
                                src={authState.user?.userId?.profilePicture ? `http://localhost:9090/${authState.user.userId.profilePicture}` : "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                                alt="Profile" 
                                className={styles.profileAvatar}
                            />
                            <span className={styles.profileName}>{authState.user?.userId?.name || "Profile"}</span>
                        </div>
                    ) : (
                        <div onClick={() => router.push("/login")} className={styles.buttonJoin}>
                            <span>Sign In</span>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}
