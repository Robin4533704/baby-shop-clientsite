import React, { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import ProductCard from "../Nav-Section/ProductCard";


const ProductList = ({ products }) => {
  const { user } = useContext(AuthContext); // <-- user get here

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4 md:p-6">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} user={user} />
      ))}
    </div>
  );
};

export default ProductList;
