import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../axios";
import "../template/ProductDetails.css";
const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axiosInstance.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        setError("Failed to fetch product details.");
        console.error(err);
      }
    };
    fetchProduct();
  }, [id]);

  if (error) return <p>{error}</p>;
  if (!product) return <p>Loading...</p>;

  return (
    <div className="product-detail-page">
      <h1>{product.name}</h1>
      <img src={product.main_image} alt={product.name} />
      <p>{product.description}</p>
      <p>Price: ${product.price}</p>
      <p>{product.stock > 0 ? "In stock" : "Out of stock"}</p>

      {product.variants && product.variants.length > 0 && (
        <div>
          <h3>Variants:</h3>
          <ul>
            {product.variants.map((variant) => (
              <li key={variant.id}>
                Size: {variant.size}, Color: {variant.color}, Price: ${variant.price || product.price}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
