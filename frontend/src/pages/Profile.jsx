import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase/firebase.config";

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePercent, setFilePercent] = useState(0);
  const [fileUploadedErr, setFileUploadedErr] = useState(false);
  const [formData, setFormData] = useState({});

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
        console.log(Math.round(progress));
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

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="font-semibold text-3xl text-center my-5">Profile</h1>
      <form className="flex flex-col gap-4">
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
          src={formData.avatar ||  currentUser.avatar}
          alt="profile"
        />
        <p className="text-center text-sm">
          {fileUploadedErr ? (
            <span className="text-red-500 mx-auto">
              Error while uploading the image (image must be less than 2 mb)
            </span>
          ) : filePercent > 0 && filePercent < 100 ? (
            <span className="text-slate-700 text-center">{`Uploading ${filePercent} %`}</span>
          ) : filePercent === 100 ? (
            <span className="text-green-600 text-center">Image uploaded successfully</span>
          ) : (
            " "
          )}
        </p>
        <input
          type="text"
          placeholder="Username"
          id="username"
          className="border p-3 rounded-lg"
        />
        <input
          type="email"
          placeholder="Email"
          id="email"
          className="border p-3 rounded-lg"
        />
        <input
          type="passowrd"
          placeholder="Password"
          id="passowrd"
          className="border p-3 rounded-lg"
        />
        <button className="bg-slate-700 p-3 text-white uppercase font-semibold rounded-lg disabled:opacity-95">
          Update
        </button>
      </form>
      <div className="mt-2 flex justify-between">
        <span className="text-red-500 cursor-pointer p-2 rounded-lg font-semibold text-xl hover:bg-red-700 hover:text-white">
          Delete Account
        </span>
        <span className="text-red-500 cursor-pointer p-2 rounded-lg font-semibold text-xl hover:bg-red-700 hover:text-white">
          Sign Out
        </span>
      </div>
    </div>
  );
};

export default Profile;
