import React, { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserFailure,
  signOutUserStart,
  signOutUserSuccess,
} from "../../redux/Slices/userSlide";
import ErrorToast from "../components/Error";

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase/firebase.config";

const Profile = () => {
  const { currentUser, loading } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePercent, setFilePercent] = useState(0);
  const [fileUploadedErr, setFileUploadedErr] = useState(false);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [severity, setSeverity] = useState("");
  const [userListings, setUserListings] = useState([]);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }

    return () => {};
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    //want unique name if the user uploads the same file twise
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    //to know the progress of the upload in pecentage
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePercent(Math.round(progress));
      },
      (error) => {
        setFileUploadedErr(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadedUrl) => {
          setFormData((prevEl) => {
            return {
              ...prevEl,
              avatar: downloadedUrl,
            };
          });
        });
      }
    );
  };

  const handleFormChange = (event) => {
    event.preventDefault();
    const { id, value } = event.target;
    setFormData((prevEl) => {
      return {
        ...prevEl,
        [id]: value,
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    dispatch(updateUserStart());
    try {
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.error));
        return;
      }

      dispatch(updateUserSuccess(data));
    } catch (error) {
      dispatch(updateUserFailure(error));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.error));
        return;
      }
      dispatch(deleteUserSuccess());
      navigate("/signup");
    } catch (error) {
      dispatch(deleteUserFailure(error));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      await fetch("/api/auth/signout");
      dispatch(signOutUserSuccess());
      navigate("/signin");
    } catch (error) {
      dispatch(signOutUserFailure(error));
    }
  };

  const handleShowAllListing = async () => {
    try {
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (!data) {
        setError(data.error);
        setSeverity("error");
        return;
      }
      if (data.success === false) {
        throw new Error(data.error);
      }
      setUserListings(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/listing/delete/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        setError(`Something went wrong`);
        setSeverity("error");
        return;
      }
      setUserListings((prevEl) => prevEl.filter((list) => list._id !== id));
      setError("Deleted the listing successfully");
      setSeverity("success");
    } catch (error) {
      setError(`Something went wrong`);
      setSeverity("error");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="font-semibold text-3xl text-center my-5">Profile</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2"
        onChange={handleFormChange}
      >
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          accept="image/*"
          hidden
        />
        <img
          onClick={() => fileRef.current.click()}
          className="object-cover rounded-full h-24 w-24 cursor-pointer self-center"
          src={formData?.avatar || currentUser?.avatar}
          alt="profile"
          id="avatar"
        />
        <p className="text-center text-sm">
          {fileUploadedErr ? (
            <span className="text-red-500 mx-auto">
              Error while uploading the image (image must be less than 2 mb)
            </span>
          ) : filePercent > 0 && filePercent < 100 ? (
            <span className="text-slate-700 text-center">{`Uploading ${filePercent} %`}</span>
          ) : filePercent === 100 ? (
            <span className="text-green-600 text-center">
              Image uploaded successfully
            </span>
          ) : (
            " "
          )}
        </p>
        <input
          type="text"
          placeholder="Username"
          id="username"
          className="border p-3 rounded-lg"
          defaultValue={currentUser.username}
        />
        <input
          type="email"
          placeholder="Email"
          id="email"
          className="border p-3 rounded-lg"
          defaultValue={currentUser.email}
        />
        <input
          type="password"
          placeholder="Password"
          id="password"
          className="border p-3 rounded-lg"
        />
        <button
          disabled={loading}
          className="bg-slate-700 p-3 text-white uppercase font-semibold rounded-lg hover:opacity-90 disabled:opacity-95"
        >
          Update
        </button>
        <Link
          to="/create-list"
          className="bg-green-500 p-3 text-white rounded-lg text-center font-semibold uppercase hover:opacity-90"
        >
          Create Listing
        </Link>
      </form>
      <div className="mt-2 flex justify-between">
        <span
          onClick={handleDeleteUser}
          className="text-red-500 cursor-pointer p-2 rounded-lg font-semibold text-xl hover:bg-red-700 hover:text-white"
        >
          Delete Account
        </span>
        <span
          onClick={handleSignOut}
          className="text-red-500 cursor-pointer p-2 rounded-lg font-semibold text-xl hover:bg-red-700 hover:text-white"
        >
          Sign Out
        </span>
      </div>
      <button className="text-green-700 w-full" onClick={handleShowAllListing}>
        Show all listings
      </button>

      {userListings && userListings.length > 0 && (
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl mt-7 text-center">Your Listings</h1>
          {userListings.map((list, index) => {
            return (
              <div
                className="flex justify-between border rounded-lg p-3 items-center gap-3"
                key={index}
              >
                <Link to={`/listing/${list._id}`}>
                  <img
                    src={list.imageUrls}
                    alt="list image"
                    className="h-20 w-20 object-contain"
                  />
                </Link>
                <Link
                  to={`/listing/${list._id}`}
                  className="text-slate-700 font-semibold flex-1 hover:underline truncate"
                >
                  <p>{list.name}</p>
                </Link>
                <div className="flex flex-col">
                  <button
                    onClick={() => handleDelete(list._id)}
                    className="text-red-700 uppercase"
                  >
                    Delete
                  </button>
                  <button className="text-green-700 uppercase">Edit</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ErrorToast
        errorMessage={error}
        setError={setError}
        severity={severity === "" ? "error" : severity}
        setSeverity={setSeverity}
      />
    </div>
  );
};

export default Profile;
