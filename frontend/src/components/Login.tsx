import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Loader } from "../utils/Utils";
import { toast, ToastContainer } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
// const URL = import.meta.env.VITE_Backend_URL;

export const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isButton, setIsButton] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsButton(true);
      await login(email, password);

      toast.success("Logined");
      navigate("/");
    } catch (err: any) {
      toast.error("Failed Login!" + "Invalid Credentials");
    } finally {
      setIsButton(false);
    }
  };

  const handleGoogle = async () => {
    try {
      await loginWithGoogle();

      toast.success("Logined");
    } catch (err: any) {
      toast.error("Failed Login!");
    }
  };
  return (
    <>
      <ToastContainer />
      <div>
        <div className="flex items-center justify-center bg-white px-4">
          <div className="flex flex-col md:flex-row items-start  w-full">
            <div className="w-full md:w-1/2   p-4">
              <img
                src="/register.png"
                alt="register"
                className="w-full  object-cover rounded-lg"
              />
            </div>

            <div className="flex mt-10 flex-col w-full gap-10 md:gap-7 ">
              <div className="flex  items-center  flex-col">
                <h1 className="font-bold text-3xl">Login</h1>
                <p className="">
                  Don`t have an account <Link to="/register">Register</Link>
                </p>
              </div>

              <form
                onSubmit={handleLogin}
                className="flex w-full flex-col items-center gap-y-4 mb-1 "
              >
                <div className="w-3/4 max-w-96 space-y-2">
                  <label className="font-semibold">Email</label>
                  <input
                    type="text"
                    name="email"
                    className="border border-slate-700 rounded-lg  p-2 lg:p-3 w-full "
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="w-3/4 max-w-96 space-y-2">
                  <label className="font-semibold">Password</label>
                  <div className="relative w-full">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      className="border border-slate-700 rounded-lg p-2 lg:p-3 w-full "
                    />
                    {password.length > 0 && (
                      <span className="absolute  right-3 top-1/2 -translate-y-1/2">
                        {!showPassword ? (
                          <FaEyeSlash
                            className="cursor-pointer"
                            onClick={() => setShowPassword(true)}
                          />
                        ) : (
                          <FaEye
                            className="cursor-pointer"
                            onClick={() => setShowPassword(false)}
                          />
                        )}
                      </span>
                    )}
                  </div>
                </div>

                <div className=" flex flex-col w-3/4 gap-1 max-w-96">
                  <button
                    type="submit"
                    className="bg-black transition-all duration-500 hover:!bg-white  text-white border hover:!text-black p-2 rounded-lg w-full"
                  >
                    {isButton ? <Loader /> : "Login"}
                  </button>
                </div>
              </form>
              <button
                className="bg-gray-200 p-2 w-3/4 mx-auto  max-w-96"
                onClick={handleGoogle}
              >
                Login with Google
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
