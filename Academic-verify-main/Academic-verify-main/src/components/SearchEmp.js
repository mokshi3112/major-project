import React, { useState, useEffect } from "react";
import Employee from "../abis/Employee.json";
import Admin from "../abis/Admin.json";
import { toast } from "react-toastify";
import { Dimmer, Loader } from "semantic-ui-react";
import { useNavigate } from "react-router-dom"; // Replaced withRouter with useNavigate

const SearchEmp = ({ emp }) => {
  const [state, setState] = useState({
    employeedata: {},
    loading: false,
    employeeContractAddress: "",
  });
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const loadData = async () => {
      setState((prev) => ({ ...prev, loading: true }));
      try {
        if (!window.web3) throw new Error("Web3 not initialized");
        const web3 = window.web3;
        const networkId = await web3.eth.net.getId();
        const AdminData = Admin.networks[networkId];
        if (AdminData) {
          const admin = new web3.eth.Contract(Admin.abi, AdminData.address);
          const employeeContractAddress = await admin.methods
            .getEmployeeContractByAddress(emp)
            .call();
          const EmployeeContract = new web3.eth.Contract(
            Employee.abi,
            employeeContractAddress
          );
          const employeedata = await EmployeeContract.methods.getEmployeeInfo().call();
          const newEmployedata = {
            ethAddress: employeedata[0],
            name: employeedata[1],
            location: employeedata[2],
            description: employeedata[3],
            overallEndorsement: employeedata[4],
            endorsecount: employeedata[5],
          };
          setState((prev) => ({
            ...prev,
            employeedata: newEmployedata,
            employeeContractAddress,
          }));
        } else {
          toast.error("The Admin Contract does not exist on this network!");
        }
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
      setState((prev) => ({ ...prev, loading: false }));
    };

    loadData();
  }, [emp]); // Re-run when emp prop changes

  const toRoute = () => {
    navigate(`/getemployee/${state.employeeContractAddress}`);
    window.location.reload(false); // Note: Consider removing reload if not necessary
  };

  return state.loading ? (
    <Dimmer active={state.loading} inverted>
      <Loader inverted content="Fetching..." />
    </Dimmer>
  ) : (
    <div
      key={state.employeeContractAddress}
      className="search-ele"
      onClick={toRoute}
    >
      <div>
        <span>{state?.employeedata?.name}</span>
        <span>{state?.employeedata?.location}</span>
      </div>
      <small>{state?.employeedata?.ethAddress}</small>
      <br />
      <small>{state?.employeedata?.description}</small>
    </div>
  );
};

export default SearchEmp;