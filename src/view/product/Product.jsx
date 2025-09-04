import React, { useState } from 'react'
import AddIcon from "../../assets/svg/AddIcon.svg";
import AddProduct from './AddProduct';
import SearchIcon from "../../assets/svg/SearchIcon.svg";
import editIconGrey from "../../assets/svg/editIconGrey.svg"
import deleteIconGrey from "../../assets/svg/deleteIconGrey.svg"
import products1 from "../../assets/img/Product 1.png"

function Product() {
    const [addProduct, setProducts] = useState(null);

    const products = [
        {
            id: 1,
            name: "Reiki Crystal Bracelet",
            description:
                "Handmade natural gemstone bracelet charged with Reiki energy. Ideal for daily healing, chakra balance, and positive vibration.",
            tags: ["Emotional Balance", "Stress Relief"],
            price: "$29.50",
            image: products1,
        },
        {
            id: 2,
            name: "Reiki Crystal Bracelet",
            description:
                "Handmade natural gemstone bracelet charged with Reiki energy. Ideal for daily healing, chakra balance, and positive vibration.",
            tags: ["Emotional Balance", "Stress Relief"],
            price: "$29.50",
            image: products1,
        },
        {
            id: 3,
            name: "Reiki Crystal Bracelet",
            description:
                "Handmade natural gemstone bracelet charged with Reiki energy. Ideal for daily healing, chakra balance, and positive vibration.",
            tags: ["Emotional Balance", "Stress Relief"],
            price: "$29.50",
            image: products1,
        },
        {
            id: 4,
            name: "Reiki Crystal Bracelet",
            description:
                "Handmade natural gemstone bracelet charged with Reiki energy. Ideal for daily healing, chakra balance, and positive vibration.",
            tags: ["Emotional Balance", "Stress Relief"],
            price: "$29.50",
            image: products1,
        },
        {
            id: 5,
            name: "Reiki Crystal Bracelet",
            description:
                "Handmade natural gemstone bracelet charged with Reiki energy. Ideal for daily healing, chakra balance, and positive vibration.",
            tags: ["Emotional Balance", "Stress Relief"],
            price: "$29.50",
            image: products1,
        }
    ];

    return (
        <div className="text-[#464646] flex flex-col gap-2">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-3">
                <div>
                    <h1 className="text-[32px] font-bold">Product</h1>
                    <p className="text-[#656565] pt-1">Manage Product Section and Page</p>
                </div>
                <button onClick={() => setProducts({})} className="bg-[#EA7913] flex items-center space-x-2 hover:bg-[#F39C2C] text-white px-6 py-3 rounded-full cursor-pointer">
                    <img src={AddIcon} alt="Download Icon" className="p-1.5" />
                    <span>Add Product</span>
                </button>
            </div>

            <div className='py-2.5 px-3'>
                <div className='p-5 rounded-2xl bg-white border-t-2 border-t-[#EA7913] flex flex-col gap-5.5'>
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-2xl text-[#656565]">Product Section</p>
                        <div className="relative w-full md:w-72 lg:w-74.5">
                            <span className="absolute inset-y-0 left-3 flex items-center text-[#EA7913]">
                                <img src={SearchIcon} alt="search" className="w-5 h-5" />
                            </span>
                            <input
                                type="text"
                                placeholder="Search"
                                className="w-full pl-10 pr-4 py-2 md:py-3 rounded-full bg-[#FCEAC9] text-[#656565] placeholder-[#656565] border-2 border-[#FEF8EC] focus:outline-none focus:ring-0 focus:border-[#F3E9D6]"
                            />
                        </div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"> 
                        {products.map((item) => (
                            <div
                                key={item.id}
                            >
                                <div className="bg-white rounded-3xl overflow-hidden">
                                    {/* products Image */}
                                    <div className="relative overflow-hidden">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-full max-h-[542px] object-cover"
                                        />

                                        {/* Buttons */}
                                        <button className="absolute flex items-center gap-2 top-5 left-5 bg-[#FFFFFF] p-3 text-[#656565] rounded-full border border-[#989898] cursor-pointer hover:bg-gray-100">
                                            <img src={editIconGrey} alt="Edit" className="p-0.5" /> <span>Edit</span>
                                        </button>
                                        <button className="absolute top-5 right-5 bg-white p-3 rounded-full border border-[#989898] cursor-pointer hover:bg-gray-100">
                                            <img src={deleteIconGrey} alt="Delete" />
                                        </button>

                                        {/* product Content */}
                                        <div className="absolute bottom-1 left-1 right-1 bg-white bg-opacity-90 backdrop-blur-md p-6 rounded-3xl">
                                            <h3 className="text-xl md:text-2xl font-Raleway Raleway-bold">
                                                {item.name}
                                            </h3>
                                            <p className="text-[#525252] text-sm pt-2 pb-3.5">
                                                {item.description}
                                            </p>
                                            <div className='space-x-1.5 space-y-2 md:space-y-0 pb-7 md:pb-5'>
                                                <button className='py-1 px-6 border border-[#BDBDBD] rounded-full text-xs'>Emotional balance</button>
                                                <button className='py-1 px-6 border border-[#BDBDBD] rounded-full text-xs'>Stress relief</button>
                                            </div>
                                            <div className="flex items-end gap-2 text-[#464646]">
                                                <span className="text-lg md:text-[32px] md:leading-[40px] font-Raleway Raleway-bold">$29</span>
                                                <span className="mb-1">$50</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {addProduct && (
                <AddProduct
                    addProduct={addProduct}
                    onClose={() => setProducts(null)}
                    onConfirm={() => {
                        console.log("Blocked:", addProduct.name);
                        setProducts(null);
                    }}
                />
            )}
        </div>
    )
}

export default Product