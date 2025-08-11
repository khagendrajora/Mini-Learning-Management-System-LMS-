import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { Nav } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { RxMagnifyingGlass } from "react-icons/rx";
import { IoCartOutline } from "react-icons/io5";
import { FaRegBell } from "react-icons/fa";
import { TiMessages } from "react-icons/ti";
import { useAuth } from "../../contexts/AuthContext";
import { toast, ToastContainer } from "react-toastify";

function Navbars() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  console.log(currentUser);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error: any) {
      toast.error("logout Failed");
    }
  };
  return (
    <>
      <ToastContainer />
      <Navbar expand="md" className="py-2 mx-auto flex md:gap-10 w-[95%]">
        <div className="flex w-full large:w-fit items-center justify-between">
          <Link to="/">
            <img
              src="/lmslogo.png"
              className="max-w-[5rem] large:max-w-[10rem] "
              alt="lms"
            />
          </Link>
          <Form className="lg:!block ">
            <InputGroup className="relative">
              <Form.Control
                placeholder="Search anything..."
                className="p-3  !pl-12  !w-[20rem] !rounded-xl border-black"
              />
              <RxMagnifyingGlass className="absolute w-10 h-10 -translate-y-1/2 top-1/2 left-2 opacity-50" />
            </InputGroup>
          </Form>
          <Navbar.Toggle aria-controls="navbar-responsive" />
        </div>
        <div className="lg:flex  hidden  mx-auto gap-2 items-center">
          <div className="w-fit ">
            <img
              src="/call.gif"
              alt="phone"
              className="w-10 h-10 max-w-20 max-h-20"
            />
          </div>

          <div className="flex min-w-[12rem]  flex-col !text-xl">
            <span className="font-bold text-xl">9812766153</span>
            <span className="no-underline !text-gray-400 text-sm">
              <Link to="" className="!text-gray-400 ">
                Whatapp
              </Link>{" "}
              /{" "}
              <Link to="" className="!text-gray-400 ">
                Viber
              </Link>{" "}
              /
              <Link to="" className="!text-gray-400 ">
                Call
              </Link>
            </span>
          </div>
        </div>

        <Navbar.Collapse
          id="navbar-responsive"
          className="justify-between w-fit "
        >
          <Nav className="py-2 items-center text-center text-sm xl:text-lg !text-black  2xl:text-2xl flex gap-2 md:!gap-5 2xl:!gap-12">
            {/* <Nav.Link
              href="/model-exam"
              className={`${
                pathName === "/model-exam" ? "!text-green-600" : ""
              } text-center hover:!text-green-600`}
            >
              Courses
            </Nav.Link> */}
            <div className=" gap-5 hidden">
              <FaRegBell className="w-7 h-7 large:w-10 large:h-10" />
              <TiMessages className="w-7 h-7 large:w-10 large:h-10" />
              <IoCartOutline className="w-7 h-7 large:w-10 large:h-10" />
            </div>
            {currentUser ? (
              <Nav.Link
                onClick={handleLogout}
                className="text-white border rounded bg-black hover:!bg-white hover:!text-black p-2"
              >
                Log&nbsp;Out
              </Nav.Link>
            ) : (
              <Nav.Link
                href="/register"
                className="text-white border rounded bg-black hover:!bg-white hover:!text-black p-2"
              >
                Join&nbsp;for&nbsp;Free
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
}

export default Navbars;
