import React, { Component } from "react";
import { toast } from "react-toastify";
import { Button, Form, Header, Modal } from "semantic-ui-react";
import Admin from "../abis/Admin.json";
import Employee from "../abis/Employee.json";
import "./Modals.css";
import { loadContract } from "../utils/contractHelpers";

export default class GetSkillsModals extends Component {
  constructor(props) {
    super(props);
    this.state = {
      skill: "",
      experience: "",
      loading: false,
    };
  }

  handleSubmit = async (e) => {
    const { skill, experience } = this.state;
    if (!skill || !experience) {
      toast.error("Please enter all the fields.");
      return;
    }
    this.setState({ loading: true });
    e.preventDefault();
    const web3 = window.web3;
    const admin = await loadContract(web3, Admin);
    const accounts = await web3.eth.getAccounts();
    if (admin) {
      const employeeContractAddress = await admin.methods
        .getEmployeeContractByAddress(accounts[0])
        .call();
      const EmployeeContract = await new web3.eth.Contract(
        Employee.abi,
        employeeContractAddress
      );
      try {
        await EmployeeContract.methods
          .addSkill(skill, experience)
          .send({
            from: accounts[0],
          });
        toast.success("Skill Added");
      } catch (err) {
        toast.error(err.message);
      }
    } else {
      toast.error("The Admin Contract does not exist on this network!");
    }
    this.setState({ loading: false });
    this.props.closeSkillModal();
  };

  handleChange = (e) => {
    e.preventDefault();
    this.setState({ [e.target.id]: e.target.value });
  };

  render() {
    return (
      <Modal
        as={Form}
        onSubmit={(e) => this.handleSubmit(e)}
        open={this.props.isOpen}
        size="tiny"
        className="modal-des"
      >
        <Header
          className="modal-heading"
          icon="pencil"
          content="Enter Skill Details"
          as="h2"
        />
        <Modal.Content className="modal-content">
          <Form className="form-inputs">
            <Form.Field className="form-inputs">
              <input
                id="skill"
                placeholder="Skill Name"
                autoComplete="off"
                autoCorrect="off"
                value={this.state.skill}
                onChange={this.handleChange}
              />
            </Form.Field>
            <Form.Field className="form-inputs">
              <input
                id="experience"
                placeholder="Experience"
                autoComplete="off"
                autoCorrect="off"
                value={this.state.experience}
                onChange={this.handleChange}
              />
            </Form.Field>
          </Form>
        </Modal.Content>
        <Modal.Actions className="modal-actions">
          <Button
            className="close-button"
            type="button"
            color="red"
            icon="times"
            content="Close"
            onClick={() => this.props.closeSkillModal()}
          />
          <Button
            className="button-css"
            type="submit"
            color="green"
            icon="save"
            content="Save"
            loading={this.state.loading}
          />
        </Modal.Actions>
      </Modal>
    );
  }
}