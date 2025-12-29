import React, { Component } from "react";
import {
  Button,
  Card,
  Dropdown,
  Form,
  Input,
  Message,
} from "semantic-ui-react";
import ScanQR from "../../components/ScanQR";
import Admin from "../../abis/Admin.json";
import Organization from "../../abis/OrganizationEndorser.json";
import Employee from "../../abis/Employee.json"; // Added Import
import { toast } from "react-toastify";
import { loadContract } from "../../utils/contractHelpers";
import "./EndorsePage.css";

export default class EndorseSection extends Component {
  state = {
    employee_address: "",
    section: "0",
    certification_name: "",
    institute: "",
    organization: "",
    skillLoading: false,
    skillError: "",
    scanQR: false,
  };

  handleChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  handleSkillEndorse = async (e) => {
    e.preventDefault();
    const { employee_address, section, certification_name, institute, organization } = this.state;

    // Basic validation
    if (!employee_address || section === "0") {
      this.setState({ skillError: "Please enter all the fields." });
      return;
    }
    if (section === "1" && !institute) {
      this.setState({ skillError: "Please enter institute name." });
      return;
    }
    if (section === "2" && !organization) {
      this.setState({ skillError: "Please enter organization name." });
      return;
    }
    if (section === "3" && !certification_name) {
      this.setState({ skillError: "Please enter certification name." });
      return;
    }

    this.setState({ skillLoading: true, skillError: "" });
    try {
      const web3 = window.web3;
      const accounts = await web3.eth.getAccounts();
      const admin = await loadContract(web3, Admin);

      if (admin) {
        // 1. Get Employee Contract Address
        const employeeContractAddress = await admin.methods
          .getEmployeeContractByAddress(employee_address)
          .call();

        if (employeeContractAddress === "0x0000000000000000000000000000000000000000") {
          throw new Error("Employee contract not found for this address");
        }

        // 2. Instantiate Employee Contract
        const EmployeeContract = new web3.eth.Contract(
          Employee.abi,
          employeeContractAddress
        );

        // 3. Call Endorsement Methods on Employee Contract
        // Note: endorseEducation and endorseWorkExp take NO arguments (they use msg.sender)
        // endorseCertification takes the certification name.

        if (section === "1") {
          // Endorse Education
          await EmployeeContract.methods.endorseEducation().send({ from: accounts[0] });
        } else if (section === "2") {
          // Endorse Work Experience
          await EmployeeContract.methods.endorseWorkExp().send({ from: accounts[0] });
        } else if (section === "3") {
          // Endorse Certification
          await EmployeeContract.methods.endorseCertification(certification_name).send({ from: accounts[0] });
        }

        toast.success("Endorsed Successfully!!");
        this.setState({
          employee_address: "",
          section: "0",
          certification_name: "",
          institute: "",
          organization: "",
        });
      } else {
        toast.error("Admin Contract not found");
      }
    } catch (error) {
      console.error(error);
      // Improve error message for user
      let errorMessage = error.message;
      if (error.message.includes("revert")) {
        errorMessage = "Transaction reverted. You may not be authorized to endorse this item, or it does not exist.";
      }
      this.setState({ skillError: errorMessage });
    }
    this.setState({ skillLoading: false });
  };

  closeScanQRModal = () => {
    this.setState({ scanQR: false });
  };

  handleAddAddress = (res) => {
    this.setState({ employee_address: res });
  };

  roleOptions = [
    {
      key: "0",
      text: "No-Role-Selected",
      value: "0",
    },
    {
      key: "1",
      text: "Endorse Education",
      value: "1",
    },
    {
      key: "2",
      text: "Endorse Work Experience",
      value: "2",
    },
    {
      key: "3",
      text: "Endorse Certification",
      value: "3",
    },
  ];

  handleDropdownSelect = (e, data) => {
    this.setState({ section: data.value });
  };

  render() {
    return (
      <>
        <ScanQR
          isOpen={this.state.scanQR}
          closeScanQRModal={this.closeScanQRModal}
          handleAddAddress={this.handleAddAddress}
        />
        <div className="endorse-section">
          <Card className="card-style">
            <Card.Content>
              <Card.Header>
                <h2 className="card-heading">Endorse Section</h2>
              </Card.Header>
              <br />
              <div>
                <Form
                  className="form-inputs"
                  onSubmit={this.handleSkillEndorse}
                  error={!!this.state.skillError}
                >
                  <Form.Field className="form-inputs">
                    <Input action>
                      <input
                        id="employee_address"
                        placeholder="Employee Address"
                        autoComplete="off"
                        autoCorrect="off"
                        value={this.state.employee_address}
                        onChange={this.handleChange}
                      />
                      <Button
                        type="button"
                        content="QR"
                        icon="qrcode"
                        onClick={() => this.setState({ scanQR: true })}
                      />
                    </Input>
                  </Form.Field>
                  <Form.Field className="form-inputs">
                    <Dropdown
                      placeholder="Select Role"
                      fluid
                      selection
                      options={this.roleOptions}
                      onChange={this.handleDropdownSelect}
                    />
                  </Form.Field>
                  {this.state.section === "1" && (
                    <Form.Field className="form-inputs">
                      <input
                        id="institute"
                        placeholder="Institute Name"
                        autoComplete="off"
                        autoCorrect="off"
                        value={this.state.institute}
                        onChange={this.handleChange}
                      />
                    </Form.Field>
                  )}
                  {this.state.section === "2" && (
                    <Form.Field className="form-inputs">
                      <input
                        id="organization"
                        placeholder="Organization Name"
                        autoComplete="off"
                        autoCorrect="off"
                        value={this.state.organization}
                        onChange={this.handleChange}
                      />
                    </Form.Field>
                  )}
                  {this.state.section === "3" && (
                    <Form.Field className="form-inputs">
                      <input
                        id="certification_name"
                        placeholder="Certification Name"
                        autoComplete="off"
                        autoCorrect="off"
                        value={this.state.certification_name}
                        onChange={this.handleChange}
                      />
                    </Form.Field>
                  )}
                  <br />
                  <Message
                    error
                    header="Oops!!"
                    content={this.state.skillError}
                  />
                  <br />
                  <Button
                    className="button-css"
                    type="submit"
                    icon="save"
                    content="Endorse"
                    floated="right"
                    loading={this.state.skillLoading}
                  />
                </Form>
              </div>
            </Card.Content>
          </Card>
        </div>
      </>
    );
  }
}