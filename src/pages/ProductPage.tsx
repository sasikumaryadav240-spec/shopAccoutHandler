import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import {
  Package,
  Search,
  Plus,
  PackageX,
  Trash2,
  AlertTriangle,
  Upload,
  Edit3,
  X,
  ArrowLeft,
} from "lucide-react";
import { getProductService, deleteProductService, type productsProps, updateProductService } from "../services/newProductService";
import ProductPageSkeleton from "../AppUses/productSkeleton";
import NewProduct from "../components/NewProduct";
import { useNotification } from "../AppUses/useNotification";
import { useNavigate } from "react-router-dom";


const ProductPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [productData, setProductData] = useState<productsProps | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const navigation = useNavigate();

  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState<boolean>(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const { handleNotification } = useNotification();

  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editLoading, setEditLoading] = useState<boolean>(false);
  const [editFormData, setEditFormData] = useState({
    id: "",
    name: "",
    price: "",
    quantity: ""
  });
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editPreviewUrl, setEditPreviewUrl] = useState<string>("");

  useEffect(() => {
    const fetchInventoryData = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getProductService();
      setProductData(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };
    fetchInventoryData();
  }, []);

  const openDeleteConfirmation = (id: string) => {
    setSelectedProductId(id);
    setIsDeletePopupOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedProductId) return;
    
    setDeleteLoading(true);
    try {
      await deleteProductService(selectedProductId);

      setProductData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          product: prev.product.filter((p) => p._id !== selectedProductId)
        };
      });

      setIsDeletePopupOpen(false);
      setSelectedProductId(null);
      handleNotification("SuccessFully Deleted👍")
    } catch (err) {
      if(err instanceof Error){
        handleNotification("Delete Failed 😔", "error");
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleEditClick = (id: string) => {
    const targetProduct = productData?.product.find((p) => p._id === id);
    if (!targetProduct) return;

    setEditFormData({
      id: targetProduct._id,
      name: targetProduct.name,
      price: String(targetProduct.price),
      quantity: String(targetProduct.quantity)
    });
    setEditPreviewUrl(targetProduct.image || "");
    setEditImageFile(null);
    setIsEditModalOpen(true);
  };

  const handleEditTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setEditImageFile(file);
      setEditPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpdateSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEditLoading(true);

    try {
      const payload = new FormData();
      payload.append("name", editFormData.name);
      payload.append("price", editFormData.price);
      payload.append("quantity", editFormData.quantity);
      if (editImageFile) {
        payload.append("image", editImageFile);
      }

      const res = await updateProductService(editFormData.id, payload);
      const updatedProduct = res.product;

      setProductData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          product: prev.product.map((p) => 
            p._id === editFormData.id ? { ...p, ...updatedProduct } : p
          )
        };
      });

      setIsEditModalOpen(false);
      handleNotification("SuccessFully Updated👍")
    } catch (err) {
      if(err instanceof Error){
        handleNotification("Update Failed😔", "error");
      }
    } finally {
      setEditLoading(false);
    }
  };

  const productList = productData?.product || [];

  const filteredProducts = productList.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const targetDeleteProduct = productList.find(p => p._id === selectedProductId);

  if (loading) {
    return (
      <ProductPageSkeleton/>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center text-white p-4">
        <div className="text-center max-w-sm bg-red-500/10 border border-red-500/20 p-6 rounded-2xl">
          <p className="text-red-400 font-semibold">Failed to load data</p>
          <p className="text-slate-400 text-xs mt-2 mb-4">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-white px-4 pt-3 pb-28">
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigation(-1)}
          className="p-2.5 bg-[#111827] border border-slate-800 mb-3 hover:border-slate-700 hover:bg-slate-800/60 text-slate-400 hover:text-white rounded-xl transition-all shadow-md active:scale-95 group"
          title="Go Back"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
        </button>
        <div className="flex flex-col justify-center items-center">
          <p className="text-slate-400 text-sm">Inventory Management</p>
          <h1 className="text-3xl font-bold mt-1">Products</h1>
        </div>

        <button 
          onClick={() => setIsProductModalOpen(true)}
          className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-900/30 hover:bg-blue-500 transition-colors"
        >
          <Plus className="w-6 h-6 text-white" />
        </button>
      </div>
      {<NewProduct
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
      />}

      <div className="bg-[#111827] border border-slate-800 rounded-3xl p-4 flex items-center gap-3 mb-6">
        <Search className="w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-transparent outline-none w-full text-white placeholder:text-slate-500 text-sm"
        />
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-5 shadow-xl mb-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm">Total Products</p>
            <h2 className="text-4xl font-bold mt-2">{productList.length}</h2>
          </div>
          <div className="bg-white/20 p-4 rounded-3xl">
            <Package className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>

      <div className="space-y-5">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div
              key={product._id}
              className="bg-[#111827] border border-slate-800 rounded-[28px] p-5 shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-800 border border-slate-700 shadow-inner">
                    <img 
                      src={product.image || "default.png"} 
                      alt={product.name} 
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-white">{product.name}</h2>
                    <p className="text-slate-400 text-xs mt-1">Available Stock</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className={`px-4 py-1.5 rounded-2xl inline-block ${
                    product.quantity > 0 ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                  }`}>
                    <span className="font-bold text-sm">
                      {product.quantity > 0 ? product.quantity : "Out of stock"}
                    </span>
                  </div>

                  <p className="text-emerald-400 mt-2 font-bold text-lg">
                    ₹{product.price}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-5">
                <button 
                  onClick={() => handleEditClick(product._id)}
                  className="bg-[#1E293B] border border-slate-700 text-slate-300 rounded-2xl py-3 font-medium hover:bg-slate-800 hover:text-white transition-all text-sm"
                >
                  Edit
                </button>
                <button 
                  onClick={() => openDeleteConfirmation(product._id)}
                  className="bg-red-600/90 text-white rounded-2xl py-3 font-medium hover:bg-red-600 transition-all text-sm shadow-md shadow-red-900/10"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-[#111827] border border-slate-800 rounded-[28px] p-6">
            <PackageX className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">No items found matching your catalog search queries</p>
          </div>
        )}
      </div>
      {isDeletePopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-[#111827] border border-slate-800 w-full max-w-sm rounded-3xl p-6 shadow-2xl text-center relative animate-scaleUp">
            
            <div className="mx-auto w-14 h-14 bg-red-500/15 border border-red-500/30 rounded-2xl flex items-center justify-center mb-4">
              <AlertTriangle className="w-7 h-7 text-red-500" />
            </div>

            <h3 className="text-xl font-bold text-white">Permanently Delete?</h3>
            <p className="text-slate-400 text-sm mt-2 px-2 leading-relaxed">
              Are you sure you want to remove <span className="text-red-400 font-semibold">"{targetDeleteProduct?.name}"</span> from your catalog? This action will permanently delete all sales data records linked to this product.
            </p>

            <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-slate-800/80">
              <button
                type="button"
                onClick={() => setIsDeletePopupOpen(false)}
                disabled={deleteLoading}
                className="bg-slate-800 hover:bg-slate-700/80 text-slate-300 hover:text-white rounded-xl py-3 font-semibold text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleteLoading}
                className="bg-red-600 hover:bg-red-500 disabled:bg-red-800 text-white rounded-xl py-3 font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-600/10 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                {deleteLoading ? "Deleting..." : "Delete Item"}
              </button>
            </div>

          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#111827] border border-slate-800 w-full max-w-md rounded-3xl p-6 shadow-2xl relative">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2"><Edit3 className="w-5 h-5 text-blue-400" /> Edit Product</h2>
                <p className="text-slate-400 text-xs mt-1">Modify item properties and stocks</p>
              </div>
              <button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-slate-800/50 rounded-xl text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div>
                <label className="text-slate-300 text-xs font-semibold block mb-1.5">Replace Product Image</label>
                <div className="border-2 border-dashed border-slate-700 hover:border-blue-500/50 rounded-2xl p-4 bg-[#1E293B]/50 text-center relative transition-colors cursor-pointer group">
                  <input type="file" accept="image/*" onChange={handleEditFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                  <div className="relative h-20 mx-auto w-20 rounded-xl overflow-hidden border border-slate-600">
                    <img src={editPreviewUrl || "default.png"} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Upload className="w-4 h-4 text-white" /></div>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-slate-300 text-xs font-semibold block mb-1.5">Product Name</label>
                <input type="text" name="name" required value={editFormData.name} onChange={handleEditTextChange} className="w-full bg-[#1E293B] border border-slate-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-blue-500 text-sm" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 text-xs font-semibold block mb-1.5">Selling Price (₹)</label>
                  <input type="number" name="price" required min="0" step="0.01" value={editFormData.price} onChange={handleEditTextChange} className="w-full bg-[#1E293B] border border-slate-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-blue-500 text-sm" />
                </div>
                <div>
                  <label className="text-slate-300 text-xs font-semibold block mb-1.5">Stock Level</label>
                  <input type="number" name="quantity" required min="0" value={editFormData.quantity} onChange={handleEditTextChange} className="w-full bg-[#1E293B] border border-slate-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-blue-500 text-sm" />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800/80 mt-6">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-5 py-2.5 bg-slate-800 text-slate-300 rounded-xl font-medium text-sm">Cancel</button>
                <button type="submit" disabled={editLoading} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium text-sm shadow-lg">{editLoading ? "Updating..." : "Save Changes"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
