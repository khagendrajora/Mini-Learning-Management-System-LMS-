import { FaStar } from "react-icons/fa";

const Card = () => {
  return (
    <>
      <div className="bg-[var(--lightGreen)] font-lexend rounded-xl p-[10px] w-full mx-auto max-w-[380px] sm:max-w-[300px] xl:max-w-[360px]">
        <div className="flex flex-col ">
          <img src="/card-image.jpg" alt="" className="rounded-lg" />
          <div className="flex gap-3 items-center mt-1">
            <span className="p-1 px-2 bg-[var(--blue)]  rounded-lg text-white">
              Bsc
            </span>
            <span className="text-gray-400 flex items-center gap-1">
              <FaStar color="#FFC300" />
              4.5(1234)
            </span>
          </div>
          <h5 className=" mt-1">
            Bsc 1st Year Zoology Full Course & Free Notes{" "}
          </h5>
          <div className="flex justify-between -ml-[10px] mt-1 items-center">
            <div className="relative inline-block bg-[var(--red)] text-yellow-300 px-6 py-2 text-sm">
              50% Off
              <div className="absolute top-[5px] -right-3 h-[25px] w-[25px] bg-[var(--red)] transform rotate-45"></div>
            </div>
            <span className="text-[var(--blue)] text-3xl">
              रु 999{" "}
              <span className="line-through text-gray-400 text-xl">1999</span>
            </span>
          </div>
          <hr />
          <div className="flex justify-center mb-1 gap-3 text-white font-semibold">
            <button className="bg-[var(--darkGreen)] w-2/5 p-2 button !rounded-lg">
              Explore
            </button>
            <button className="bg-[var(--red)] button2 p-2 w-2/5 !rounded-lg">
              Enroll&nbsp;Now
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Card;
