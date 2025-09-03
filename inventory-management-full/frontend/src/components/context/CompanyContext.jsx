import React, { createContext, useContext, useState, useEffect } from "react";
// import API from "../utils/API";
import API from "../../api/api";


// ------ Context Setup ------
const CompanyContext = createContext(null);

export const CompanyProvider = ({ children }) => {
  const [companies, setCompanies] = useState([]);
  const [currentCompany, setCurrentCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  // Select company and persist to localStorage
  const selectCompany = (company) => {
    setCurrentCompany(company);
    if (company) {
      const companyId = company._id || company.id;
      localStorage.setItem("selectedCompanyId", companyId);
    }
  };

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      try {
        const res = await API.get("/companies");
        if (Array.isArray(res.data)) {
          setCompanies(res.data);

          // Retrieve and use persisted selection
          const storedCompanyId = localStorage.getItem("selectedCompanyId");
          const found =
            res.data.find(
              (c) => c._id === storedCompanyId || c.id === storedCompanyId
            ) || res.data[0]; // fallback to first

          selectCompany(found || null);
        } else {
          setCompanies([]);
          setCurrentCompany(null);
        }
      } catch (error) {
        setCompanies([]);
        setCurrentCompany(null);
        // Optionally: Show a toast or log error
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  return (
    <CompanyContext.Provider
      value={{
        companies,
        currentCompany,
        setCurrentCompany: selectCompany,
        loading,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error("useCompany must be used within a CompanyProvider");
  }
  return context;
};
