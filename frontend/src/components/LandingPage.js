import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Styles/LandingPage.css'; 
import logo from '../logo.png'

const LandingPage = () => {
    const [items, setItems] = useState([]);
    const [viewMore, setViewMore] = useState(false);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/items');
                setItems(response.data.slice(0, 6));
            } catch (error) {
                console.error('Error fetching items:', error);
            }
        };
        fetchItems();
    }, []);

    const handleViewMore = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/items');
            setItems(response.data); 
            setViewMore(true);
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    };

    return (
        <div className="landing-page">
            <nav className="navbar">
                <img src={logo} alt="Logo" className="logo" />
            </nav>

            <div className="hero-section">
                <div className="hero-content">
                    <h2>Improve your skills on your own </h2>
                    <h2>To prepare for a better future</h2>
                    <button className="register-btn">REGISTER NOW</button>
                </div>
            </div>

            <div className="courses-section">
                <div className="courses-header">
                    <h1>Discover Our Courses</h1>
                    <button className="view-more-btn" onClick={handleViewMore}>
                        View More
                    </button>
                </div>
                <div className="courses-list">
                    {items.map((item) => (
                        <div key={item._id} className="course-item">
                            <img src={`http://localhost:5000/uploads/${item.pic}`} alt={item.name} />
                            <p className="titleItem">{item.name} / {item.description}</p>
                            <p className="prixItem">{item.price} DT / Month</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="contact-section">
                <div className="contact-form">
                    <h3>Contact Us</h3>
                    <form>
                        <label className='labelContact' htmlFor="name">NAME</label>
                        <input type="text" id="name" name="name" placeholder="maryemsehly" required/>

                        <label className='labelContact' htmlFor="email">EMAIL</label>
                        <input type="email" id="email" name="email" placeholder="maryem@gmail.com" required/>

                        <label className='labelContact' htmlFor="message">MESSAGE</label>
                        <textarea
                            id="message"
                            name="message"
                            placeholder="Write your message here"
                            required
                        ></textarea>

                        <button type="submit" className="send-btn">Send the Message</button>
                    </form>
                </div>
            </div>

        </div>
    );
};

export default LandingPage;
