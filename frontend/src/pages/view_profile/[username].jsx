import React, { useEffect, useState } from "react";
import { BASE_URL, clientServer } from "@/config";
import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout";
import styles from "./index.module.css";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { getAllPosts } from "@/config/redux/action/postAction";
import { sendConnectionRequest, getMyConnectionRequests, getMyReceivedConnectionRequests } from "@/config/redux/action/authAction";

export default function ViewProfilePage({ userProfile }) {

    const router = useRouter();
    const postReducer = useSelector((state) => state.postReducer);
    const authState = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [userPosts, setUserPosts] = useState([]);

    const [connectionState, setConnectionState] = useState("Connect");

    const getUserPosts = async () => {
        await dispatch(getAllPosts());
        await dispatch(getMyConnectionRequests());
        await dispatch(getMyReceivedConnectionRequests());
    }

    useEffect(() => {
        let post = (postReducer.posts || []).filter((post) => {
            return post.userId && post.userId.username === router.query.username
        })
        setUserPosts(post);
    }, [postReducer.posts, router.query.username])

    useEffect(() => {
        if (userProfile && userProfile.userId && authState.user && authState.user.userId) {
            if (userProfile.userId.username === authState.user.userId.username) {
                setConnectionState("Self");
                return;
            }

            const sentRequest = authState.connection?.find(req => req.connectionId && req.connectionId._id === userProfile.userId._id);
            const receivedRequest = authState.connectionRequest?.find(req => req.userId && req.userId._id === userProfile.userId._id);

            if (sentRequest) {
                if (sentRequest.status_accepted === true) setConnectionState("Connected");
                else if (sentRequest.status_accepted === null) setConnectionState("Request Sent");
                else setConnectionState("Connect");
            } else if (receivedRequest) {
                if (receivedRequest.status_accepted === true) setConnectionState("Connected");
                else if (receivedRequest.status_accepted === null) setConnectionState("Accept/Reject");
                else setConnectionState("Connect");
            } else {
                setConnectionState("Connect");
            }
        }
    }, [authState.connection, authState.connectionRequest, userProfile, authState.user]);

    useEffect(() => {
        getUserPosts();
    }, [])

    if (!userProfile || !userProfile.userId) return null;

    const profilePicUrl = userProfile.userId?.profilePicture ? `${BASE_URL}/${userProfile.userId.profilePicture}` : "https://cdn-icons-png.flaticon.com/512/149/149071.png";
    const coverPicUrl = userProfile.userId?.coverPicture ? `${BASE_URL}/${userProfile.userId.coverPicture}` : "";

    return (
        <UserLayout>
            <DashboardLayout>
                <div className={styles.container}>
                    <div className={styles.backDropContianer} style={coverPicUrl ? { backgroundImage: `url(${coverPicUrl})`, backgroundSize: "cover", backgroundPosition: "center" } : {}}>
                        <div className={styles.backDrop}>
                            <img src={profilePicUrl} alt="profile" />
                        </div>
                    </div>

                    <div className={styles.profileContainer_details}>
                        <div className={styles.profileHeaderFlex}>
                            <div>
                                <h1 className={styles.profileName}>{userProfile.userId?.name}</h1>
                                <p className={styles.profileUsername}>@{userProfile.userId?.username}</p>
                                
                                {userProfile.bio && <p className={styles.profileBio}>{userProfile.bio}</p>}
                                
                                <div className={styles.profileMeta}>
                                    {userProfile.location && (
                                        <span className={styles.metaItem}>📍 {userProfile.location}</span>
                                    )}
                                    <span className={styles.metaItem} style={{ color: "#0A66C2", fontWeight: "600" }}>
                                        👥 {userProfile.connectionsCount || 0} Connections
                                    </span>
                                </div>

                                <div className={styles.socialLinks}>
                                    {userProfile.portfolio && <a href={userProfile.portfolio} target="_blank" rel="noreferrer" className={styles.linkBadge}>🌐 Portfolio</a>}
                                    {userProfile.github && <a href={userProfile.github} target="_blank" rel="noreferrer" className={styles.linkBadge}>🐙 GitHub</a>}
                                    {userProfile.linkedin && <a href={userProfile.linkedin} target="_blank" rel="noreferrer" className={styles.linkBadge}>💼 LinkedIn</a>}
                                </div>
                            </div>
                            
                            <div className={styles.actionButtonsTop}>
                                {connectionState === "Self" ? null : 
                                    connectionState === "Connected" ? (
                                        <button className={styles.connectedButton}>Connected</button>
                                    ) : connectionState === "Request Sent" ? (
                                        <button className={styles.connectedButton}>Request Sent</button>
                                    ) : connectionState === "Accept/Reject" ? (
                                        <button onClick={() => router.push('/my_connection')} className={styles.connectBtn}>Accept Request</button>
                                    ) : (
                                        <button onClick={async () => {
                                            await dispatch(sendConnectionRequest({ token: localStorage.getItem('token'), connectionId: userProfile.userId._id }));
                                            dispatch(getMyConnectionRequests());
                                        }} className={styles.connectBtn}>
                                            Connect
                                        </button>
                                    )
                                }
                                <div onClick={async () => {
                                    const response = await clientServer.get(`/user/download_resume?id=${userProfile.userId._id}`);
                                    window.open(`${BASE_URL}/${response.data.message}`, "_blank");
                                }} style={{ cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: "0.7rem", border: "1px solid var(--border-light)", borderRadius: "50%", color: "var(--text-secondary)" }}>
                                    <svg style={{ width: "1.4em" }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {userProfile.skills && userProfile.skills.length > 0 && (
                            <div className={styles.sectionBlock}>
                                <h3 className={styles.sectionHeading}>Skills</h3>
                                <div className={styles.skillsContainer}>
                                    {userProfile.skills.map((skill, index) => (
                                        <span key={index} className={styles.skillBadge}>{skill}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {userProfile.pastWork && userProfile.pastWork.length > 0 && (
                            <div className={styles.sectionBlock}>
                                <h3 className={styles.sectionHeading}>Experience</h3>
                                <div className={styles.experienceList}>
                                    {userProfile.pastWork.map((work, index) => (
                                        <div key={index} className={styles.experienceItem}>
                                            <div className={styles.expIcon}>💼</div>
                                            <div className={styles.expDetails}>
                                                <h4>{work.position}</h4>
                                                <p className={styles.expCompany}>{work.company}</p>
                                                <p className={styles.expYears}>{work.years}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {userProfile.education && userProfile.education.length > 0 && (
                            <div className={styles.sectionBlock}>
                                <h3 className={styles.sectionHeading}>Education</h3>
                                <div className={styles.experienceList}>
                                    {userProfile.education.map((edu, index) => (
                                        <div key={index} className={styles.experienceItem}>
                                            <div className={styles.expIcon}>🎓</div>
                                            <div className={styles.expDetails}>
                                                <h4>{edu.school}</h4>
                                                <p className={styles.expCompany}>{edu.degree} {edu.fieldOfStudy && `- ${edu.fieldOfStudy}`}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {userPosts && userPosts.length > 0 && (
                            <div className={styles.sectionBlock}>
                                <h3 className={styles.sectionHeading}>Recent Activity</h3>
                                <div className={styles.recentActivityGrid}>
                                    {userPosts.slice(0, 4).map((post) => (
                                        <div key={post._id} className={styles.activityCard}>
                                            {post.media ? (
                                                <div className={styles.activityImg} style={{ backgroundImage: `url(${BASE_URL}/${post.media})` }}></div>
                                            ) : (
                                                <div className={styles.activityTextOnly}>{post.body.substring(0, 60)}...</div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </DashboardLayout>
        </UserLayout>
    )
}

export async function getServerSideProps(context) {
    try {
        const request = await clientServer.get("/user/get_profile_based_on_username", {
            params: {
                username: context.query.username
            }
        });

        return {
            props: {
                userProfile: request.data.profile
            },
        };
    } catch (error) {
        return {
            notFound: true,
        };
    }
}