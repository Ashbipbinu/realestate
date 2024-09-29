import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
      {landlord && (
        <div className="flex flex-col gap-2">
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
          <Link to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`} className="bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95">Send Message</Link>
        </div>
      )}
    </>
  );
};

export default Contact;
