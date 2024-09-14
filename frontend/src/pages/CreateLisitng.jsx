import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import React, { useEffect, useState } from "react";
import { app } from "../firebase/firebase.config";
import { FaTrash, FaCheck } from "react-icons/fa";
import { BeatLoader } from "react-spinners";
import ErrorToast from "../components/Error";
import { useSelector } from "react-redux";
import {useNavigate } from 'react-router-dom'

const CreateLisitng = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 0,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imgfiles, setImgFiles] = useState([]);

  const [buffer, setBuffer] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [severity, setSeverity] = useState("");

  const navigate = useNavigate()

  useEffect(() => {
    console.log("FormData updated:", formData);
    setLoading(false);
    // Add any other side effects here
    setBuffer([]);
  }, [formData]);

  const handleImageSelector = (event) => {
    const { files } = event.target;
    const newImageUrl = Object.values(files);
    setBuffer((prevFiles) => [...prevFiles, ...newImageUrl]);
    return;
  };

  const handlePhotoUpload = async (files) => {
    if (files.length > 0 && files.length < 7 && formData.imageUrls.length < 7) {
      const promises = [];
      for (let i = 0; i < files.length; i++) {
        setBuffer((prevEl) => prevEl.slice(i, 1));
        promises.push(storeImage(files[i]));
      }
      const urls = await Promise.all(promises);
      await setFormData((prevEl) => {
        return {
          ...prevEl,
          imageUrls: [...formData.imageUrls, ...urls],
        };
      });
    } else {
      setError("Number of images to be uploaded has limited to only 6");
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_change",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            resolve(url);
          });
        }
      );
    });
  };

  const handleChanges = (event) => {
    const { id, value, checked, type } = event.target;
    console.log(event.target.imgfiles);
    const newImageUrls = Object.values(imgfiles);
    setImgFiles((prevFiles) => [...prevFiles, ...newImageUrls]);

    if (id === "sale" || id === "rent") {
      setFormData((prevEl) => {
        return {
          ...prevEl,
          type: id,
        };
      });
    }

    if (id === "parking" || id === "furnished" || id === "offer") {
      console.log(id);
      setFormData((prevEl) => {
        return {
          ...prevEl,
          [id]: checked,
        };
      });
    }

    if (type === "number" || type === "text" || type === "textarea") {
      setFormData((prevEl) => {
        return {
          ...prevEl,
          [id]: value,
        };
      });
    }

    setFormData((prevEl) => {
      return {
        ...prevEl,
        imageUrls: [...prevEl.imageUrls, ...newImageUrls],
      };
    });

    if (formData.imageUrls && formData.imageUrls.length > 0) {
      console.log(formData.imageUrls.map((file) => file.name));
    } else {
      console.log("FileList is empty or undefined");
    }
  };

  const handleImageSubmission = async () => {
    if (
      buffer.length <= 0 ||
      buffer.length + 1 > 7 ||
      formData?.imageUrls?.length + buffer?.length > 6
    ) {
      console.log(formData?.imageUrls, buffer);
      setError(
        "Follow the guidelines before submitting the photos. Count of photos should not be less than 0 and exceed 6"
      );
      setSeverity("error");
    } else if (!formData.imageUrls || formData.imageUrls.length + 1 <= 6) {
      console.log("entered", formData);
      setLoading(true);
      await handlePhotoUpload(buffer);
      setSeverity("success");
      setError("Photos uploaded successfully.");
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1) {
        setError("Please upload atleast one photo");
        return;
      }
      if (+formData.regularPrice < +formData.discountPrice) {
        return setError("Discount price must be lower than regular price");
      }
      const res = await fetch("/api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, userRef: currentUser }),
      });

      const data = await res.json();
      if (data.success === false) {
        throw new Error("Please make sure that all fields are filled.")
        return
      }
      navigate(`/listing/${data._id}`)
    } catch (error) {
      setError(error.message);
    }
  };

  const deletePreviewImg = (index) => {
    console.log(index);
    setBuffer((imgs) => {
      return imgs.filter((img) => imgs.indexOf(img) !== index);
    });
    return;
  };

  return (
    <main className="flex p-5 flex-wrap justify-center items-center flex-col w-full">
      <h1 className="text-3xl font-semibold text-center mb-4">
        Create a Listing
      </h1>

      <div className="flex flex-wrap gap-5 ">
        <form className="flex flex-col gap-5 w-full" onChange={handleChanges}>
          <input
            id="name"
            type="text"
            placeholder="Name"
            className="p-3 rounded-lg text-xl"
            required
            maxLength="70"
            minLength="10"
            value={formData.name}
          />
          <textarea
            className="p-3 rounded-lg text-xl"
            id="description"
            placeholder="Description"
            value={formData.description}
          ></textarea>
          <input
            className="p-3 rounded-lg text-xl"
            type="text"
            placeholder="Address"
            id="address"
            value={formData.address}
          />
          <div className="flex  items-center gap-3 text-lg font-semibold flex-wrap w-full">
            <input
              type="checkbox"
              id="sale"
              checked={formData.type === "sale"}
            />
            <label htmlFor="type">Sell</label>
            <input
              type="checkbox"
              id="rent"
              checked={formData.type === "rent"}
            />
            <label htmlFor="type">Rent</label>
            <input type="checkbox" id="parking" checked={formData.parking} />
            <label htmlFor="parking">Parking spot</label>
            <input
              type="checkbox"
              id="furnished"
              checked={formData.furnished}
            />
            <label htmlFor="furnished">Furnished</label>
            <input type="checkbox" id="offer" checked={formData.offer} />
            <label htmlFor="offer">Offer</label>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <label htmlFor="bathrooms" className="font-semibold ">
              Bathrooms:
            </label>
            <input
              type="number"
              id="bathrooms"
              className="p-2 w-full rounded-lg "
              min={1}
              checked={formData.bathroom}
            />
            <label htmlFor="bedrooms" className="font-semibold">
              Bedrooms:
            </label>
            <input
              type="number"
              id="bedrooms"
              className="p-2 w-full rounded-lg "
              min={1}
              checked={formData.bedroom}
            />
            <label htmlFor="regularPrice" className="font-semibold relative">
              Regular Price:{" "}
              <span className="absolute top-5 left-0 text-sm">
                ($ per month)
              </span>
            </label>
            <input
              type="number"
              id="regularPrice"
              className="p-2 w-full rounded-lg "
              min={50}
              value={formData.regularPrice}
            />
            {formData.offer && (
              <>
                <label
                  htmlFor="discountPrice"
                  className="font-semibold relative"
                >
                  Discounted price:
                </label>
                <input
                  type="number"
                  id="discountPrice"
                  className="p-2 w-full rounded-lg"
                  min={50}
                  value={formData.discountedPrice}
                  required
                />
              </>
            )}
          </div>
        </form>

        <div className="flex flex-col gap-3 sm:w-auto w-full md:w-full">
          <p>
            <span className="font-semibold text-lg">Images:</span> The first
            image will be the cover (max 6)
          </p>
          <div className="flex flex-col gap-7">
            <input
              onChange={handleImageSelector}
              type="file"
              accept="image/*"
              multiple
            />
            <div className="flex flex-wrap gap-3 w-full sm:w-[400px]">
              {formData?.imageUrls.map((url, index) => {
                return (
                  <div
                    key={index}
                    className="w-2/6 p-2 border-2 border-slate-600 flex flex-col justify-center items-center"
                  >
                    <img
                      className="w-32 h-32 object-contain "
                      src={url}
                      alt="preview"
                    />
                    <button className="bg-transparent mt-2 px-3 rounded-lg text-red-500  font-semibold">
                      <FaCheck className="text-green-500" />
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="flex flex-wrap justify-start items-center gap-3 w-full sm:w-[400px]">
              {loading ? (
                <BeatLoader
                  loading={loading}
                  margin={4}
                  size={10}
                  speedMultiplier={2}
                />
              ) : (
                buffer.map((imgs, index) => {
                  return (
                    <div
                      key={index}
                      className="w-2/6 p-2 border-2 border-slate-600 flex flex-col justify-center items-center"
                    >
                      <img
                        className="w-32 h-32 object-contain "
                        src={`${URL.createObjectURL(imgs)}`}
                        alt="preview"
                      />
                      <button className="bg-transparent mt-2 px-3 rounded-lg text-red-500  font-semibold">
                        {buffer.includes(imgfiles[index]) ? (
                          <FaCheck className="text-green-500" />
                        ) : (
                          <FaTrash onClick={() => deletePreviewImg(index)} />
                        )}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
            <div className="flex justify-center flex-1">
              <button
                onClick={handleImageSubmission}
                className="w-full sm:w-2/3 hover:opacity-90 rounded-lg bg-green-400 p-3 text-white uppercase font-semibold"
              >
                {loading ? "Uploading" : "Upload"}
              </button>
            </div>
            <div className="flex justify-center flex-1">
              <button
                onClick={handleSubmit}
                className="w-full sm:w-2/3 disabled:bg-slate-200 hover:opacity-90 rounded-lg bg-green-400 p-3 text-white uppercase font-semibold"
              >
                {loading ? (
                  <BeatLoader
                    loading={loading}
                    margin={4}
                    size={10}
                    speedMultiplier={2}
                  />
                ) : (
                  " Create Listing"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      <ErrorToast
        errorMessage={error}
        setError={setError}
        severity={severity === "" ? "error" : severity}
        setSeverity={setSeverity}
      />
    </main>
  );
};

export default CreateLisitng;
