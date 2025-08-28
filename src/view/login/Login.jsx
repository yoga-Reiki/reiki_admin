import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoIosArrowRoundForward } from "react-icons/io";
import { IoEyeOffOutline } from "react-icons/io5";
import loginBG from "../../assets/img/loginBG.png";
import reikiLogo from "../../assets/img/logo.png";
import Emailicon from "../../assets/svg/Email.svg";
import eyeIcon from "../../assets/svg/eyeIcon.svg";
import Password from "../../assets/svg/Password.svg";
import toast from "react-hot-toast";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", Password: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors[name];
      return newErrors;
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const staticEmail = process.env.REACT_APP_LOGIN_EMAIL;
    const staticPassword = process.env.REACT_APP_LOGIN_PASSWORD;

    let newErrors = {};

    // Validation
    if (!form.email) {
      newErrors.email = "Email is required";
    }
    if (!form.Password) {
      newErrors.Password = "Password is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (form.email === staticEmail && form.Password === staticPassword) {
      toast.success("Login Successful!");
      
      const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
      localStorage.setItem("token", token);

      setTimeout(() => {
        navigate("/dashboard");
      }, 500);
    } else {
      setErrors({
        email: "Invalid email or password",
        Password: "Invalid email or password",
      });
      toast.error("Invalid email or password!");
    }
  };


  const onForgotPassword = async () => {
    if (!form.email) {
      setErrors((prev) => ({
        ...prev,
        email: "Please enter your email to reset password.",
      }));
      return;
    }
    toast.info("Password reset link sent to your email!");
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4 xl:px-0 text-[#464646]"
      style={{ backgroundImage: `url(${loginBG})` }}
    >
      <div className="bg-white bg-opacity-90 rounded-2xl p-6 md:p-14 w-full max-w-[501px]">
        <div className="flex flex-col justify-between gap-10 md:gap-14">
          <div className="flex flex-col items-center justify-between gap-5 md:gap-8">
            <Link to="/" className="flex items-center">
              <img
                src={reikiLogo}
                alt="Logo"
                className="w-30 md:w-32 object-contain mb-1 hover:cursor-pointer transition-transform transform"
              />
            </Link>
            <h1 className="text-2xl md:text-[32px] md:leading-[40px] font-semibold font-Raleway text-center text-[#3D3D3D]">
              Welcome to Shree Sai Yog & Reiki Healing Centre
            </h1>
          </div>

          {/* form */}
          <form className="space-y-5" onSubmit={onSubmit}>
            {/* Email */}
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
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl text-[#525252] placeholder-[#525252] border-[1px] border-[#BDBDBD] focus:outline-none focus:ring-0 focus:border-[#EA7913]"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm md:text-lg mb-2"
              >
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-[#EA7913]">
                  <img src={Password} alt="password" className="w-5 h-5" />
                </span>
                <input
                  id="Password"
                  name="Password"
                  value={form.Password}
                  onChange={onChange}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl text-[#525252] placeholder-[#525252] border-[1px] border-[#BDBDBD] focus:outline-none focus:ring-0 focus:border-[#EA7913]"
                  placeholder="Enter Password"
                  type={showPassword ? "text" : "password"}
                  onCopy={(e) => e.preventDefault()}
                  onCut={(e) => e.preventDefault()}
                  onPaste={(e) => e.preventDefault()}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center cursor-pointer focus:outline-none"
                >
                  {showPassword ? (
                    <img src={eyeIcon} className="w-5 h-5" alt="" />
                  ) : (
                    <IoEyeOffOutline className="w-5 h-5 text-[#EA7913]" />
                  )}
                </button>
              </div>
              <div className={`${errors.Password && "flex justify-between"}`}>
                {errors.Password && (
                  <p className="text-red-500 text-sm mt-1">{errors.Password}</p>
                )}
                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={onForgotPassword}
                    className="text-sm cursor-pointer"
                  >
                    Forgot Password ?
                  </button>
                </div>
              </div>
            </div>

            {/* Sign in button */}
            <div className="w-full mt-10 md:mt-14 relative inline-block rounded-full px-[5px] py-[3px] bg-gradient-to-r from-[#FF7900] via-[#EAD3BE] to-[#FF7900] hover:from-[#F39C2C] hover:via-[#F39C2C] hover:to-[#F39C2C] active:from-[#EA7913] active:via-[#EA7913] active:to-[#EA7913]">
              <button
                type="submit"
                className="w-full h-full inline-flex justify-center items-center space-x-1.5 py-2 bg-[#EA7913] text-[#F8F8F8] rounded-full font-medium hover:cursor-pointer hover:bg-[#F39C2C] active:bg-[#EA7913] transition text-base"
              >
                <span>Sign in </span>
                <IoIosArrowRoundForward size={28} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
