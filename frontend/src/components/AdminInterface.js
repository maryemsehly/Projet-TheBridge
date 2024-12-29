import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Styles/AdminInterface.css'; 
import { motion } from 'framer-motion'; 

const AdminInterface = () => {
    const [items, setItems] = useState([]);
    const [newItem, setNewItem] = useState({ name: '', description: '', price: 0, pic: '' });
    const [updatedItem, setUpdatedItem] = useState({ name: '', description: '', price: 0, pic: '' });
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [itemToUpdate, setItemToUpdate] = useState(null);
    const navigate = useNavigate();
    const API_URL = 'http://localhost:5000/api/items';

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/login');
            return;
        }
        fetchItems(token); 
    }, [navigate]);

    const fetchItems = async (token) => {
        try {
            const response = await axios.get(API_URL, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (Array.isArray(response.data)) {
                setItems(response.data);
            } else {
                setItems([]);
            }
        } catch (error) {
            console.error('Error fetching items:', error);
            setItems([]);
        } finally {
            setLoading(false);
        }
    };

    // Creation des courses 
    const handleCreate = async () => {
        const formData = new FormData();
        formData.append('name', newItem.name);
        formData.append('description', newItem.description);
        formData.append('price', newItem.price);
        if (newItem.pic) formData.append('pic', newItem.pic);

        const token = localStorage.getItem('adminToken');
        await axios.post('http://localhost:5000/api/items', formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        });

        setNewItem({ name: '', description: '', price: 0, pic: '' });
        setImagePreview(null);
        fetchItems();
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setNewItem({ ...newItem, pic: file });
        setImagePreview(URL.createObjectURL(file)); 
    };

    // Update courses
    const handleUpdateClick = (item) => {
        setItemToUpdate(item);
        setUpdatedItem({
            name: item.name,
            description: item.description,
            price: item.price,
            pic: item.pic
        });
        setShowUpdateForm(true);
    };

    const handleUpdate = async () => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const updatedData = { ...updatedItem };
            if (updatedData.pic instanceof File) {
                const formData = new FormData();
                formData.append('name', updatedData.name);
                formData.append('description', updatedData.description);
                formData.append('price', updatedData.price);
                formData.append('pic', updatedData.pic);
                await axios.put(`${API_URL}/${itemToUpdate._id}`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });
            } else {
                await axios.put(`${API_URL}/${itemToUpdate._id}`, updatedData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            }

            fetchItems(token);
            setShowUpdateForm(false); 
            setShowConfirmation(false); 
        } catch (error) {
            console.error('Error updating item:', error);
        }
    };

    const handleCancelUpdate = () => {
        setUpdatedItem({
            name: itemToUpdate.name,
            description: itemToUpdate.description,
            price: itemToUpdate.price,
            pic: itemToUpdate.pic,
        });
        setShowUpdateForm(false); 
        setShowConfirmation(false); 
    };


    const handleDelete = async (id) => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            await axios.delete(`${API_URL}/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            fetchItems(token); 
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };
    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/login');
    };

    return (
        <motion.div
            className="admin-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="admin-header">
                <h1>Admin Interface</h1>
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>

            {loading ? (
                <motion.p
                    className="loading-text"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    Loading...
                </motion.p>
            ) : (
                <>
                    <motion.div
                        className="create-item-form"
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2>Create Courses</h2>
                        <input
                            type="text"
                            placeholder="Name 1"
                            value={newItem.name}
                            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Name 2"
                            value={newItem.description}
                            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                        />
                        <input
                            type="number"
                            placeholder="Price"
                            value={newItem.price}
                            onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
                        />
                        <input
                            type="file"
                            onChange={handleImageChange}
                        />
                        {imagePreview && <img src={imagePreview} alt="Preview" style={{ width: '100px', height: '100px' }} />}
                        <br />
                        <button className="create-btn" onClick={handleCreate}>Create</button>
                    </motion.div>

                    <motion.div
                        className="items-list"
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2>Items</h2>
                        {items.length === 0 ? (
                            <p>No items found</p>
                        ) : (
                            items.map((item) => (
                                <motion.div
                                    key={item._id}
                                    className="item-card"
                                    whileHover={{ scale: 1.03 }}
                                    transition={{ type: 'spring', stiffness: 300 }}
                                >
                                   
                                    {item.pic && <img src={`http://localhost:5000/uploads/${item.pic}`} alt={item.name} style={{ width: '100px', height: '100px' }} />}
                                    <p>{item.name} - {item.description} - {item.price} DT</p>
                                    <button
                                        className="update-btn"
                                        onClick={() => handleUpdateClick(item)}
                                    >
                                        Update
                                    </button>
                                    <button className="delete-btn" onClick={() => handleDelete(item._id)}>Delete</button>
                                </motion.div>
                            ))
                        )}
                    </motion.div>
                </>
            )}

          
            {showUpdateForm && (
                <div className="update-modal">
                    <div className="update-modal-content">
                        <h3>Update Item</h3>
                        <input
                            type="text"
                            placeholder="Name 1"
                            value={updatedItem.name}
                            onChange={(e) => setUpdatedItem({ ...updatedItem, name: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Name 2"
                            value={updatedItem.description}
                            onChange={(e) => setUpdatedItem({ ...updatedItem, description: e.target.value })}
                        />
                        <input
                            type="number"
                            placeholder="Price"
                            value={updatedItem.price}
                            onChange={(e) => setUpdatedItem({ ...updatedItem, price: Number(e.target.value) })}
                        />
                        <input type="file" onChange={handleImageChange} />
                        {imagePreview && <img src={imagePreview} alt="Preview" style={{ width: '100px', height: '100px' }} />}
                        <div className="modal-buttons">
                            <button className="ok-btn" onClick={handleUpdate}>OK</button>
                            <button className="cancel-btn" onClick={handleCancelUpdate}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default AdminInterface;
