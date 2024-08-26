import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000";

const Library = ({ userName }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTitle, setSearchTitle] = useState("");
    const [searchAuthor, setSearchAuthor] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/products/`, {
                    params: {
                        title: searchTitle,
                        author: searchAuthor
                    }
                });
                setProducts(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [searchTitle, searchAuthor]);

    const handleSearch = () => {
        // Trigger fetch with new search params
        fetchProducts();
    };

    const handleBuyClick = (productId) => {
        // Handle the buy action here, e.g., redirect to a purchase page or show a confirmation
        console.log(`Product ${productId} bought`);
        // Example: Navigate to purchase page
        // window.location.href = `/purchase/${productId}`;
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="shop page-bg">
            <h1>Welcome, Bookie</h1>
            <h4>Check out our latest collection!</h4>
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search by title"
                    value={searchTitle}
                    onChange={(e) => setSearchTitle(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Search by author"
                    value={searchAuthor}
                    onChange={(e) => setSearchAuthor(e.target.value)}
                />
                <button onClick={handleSearch}>Search</button>
            </div>
            <div className="cards">
                {products.map((product) => (
                    <div key={product.id} className="card">
                        <img
                            src={product.coverURL}
                            alt={product.title}
                            className="card-image"
                        />
                        <h6 className="card-title">{product.title}</h6>
                        <p className="card-description">{product.author}</p>
                        <p className="card-price"><b>Rs. {product.price}</b></p>
                        <div className="buttons-container">
                            <button onClick={() => handleBuyClick(product.id)}>Buy</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Library;
