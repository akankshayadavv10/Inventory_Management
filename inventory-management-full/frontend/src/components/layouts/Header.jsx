// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { useCompany } from "../../context/CompanyContext";
// import { useAuth } from "../../context/AuthContext";

// function Header() {
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const { companies, currentCompany, setCurrentCompany, loading } = useCompany();

//   const handleCompanyChange = (e) => {
//     const selectedCompany = companies.find(
//       (c) => c._id === e.target.value || c.id === e.target.value
//     );
//     if (selectedCompany) {
//       setCurrentCompany(selectedCompany);
//       navigate("/dashboard"); // Redirect to dashboard on company change
//     }
//   };

//   if (loading) {
//     return (
//       <header className="bg-white border-b border-gray-200 p-4">
//         <p className="text-gray-500">Loading companies...</p>
//       </header>
//     );
//   }

//   return (
//     <header className="bg-white border-b border-gray-200 z-10">
//       <div className="flex flex-wrap items-center justify-between h-auto min-h-16 px-4 py-2 md:px-6 md:py-0">
//         {/* Company Selector */}
//         <div className="flex items-center w-full md:w-auto mb-2 md:mb-0">
//           <span className="text-sm text-gray-500 mr-2">Company:</span>
//           <select
//             value={currentCompany?.id || currentCompany?._id || ""}
//             onChange={handleCompanyChange}
//             className="flex-grow md:flex-grow-0 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
//             aria-label="Select company"
//           >
//             {companies.map((company) => (
//               <option key={company._id || company.id} value={company._id || company.id}>
//                 {company.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* User Info */}
//         <div className="flex items-center space-x-4">
//           <div className="flex items-center">
//             <div className="text-gray-700 font-extrabold">
//               Welcome, {user?.name}
//             </div>
//             <div className="ml-2 hidden md:block">
//               <div className="text-xs text-gray-500">{user?.role}</div>
//             </div>
//           </div>
//           {/* Add notification or settings icons here if needed */}
//         </div>
//       </div>
//     </header>
//   );
// }

// export default Header;




import React from "react";
import { useAuth } from "../../context/AuthContext";

function Header() {
  const { user } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 z-10">
      <div className="flex flex-wrap items-center justify-between h-auto min-h-16 px-4 py-2 md:px-6 md:py-0">
        
        {/* App/Brand Name */}
        <div className="flex items-center w-full md:w-auto mb-2 md:mb-0">
          <h1 className="text-lg font-bold text-gray-700">
            Invoice Management
          </h1>
        </div>

        {/* User Info */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="text-gray-700 font-extrabold">
              Welcome, {user?.name || "Guest"}
            </div>
            <div className="ml-2 hidden md:block">
              <div className="text-xs text-gray-500">{user?.role || "User"}</div>
            </div>
          </div>
          {/* You can add logout/settings icons here later */}
        </div>
      </div>
    </header>
  );
}

export default Header;
