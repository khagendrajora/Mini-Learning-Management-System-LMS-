import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Loader } from "../utils/Utils";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

export const Register = () => {
  const [isButton, setIsButton] = useState(false);
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsButton(true);
      await register(email, password, name);

      toast.success("Registered");
      setName("");
      setEmail("");
      setPassword("");
    } catch (error: any) {
      toast.error("Failed!");
    } finally {
      setIsButton(false);
    }
  };
  return (
    <>
      <ToastContainer />
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
              <h1 className="font-bold text-3xl">Register</h1>
              <p className="">Create new Account</p>
            </div>
            <form
              onSubmit={handleSubmit}
              className="flex w-full flex-col items-center gap-y-4 mb-10 "
            >
              <div className="w-3/4 max-w-96 space-y-2">
                <label className="font-semibold">Name</label>
                <input
                  type="text"
                  name="name"
                  className="border border-slate-700 rounded-lg  p-2 lg:p-3 w-full "
                  placeholder="Name"
                  value={name}
                  required
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="w-3/4 max-w-96 space-y-2">
                <label className="font-semibold">Email</label>
                <input
                  type="text"
                  name="email"
                  className="border border-slate-700 rounded-lg  p-2 lg:p-3 w-full "
                  placeholder="Email"
                  value={email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="w-3/4 max-w-96 space-y-2">
                <label className="font-semibold">Password</label>
                <div className="relative w-full">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    required
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
                  className={` bg-black  hover:!bg-white border text-white hover:!text-black p-2 rounded-lg w-full`}
                >
                  {isButton ? <Loader /> : "Sign up"}
                </button>
                <p className="text-center">
                  Already have an account? <Link to="/login">Login</Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
