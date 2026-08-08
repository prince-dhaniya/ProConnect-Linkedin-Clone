import UserLayout from '@/layout/UserLayout'
import DashboardLayout from '@/layout/DashboardLayout'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { getAboutUser } from '@/config/redux/action/authAction'
import { clientServer } from '@/config'
import styles from './edit.module.css'

export default function EditProfile() {
    const router = useRouter();
    const dispatch = useDispatch();
    const authState = useSelector((state) => state.auth);

    const [userProfile, setUserProfile] = useState({
        name: "",
        username: "",
        bio: "",
        location: "",
        portfolio: "",
        github: "",
        linkedin: "",
        skills: "",
        pastWork: [],
        education: []
    });

    useEffect(() => {
        const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
        if (token && !authState.user) {
            dispatch(getAboutUser({ token }));
        }
    }, [dispatch, authState.user]);

    useEffect(() => {
        if (authState.user) {
            setUserProfile({
                name: authState.user.userId?.name || "",
                username: authState.user.userId?.username || "",
                bio: authState.user.bio || "",
                location: authState.user.location || "",
                portfolio: authState.user.portfolio || "",
                github: authState.user.github || "",
                linkedin: authState.user.linkedin || "",
                skills: (authState.user.skills || []).join(", "),
                pastWork: authState.user.pastWork || [],
                education: authState.user.education || []
            });
        }
    }, [authState.user]);

    const handleSave = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            
            await clientServer.post("/user_update", { 
                token, 
                name: userProfile.name,
                username: userProfile.username
            });

            
            await clientServer.post("/update_profile_data", {
                token,
                bio: userProfile.bio,
                location: userProfile.location,
                portfolio: userProfile.portfolio,
                github: userProfile.github,
                linkedin: userProfile.linkedin,
                skills: userProfile.skills.split(",").map(s => s.trim()).filter(s => s),
                pastWork: userProfile.pastWork,
                education: userProfile.education
            });

            await dispatch(getAboutUser({ token }));
            router.push("/profile");
        } catch (error) {
            console.error("Failed to update profile", error);
            alert("Failed to update profile");
        }
    };

    const handleWorkChange = (index, field, value) => {
        const newWork = [...userProfile.pastWork];
        newWork[index][field] = value;
        setUserProfile({...userProfile, pastWork: newWork});
    };

    const handleEduChange = (index, field, value) => {
        const newEdu = [...userProfile.education];
        newEdu[index][field] = value;
        setUserProfile({...userProfile, education: newEdu});
    };

    const addWork = () => setUserProfile({...userProfile, pastWork: [...userProfile.pastWork, { company: "", position: "", years: "" }]});
    const addEdu = () => setUserProfile({...userProfile, education: [...userProfile.education, { school: "", degree: "", fieldOfStudy: "" }]});

    const removeWork = (index) => setUserProfile({...userProfile, pastWork: userProfile.pastWork.filter((_, i) => i !== index)});
    const removeEdu = (index) => setUserProfile({...userProfile, education: userProfile.education.filter((_, i) => i !== index)});

    return (
        <UserLayout>
            <DashboardLayout>
                <div className={styles.container}>
                    <div className={styles.header}>
                        <h1>Edit Profile</h1>
                    </div>

                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Basic Info</h2>
                        <div className={styles.formGroup}>
                            <label>Full Name</label>
                            <input className={styles.input} type="text" value={userProfile.name} onChange={(e) => setUserProfile({...userProfile, name: e.target.value})} />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Username</label>
                            <input className={styles.input} type="text" value={userProfile.username} onChange={(e) => setUserProfile({...userProfile, username: e.target.value})} />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Bio / Headline</label>
                            <textarea className={styles.input} value={userProfile.bio} onChange={(e) => setUserProfile({...userProfile, bio: e.target.value})} />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Location</label>
                            <input className={styles.input} type="text" value={userProfile.location} onChange={(e) => setUserProfile({...userProfile, location: e.target.value})} placeholder="e.g. San Francisco, CA" />
                        </div>
                    </div>

                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Skills</h2>
                        <div className={styles.formGroup}>
                            <label>Add skills (comma separated)</label>
                            <input className={styles.input} type="text" value={userProfile.skills} onChange={(e) => setUserProfile({...userProfile, skills: e.target.value})} placeholder="React, Node.js, Design..." />
                        </div>
                    </div>

                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Links</h2>
                        <div className={styles.formGroup}>
                            <label>Portfolio / Website</label>
                            <input className={styles.input} type="text" value={userProfile.portfolio} onChange={(e) => setUserProfile({...userProfile, portfolio: e.target.value})} />
                        </div>
                        <div className={styles.formGroup}>
                            <label>GitHub URL</label>
                            <input className={styles.input} type="text" value={userProfile.github} onChange={(e) => setUserProfile({...userProfile, github: e.target.value})} />
                        </div>
                        <div className={styles.formGroup}>
                            <label>LinkedIn URL</label>
                            <input className={styles.input} type="text" value={userProfile.linkedin} onChange={(e) => setUserProfile({...userProfile, linkedin: e.target.value})} />
                        </div>
                    </div>

                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Experience</h2>
                        {userProfile.pastWork.map((work, idx) => (
                            <div key={idx} className={styles.arrayItem}>
                                <button className={styles.removeBtn} onClick={() => removeWork(idx)}>Remove</button>
                                <div className={styles.formGroup}>
                                    <label>Company</label>
                                    <input className={styles.input} type="text" value={work.company} onChange={(e) => handleWorkChange(idx, "company", e.target.value)} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Position</label>
                                    <input className={styles.input} type="text" value={work.position} onChange={(e) => handleWorkChange(idx, "position", e.target.value)} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Years</label>
                                    <input className={styles.input} type="text" value={work.years} onChange={(e) => handleWorkChange(idx, "years", e.target.value)} />
                                </div>
                            </div>
                        ))}
                        <button className={styles.addBtn} onClick={addWork}>+ Add Experience</button>
                    </div>

                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Education</h2>
                        {userProfile.education.map((edu, idx) => (
                            <div key={idx} className={styles.arrayItem}>
                                <button className={styles.removeBtn} onClick={() => removeEdu(idx)}>Remove</button>
                                <div className={styles.formGroup}>
                                    <label>School / University</label>
                                    <input className={styles.input} type="text" value={edu.school} onChange={(e) => handleEduChange(idx, "school", e.target.value)} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Degree</label>
                                    <input className={styles.input} type="text" value={edu.degree} onChange={(e) => handleEduChange(idx, "degree", e.target.value)} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Field of Study</label>
                                    <input className={styles.input} type="text" value={edu.fieldOfStudy} onChange={(e) => handleEduChange(idx, "fieldOfStudy", e.target.value)} />
                                </div>
                            </div>
                        ))}
                        <button className={styles.addBtn} onClick={addEdu}>+ Add Education</button>
                    </div>

                    <div className={styles.actions}>
                        <button className={styles.cancelBtn} onClick={() => router.push("/profile")}>Cancel</button>
                        <button className={styles.saveBtn} onClick={handleSave}>Save Changes</button>
                    </div>
                </div>
            </DashboardLayout>
        </UserLayout>
    )
}
