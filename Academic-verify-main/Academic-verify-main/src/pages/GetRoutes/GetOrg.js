import React, { useState, useEffect } from "react";
import Organization from "../../abis/OrganizationEndorser.json";
import Admin from "../../abis/Admin.json";
import { toast } from "react-toastify";
import OrgEndCard from "../../components/OrgEndCard";
import EmployeeCard from "../../components/EmployeeCard";
import "./GetOrg.css";
import LoadComp from "../../components/LoadComp";
import { useNavigate, useParams } from "react-router-dom"; // Replaced withRouter with useNavigate and useParams

const GetOrg = () => {
  const [state, setState] = useState({
    orgcontractAddress: "",
    employees: [],
    loadcomp: false,
  });
  const navigate = useNavigate(); // Hook for navigation
  const { orgAddress } = useParams(); // Hook to get orgAddress from URL params

  useEffect(() => {
    const loadData = async () => {
      setState((prev) => ({ ...prev, loadcomp: true }));
      try {
        if (!window.web3) throw new Error("Web3 not initialized");
        const web3 = window.web3;
        const networkId = await web3.eth.net.getId();
        const AdminData = Admin.networks[networkId];
        if (!orgAddress) {
          navigate("/");
          return;
        }
        if (AdminData) {
          const admin = await new web3.eth.Contract(Admin.abi, AdminData.address);
          const orgContractAddress = await admin?.methods
            ?.getOrganizationContractByAddress(orgAddress)
            .call();
          const orgContract = await new web3.eth.Contract(
            Organization.abi,
            orgContractAddress
          );

          const employeeCount = await orgContract?.methods?.totalEmployees().call();
          const employees = await Promise.all(
            Array(parseInt(employeeCount))
              .fill()
              .map(async (_, index) => {
                const employee = await orgContract?.methods
                  ?.getEmployeeByIndex(index)
                  .call();
                return admin.methods.getEmployeeContractByAddress(employee).call();
              })
          );

          setState((prev) => ({ ...prev, orgContractAddress, employees }));
        } else {
          toast.error("The Admin Contract does not exist on this network!");
        }
      } catch (error) {
        console.error("Error loading organization data:", error);
      }
      setState((prev) => ({ ...prev, loadcomp: false }));
    };

    loadData();
  }, [orgAddress, navigate]); // Re-run when orgAddress changes

  return state.loadcomp ? (
    <LoadComp />
  ) : (
    <div>
      {state.orgContractAddress && (
        <OrgEndCard OrgEndContractAddress={state.orgContractAddress} />
      )}
      <br />
      <div>
        <div
          style={{ width: "68%", marginLeft: "auto", marginRight: "auto" }}
        >
          <h2 className="org-card-heading">Employees in the organization</h2>
        </div>
        <br />
        {state.employees?.map((employee, index) => (
          <EmployeeCard key={index} employeeContractAddress={employee} />
        ))}
      </div>
      <br />
    </div>
  );
};

export default GetOrg;