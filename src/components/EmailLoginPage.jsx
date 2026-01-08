import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

export default function OrgLogin() {
  const navigate = useNavigate();
  const backendURL= import.meta.env.VITE_BACKEND_URL || "https://interview-automation.onrender.com";    //    http://127.0.0.1:8000   --   https://interview-automation.onrender.com
  const location = useLocation();
  const [Details, setDetails] = useState({email: ""});
  // console.log(location.state?.from, "location.state?.from===Org", location.state?.from==="Org")

  const [loading, setLoading] = useState(false); // track loading

  const handleChange = (e) => {
    setDetails({ ...Details, [e.target.name]: e.target.value });
  };

  const handleNext = async () => {
    if (!Details.email) {
      if (location.state?.from === "Org") {
        toast.error("Please enter your Organization Email!");
      } else {
        toast.error("Please enter your Personal Email!");
      }
      return;
    }

    setLoading(true); // start loading

    if (location.state?.from==="Org"){
      try {
        const response = await fetch(`${backendURL}/org/get/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: Details.email }),
        });

        const result = await response.json();
        console.log("Server Response:", result);
        // console.log("Status raw:", result.status, "| type:", typeof result.status, "not_found===result.status:", "not_found"===result.status);
        if (result.status === "exists") {
          toast.success("Organization found!");
          navigate("/Organization/OrgDashboard", { state: result.data });
        } else if (result.status === "not_found") {
          toast.error("Organization not found. Please register!");
          navigate("/Organization", { state: { email: Details.email } });
        } else {
          toast.error("Unexpected server response!");
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("Something went wrong. Please try again later!");
      } finally {
        setLoading(false); // stop loading
      }
    }
    else{
      try {
        const response = await fetch(`${backendURL}/std/get/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: Details.email }),
        });

        const result = await response.json();
        console.log("Server Response:", result);
        // console.log("Status raw:", result.status, "| type:", typeof result.status, "not_found===result.status:", "not_found"===result.status);
        if (result.status === "exists") {
          toast.success("Student found!");
          navigate("/Student/StdDashboard", { state: result.data });
        } else if (result.status === "not_found") {
          toast.error("Student not found. Please register!");
          navigate("/Student", { state: { email: Details.email } });
        } else {
          toast.error("Unexpected server response!");
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("Something went wrong. Please try again later!");
      } finally {
        setLoading(false); // stop loading
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-indigo-950 text-white px-4">

      <div className="w-full max-w-md bg-gray-900/90 backdrop-blur border border-gray-800 rounded-2xl shadow-2xl p-8">

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-indigo-400">
            {location.state?.from === "Org" ? "Organization Login" : "Student Login"}
          </h1>
          <p className="text-sm text-gray-400 mt-2">
            {location.state?.from === "Org"
              ? "Access your organization dashboard"
              : "Access your interview dashboard"}
          </p>
        </div>

        {/* Input */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-300">
            {location.state?.from === "Org"
              ? "Organization Primary Email"
              : "Your Personal Email"}
          </label>

          <input
            type="text"
            name="email"
            placeholder="example@gmail.com"
            className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            value={Details.email}
            onChange={handleChange}
            onBlur={(e) => {
              const val = e.target.value;
              const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

              if (val && !emailRegex.test(val)) {
                toast.error("Enter a valid Gmail address (example@gmail.com)");
                setDetails({ ...Details, email: "" });
              }
            }}
          />
        </div>

        {/* Button */}
        <button
          onClick={handleNext}
          disabled={loading}
          className={`w-full mt-8 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
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

        {/* Footer hint */}
        <p className="text-xs text-gray-500 text-center mt-6">
          We'll Check if you are already registered
        </p>
      </div>
    </div>
  );
}
