import { Button, Form, InputGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import { IoIosLink } from "react-icons/io";

const Footers = () => {
  return (
    <>
      <div className={`bg-black !text-white   p-3 mt-20`}>
        <div className="bg-black items-center mx-auto w-[95%] gap-3 -mt-20  flex flex-wrap rounded-2xl justify-between p-3 md:!p-6">
          <div className="w-fit mx-auto">
            <h1>Join Us Today</h1>
            <span className="text-xs">
              Be the first person to know about out decision
            </span>
          </div>
          <InputGroup className="sm:!w-3/5 mx-auto !relative h-fit">
            <img
              src="/message-50.png"
              className="absolute -translate-y-1/2 top-1/2 left-2"
            />
            <Form.Control
              className="p-3 !pl-18 bg-transparent border-3 !rounded-xl  !placeholder-white"
              placeholder="Write Your Email here..."
              aria-label="Recipient's message"
              // aria-describedby="join-button"
            />
            <Button
              variant="danger"
              className="!absolute p-2 px-4 right-2 -translate-y-1/2 top-1/2 bg-[var(--red)] !rounded-xl "
            >
              Join Me
            </Button>
          </InputGroup>
        </div>
        <div className="flex w-[95%] py-4 mx-auto flex-wrap justify-between gap-y-4">
          <div className="flex flex-col gap-2 sm:w-2/5 md:w-1/3">
            <img src="/lmslogo.png" alt="" className="w-[8rem]" />

            <div className="flex gap-2">
              <img
                src="/facebook-logo-94.png"
                className="w-7 h-7 cursor-pointer"
              />
              <img
                src="/instagram-logo-94.png"
                className="w-7 h-7 cursor-pointer"
              />
              <img
                src="/youtube-logo-94.png"
                className="w-7 h-7 cursor-pointer"
              />
            </div>
          </div>

          <div className="flex  gap-2 flex-col sm:w-2/5 md:w-1/3 list-none">
            <h1 className="  !text-xl">Useful Links</h1>

            <Link
              to=""
              className="text-white flex items-center gap-1 hover:!text-blue-600  !no-underline"
            >
              <IoIosLink />
              Blogs
            </Link>
            <Link
              to=""
              className="text-white flex items-center gap-1 hover:!text-blue-600  !no-underline"
            >
              <IoIosLink />
              Contact Us
            </Link>
            <Link
              to=""
              className="text-white flex items-center gap-1 hover:!text-blue-600   !no-underline"
            >
              <IoIosLink />
              Terms and Condition
            </Link>
            <Link
              to=""
              className="text-white flex items-center gap-1 hover:!text-blue-600  !no-underline"
            >
              <IoIosLink />
              Privacy Policy
            </Link>
          </div>
          <div className="flex flex-col sm:w-2/5 md:w-1/3 gap-2">
            <h1 className="  !text-xl">Download APP</h1>
            <div className="flex flex-col   gap-2">
              <img
                src="/google_play.png"
                alt=""
                className="w-3/5 max-w-[200px]"
              />
              <img
                src="/app_store.png"
                alt=""
                className="w-3/5 max-w-[200px]"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footers;
