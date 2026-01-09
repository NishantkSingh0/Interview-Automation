import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function PricingPage({ initialData }) {
  
  const [IsLocation, setIsLocation] = useState(false);
  const [selected, setSelected] = useState(null);
  const [isStudent, setIsStudent] = useState(true); // toggle between Student & Organization
  const location = useLocation();  
  const [IsLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const CARD_VERTICAL_PADDING = "py-20";
  const CARD_WIDTH = "w-72 md:w-56";
  const CARD_GAP = "gap-2 md:gap-4";
  const type = location.state?.Type || "";
  // JSON batch state (tokens)
  const defaultBatch = { Type: "batchA", Tokens: 0, id: "batch123" };
  const [batchData, setBatchData] = useState(initialData || defaultBatch);
  
  const backendURL=import.meta.env.VITE_BACKEND_URL || "https://interview-automation.onrender.com";    //    http://127.0.0.1:8000   --   https://interview-automation.onrender.com 
  
  const [PricingData, setPricingData] = useState({
    name: location.state?.name || "",
    email: location.state?.email || "",
    TokensToAdd: 0
  });
  
  // Organization Plans
  const orgPlans = [
    { id: 1, title: "Essential", price: 109, Tokens: 5, Gradient: "bg-gradient-to-r from-gray-500 to-blue-gray-700 border-4 border-gray-600" },
    { id: 2, title: "Deluxe", price: 329, Tokens: 18, Gradient: "bg-gradient-to-r from-blue-500 to-green-400 border-4 border-blue-500" },
    { id: 3, title: "Premium", price: 476, Tokens: 31, Gradient: "bg-gradient-to-r from-purple-600 to-pink-600 border-4 border-blue-500" },
    { id: 4, title: "Most Savings", price: 600, Tokens: 50, Gradient: "bg-gradient-to-r from-orange-500 to-red-500 border-4 border-orange-500" },
  ];

  // Student Plans
  const studentPlans = [
    {id: 1, title: "Essential",price: 45,Tokens: 2, Gradient: "bg-gradient-to-r from-sky-400 to-blue-500 border-4 border-sky-500"},
    {id: 2, title: "Deluxe", price: 85, Tokens: 4, Gradient: "bg-gradient-to-r from-emerald-400 to-teal-500 border-4 border-teal-500"},
    {id: 3, title: "Premium", price: 116, Tokens: 6, Gradient: "bg-gradient-to-r from-violet-400 to-fuchsia-500 border-4 border-fuchsia-500"},
    {id: 4, title: "Most Savings", price: 199, Tokens: 13, Gradient: "bg-gradient-to-r from-amber-400 to-orange-500 border-4 border-amber-500"},
  ];

  const plans = isStudent ? studentPlans : orgPlans;
  
  useEffect(() => {
    // if no state OR empty state
    console.log("Inside UseEffect: ",location)
    if (type && type==='std'){
      setIsStudent(true)
    }else{
      setIsStudent(false)
    }
    if (location.state && Object.keys(location.state).length !== 0) {
      setIsLocation(true);
    }
  }, [location, navigate]);

  const handlePurchase = async (tokensToAdd) => {
    try {
      setIsLoading(true)
      setPricingData({...PricingData, TokensToAdd: tokensToAdd})
      const res = await axios.put(
        `${backendURL}/${type}/update-tokens/`,
        {PricingData}
      );

      if (res.data.status === "updated") {
        toast.success("Tokens updated");
      }
    } catch (err) {
      toast.error("Updation failed");
      console.error(err);
    }finally{
      setIsLoading(false)
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-white p-6">
      {/* Toggle Switch */}
      <div className="relative mb-12">
        <div className="flex bg-gray-800 rounded-full p-1 w-72 justify-between items-center shadow-lg border border-gray-600">
          <button
            onClick={() => setIsStudent(false)}
            className={`flex-1 text-center py-2 rounded-full font-semibold transition-all duration-300 
              ${!isStudent ? "bg-linear-to-r from-blue-500 to-green-400 text-white" : "text-gray-400"}
              ${(type && type==='std') ?'hidden':'block'}`}
          >
            Organization
          </button>
          <button
            onClick={() => setIsStudent(true)}
            className={`flex-1 text-center py-2 rounded-full font-semibold transition-all duration-300 
             ${isStudent ? "bg-linear-to-r from-purple-600 to-pink-600 text-white" : "text-gray-400"}
             ${(type && type==='org')?'hidden':'block'}`}
          >
            Student
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className={`flex items-end justify-center max-w-5xl w-full flex-wrap ${CARD_GAP}`}>
        {plans.map((plan) => {
          const isSelected = selected === plan.id;

          return (
            <div
              key={plan.id}
              onMouseEnter={() => setSelected(plan.id)}
              onMouseLeave={() => setSelected(null)}
              className={`rounded-2xl shadow-lg px-6 ${CARD_VERTICAL_PADDING} flex flex-col items-center transition-all duration-300 border ${CARD_WIDTH} ${
                isSelected
                  ? `${plan.Gradient} -translate-y-10 text-white z-30 shadow-2xl`
                  : "bg-gray-900 border-gray-700 text-gray-200 hover:-translate-y-10 hover:shadow-purple-500/30 hover:bg-linear-to-r hover:from-purple-600 hover:to-pink-600"
              }`}
            >
              <h3 className={`text-lg font-semibold mb-3 ${isSelected ? "text-white" : "text-gray-200"}`}>{plan.title}</h3>

              <p className={`text-3xl font-extrabold mb-6 ${isSelected ? "text-white" : "text-gray-200"}`}>
                ₹{plan.price}
              </p>
              <ul className={`text-sm space-y-2 mb-6 text-center ${isSelected ? "text-white/90" : "text-gray-300"}`}>
                <li className="flex items-center justify-center gap-2">
                  <span><b>{plan.Tokens}</b></span>
                  <img src="./Logo.png" alt="Tokens" className="w-4 h-4" />
                </li>
                <li>~ ₹{Math.floor(plan.price / plan.Tokens)} per Schedule</li>
              </ul>
              <div className={` ${IsLocation?'block':'hidden'} flex justify-center w-full mt-auto`}>
                <button
                  onClick={() => handlePurchase(plan.Tokens)}
                  className="px-6 py-2 rounded-lg font-semibold transition-all duration-300 bg-white text-purple-700 hover:scale-105"
                >
                {IsLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    "Purchase"
                )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <div className={`mt-10 text-lg ${type==='org'?'block':'hidden'}`}>For Collaboritive works and partnership contact us @<a href="mailto::nishantsingh.talk@gmail.com" className="hover:text-teal-400 text-gray-300">nishantsingh.talk@gmail.com</a></div>
    </div>
  );
}
