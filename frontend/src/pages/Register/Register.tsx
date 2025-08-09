import { useRef, useState } from "react";
import { Button, Col, Modal, Row, Form } from "react-bootstrap";
import Countdown from "react-countdown";
import { FaEdit } from "react-icons/fa";

const Register = () => {
  const handleClose = () => setShow(false);
  // const handleShow = () => setShow(true);
  const [form, setForm] = useState(false);
  const [formData, setFormData] = useState({
    phone: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  });

  interface RegisterFormData {
    phone: string;
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    termsAccepted: boolean;
  }

  interface HandleChangeEvent extends React.ChangeEvent<HTMLInputElement> {}

  const handleChange = (e: HandleChangeEvent) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev: RegisterFormData) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSendOtp = () => {
    // Implement OTP sending logic here

    setShow(true);
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    console.log(formData);
  };

  const [show, setShow] = useState(false);
  const [otp, setOtp] = useState(new Array(4).fill(""));
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const handleChanges = (e: any, index: number) => {
    const value = e.target.value.replace(/\D/, "");
    if (!value) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (index < 5 && value) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];

      if (otp[index]) {
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
        newOtp[index - 1] = "";
        setOtp(newOtp);
      }
    }
  };

  const handleSubmits = () => {
    const enteredOtp = otp.join("");
    console.log("Entered OTP:", enteredOtp);
    // You can add API call or validation here
    handleClose();
    setForm(true);
  };
  return (
    <div className="flex items-center justify-center bg-white px-4">
      <div className="flex flex-col md:flex-row items-start  w-full">
        <div className="w-full md:w-1/2   p-4">
          <img
            src="/register.png"
            alt="register"
            className="w-full  object-cover rounded-lg"
          />
          <div className="text-xl text-center font-semibold text-black">
            Welcome to Hamromaster.
          </div>
        </div>

        <div className="w-full md:w-1/2 py-8 lg:p-8 space-y-4">
          <h2 className="text-3xl font-bold">Register</h2>
          <p className="text-gray-500">
            Start your academic journey with Hamromaster.
          </p>

          <div
            className={`${
              form ? "hidden " : "block"
            } flex  items-center justify-center  mb-2   lg:mx-0`}
          >
            <div className="bg-[var(--blue)] border-r-0 border-l-1 border-t-1 border-b-1 border-black text-white flex items-center p-2 rounded-l-xl">
              <img
                src="https://flagcdn.com/w40/np.png"
                alt="Nepal Flag"
                className="w-8 h-5 "
              />
              +977
            </div>
            <input
              type="text"
              placeholder="Enter your mobile number"
              className="w-full  rounded-r-xl p-2 border-r-1 border-t-1 border-b-1 border-l-0 border-black  text-gray-700 focus:outline-none"
            />
          </div>
          <p className={`${form ? "hidden " : "block"} text-sm text-gray-500`}>
            You will get OTP on mobile
          </p>

          <button
            className={`${
              form ? "hidden " : "block"
            } w-11/12 mx-auto bg-[var(--darkGreen)] text-white py-2 rounded-lg font-semibold button`}
            onClick={handleSendOtp}
          >
            Send OTP
          </button>

          <Modal show={show} onHide={handleClose} centered>
            <Modal.Header className="flex flex-col">
              <Modal.Title>OTP Verification</Modal.Title>
              <p className="flex items-center gap-1">
                Please enter 4 digit code sent to your mobile{" "}
                <strong>9812***</strong>
                <FaEdit color="#55b20b" className="cursor-pointer" />
              </p>
              <Countdown date={Date.now() + 120000} />
            </Modal.Header>
            <Modal.Body>
              <Form.Group>
                <Row className="justify-content-center">
                  {otp.map((digit, index) => (
                    <Col key={index} xs={2} className="">
                      <Form.Control
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChanges(e, index)}
                        onKeyDown={(e) =>
                          handleBackspace(
                            e as React.KeyboardEvent<HTMLInputElement>,
                            index
                          )
                        }
                        ref={(el) => {
                          inputRefs.current[index] = el;
                        }}
                        className="text-center border-2 border-black fs-4 py-2"
                      />
                    </Col>
                  ))}
                </Row>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer className="flex gap-2 flex-col">
              <span>
                Didn`t get the OTP code?{" "}
                <button className="hover:text-blue-600">
                  <strong>Resend Code</strong>
                </button>
              </span>

              <div className="!space-x-3">
                <Button
                  className="!bg-[var(--red)] button2 border-0"
                  onClick={() => {
                    setOtp(new Array(6).fill("")), handleClose();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="!bg-[var(--darkGreen)]  border-0"
                  onClick={handleSubmits}
                >
                  Submit OTP
                </Button>
              </div>
            </Modal.Footer>
          </Modal>

          <form
            onSubmit={handleSubmit}
            className={`flex flex-col gap-4 ${form ? "block" : "hidden"}`}
          >
            <input
              type="text"
              name="name"
              placeholder="Enter Your name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-black rounded-md focus:outline-none"
            />
            <input
              type="email"
              name="email"
              placeholder="Enter Your Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-black rounded-md focus:outline-none"
            />
            <input
              type="password"
              name="password"
              placeholder="Enter Your Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-black rounded-md focus:outline-none"
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-black rounded-md focus:outline-none"
            />

            <label className="flex  items-center text-sm text-gray-600">
              <input
                type="checkbox"
                name="termsAccepted"
                checked={formData.termsAccepted}
                onChange={handleChange}
                className="!mr-2"
              />
              I accept{" "}
              <a href="#" className="text-blue-600 underline mx-1">
                Terms/Conditions
              </a>
              and{" "}
              <a href="#" className="text-blue-600 underline mx-1">
                Privacy Policy
              </a>
            </label>

            <button
              type="submit"
              className="w-11/12 mx-auto bg-[var(--darkGreen)] text-white py-2 rounded-lg font-semibold button transition"
            >
              Start your journey for free
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
