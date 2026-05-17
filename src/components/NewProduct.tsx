import React, { useState, type ChangeEvent, type FormEvent } from 'react';
import { X, DollarSign, Box, Upload } from 'lucide-react';
import { createProductService } from '../services/newProductService';
import { useNotification } from '../AppUses/useNotification';

interface NewProductProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewProduct: React.FC<NewProductProps> = ({ isOpen, onClose }) => {
  const {handleNotification} = useNotification();
  const [productData, setProductData] = useState({
    name: '',
    price: '',
    quantity: '1'
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  if (!isOpen) return null;

  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataPayload = new FormData();
      dataPayload.append("name", productData.name);
      dataPayload.append("price", productData.price);
      dataPayload.append("quantity", productData.quantity);
      
      if (imageFile) {
        dataPayload.append("image", imageFile); 
      }

      await createProductService(dataPayload);

      setProductData({ name: '', price: '', quantity: '1' });
      setImageFile(null);
      setPreviewUrl('');
      onClose();
      handleNotification("SuccessFully added new Product👍")
    } catch (error) {
      if(error instanceof Error){
        setError(error.message);
        handleNotification("Product Adding Failed👍", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-[#111827] border border-slate-800 w-full max-w-md rounded-3xl p-6 shadow-2xl relative animate-scaleUp">

        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Box className="w-5 h-5 text-emerald-400" /> Add New Product
            </h2>
            <p className="text-slate-400 text-xs mt-1">Populate your inventory list catalog</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-800/50 rounded-xl text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="text-slate-300 text-xs font-semibold block mb-1.5">Product Image</label>
            <div className="border-2 border-dashed border-slate-700 hover:border-emerald-500/50 rounded-2xl p-4 bg-[#1E293B]/50 text-center relative transition-colors cursor-pointer group">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />
              
              {previewUrl ? (
                <div className="relative h-24 mx-auto w-24 rounded-xl overflow-hidden border border-slate-600">
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="py-2">
                  <Upload className="w-8 h-8 text-slate-500 mx-auto group-hover:text-emerald-400 transition-colors mb-2" />
                  <p className="text-slate-400 text-xs">Click or drag image file here to upload</p>
                  <p className="text-slate-500 text-[10px] mt-1">PNG, JPG up to 5MB</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="text-slate-300 text-xs font-semibold block mb-1.5">Product Name</label>
            <input
              type="text"
              name="name"
              required
              placeholder="e.g., Wireless Mouse, Organic Tea"
              value={productData.name}
              onChange={handleTextChange}
              className="w-full bg-[#1E293B] border border-slate-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">

            <div>
              <label className="text-slate-300 text-xs font-semibold block mb-1.5">Selling Price (₹)</label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="number"
                  name="price"
                  required
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={productData.price}
                  onChange={handleTextChange}
                  className="w-full bg-[#1E293B] border border-slate-700 text-white pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-300 text-xs font-semibold block mb-1.5">Initial Quantity</label>
              <input
                type="number"
                name="quantity"
                required
                min="0"
                value={productData.quantity}
                onChange={handleTextChange}
                className="w-full bg-[#1E293B] border border-slate-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors text-sm"
              />
            </div>
          </div>
          {error && <p className='text-xl text-red-500 font-bold'>{error}</p>}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800/80 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700/80 text-slate-300 hover:text-white rounded-xl font-medium text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white rounded-xl font-medium text-sm shadow-lg transition-colors"
            >
              {loading ? 'Creating...' : 'Add Product'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default NewProduct;
