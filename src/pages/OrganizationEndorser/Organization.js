import React, { Component } from "react";
import Organization from "../../abis/OrganizationEndorser.json";
import Admin from "../../abis/Admin.json";
import { toast } from "react-toastify";
import OrgEndCard from "../../components/OrgEndCard";
import EmployeeCard from "../../components/EmployeeCard";
import LoadComp from "../../components/LoadComp";
import GetEmployeeModal from "../../components/GetEmployeeModal";
import { loadContract } from "../../utils/contractHelpers";

export default class OrganizationEndorser extends Component {
  state = {
    orgContractAddress: "",
    employees: [],
    employeemodal: false,
    loadcomp: false,
  };

  componentDidMount = async () => {
    this.setState({ loadcomp: true });
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    const admin = await loadContract(web3, Admin);

    if (admin) {
      const orgContractAddress = await admin?.methods
        ?.getOrganizationContractByAddress(accounts[0])
        .call();
      const orgContract = new web3.eth.Contract(
        Organization.abi,
        orgContractAddress
      );
      this.setState({ orgContractAddress });
      await this.getEmployees(orgContract);
    } else {
      toast.error("The Admin Contract does not exist on this network!");
    }
    this.setState({ loadcomp: false });
  };

  getEmployees = async (orgContract) => {
    const employeeCount = await orgContract?.methods?.totalEmployees().call();
    const web3 = window.web3;
    const admin = await loadContract(web3, Admin);

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
    this.setState({ employees });
  };

  closeEmployeeModal = () => {
    this.setState({ employeemodal: false });
    const web3 = window.web3;
    const orgContract = new web3.eth.Contract(
      Organization.abi,
      this.state.orgContractAddress
    );
    this.getEmployees(orgContract);
  };

  render() {
    return this.state.loadcomp ? (
      <LoadComp />
    ) : (
      <div>
        <GetEmployeeModal
          isOpen={this.state.employeemodal}
          closeEmployeeModal={this.closeEmployeeModal}
        />
        {this.state.orgContractAddress && (
          <OrgEndCard OrgEndContractAddress={this.state.orgContractAddress} />
        )}
        <br />
        <div>
          <div
            style={{ width: "68%", marginLeft: "auto", marginRight: "auto" }}
          >
            <span
              className="add-employee"
              onClick={(e) =>
                this.setState({
                  employeemodal: !this.state.employeemodal,
                })
              }
            >
              <span className="fas fa-plus">&nbsp;Add Employee</span>
            </span>
            <h2 className="org-card-heading">Employees in the organization</h2>
          </div>
          <br />
          {this.state.employees?.map((employee, index) => (
            <EmployeeCard key={index} employeeContractAddress={employee} />
          ))}
        </div>
        <br />
      </div>
    );
  }
}