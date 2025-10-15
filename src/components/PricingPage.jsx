import React, { useState } from "react";

export default function PricingPage({ initialData }) {
  const [selected, setSelected] = useState(null);
  const [isStudent, setIsStudent] = useState(true); // toggle between Student & Organization

  const CARD_VERTICAL_PADDING = "py-20";
  const CARD_WIDTH = "w-72 md:w-56";
  const CARD_GAP = "gap-2 md:gap-4";

  // JSON batch state (tokens)
  const defaultBatch = { Type: "batchA", Tokens: 0, id: "batch123" };
  const [batchData, setBatchData] = useState(initialData || defaultBatch);

  // Organization Plans
  const orgPlans = [
    { id: 1, title: "Essential", price: 119, Tokens: 5, CostingRatio: 24, Gradient: "bg-gradient-to-r from-gray-500 to-blue-gray-700 border-4 border-gray-600" },
    { id: 2, title: "Deluxe", price: 349, Tokens: 18, CostingRatio: 19, Gradient: "bg-gradient-to-r from-blue-500 to-green-400 border-4 border-blue-500" },
    { id: 3, title: "Premium", price: 476, Tokens: 28, CostingRatio: 17, Gradient: "bg-gradient-to-r from-purple-600 to-pink-600 border-4 border-blue-500" },
    { id: 4, title: "Most Savings", price: 556, Tokens: 37, CostingRatio: 15, Gradient: "bg-gradient-to-r from-orange-500 to-red-500 border-4 border-orange-500" },
  ];

  // Student Plans
  const studentPlans = [
    {id: 1, title: "Essential",price: 45,Tokens: 2, CostingRatio: 24, Gradient: "bg-gradient-to-r from-sky-400 to-blue-500 border-4 border-sky-500"},
    {id: 2, title: "Deluxe", price: 85, Tokens: 4, CostingRatio: 21, Gradient: "bg-gradient-to-r from-emerald-400 to-teal-500 border-4 border-teal-500"},
    {id: 3, title: "Premium", price: 116, Tokens: 6, CostingRatio: 19, Gradient: "bg-gradient-to-r from-violet-400 to-fuchsia-500 border-4 border-fuchsia-500"},
    {id: 4, title: "Most Savings", price: 199, Tokens: 13, CostingRatio: 15, Gradient: "bg-gradient-to-r from-amber-400 to-orange-500 border-4 border-amber-500"},
  ];

  const plans = isStudent ? studentPlans : orgPlans;

  const handlePurchase = (tokensToAdd) => {
    const updated = { ...batchData, Tokens: batchData.Tokens + tokensToAdd };
    setBatchData(updated);
    console.log("Updated batchData:", updated);
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-white p-6">
      {/* Toggle Switch */}
      <div className="relative mb-12">
        <div className="flex bg-gray-800 rounded-full p-1 w-72 justify-between items-center shadow-lg border border-gray-600">
          <button
            onClick={() => setIsStudent(false)}
            className={`flex-1 text-center py-2 rounded-full font-semibold transition-all duration-300 ${
              !isStudent ? "bg-gradient-to-r from-blue-500 to-green-400 text-white" : "text-gray-400"
            }`}
          >
            Organization
          </button>
          <button
            onClick={() => setIsStudent(true)}
            className={`flex-1 text-center py-2 rounded-full font-semibold transition-all duration-300 ${
              isStudent ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white" : "text-gray-400"
            }`}
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
                  : "bg-gray-900 border-gray-700 text-gray-200 hover:-translate-y-10 hover:shadow-purple-500/30 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600"
              }`}
            >
              <h3 className={`text-lg font-semibold mb-3 ${isSelected ? "text-white" : "text-gray-200"}`}>{plan.title}</h3>

              <p className={`text-3xl font-extrabold mb-6 ${isSelected ? "text-white" : "text-gray-200"}`}>
                ₹{plan.price}
              </p>

              <ul className={`text-sm space-y-2 mb-6 text-center ${isSelected ? "text-white/90" : "text-gray-300"}`}>
                <li>{plan.Tokens} Tokens</li>
                <li>Costs ₹{plan.CostingRatio} per Schedule</li>
              </ul>

              <div className="flex justify-center w-full mt-auto">
                <button
                  onClick={() => handlePurchase(plan.Tokens)}
                  className="px-6 py-2 rounded-lg font-semibold transition-all duration-300 bg-white text-purple-700 hover:scale-105"
                >
                  PURCHASE
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
