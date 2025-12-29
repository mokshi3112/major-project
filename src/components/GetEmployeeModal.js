import React, { Component } from "react";
import { Modal, Form, Button, Input, Header } from "semantic-ui-react";
import ScanQR from "./ScanQR";
import Organization from "../abis/OrganizationEndorser.json";
import Admin from "../abis/Admin.json";
import { toast } from "react-toastify";
import { loadContract } from "../utils/contractHelpers";

export default class GetEmployeeModal extends Component {
  state = {
    employee_address: "",
    scanQR: false,
    loading: false,
  };

  handleChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { employee_address } = this.state;
    if (!employee_address) {
      toast.error("Please enter the employee address.");
      return;
    }
    this.setState({ loading: true });
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
          .addEmployee(employee_address)
          .send({ from: accounts[0] });
        toast.success("Employee added successfully!!");
        this.props.closeEmployeeModal();
      } else {
        toast.error("Admin Contract not found");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to add employee");
    }
    this.setState({ loading: false });
  };

  closeScanQRModal = () => {
    this.setState({ scanQR: false });
  };

  handleAddAddress = (res) => {
    this.setState({ employee_address: res });
  };

  render() {
    return (
      <>
        <ScanQR
          isOpen={this.state.scanQR}
          closeScanQRModal={this.closeScanQRModal}
          handleAddAddress={this.handleAddAddress}
        />
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
            content="Enter Employee Address"
            as="h2"
          />
          <Modal.Content className="modal-content">
            <Form className="form-inputs">
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
            </Form>
          </Modal.Content>
          <Modal.Actions className="modal-actions">
            <Button
              className="close-button"
              type="button"
              color="red"
              icon="times"
              content="Close"
              onClick={() => this.props.closeEmployeeModal()}
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
      </>
    );
  }
}