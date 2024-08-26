import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000";

const Dashboard = () => {
    const [products, setProducts] = useState([]);
    const [formProduct, setFormProduct] = useState({
        id: null,
        title: "",
        author: "",
        coverURL: "",
        price: "",
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/products`);
            setProducts(response.data);
            console.log( "Fetching collection.");
        }
        catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const handleChange = (e) => {
        setFormProduct({
            ...formProduct,
            [e.target.name]: e.target.value,
        });
    };

    const createOrUpdateProduct = async () => {
        try {
            if (formProduct.id) {
                await axios.put(
                    `${API_BASE_URL}/products/${formProduct.id}`,
                    formProduct
                );
                console.log( "Book titled " + formProduct.title + " was updated.");
            }
            else {
                await axios.post(`${API_BASE_URL}/products`, formProduct);
                console.log( "Book titled " + formProduct.title + " was created.");
            }
            fetchProducts();
            setFormProduct({
                id: null,
                title: "",
                author: "",
                coverURL: "",
                price: "",
            });
        }
        catch (error) {
            console.error("Error saving product:", error);
        }
    };

    const startUpdate = (product) => {
        setFormProduct(product);
    };

    const deleteProduct = async (id) => {
        try {
            await axios.delete(`${API_BASE_URL}/products/${id}`);
            fetchProducts();
            console.log( "Book with ID " + id + " was deleted."); 
        }
        catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    return (
        <div className="dashboard page-bg">
            <h1>Library Dashboard</h1>
            <h4>Manage Book Collection</h4>
            <div className="new-product-form island">
                <h5>
                    {formProduct.id ? "Update Product" : "Create New Product"}
                </h5>
                <input
                    type="text"
                    name="title"
                    placeholder="Book Title"
                    value={formProduct.title}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="author"
                    placeholder="Author"
                    value={formProduct.author}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="coverURL"
                    placeholder="Cover URL"
                    value={formProduct.coverURL}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="price"
                    placeholder="Price"
                    value={formProduct.price}
                    onChange={handleChange}
                />
                {/* <input
                    type="number"
                    name="rating"
                    placeholder="Rating (1-5)"
                    value={formProduct.rating}
                    onChange={handleChange}
                />
                <textarea
                    name="reviews"
                    placeholder="Write your review here..."
                    value={formProduct.reviews}
                    onChange={handleChange}
                /> */}
                <button onClick={createOrUpdateProduct}>
                    {formProduct.id ? "Update Product" : "Add Product"}
                </button>
            </div>
            <div className="cards">
                {products.map((product) => (
                    <div key={product.id} className="card">
                        <img
                            src={product.coverURL}
                            alt={product.title}
                            className="card-image"
                        />
                        <h5 className="card-title">{product.title}</h5>
                        <p className="card-description">
                            {product.author}
                        </p>
                        <p className="card-price"> Rs. {product.price}</p>
                        <div className="buttons-container">
                            <button onClick={() => startUpdate(product)}>
                                Update
                            </button>
                            <button onClick={() => deleteProduct(product.id)}>
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;