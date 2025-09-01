import React from 'react';
import Emailicon from "../../assets/svg/Email.svg";

function ForgotModel({ onSubmit, onChange, form, errors, loading }) {
    return (
        <div>
            <form className="space-y-5" onSubmit={onSubmit}>
                <div>
                    <label htmlFor="email" className="block text-sm md:text-lg mb-2">
                        Email
                    </label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-3 flex items-center text-[#EA7913]">
                            <img src={Emailicon} alt="email" className="w-5 h-5" />
                        </span>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={onChange}
                            placeholder="Enter Your Email"
                            className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#BDBDBD]"
                        />
                    </div>
                    {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                </div>

                <div className="w-full mt-10">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 bg-[#EA7913] text-white rounded-full font-medium"
                    >
                        {loading ? "Sending OTP..." : "Send OTP"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ForgotModel;
