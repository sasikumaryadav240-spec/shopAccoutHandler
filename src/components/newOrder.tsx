import React, { useEffect, useState, type FormEvent } from 'react';
import { ShoppingCart, Plus, Minus, Trash2, CheckCircle2, CreditCard, Wallet, Box, X } from 'lucide-react';
import { getProductService } from '../services/newProductService';
import { createOrderService } from '../services/newOrderService';
import { useNotification } from '../AppUses/useNotification';

interface ProductItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

interface NewOrderProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewOrder: React.FC<NewOrderProps> = ({ isOpen, onClose }) => {
  const { handleNotification } = useNotification();
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<"Cash" | "UPI">("Cash");
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) return;
    
    const loadProducts = async () => {
      try {
        setLoading(true);
        const res = await getProductService();
        setProducts(res.product || []);
      } catch (error) {
        console.error("Failed to sync store products:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [isOpen]);

  const addToCart = (product: ProductItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.productId === product._id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.productId === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { productId: product._id, name: product.name, price: product.price, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, amount: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.productId === productId) {
            const newQty = item.quantity + amount;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.productId !== productId));
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async (e: FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return alert("Your cart is empty!");
    setSubmitting(true);

    try {
      const orderPayload = {
        items: cart.map((item) => ({
          productId: item.productId,
          name: item.name, 
          quantity: item.quantity
        })),
        paymentMethod: paymentMethod
      };

      await createOrderService(orderPayload);
      setCart([]);
      onClose(); 
      handleNotification("Order Placed SuccessFully👍")
    } catch (error) {
      if(error instanceof Error){
        handleNotification("order Failed to place 😔", "error");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const productPlaceholders = [1, 2, 3, 4, 5, 6, 7, 8];
  const cartPlaceholders = [1, 2];

  return (
    <div className="fixed inset-0 z-50 bg-[#0F172A] text-white flex flex-col w-screen h-screen overflow-y-auto animate-fadeIn">

      <div className="h-16 px-6 border-b border-slate-800 flex items-center justify-between bg-[#111827] shrink-0 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600/10 p-2 rounded-xl border border-blue-500/20">
            <ShoppingCart className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white leading-none">POS Billing Terminal</h1>
            <p className="text-slate-400 text-[10px] mt-1">Active Cashier Session</p>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition-all border border-slate-700/50 shadow-md"
        >
          <X className="w-4 h-4" /> Close Register
        </button>
      </div>

      {loading ? (
        <div className="fixed inset-0 z-50 bg-[#0F172A] text-white flex flex-col w-screen h-screen overflow-y-auto animate-pulse">

          <div className="h-16 px-6 border-b border-slate-800 flex items-center justify-between bg-[#111827] shrink-0">
            <div className="flex items-center gap-3">
              <div className="bg-slate-800 p-2 rounded-xl border border-slate-700/40 w-9 h-9">
                <ShoppingCart className="w-5 h-5 text-slate-600" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-32 bg-slate-800 rounded-md"></div>
                <div className="h-3 w-24 bg-slate-800/60 rounded-sm"></div>
              </div>
            </div>
            <div className="h-8 w-28 bg-slate-800 rounded-xl"></div>
          </div>

          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 auto-rows-max">

            <div className="lg:col-span-7 p-6 bg-[#0F172A] border-r border-slate-800/40">
              <div className="flex flex-col mb-4 space-y-2">
                <div className="h-3 w-36 bg-slate-800 rounded-sm"></div>
                <div className="h-6 w-24 bg-slate-800 rounded-md"></div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 pb-12">
                {productPlaceholders.map((id) => (
                  <div
                    key={id}
                    className="bg-[#111827] border border-slate-800/80 rounded-2xl p-3 flex flex-col justify-between"
                  >
                    <div className="w-full aspect-square rounded-xl bg-slate-800/60 border border-slate-700/30 mb-3"></div>
                    <div className="space-y-3">

                      <div className="h-3.5 w-3/4 bg-slate-800 rounded"></div>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/40">

                        <div className="h-4 w-10 bg-slate-800 rounded"></div>

                        <div className="h-4 w-12 bg-slate-800/60 rounded"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 p-6 bg-[#090d16] flex flex-col justify-between border-t lg:border-t-0 border-slate-800 pb-20">
              <div className="space-y-4 flex flex-col">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                  <div className="h-4 w-28 bg-slate-800 rounded"></div>
                  <div className="h-4 w-16 bg-slate-800/60 rounded"></div>
                </div>

                <div className="space-y-2.5">
                  {cartPlaceholders.map((id) => (
                    <div key={id} className="flex items-center justify-between bg-[#111827] border border-slate-800/80 p-3 rounded-xl">
                      <div className="space-y-2 w-1/2">
                        <div className="h-3.5 w-3/4 bg-slate-800 rounded"></div>
                        <div className="h-3 w-1/2 bg-slate-800/60 rounded"></div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-16 bg-slate-800 rounded-lg"></div>
                        <div className="h-8 w-8 bg-slate-800/60 rounded-lg"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4 pt-6 border-t border-slate-800/80 mt-6">
                <div className="space-y-2">
                  <div className="h-3 w-24 bg-slate-800 rounded"></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="h-11 bg-slate-800 rounded-xl flex items-center justify-center text-slate-700"><Wallet className="w-4 h-4" /></div>
                    <div className="h-11 bg-slate-800 rounded-xl flex items-center justify-center text-slate-700"><CreditCard className="w-4 h-4" /></div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/60 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="h-4 w-24 bg-slate-800 rounded"></div>
                    <div className="h-7 w-20 bg-slate-800 rounded-lg"></div>
                  </div>
                  <div className="h-12 bg-slate-800 rounded-xl w-full"></div>
                </div>
              </div>

            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 auto-rows-max">

          <div className="lg:col-span-7 p-6 bg-[#0F172A] border-r border-slate-800/40">
            <div className="flex flex-col mb-4">
              <p className="text-slate-400 text-[11px] uppercase tracking-wider font-semibold">Available Stock Inventory</p>
              <h1 className="text-xl font-bold mt-0.5 text-white">Select Items</h1>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 pb-12">
              {products.map((product) => (
                <div
                  key={product._id}
                  onClick={() => addToCart(product)}
                  className="bg-[#111827] border border-slate-800/80 hover:border-blue-500/60 rounded-2xl p-3 cursor-pointer transition-all shadow-lg flex flex-col justify-between group active:scale-[0.96] hover:bg-[#162032]"
                >
                  <div className="w-full aspect-square rounded-xl bg-slate-800/50 border border-slate-700/40 overflow-hidden mb-3 pointer-events-none">
                    <img src={product.image || "default.png"} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="pointer-events-none">
                    <h3 className="font-semibold text-white truncate text-xs">{product.name}</h3>
                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-800/30">
                      <span className="text-emerald-400 font-bold text-sm">₹{product.price}</span>
                      <span className="text-slate-500 text-[9px] bg-slate-800 px-1.5 py-0.5 rounded">Qty: {product.quantity}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleCheckout} className="lg:col-span-5 p-6 bg-[#090d16] flex flex-col justify-between border-t lg:border-t-0 border-slate-800 pb-20">
            
            <div className="space-y-4 flex flex-col">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Line Item Summary</span>
                <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded font-medium">{cart.length} items active</span>
              </div>

              <div className="space-y-2.5">
                {cart.length === 0 ? (
                  <div className="text-center text-slate-600 text-xs flex flex-col items-center justify-center space-y-2 py-12 bg-[#111827]/30 border border-dashed border-slate-800 rounded-2xl">
                    <Box className="w-8 h-8 opacity-10" />
                    <p className="font-medium">Register Tray Empty</p>
                    <p className="text-[10px] text-slate-500">Tap product cards on the left to include items</p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.productId} className="flex items-center justify-between bg-[#111827] border border-slate-800 p-3 rounded-xl shadow-sm">
                      <div className="truncate pr-2">
                        <h4 className="font-semibold text-white truncate text-xs">{item.name}</h4>
                        <span className="text-[10px] text-slate-400 font-mono">₹{item.price} each</span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <div className="flex items-center bg-[#1E293B] border border-slate-700 rounded-lg overflow-hidden scale-90">
                          <button type="button" onClick={() => updateQuantity(item.productId, -1)} className="p-1 text-slate-400 hover:text-white hover:bg-slate-700"><Minus className="w-3 h-3" /></button>
                          <span className="px-1.5 font-bold text-xs text-white min-w-[14px] text-center">{item.quantity}</span>
                          <button type="button" onClick={() => updateQuantity(item.productId, 1)} className="p-1 text-slate-400 hover:text-white hover:bg-slate-700"><Plus className="w-3 h-3" /></button>
                        </div>
                        <button type="button" onClick={() => removeFromCart(item.productId)} className="text-slate-500 hover:text-red-400 p-1.5 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-slate-800/80 bg-[#090d16] mt-6">
              <div>
                <label className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider block mb-2">Select Payment Mode</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("Cash")}
                    className={`p-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-all ${
                      paymentMethod === "Cash" 
                        ? "bg-emerald-600/10 border-emerald-500 text-emerald-400 shadow-lg shadow-emerald-950/40" 
                        : "bg-[#111827] border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <Wallet className="w-4 h-4" /> Cash Desk
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("UPI")}
                    className={`p-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-all ${
                      paymentMethod === "UPI" 
                        ? "bg-blue-600/10 border-blue-500 text-blue-400 shadow-lg shadow-blue-950/40" 
                        : "bg-[#111827] border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <CreditCard className="w-4 h-4" /> UPI Scan
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/60 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider">Total Collection</span>
                  <span className="text-2xl font-black text-emerald-400 tracking-tight">₹{totalAmount}</span>
                </div>

                <button
                  type="submit"
                  disabled={cart.length === 0 || submitting}
                  className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 font-bold text-white rounded-xl py-3.5 flex items-center justify-center gap-2 shadow-xl shadow-blue-900/10 transition-all text-xs tracking-wide"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {submitting ? "Processing Settlement..." : `Finalize & Charge ₹${totalAmount}`}
                </button>
              </div>
            </div>

          </form>
        </div>
      )}
    </div>
  );
};

export default NewOrder;
