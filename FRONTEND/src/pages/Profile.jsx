import React, { useEffect, useState } from 'react';
import Title from "../components/Title.jsx";
import '../style/Profile.css';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            fetchProfile(parsedUser.maKH); // Assuming user has a property maKH as id
        }
    }, []);

    const fetchProfile = async (id) => {
        try {
            const response = await fetch(`http://localhost:8080/api/khachhang/${id}`);
            if (response.ok) {
                const data = await response.json();
                setProfile(data);
                setFormData(data); // Initialize form data with fetched profile
            } else {
                console.error("Cannot fetch user information");
            }
        } catch (error) {
            console.error("Error calling API:", error);
        }
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleUpdate = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/khachhang/${profile.maKH}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                const updatedProfile = await response.json();
                setProfile(updatedProfile);
                setIsEditing(false); // Exit editing mode
            } else {
                console.error("Failed to update profile");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    return (
        <div className='orders-container'>
            <div className='orders-title-wrapper'>
                <Title text1={'MY'} text2={' PROFILE'} />
            </div>

            {profile ? (
                <div className='profile-details'>
                    {isEditing ? (
                        <div className="profile-edit-form">
                            <p><strong>Họ tên:</strong></p>
                            <input
                                type="text"
                                name="hoTen"
                                value={formData.hoTen}
                                onChange={handleChange}
                                placeholder="Họ tên"
                            />

                            <p><strong>Email:</strong></p>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email"
                            />

                            <p><strong>SĐT:</strong></p>
                            <input
                                type="text"
                                name="soDienThoai"
                                value={formData.soDienThoai}
                                onChange={handleChange}
                                placeholder="Số điện thoại"
                            />

                            <button onClick={handleUpdate}>Lưu</button>
                        </div>
                    ) : (
                        <div>
                            <p><strong>Họ tên:</strong> {profile.hoTen}</p>
                            <p><strong>Email:</strong> {profile.email}</p>
                            <p><strong>SĐT:</strong> {profile.soDienThoai}</p>
                            <button onClick={handleEditClick}>Cập nhật thông tin</button>
                        </div>
                    )}
                </div>
            ) : (
                <p>Đang tải thông tin hồ sơ...</p>
            )}
        </div>
    );
};

export default Profile;