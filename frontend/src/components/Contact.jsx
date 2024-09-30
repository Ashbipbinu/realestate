import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import ErrorToast from "./Error";

const Contact = ({ listing }) => {
  const [landlord, setLandLord] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [severity, setSeverity] = useState(null);
  const [message, setMessage] = useState("");

  const handleMessage = (event) => {
    setMessage(event.target.value);
  };

  useEffect(() => {
    const fetchLandLord = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        if (data.success === false) {
          setError(data.message);
          setSeverity("error");
          setLoading(false);
        }
        setLandLord(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setSeverity("error");
        setLoading(false);
      }
    };
    fetchLandLord();
  }, [listing?.userRef]);
  return (
    <>
      {landlord && !loading ? (
        <div className="flex flex-col gap-4 mt-3">
          <p>
            Contact <span className="font-semibold">{landlord.username}</span>{" "}
            for{" "}
            <span className="font-semibold">{listing.name.toLowerCase()}</span>
          </p>
          <textarea
            name="message"
            id="message"
            rows="2"
            onChange={handleMessage}
            value={message}
            placeholder="Enter your message"
            className="w-full  border p-3 rounded-lg"
          ></textarea>
          <Link
            to={`mailto:${landlord.email}?subject=Regarding%20${
              listing.name
            }&body=${encodeURIComponent(
              message
            )}%0A%0ALink to the property:%20${encodeURIComponent(
              window.location.href
            )}`}
            onClick={
              !message
                ? (e) => {
                    e.preventDefault();
                    setError("Please enter a valid message");
                    setSeverity("info");
                  }
                : undefined
            }
            className={`bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95 ${
              !message ? "disabled opacity-70" : ""
            }`}
          >
            Send Message
          </Link>
        </div>
      ) : (
        <div className="flex justify-center items-center m-10">
          <ClipLoader size={80} color={"#6b7280"} loading={true} />
        </div>
      )}
      <ErrorToast
        errorMessage={error}
        setError={setError}
        severity={severity}
        setSeverity={setSeverity}
      />
    </>
  );
};

export default Contact;
