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
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-xl w-125">
        <h1 className="text-2xl font-bold text-center mb-6">
          Organization Details
        </h1>
          <div className="space-y-2 mb-4">
              <label className="block text-sm font-medium">Organization Name</label>
              <input
                type="text"
                name="name"
                placeholder='xyz pvt ltd'
                className="w-full sm:px-6 sm:p-2 border rounded peer px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-600"
                value={orgDetails.name}
                onChange={handleChange}
              />
              <div className="ml-4 w-0 h-1 rounded-full bg-blue-500 transition-all duration-300 peer-hover:w-[60%] peer-focus:w-[88%] sm:peer-focus:w-[94%]"></div>
          </div>
          <div className="space-y-2 mb-4">
              <label className="block text-sm font-medium">Organization Email</label>
              <input
                type="text"
                name="email"
                placeholder='admin@example.com'
                className="w-full sm:px-6 sm:p-2 border rounded peer px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-600"
                value={orgDetails.email}
                onChange={handleChange}
              />
              <div className="ml-4 w-0 h-1 rounded-full bg-blue-500 transition-all duration-300 peer-hover:w-[60%] peer-focus:w-[88%] sm:peer-focus:w-[94%]"></div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Organization Type
            </label>

            <div className="flex gap-3 justify-center">
              {levels.map((org_size) => (
                <label
                  key={org_size}
                  className={`px-4 py-2 rounded-2xl cursor-pointer shadow-sm transition-all 
                    border text-sm font-medium
                    ${
                      orgDetails.org_size === org_size
                        ? "bg-blue-500 text-white shadow-md border-blue-600"
                        : "bg-gray-600 text-white hover:bg-gray-700 border-gray-300"
                    }`}
                >
                  <input
                    type="radio"
                    name="orgType"
                    value={org_size}
                    onChange={handleRadioChange}
                    className="hidden"
                  />
                  {org_size}
                </label>
              ))}
            </div>
          </div>
        <button
          onClick={handleNext}
          disabled={loading}
          className={`w-full mt-6 py-3 rounded-lg font-semibold cursor-pointer flex items-center justify-center gap-2 ${
            loading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            "Next"
          )}
        </button>
      </div>
    </div>
  );
}
