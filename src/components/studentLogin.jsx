import { useState, useEffect } from "react";
// import Suggestions from "./Suggestions.jsx";
import { Upload, FileText, Trash } from "lucide-react";
import { useNavigate, useLocation } from 'react-router-dom';
// import ScreenWarning from './Others/NoMob.jsx';
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
// import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
// import { auth } from "../firebase.js";


export default function StudentLogin() {
  const backendURL=import.meta.env.VITE_BACKEND_URL || "https://interview-automation.onrender.com";    //    http://127.0.0.1:8000   --   https://interview-automation.onrender.com 
  // if (window.innerWidth < 1024) {
  //   return <ScreenWarning />;  // Smaller screens not allowed
  // }
  const navigate=useNavigate();
  const location = useLocation();

  useEffect(() => {
    // if no state OR empty state -> Return to Home
    console.log("Inside UseEffect: ",location)
    if (!location.state?.email) {
      navigate("/", { replace: true });
    }
  }, [location, navigate]);

  const [formData, setFormData] = useState({
      StudentMail : location.state?.email,
      StudentName : "",
      Tokens : 0,
      ExpectedPosition : "",
      Designation : "",
      Resume : "",
      Scores : [],
      OurFeedback : "",
      ImprovementsNeeded : ""
  });
  const [loading, setLoading] = useState(false);

  const levels=["Beginner","I", "II", "III", "Advanced"]

  useEffect(() => {
    console.log("Location state received:", location.state);
    const { Designation, StudentName, ExpectedPosition } = location.state || {};

    if (Designation || StudentName || ExpectedPosition) {
      setFormData((prev) => ({
        ...prev,
        ...(Designation && { Designation }),
        ...(StudentName && { StudentName }),
        ...(ExpectedPosition && { ExpectedPosition }),
      }));
    }
  }, [
    location.state?.Designation,
    location.state?.StudentName,
    location.state?.ExpectedPosition,
  ]);

  const handleRadioChange = (e) => {
    setFormData({ ...formData, ExpectedPosition: e.target.value });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    if (file && file.type === "application/pdf") {
      
      // Prepare form data for upload
      const formDataToSend = new FormData();
      formDataToSend.append("Resume", file);
      
      try {
        const res = await fetch(`${backendURL}/ParseResumes/`, {
          method: "POST",
          body: formDataToSend,
        });
        
        if (!res.ok) throw new Error("Failed to upload resume");
        
        const data = await res.json();
        console.log("Parsed Resume Text:", data); // or data.text depending on backend
        setFormData({ ...formData, Resume: data.parsed_text});
        
        toast.success("Resume parsed successfully!");

        // optionally set parsed text in state
        // setParsedText(data.text);

      } catch (err) {
        console.error("Error:", err);
        toast.error("Error uploading or parsing resume");
      }
    } else {
      toast.error("Please upload a PDF file only!");
    }
  };


  const handleGoogleLogin = async () => {
    // try {
    //   const provider = new GoogleAuthProvider();
    //   const result = await signInWithPopup(auth, provider);

    //   // The signed-in user info
    //   const user = result.user;
    //   console.log("User:", user.displayName, user.email, user.emailVerified);
    //   toast.success("User:", user.displayName, user.email, user.emailVerified);
    //   // emailVerified will always be true for Google users
    // } catch (error) {
    //   console.error(error);
    //   toast.error(error)
    // }
    toast.error("Authentication Login script is not managed")
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData)
    if (!formData.StudentMail || !formData.StudentName || !formData.Designation || !formData.ExpectedPosition || !formData.Resume) { //  !formData.username || !formData.password ||
      toast.error("Please fill all fields and upload a PDF resume!");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${backendURL}/std/create/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      console.log("Server Response:", result);

      if (result.status === "created") {
        toast.success("You are registered successfully.");
        navigate('/Student/StdDashboard', { state: result.data })
        toast.success("Organization created successfully!");
      } else {
        toast.error("Failed to register!");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }

  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-950 via-gray-900 to-indigo-950 flex items-center justify-center text-white px-4">

      <div className="w-full max-w-3xl bg-gray-900/90 backdrop-blur border border-gray-800 rounded-2xl shadow-2xl p-8 md:p-10">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-indigo-400">
            Student Registration
          </h1>
          <p className="text-sm text-gray-400 mt-2">
            Register once and attend interviews seamlessly
          </p>
        </div>

        <form className="space-y-8" onSubmit={handleSubmit}>

          {/* DESIGNATION */}
          <div>          
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Designation
            </label>
            <input
              type="text"
              placeholder="Enter Designation"
              value={formData.Designation}
              onChange={(e) =>
                setFormData({ ...formData, Designation: e.target.value })
              }
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* EXPECTED POSITION */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Expected Position Level
            </label>
            <div className="flex flex-wrap gap-3 justify-center">
              {levels.map((level) => (
                <label
                  key={level}
                  className={`px-5 py-2 rounded-full cursor-pointer text-sm font-medium transition-all border
                    ${
                      formData.ExpectedPosition === level
                        ? "bg-indigo-600 border-indigo-600 shadow-md"
                        : "bg-gray-800 border-gray-700 hover:bg-gray-700"
                    }`}
                >
                  <input
                    type="radio"
                    name="ExpectedPosition"                 // ⭐ same name for the group
                    value={level}
                    checked={formData.ExpectedPosition === level}
                    onChange={handleRadioChange}
                    className="hidden"
                  />
                  {level}
                </label>
              ))}
            </div>
          </div>

          {/* NAME */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Full Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              value={formData.StudentName}
              onChange={(e) =>
                setFormData({ ...formData, StudentName: e.target.value })
              }
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* GOOGLE LOGIN */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-gray-800 border border-gray-700 hover:bg-gray-700 transition-all"
          >
            <FcGoogle className="w-6 h-6" />
            <span className="font-medium">Continue with Google</span>
          </button>

          {/* RESUME UPLOAD */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Upload Resume (PDF)
            </label>

            {!formData.Resume ? (
              <label
                htmlFor="resumeUpload"
                className="border-2 border-dashed border-gray-600 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 transition-all"
              >
                <Upload className="w-10 h-10 text-indigo-400 mb-3" />
                <p className="text-gray-400 text-sm">
                  Drag & drop or click to upload
                </p>
                <input
                  type="file"
                  id="resumeUpload"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="flex items-center gap-4 bg-gray-800 border border-gray-700 rounded-lg p-4">
                <FileText className="text-green-500 w-6 h-6" />
                <p className="text-sm text-gray-200 truncate">
                  Resume Uploaded
                </p>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, Resume: "" })}
                  className="ml-auto text-red-400 hover:text-red-500 text-sm"
                >
                  <Trash/>
                </button>
              </div>
            )}
          </div>

          {/* SUBMIT */}
          <button
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold flex justify-center items-center gap-2 transition-all ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98]"
            }`}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Continue"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}