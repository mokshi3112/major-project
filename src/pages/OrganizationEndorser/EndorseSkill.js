import React, { Component } from "react";
import { Button, Card, Form, Input, Message } from "semantic-ui-react";
import ScanQR from "../../components/ScanQR";
import Admin from "../../abis/Admin.json";
import Organization from "../../abis/OrganizationEndorser.json";
import { toast } from "react-toastify";
import { loadContract } from "../../utils/contractHelpers";
import "./EndorsePage.css";

export default class EndorseSkill extends Component {
  state = {
    employee_address_skill: "",
    skill_name: "",
    skill_score: "",
    skill_review: "",
    skillLoading: false,
    skillError: "",
    scanQR: false,
  };

  handleChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  handleSkillEndorse = async (e) => {
    e.preventDefault();
    const { employee_address_skill, skill_name, skill_score, skill_review } = this.state;
    if (!employee_address_skill || !skill_name || !skill_score || !skill_review) {
      this.setState({ skillError: "Please enter all the fields." });
      return;
    }
    this.setState({ skillLoading: true, skillError: "" });
    try {
      const web3 = window.web3;
      const accounts = await web3.eth.getAccounts();
      const admin = await loadContract(web3, Admin);

      if (admin) {
        const orgContractAddress = await admin.methods
          .getOrganizationContractByAddress(accounts[0])
          .call();
        const orgContract = new web3.eth.Contract(
          Organization.abi,
          orgContractAddress
        );
        await orgContract.methods
          .endorseSkill(employee_address_skill, skill_name, skill_score, skill_review)
          .send({ from: accounts[0] });
        toast.success("Skill Endorsed Successfully!!");
        this.setState({
          employee_address_skill: "",
          skill_name: "",
          skill_score: "",
          skill_review: "",
        });
      } else {
        toast.error("Admin Contract not found");
      }
    } catch (error) {
      console.error(error);
      this.setState({ skillError: error.message });
    }
    this.setState({ skillLoading: false });
  };

  closeScanQRModal = () => {
    this.setState({ scanQR: false });
  };

  handleAddAddress = (res) => {
    this.setState({ employee_address_skill: res });
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
                <h2 className="card-heading">Endorse Skill</h2>
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
                        id="employee_address_skill"
                        placeholder="Employee Address"
                        autoComplete="off"
                        autoCorrect="off"
                        value={this.state.employee_address_skill}
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
                    <input
                      id="skill_name"
                      placeholder="Skill Name"
                      autoComplete="off"
                      autoCorrect="off"
                      value={this.state.skill_name}
                      onChange={this.handleChange}
                    />
                  </Form.Field>
                  <Form.Field className="form-inputs">
                    <input
                      id="skill_score"
                      placeholder="Skill Level (1-100)"
                      autoComplete="off"
                      autoCorrect="off"
                      type="number"
                      min="1"
                      max="100"
                      value={this.state.skill_score}
                      onChange={this.handleChange}
                    />
                  </Form.Field>
                  <Form.Field className="form-inputs">
                    <textarea
                      id="skill_review"
                      placeholder="Review"
                      autoComplete="off"
                      autoCorrect="off"
                      value={this.state.skill_review}
                      onChange={this.handleChange}
                    />
                  </Form.Field>
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