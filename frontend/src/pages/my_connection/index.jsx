import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout";
import styles from "./index.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getMyConnectionRequests, getMyReceivedConnectionRequests, acceptConnectionRequest } from "@/config/redux/action/authAction";
import { useRouter } from "next/router";
import { BASE_URL } from "@/config";

export default function MyConnection() {
    const dispatch = useDispatch();
    const authState = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(getMyConnectionRequests());
        dispatch(getMyReceivedConnectionRequests());
    }, []);

    const router = useRouter();

    return (
        <UserLayout>
            <DashboardLayout>
                <div className={styles.container}>
                    <h3 className={styles.title}>Pending Connection Requests</h3>
                    {authState.connectionRequest.length === 0 && <p style={{ color: "#666" }}>No pending connection requests</p>}

                    {authState.connectionRequest.length !== 0 && authState.connectionRequest.filter((connection) => connection.status_accepted === null).map((user, index) => {
                        if (!user.userId) return null;
                        return (
                            <div onClick={() => {
                                router.push(`/view_profile/${user.userId.username}`);
                            }} className={styles.userCard} key={index}>
                                <div className={styles.profilePicture}>
                                    <img src={`${BASE_URL}/${user.userId.profilePicture}`} alt="" />
                                </div>
                                <div className={styles.userInfo}>
                                    <h3>{user.userId.name}</h3>
                                    <p>@{user.userId.username}</p>
                                </div>
                                    <div style={{ display: "flex", gap: "0.5rem" }}>
                                        <button onClick={async (e) => {
                                            e.stopPropagation();
                                            await dispatch(acceptConnectionRequest({
                                                token: localStorage.getItem("token"),
                                                connectionId: user._id,
                                                action: "accept"
                                            }));
                                            dispatch(getMyConnectionRequests());
                                            dispatch(getMyReceivedConnectionRequests());
                                        }} style={{ padding: "0.4rem 1rem", background: "#0a66c2", color: "#fff", border: "none", borderRadius: "20px", cursor: "pointer", fontWeight: 600 }}>Accept</button>
                                        <button onClick={async (e) => {
                                            e.stopPropagation();
                                            await dispatch(acceptConnectionRequest({
                                                token: localStorage.getItem("token"),
                                                connectionId: user._id,
                                                action: "reject"
                                            }));
                                            dispatch(getMyConnectionRequests());
                                            dispatch(getMyReceivedConnectionRequests());
                                        }} style={{ padding: "0.4rem 1rem", background: "transparent", color: "#666", border: "1px solid #ccc", borderRadius: "20px", cursor: "pointer", fontWeight: 600 }}>Decline</button>
                                    </div>
                            </div>
                        )
                    })}

                    <h3 className={styles.title} style={{ marginTop: "1rem" }}>My Network</h3>
                    
                    {authState.connectionRequest.filter((connection) => connection.status_accepted === true).map((user, index) => {
                        if (!user.userId) return null;
                        return (
                            <div onClick={() => {
                                router.push(`/view_profile/${user.userId.username}`);
                            }} className={styles.userCard} key={`recv-${index}`}>
                                <div className={styles.profilePicture}>
                                    <img src={`${BASE_URL}/${user.userId.profilePicture}`} alt="" />
                                </div>
                                <div className={styles.userInfo}>
                                    <h3>{user.userId.name}</h3>
                                    <p>@{user.userId.username}</p>
                                </div>
                                <button onClick={async (e) => {
                                    e.stopPropagation();
                                    await dispatch(acceptConnectionRequest({
                                        token: localStorage.getItem("token"),
                                        connectionId: user._id,
                                        action: "remove"
                                    }));
                                    dispatch(getMyConnectionRequests());
                                    dispatch(getMyReceivedConnectionRequests());
                                }} style={{ padding: "0.4rem 1rem", background: "transparent", color: "#ef4444", border: "1px solid #ef4444", borderRadius: "20px", cursor: "pointer", fontWeight: 600 }}>Remove</button>
                            </div>
                        )
                    })}
                    
                    
                    {authState.connection.filter((connection) => connection.status_accepted === true).map((user, index) => {
                        if (!user.connectionId) return null;
                        return (
                            <div onClick={() => {
                                router.push(`/view_profile/${user.connectionId.username}`);
                            }} className={styles.userCard} key={`sent-${index}`}>
                                <div className={styles.profilePicture}>
                                    <img src={`${BASE_URL}/${user.connectionId.profilePicture}`} alt="" />
                                </div>
                                <div className={styles.userInfo}>
                                    <h3>{user.connectionId.name}</h3>
                                    <p>@{user.connectionId.username}</p>
                                </div>
                                <button onClick={async (e) => {
                                    e.stopPropagation();
                                    await dispatch(acceptConnectionRequest({
                                        token: localStorage.getItem("token"),
                                        connectionId: user._id,
                                        action: "remove"
                                    }));
                                    dispatch(getMyConnectionRequests());
                                    dispatch(getMyReceivedConnectionRequests());
                                }} style={{ padding: "0.4rem 1rem", background: "transparent", color: "#ef4444", border: "1px solid #ef4444", borderRadius: "20px", cursor: "pointer", fontWeight: 600 }}>Remove</button>
                            </div>
                        )
                    })}
                </div>
            </DashboardLayout>
        </UserLayout>
    )
}