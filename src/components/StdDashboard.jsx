import React, { useState } from 'react';
import { User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const StdDashboard = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const [isAbout, setIsAbout] = useState(false);
  console.log("Received Data",location)
  const [studentData, setStudentData] = useState({
    StudentName: location.state?.StudentName || "",
    StudentMail: location.state?.StudentMail || "",
    Designation: location.state?.Designation || "",
    ExpectedPosition: location.state?.ExpectedPosition || "",
    Resume: location.state?.Resume || "",
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

  const HandleScheduleInterview = () => {
    navigate('/verification', { state: location.state })  // Pass existing state to the next page;
  };
  
  const HandleUpdate = () => {
    navigate('/Student', { state: location.state })  // Pass existing state to the next page;
  };

  return (
    <div className="flex min-h-screen bg-gray-950 text-white font-sans">
      {/* Sidebar */}
      <div
        className={`${menuOpen ? 'w-56' : 'w-16'} bg-gray-900 p-4 transition-all duration-300 flex flex-col fixed top-0 left-0 h-full shadow-lg`}
        onMouseEnter={() => {if (!menuOpen) setMenuOpen(true);}}   onMouseLeave={() => {if (menuOpen) setMenuOpen(false);}}>
        {/* About Menu */}
        <div className="flex items-center justify-start mb-6 border-b border-gray-800 pb-3">
          <button
            title='About You'
            onClick={() => setIsAbout(true)}
            className={`w-full text-cente hover:bg-indigo-700 ${isAbout?`bg-indigo-700`:`bg-gray-600`} ${menuOpen?`px-2 md:px-4`:`px-0 md:px-2`} py-2 rounded-lg transition-all text-sm font-medium truncate`}
          >
            {menuOpen?<div className="flex items-center"><User className="mr-2" size={16}/> <span className="leading-none">{location.state.StudentName}</span></div>:<User size={16}/>}
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
                selectedBatch === index && !isAbout ? 'bg-indigo-700 text-white' : 'bg-gray-900 text-gray-300'
              }`}
            >
              {menuOpen?`Interview ${index + 1}`:`${index + 1}`}
            </button>
          ))}
        </div>

        {/* Add Batch Button */}
        <div className="mt-4 border-t border-gray-800 cursor-pointer pt-3">
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
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-indigo-400 tracking-wide">
              Hey, {location.state.StudentName}
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              View and update your personal & professional information
            </p>
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
                <label className="text-sm text-gray-400 mb-1 block">Email</label>
                <input
                  value={studentData.StudentMail}
                  onChange={(e) =>
                    setStudentData({ ...studentData, StudentMail: e.target.value })
                  }
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
                rows={16}
                value={studentData.Resume}
                onChange={(e) =>
                  setStudentData({ ...studentData, Resume: e.target.value })
                }
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg resize-none focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* FOOTER */}
            <div className="flex justify-end border-t border-gray-800 pt-6">
              <button
                onClick={HandleUpdate}
                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm font-medium"
              >
                Update Profile
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default StdDashboard;

