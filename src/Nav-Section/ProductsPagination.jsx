import React from "react";

const ProductsPagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

 const renderPageNumbers = () => {
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(
      <button
        key={i}
        type="button" // 🔹 এটা এখানে দিতে হবে
        onClick={() => onPageChange(i)}
        className={`px-3 py-1 rounded-md border ${
          i === currentPage
            ? "bg-pink-600 text-white"
            : "bg-white text-gray-700 hover:bg-gray-100"
        }`}
      >
        {i}
      </button>
    );
  }
  return pages;
};


  return (
    <div className="flex items-center justify-center space-x-2 mt-6">
    <button
  type="button" // 🔹 important
  onClick={handlePrev}
  disabled={currentPage === 1}
  className="px-3 py-1 rounded-md border bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
>
  Prev
</button>


      {renderPageNumbers()}

      <button
       type="button"
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded-md border bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

export default ProductsPagination;
