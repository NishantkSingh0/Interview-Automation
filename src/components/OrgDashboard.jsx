import React, { useState } from 'react';
import { Building  } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const OrgDashboard = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(0);
  const [IsAbout, setIsAbout] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [orgData, setOrgData] = useState({
    name: location.state?.name || "",
    email: location.state?.email || "",
    org_size: location.state?.org_size || ""
  });
  console.log("Received: ",location)
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

  const handleAddBatch = () => {
    navigate('/Organization/Add_Candidates');
  };
  
  const HandleUpdate = () => {
    navigate('/Organization/Add_Candidates');
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
            title='About Organization'
            onClick={() => setIsAbout(true)}
            className={`w-full text-center bg-gray-600 hover:bg-indigo-700 ${IsAbout?`bg-indigo-700`:``} ${menuOpen?`px-2 md:px-4`:`px-0 md:px-2`} py-2 rounded-lg transition-all text-sm font-medium truncate`}
          >
            {menuOpen?<div className="flex items-center"><Building  className="mr-2" size={16}/> <span className="leading-none">{location.state.name}</span></div>:<Building  size={16}/>}
          </button>
        </div>

        {/* Batch Buttons */}
        <div className="flex-1 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-gray-700">
          {batches.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setSelectedBatch(index);
                setIsAbout(false);
              }}
              className={`w-full text-left ${menuOpen?`px-2 md:px-4`:`px-1 md:px-3`} py-2 rounded-lg text-sm transition-all duration-200 hover:bg-gray-800 focus:outline-none truncate ${
                selectedBatch === index && !IsAbout ? 'bg-indigo-700 text-white' : 'bg-gray-900 text-gray-300'
              }`}
            >
              {menuOpen?`Batch ${index + 1}`:`${index + 1}`}
            </button>
          ))}
        </div>

        {/* Add Batch Button */}
        <div className="mt-4 border-t border-gray-800 cursor-pointer pt-3">
          <button
            title='Schedule a interview'
            onClick={handleAddBatch}
            className={`w-full text-center bg-indigo-600 hover:bg-indigo-700 ${menuOpen?`px-2 md:px-4`:`px-0 md:px-2`} py-2 rounded-lg transition-all text-sm font-medium truncate`}
          >
            {menuOpen?`Add Batch +`:`+`}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`${IsAbout?'hidden':'block'} flex-1 ${menuOpen?`md:ml-56`:`md:ml-14`} p-8 transition-all duration-300`}>
        <h1 className="text-3xl font-semibold mb-6 text-indigo-400 tracking-wide">
          Candidate Dashboard - Batch {selectedBatch + 1}
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

      {/* About Organization Section */}
      <div
        className={`${IsAbout ? "flex" : "hidden"} flex-1 ${
          menuOpen ? "md:ml-56" : "md:ml-14"
        } min-h-screen p-8 transition-all duration-300 justify-center items-center`}
      >
        <div className="w-full max-w-4xl">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-indigo-400 tracking-wide">
              Welcome,
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              View and update your organization information
            </p>
          </div>
      
          {/* Card */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-8">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Organization Name */}
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Organization Name
                </label>
                <input
                  type="text"
                  value={orgData.name}
                  onChange={(e) =>
                    setOrgData({ ...orgData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 text-gray-200 border border-gray-700 focus:outline-none focus:border-indigo-500"
                />
              </div>
                
              {/* Email */}
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={orgData.email}
                  onChange={(e) =>
                    setOrgData({ ...orgData, email: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 text-gray-200 border border-gray-700 focus:outline-none focus:border-indigo-500"
                />
              </div>
                
              {/* Organization Size */}
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-400 mb-1">
                  Organization Size
                </label>
                <input
                  type="text"
                  value={orgData.org_size}
                  onChange={(e) =>
                    setOrgData({ ...orgData, org_size: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 text-gray-200 border border-gray-700 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
                
            {/* Footer */}
            <div className="flex justify-end mt-8 border-t border-gray-800 pt-6">
              <button
                onClick={HandleUpdate}
                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-sm font-medium"
              >
                Update Organization
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrgDashboard;

