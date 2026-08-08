import React, { useEffect } from "react";
import UserLayout from "@/layout/UserLayout";
import DashboardLayout from "@/layout/DashboardLayout";
import styles from "./index.module.css";
import { useDispatch, useSelector } from "react-redux";
import { getAllUser, sendConnectionRequest } from "@/config/redux/action/authAction";
import { BASE_URL } from "@/config";
import { useRouter } from "next/router";

export default function DiscoverPage() {
    const dispatch = useDispatch();
    const authState = useSelector((state) => state.auth);
    const router = useRouter();

    useEffect(() => {
        if (!authState.all_profiles_fetched) {
            dispatch(getAllUser());
        }
    }, []);

    return (
        <UserLayout>
            <DashboardLayout>
                <div className={styles.container}>
                    <h3 className={styles.title}>Discover People</h3>
                    <div className={styles.userGrid}>
                        {authState.all_users && authState.all_users.map((profile, index) => {
                            if (!profile.userId) return null;
                            return (
                                <div key={index} onClick={() => {
                                    router.push(`/view_profile/${profile.userId?.username}`);
                                }} className={styles.userCard}>
                                    <img
                                        src={profile.userId?.profilePicture ? `${BASE_URL}/${profile.userId.profilePicture}` : "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                                        alt=""
                                        className={styles.avatar}
                                    />
                                    <div>
                                        <p className={styles.userName}>{profile.userId?.name}</p>
                                        <p className={styles.userHandle}>@{profile.userId?.username}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </DashboardLayout>
        </UserLayout>
    )
}
