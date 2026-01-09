import React, { useState, useEffect } from 'react';
import { Upload, FileText, User, Circle, Trash } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, useLocation } from 'react-router-dom';

const StdDashboard = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(0);
  const [IsLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [isAbout, setIsAbout] = useState(false);
  const backendURL=import.meta.env.VITE_BACKEND_URL || "https://interview-automation.onrender.com";    //    http://127.0.0.1:8000   --   https://interview-automation.onrender.com 
  console.log("Received Data:", location)
  useEffect(() => {
    // if no state OR empty state
    if (!location.state || Object.keys(location.state).length === 0) {
      navigate("/", { replace: true });
    }
  }, [location, navigate]);

  const [studentData, setStudentData] = useState({
    StudentMail: location.state?.StudentMail,
    StudentName: location.state?.StudentName,
    Designation: location.state?.Designation,
    ExpectedPosition: location.state?.ExpectedPosition,
    Resume: location.state?.Resume,
    Type: 'std',
  });
  // ✅ Sample backend-style JSON test data
  const candNames = [
    ['Alice Johnson', 'Bob Smith', 'Charlie Brown', 'Charlie Brown'],
    ['David Lee', 'Eva Green', 'Frank White', 'Charlie Brown'],
    ['Grace Kim', 'Henry Ford', 'Isabella Cruz', 'Charlie Brown'],
  ];


  const candScores = [
    [
      [85, 92, 88],
      [78, 80, 75],
      [90, 95, 92],
      [90, 95, 92],
    ],
    [
      [70, 75, 72],
      [88, 86, 90],
      [60, 68, 65],
      [88, 86, 90],
    ],
    [
      [95, 97, 96],
      [84, 89, 85],
      [95, 97, 96],
      [73, 77, 75],
    ],
  ];

  const resumeInfos = [
    [
      'Frontend Developer – React & Tailwind',
      'Backend Developer – Node.js & Express',
      'Full Stack Developer – MERN Stack',
      'Backend Developer – Node.js & Express',
    ],
    [
      'UI/UX Designer – Figma Expert',
      'QA Engineer – Selenium & Cypress',
      'Data Analyst – Power BI & SQL',
      'QA Engineer – Selenium & Cypress',
    ],
    [
      'ML Engineer – Python & TensorFlow',
      'DevOps Engineer – AWS & Docker',
      'ML Engineer – Python & TensorFlow',
      'Cybersecurity Analyst – Network Security',
    ],
  ];

  const batches = candNames;
  const HandleUpdate = async (e) => {
    try {
      setIsLoading(true)
      const res = await axios.put(
        `${backendURL}/std/update-info/`,
        studentData
      );

      if (res.data.status === "updated") {
        // 🔁 Reassign state from backend
        setStudentData(res.data.data);
        toast.success("Student info updated");
      }
    } catch (err) {
      toast.error("Updation failed");
      console.error(err);
    }
    finally{
      setIsLoading(false)
    }
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
        setStudentData({ ...studentData, Resume: data.parsed_text});
        
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

  const HandleScheduleInterview = () => {
    navigate('/verification', { state: location.state })  // Pass existing state to the next page;
  };
  
  return (
    <div className="flex min-h-screen bg-gray-950 text-white font-sans">
      {/* Sidebar */}
      <div
        className={`${menuOpen ? 'w-56' : 'w-16'} bg-gray-900 p-4 transition-all duration-300 flex flex-col fixed top-0 left-0 h-full shadow-lg`}
        onMouseEnter={() => {if (!menuOpen) setMenuOpen(true);}}   onMouseLeave={() => {if (menuOpen) setMenuOpen(false);}}>
        {/* About Menu */}
        <div className="flex items-center justify-start mb-6 border-b border-gray-700 pb-3">
          <button
            title='About You'
            onClick={() => setIsAbout(true)}
            className={`w-full text-cente hover:bg-indigo-700 ${isAbout?`bg-indigo-700`:`bg-gray-800`} ${menuOpen?`px-2 md:px-4`:`px-0 md:px-2`} py-2 rounded-lg transition-all text-sm font-medium truncate`}
          >
            {menuOpen?<div className="flex items-center"><User className="mr-2" size={16}/> <span className="leading-none">{location.state.StudentName?.slice(0, 20)}</span></div>:<User size={16}/>}
          </button>
        </div>

        {/* Batch Buttons */}
        <div className="flex-1 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-gray-700">
          {batches.map((_, index) => (
            <button
              key={index}
              title={`Interview ${index + 1}`}
              onClick={() => {
                setSelectedBatch(index);
                setIsAbout(false);
              }}
              className={`w-full text-left ${menuOpen?`px-2 md:px-4`:`px-1 md:px-3`} py-2 rounded-lg text-sm transition-all duration-200 hover:bg-gray-800 focus:outline-none truncate ${
                selectedBatch === index && !isAbout ? 'bg-indigo-700 text-white' : 'bg-gray-800/50 text-gray-300'
              }`}
            >
              {menuOpen?`Interview ${index + 1}`:`${index + 1}`}
            </button>
          ))}
        </div>

        {/* Add Batch Button */}
        <div className="mt-4 border-t border-gray-700 cursor-pointer pt-3">
          <button
            title='Schedule a interview'
            onClick={HandleScheduleInterview}
            className={`w-full text-center bg-indigo-600 hover:bg-indigo-700 ${menuOpen?`px-2 md:px-4`:`px-0 md:px-2`} py-2 rounded-lg transition-all text-sm font-medium truncate`}
          >
            {menuOpen?`Schedule Interview`:`+`}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`${isAbout ? "hidden" : "block"} flex-1 ${menuOpen ? "md:ml-56" : "md:ml-14"} p-8 transition-all duration-300`}>
        <h1 className="text-3xl font-semibold mb-6 text-indigo-400 tracking-wide">
          Student Dashboard [Interview {selectedBatch + 1}]
        </h1>

        <div className="overflow-x-auto rounded-xl border border-gray-800 shadow-xl">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-900 text-indigo-400">
              <tr>
                <th className="px-6 py-3 text-left uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left uppercase tracking-wider">Scores</th>
                <th className="px-6 py-3 text-left uppercase tracking-wider">Resume Information</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {candNames[selectedBatch].map((name, idx) => (
                <tr key={idx} className="hover:bg-gray-800 transition-colors">
                  <td className="px-6 py-3 font-medium text-gray-200">{name}</td>
                  <td className="px-6 py-3 text-gray-300">
                    {candScores[selectedBatch][idx].join(', ')}
                  </td>
                  <td className="px-6 py-3 text-gray-400">
                    {resumeInfos[selectedBatch][idx]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* About Student Section */}
      <div
        className={`${isAbout ? "flex" : "hidden"} flex-1 ${
          menuOpen ? "md:ml-56" : "md:ml-14"
        } min-h-screen p-8 transition-all duration-300 justify-center items-center`}
      >
        <div className="w-full max-w-5xl">
      
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            {/* Left side */}
            <div>
              <h1 className="text-3xl font-semibold text-indigo-400 tracking-wide">
                Hey, {location.state?.StudentName}
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                View and update your personal & professional information
              </p>
            </div>

            {/* Right side */}
            <div onClick={() =>  navigate("/Pricings",{state:studentData})} className="flex items-center gap-2 cursor-pointer bg-gray-800 px-2 py-1 border-0 rounded-lg" title={location.state?.Tokens===0?`You can't Schedule any interview right now.. Click to Recharge now`:'Click to Add More'}>
              <p className="text-gray-300">
                {location.state?.Tokens}
              </p>
              <img
                src="./Logo.png"   // or import tokenImg from "../assets/token.png"
                alt="Tokens"
                className="w-5 h-5"
              />
            </div>
          </div>
      
          {/* Card */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-8">
      
            {/* BASIC INFO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Name</label>
                <input
                  value={studentData.StudentName}
                  onChange={(e) =>
                    setStudentData({ ...studentData, StudentName: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label title="Email is a primary key of DB, So Can't be changed" className="flex items-center text-sm text-gray-400 mb-1">Email <span><Circle fill="orange" stroke="orange" size={8} className='ml-2'/></span></label>
                <input
                  value={studentData.StudentMail}
                  readOnly
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Designation</label>
                <input
                  value={studentData.Designation}
                  onChange={(e) =>
                    setStudentData({ ...studentData, Designation: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Expected Position</label>
                <input
                  value={studentData.ExpectedPosition}
                  onChange={(e) =>
                    setStudentData({ ...studentData, ExpectedPosition: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg"
                />
              </div>
            </div>
             
            {/* RESUME */}
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Resume</label>
              <textarea
                rows={studentData.Resume ? 16 : 2}
                value={studentData.Resume || ""}
                readOnly
                className="w-full px-4 py-3 my-3 bg-gray-800 border border-gray-700 rounded-lg resize-none focus:outline-none focus:border-indigo-500"
              />
            </div>
            {/* RESUME UPLOAD */}
            <div>            
              {!studentData.Resume ? (
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
                    Uploaded Resume 
                  </p>
                  <button
                    type="button"
                    onClick={() => setStudentData({ ...studentData, Resume: "" })}
                    className="ml-auto text-red-400 hover:text-red-500 text-sm"
                  >
                   <Trash/>
                  </button>
                </div>
              )}
            </div>

            {/* FOOTER */}
            <div className="flex justify-end border-t border-gray-800 pt-6">
              <button
                onClick={HandleUpdate}
                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm font-medium"
              >
              {IsLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "Update Info"
              )}
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default StdDashboard;

