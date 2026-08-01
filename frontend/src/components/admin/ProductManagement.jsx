import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaEdit, FaTrash, FaEye, FaUpload } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  useGetAdminProductsQuery,
  useDeleteProductMutation,
} from "../../api/productApi";
import { formatPrice, formatDate } from "../../helpers/helpers";
import Pagination from "../common/Pagination";
import Loader from "../common/Loader";
import Modal from "../common/Modal";

const ProductManagement = () => {
  const [page, setPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { data, isLoading, refetch } = useGetAdminProductsQuery({
    page,
    limit: 10,
  });
  const [deleteProduct, { isLoading: deleteLoading }] =
    useDeleteProductMutation();

  const products = data?.products || [];
  const totalCount = data?.pagination?.totalCount || 0;
  const totalPages = data?.pagination?.totalPages || 1;

  const handleDelete = async () => {
    if (!selectedProduct) return;
    try {
      await deleteProduct(selectedProduct._id).unwrap();
      toast.success("Product deleted successfully");
      setShowDeleteModal(false);
      setSelectedProduct(null);
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete product");
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Product Management</h1>
        <Link
          to="/admin/products/new"
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FaPlus className="mr-2" />
          Add Product
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Added
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No products found. Click "Add Product" to create one.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr
                    key={product._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={
                              product.images?.[0]?.url ||
                              "/images/placeholder.png"
                            }
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 truncate max-w-[200px]">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-500 font-mono">
                            ID: {product._id.slice(-8)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold">
                      {formatPrice(product.price)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={
                          product.stock > 0 ? "text-green-600" : "text-red-600"
                        }
                      >
                        {product.stock > 0 ? product.stock : "Out of Stock"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(product.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          to={`/products/${product._id}`}
                          className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                          title="View"
                        >
                          <FaEye />
                        </Link>
                        <Link
                          to={`/admin/products/${product._id}`}
                          className="p-1.5 text-gray-400 hover:text-yellow-600 transition-colors"
                          title="Edit"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          onClick={() => {
                            setSelectedProduct(product);
                            setShowDeleteModal(true);
                          }}
                          className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Delete"
      >
        <div className="text-center">
          <p className="text-gray-700 mb-4">
            Are you sure you want to delete{" "}
            <strong>{selectedProduct?.name}</strong>?
          </p>
          <p className="text-sm text-red-600 mb-6">
            This action cannot be undone.
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={deleteLoading}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
            >
              {deleteLoading ? "Deleting..." : "Delete Product"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProductManagement;
