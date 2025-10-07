import React, { useEffect, useRef, useState } from 'react'
import AddIcon from "../../assets/svg/AddIcon.svg";
import AddProduct from './AddProduct';
import editIconDarkGrey from "../../assets/svg/editIconDarkGrey.svg"
import deleteIconGrey from "../../assets/svg/deleteIconGrey.svg"
import DotMenuIcon from "../../assets/svg/DotMenuIcon.svg";
import EditProduct from './EditProduct';
import toast from 'react-hot-toast';
import { getProductData, getProductDelete } from '../../services/productServices';
import DeleteModel from '../component/DeleteModel';

function SkeletonBox() {
    return (
        <div className="bg-gray-300 animate-pulse rounded-3xl h-[542px] w-full"></div>
    );
}

function Product() {
    const [productData, setProductData] = useState([]);
    const [error, setError] = useState(null);
    const [addProduct, setProducts] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isEditingProduct, setIsEditingProduct] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [productDelete, setProductDelete] = useState(null);
    const hasFetched = useRef(false);
    const [hovered, setHovered] = useState(null);
    const [activeDropdownId, setActiveDropdownId] = useState(null);
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 10,
        totalUsers: 0,
    });
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (!hasFetched.current) {
            fetchProduct();
            hasFetched.current = true;
        }
    }, []);

    useEffect(() => {
        if (searchQuery === "") {
            fetchProduct();
        }
    }, [searchQuery]);

    const fetchProduct = async () => {
        setLoading(true);
        try {
            const response = await getProductData({
                page: pagination.page,
                pageSize: pagination.pageSize,
                query: searchQuery,
            });

            setProductData(response?.data?.items || []);
            setPagination((prev) => ({
                ...prev,
                totalUsers: response?.data?.totalItems || 0,
            }));
        } catch (err) {
            setError("Failed to fetch product");
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = async () => {
        if (!productDelete || !productDelete._id) return;

        try {
            await getProductDelete(productDelete._id);
            toast.success("Product deleted successfully!");
            setProductDelete(null);
            fetchProduct();
        } catch (error) {
            console.error("Delete failed", error);
            toast.error("Failed to delete product");
        }
    };

    return (
        <div>
            {isEditingProduct ? (
                <EditProduct fetchProduct={fetchProduct} selectedProduct={selectedProduct} onCancel={() => setIsEditingProduct(false)} />
            ) : addProduct ? (
                <AddProduct
                    addProduct={addProduct}
                    onClose={() => setProducts(null)}
                    onConfirm={() => {
                        console.log("Blocked:", addProduct.name);
                        setProducts(null);
                    }}
                    fetchProduct={fetchProduct}
                />
            ) : (
                <div className="text-[#464646] flex flex-col gap-2">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-3 font-Raleway Raleway-medium">
                        <div>
                            <h1 className="text-[32px]">Product</h1>
                            <p className="text-[#656565] pt-1">Manage Product Section and Page</p>
                        </div>
                        <button onClick={() => setProducts({})} className="bg-[#EA7913] flex items-center space-x-2 hover:bg-[#F39C2C] text-white px-6 py-3 rounded-full cursor-pointer">
                            <img src={AddIcon} alt="Download Icon" className="p-1.5" />
                            <span>Add Product</span>
                        </button>
                    </div>

                    <div className='px-3'>
                        <div className='p-6 rounded-2xl bg-white flex flex-col gap-5.5'>
                            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                                <p className="text-2xl font-Raleway Raleway-medium text-[#656565]">All Product</p>
                                {/* <div className="relative w-full md:w-72 lg:w-74.5">
                                    <span className="absolute inset-y-0 left-3 px-1 flex items-center text-[#EA7913]">
                                        <img src={SearchIcon} alt="search" className="w-5 h-5" />
                                    </span>
                                    <input
                                        type="text"
                                        placeholder="Search"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                fetchProduct();
                                            }
                                        }}
                                        className="w-full pl-10 pr-4 py-2 md:py-3 rounded-full bg-[#FCEAC9] text-[#656565] placeholder-[#656565] border-2 border-[#FEF8EC] focus:outline-none focus:ring-0 focus:border-[#F3E9D6]"
                                    />
                                </div> */}
                            </div>

                            <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                                {loading
                                    ? Array.from({ length: 6 }).map((_, i) => <SkeletonBox key={i} />)
                                    : productData.map((item) => {
                                        const isDropdownOpen = activeDropdownId === item._id;

                                        return (
                                            <div
                                                key={item._id}
                                                onMouseEnter={() => setHovered(item._id)}
                                                onMouseLeave={() => setHovered(null)}
                                                className="relative"
                                            >
                                                <div className="bg-white rounded-3xl overflow-hidden">
                                                    {/* Product Image */}
                                                    <div className="relative overflow-hidden">
                                                        <img
                                                            src={item.coverImageUrl}
                                                            alt={item.title}
                                                            className="w-full h-[542px] object-cover"
                                                        />

                                                        {/* 3-Dot Menu */}
                                                        {(hovered === item._id || activeDropdownId === item._id) && (
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setActiveDropdownId(prev =>
                                                                        prev === item._id ? null : item._id
                                                                    );
                                                                }}
                                                                className="absolute top-5 right-5 bg-white p-3 rounded-full border border-[#FCEAC9] cursor-pointer z-10"
                                                            >
                                                                <img src={DotMenuIcon} alt="Options" />
                                                            </button>
                                                        )}

                                                        {/* Dropdown menu */}
                                                        {isDropdownOpen && (
                                                            <div className="absolute space-y-2 top-17 right-5 mt-2 w-48 lg:w-55 bg-white rounded-2xl p-2 cursor-pointer border border-[#FCEAC9] z-20">
                                                                <button
                                                                    onClick={() => {
                                                                        setSelectedProduct(item);
                                                                        setIsEditingProduct(true);
                                                                        setActiveDropdownId(null);
                                                                    }}
                                                                    className="cursor-pointer flex items-center gap-2.5 w-full rounded-xl p-3 text-left text-sm hover:bg-[#FEF8EC] text-[#656565] hover:text-[#292929]"
                                                                >
                                                                    <img src={editIconDarkGrey} alt="Edit" className="w-5 h-5" />
                                                                    <p>Edit Product</p>
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        setProductDelete(item);
                                                                        setActiveDropdownId(null);
                                                                    }}
                                                                    className="cursor-pointer flex items-center gap-2.5 w-full rounded-xl p-3 text-left text-sm hover:bg-[#FEF8EC] text-[#656565] hover:text-[#292929]"
                                                                >
                                                                    <img src={deleteIconGrey} alt="deleteIcon" className="w-5 h-5" />
                                                                    <p>Delete Product</p>
                                                                </button>
                                                            </div>
                                                        )}

                                                        <div className={`absolute bottom-1 left-1 right-1 bg-white p-6 rounded-3xl ${!isDropdownOpen ? "opacity-100" : "opacity-85"}`}>
                                                            <h3 className="text-xl md:text-2xl font-Raleway Raleway-bold">
                                                                {item.title}
                                                            </h3>
                                                            <p className="text-sm pt-2 pb-3.5">
                                                                {item.summary}
                                                            </p>
                                                            <div className='space-x-1.5 space-y-2 md:space-y-0 pb-7 md:pb-5'>
                                                                <button className='py-1 px-4 border border-[#BDBDBD] rounded-full text-xs'>{item?.chips[0]}</button>
                                                                <button className='py-1 px-4 border border-[#BDBDBD] rounded-full text-xs'>{item?.chips[1]}</button>
                                                            </div>
                                                            <div className="flex items-end gap-2 text-[#464646]">
                                                                <span className="text-lg md:text-[32px] md:leading-[40px] font-Raleway Raleway-bold">${item?.detail?.priceNew}</span>
                                                                <span className="mb-1">${item?.detail?.priceOld}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        </div>
                    </div>

                    {productDelete && (
                        <DeleteModel productLoading={loading} onCancel={() => setProductDelete(null)} onConfirmProduct={confirmDelete} />
                    )}
                </div>
            )}
        </div>
    )
}

export default Product


// *********************** old product design code *************************************

// : productData.map((item) => (
//     <div
//         key={item._id}
//     >
//         <div className="bg-white rounded-3xl overflow-hidden">
//             {/* products Image */}
//             <div className="relative overflow-hidden">
//                 <img
//                     src={item.coverImageUrl}
//                     alt={item.title}
//                     className="w-full h-[542px] object-cover"
//                 />

//                 {/* Buttons */}
//                 <button
//                     onClick={() => {
//                         setSelectedProduct(item);
//                         setIsEditingProduct(true);
//                     }} className="absolute flex items-center gap-2 top-5 left-5 bg-[#FFFFFF] p-3 text-[#656565] rounded-full border border-[#989898] cursor-pointer hover:bg-gray-100">
//                     <img src={editIconGrey} alt="Edit" className="p-0.5" /> <span>Edit</span>
//                 </button>
//                 <button onClick={() => setProductDelete(item)} className="absolute top-5 right-5 bg-white p-3 rounded-full border border-[#989898] cursor-pointer hover:bg-gray-100">
//                     <img src={deleteIconGrey} alt="Delete" />
//                 </button>

//                 {/* product Content */}
//                 <div className="absolute bottom-1 left-1 right-1 bg-white bg-opacity-90 backdrop-blur-md p-6 rounded-3xl">
//                     <h3 className="text-xl md:text-2xl font-Raleway Raleway-bold">
//                         {item.title}
//                     </h3>
//                     <p className="text-sm pt-2 pb-3.5">
//                         {item.summary}
//                     </p>
//                     <div className='space-x-1.5 space-y-2 md:space-y-0 pb-7 md:pb-5'>
//                         <button className='py-1 px-4 border border-[#BDBDBD] rounded-full text-xs'>{item?.chips[0]}</button>
//                         <button className='py-1 px-4 border border-[#BDBDBD] rounded-full text-xs'>{item?.chips[1]}</button>
//                     </div>
//                     <div className="flex items-end gap-2 text-[#464646]">
//                         <span className="text-lg md:text-[32px] md:leading-[40px] font-Raleway Raleway-bold">${item?.detail?.priceNew}</span>
//                         <span className="mb-1">${item?.detail?.priceOld}</span>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     </div>
// ))


