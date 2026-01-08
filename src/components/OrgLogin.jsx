import React, { useState, useEffect } from "react";
import { useNavigate, useLocation  } from "react-router-dom";
import toast from "react-hot-toast";

export default function OrgLogin() {
  const backendURL= import.meta.env.VITE_BACKEND_URL || "https://interview-automation.onrender.com";     //    http://127.0.0.1:8000   --   https://interview-automation.onrender.com 
  const navigate = useNavigate();
  const location = useLocation();
  const levels=["Startup", "Growing", "Mature", "Enterprise"]
  const [orgDetails, setOrgDetails] = useState({
    email: "",
    name: "",
    tokens: 0,
    org_size: "",
    cand_names: ['None'],
    cand_scores: ['None'],
    resume_infos: ['None'],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state?.email) {
      setOrgDetails((prev) => ({ ...prev, email: location.state.email }));
    }
  }, [location.state?.email]);

  const handleChange = (e) => {
    setOrgDetails({ ...orgDetails, [e.target.name]: e.target.value });
  };

  const handleRadioChange = (e) => {
    setOrgDetails({ ...orgDetails, org_size: e.target.value });
  };

  const handleNext = async () => {
    if (!orgDetails.name || !orgDetails.email || !orgDetails.org_size) {
      toast.error("Please fill all fields.. Before proceeding further");
      return;
    }
    console.log(orgDetails)
    // toast.success("Form Filled successfully. But nothing to naviagete")
    // navigate("/organization/pay", { state: orgDetails });
    setLoading(true);

    try {
      const response = await fetch(`${backendURL}/org/create/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orgDetails),
      });

      const result = await response.json();
      console.log("Server Response:", result);

      if (result.status === "created") {
        toast.success("Organization created successfully!");
        // Navigate to Add_Candidates with newly created org data
        navigate("/Organization/OrgDashboard", { state: result.data });
      } else {
        toast.error("Failed to create organization!");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
    // navigate('/Organization/Add_Candidates')
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-indigo-950 text-white px-4">

      <div className="w-full max-w-md bg-gray-900/90 backdrop-blur border border-gray-800 rounded-2xl shadow-2xl p-8">

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-indigo-400">
            Organization Setup
          </h1>
          <p className="text-sm text-gray-400 mt-2">
            Create your organization profile to get started
          </p>
        </div>

        {/* Form */}
        <div className="space-y-6">

          {/* Organization Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Organization Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="XYZ Pvt Ltd"
              value={orgDetails.name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>

          {/* Organization Email */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Organization Email
            </label>
            <input
              type="text"
              name="email"
              placeholder="admin@example.com"
              value={orgDetails.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>

          {/* Organization Type */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Organization Type
            </label>
            <div className="flex flex-wrap gap-3 justify-center">
              {levels.map((org_size) => (
                <label
                  key={org_size}
                  className={`px-5 py-2 rounded-full cursor-pointer text-sm font-medium transition-all border
                    ${
                      orgDetails.org_size === org_size
                        ? "bg-indigo-600 border-indigo-600 shadow-md"
                        : "bg-gray-800 border-gray-700 hover:bg-gray-700"
                    }`}
                >
                  <input
                    type="radio"
                    name="org_size"          // ⭐ REQUIRED
                    value={org_size}
                    checked={orgDetails.org_size === org_size}
                    onChange={handleRadioChange}
                    className="hidden"
                  />
                  {org_size}
                </label>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleNext}
            disabled={loading}
            className={`w-full mt-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
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
        </div>
      </div>
    </div>
  );
}
