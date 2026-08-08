import { getAboutUser } from "@/config/redux/action/authAction";
import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout";
import React, { useEffect, useState } from "react";
import styles from './index.module.css';
import { BASE_URL, clientServer } from "@/config";
import { getAllPosts } from "@/config/redux/action/postAction";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { reset } from "@/config/redux/reducer/authReducer";

export default function ProfilePage() {

    const authState = useSelector((state) => state.auth);
    const postReducer = useSelector((state) => state.postReducer);
    const router = useRouter();
    const dispatch = useDispatch();

    const [userProfile, setUserProfile] = useState({});
    const [userPosts, setUserPosts] = useState([]);

    useEffect(() => {
        dispatch(getAboutUser({ token: localStorage.getItem("token") }))
        dispatch(getAllPosts())
    }, [dispatch])

    useEffect(() => {
        if (authState.user && authState.user.userId) {
            setUserProfile(authState.user)
            let post = (postReducer.posts || []).filter((post) => {
                return post.userId && post.userId.username === authState.user.userId?.username;
            })
            setUserPosts(post);
        }
    }, [authState.user, postReducer.posts])

    const updateProfilePicture = async (file) => {
        const formData = new FormData();
        formData.append("profilePicture", file);
        formData.append("token", localStorage.getItem("token"));
        await clientServer.post("/update_profile_picture", formData, {
            headers: { 'content-Type': 'multipart/form-data' }
        });
        dispatch(getAboutUser({ token: localStorage.getItem("token") }));
    }

    const updateCoverPicture = async (file) => {
        const formData = new FormData();
        formData.append("coverPicture", file);
        formData.append("token", localStorage.getItem("token"));
        await clientServer.post("/update_cover_picture", formData, {
            headers: { 'content-Type': 'multipart/form-data' }
        });
        dispatch(getAboutUser({ token: localStorage.getItem("token") }));
    }

    if (!authState.user || !userProfile.userId) return null;

    const profilePicUrl = userProfile.userId?.profilePicture ? `${BASE_URL}/${userProfile.userId.profilePicture}` : "https://cdn-icons-png.flaticon.com/512/149/149071.png";
    const coverPicUrl = userProfile.userId?.coverPicture ? `${BASE_URL}/${userProfile.userId.coverPicture}` : "";

    return (
        <UserLayout>
            <DashboardLayout>
                <div className={styles.container}>
                    <div className={styles.backDropContianer} style={coverPicUrl ? { backgroundImage: `url(${coverPicUrl})`, backgroundSize: "cover", backgroundPosition: "center" } : {}}>
                        <label htmlFor="coverPictureUpload" className={styles.coverEditBtn}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z" />
                            </svg>
                            Edit Cover
                        </label>
                        <input onChange={(e) => updateCoverPicture(e.target.files[0])} hidden type="file" id="coverPictureUpload" accept="image/*" />
                        
                        <div className={styles.backDrop}>
                            <img src={profilePicUrl} alt="profile" />
                            <label htmlFor="profilePictureUpload" className={styles.backDrop_overlay}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{width: '24px', height: '24px'}}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z" />
                                </svg>
                            </label>
                            <input onChange={(e) => updateProfilePicture(e.target.files[0])} hidden type="file" id="profilePictureUpload" accept="image/*" />
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
                                <button onClick={() => router.push("/profile/edit")} className={styles.editProfileBtn}>
                                    Edit Profile
                                </button>
                                <button onClick={() => {
                                    localStorage.removeItem("token");
                                    dispatch(reset());
                                    router.push("/login");
                                }} className={styles.signOutBtnOutline}>
                                    Sign Out
                                </button>
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