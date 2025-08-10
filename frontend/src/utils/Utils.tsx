import { Button, Spinner } from "react-bootstrap";

export const Loader = () => {
  return (
    <div>
      {" "}
      <Button variant="white" disabled>
        <Spinner as="span" size="sm" role="status" aria-hidden="true" />
        <span className="visually-hidden">Loading...</span>
      </Button>
    </div>
  );
};

export const PageLoader = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <img
        src="/Dual Ball@1x-1.6s-155px-155px.gif"
        height={100}
        width={100}
        alt="Loading........"
      />
    </div>
  );
};
