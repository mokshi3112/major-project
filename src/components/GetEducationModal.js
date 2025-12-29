import React, { Component } from "react";
import { Modal, Form, Button, Input, Header } from "semantic-ui-react";
import ScanQR from "./ScanQR";
import Admin from "../abis/Admin.json";
import Employee from "../abis/Employee.json";
import { toast } from "react-toastify";
import { loadContract } from "../utils/contractHelpers";

export default class GetEducationModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      institute: "",
      startdate: "",
      enddate: "",
      description: "",
      scanQR: false,
      loading: false,
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { institute, startdate, enddate, description } = this.state;
    if (!institute || !startdate || !enddate || !description) {
      toast.error("Please enter all the fields.");
      return;
    }
    this.setState({ loading: true });
    try {
      const web3 = window.web3;
      const accounts = await web3.eth.getAccounts();
      const admin = await loadContract(web3, Admin);

      if (admin) {
        const employeeContractAddress = await admin.methods
          .getEmployeeContractByAddress(accounts[0])
          .call();
        const EmployeeContract = new web3.eth.Contract(
          Employee.abi,
          employeeContractAddress
        );
        await EmployeeContract.methods
          .addEducation(institute, startdate, enddate, description)
          .send({ from: accounts[0] });
        toast.success("Education added successfully!!");
        this.props.closeCertificationModal();
      } else {
        toast.error("Admin Contract not found");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to add education");
    }
    this.setState({ loading: false });
  };

  closeScanQRModal = () => {
    this.setState({ scanQR: false });
  };

  handleAddAddress = (res) => {
    this.setState({ institute: res });
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
            content="Enter Education Details"
            as="h2"
          />
          <Modal.Content className="modal-content">
            <Form className="form-inputs">
              <Form.Field className="form-inputs">
                <Input action>
                  <input
                    id="institute"
                    placeholder="Institute Address"
                    autoComplete="off"
                    autoCorrect="off"
                    value={this.state.institute}
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
                  id="startdate"
                  placeholder="Start Date"
                  autoComplete="off"
                  autoCorrect="off"
                  value={this.state.startdate}
                  onChange={this.handleChange}
                />
              </Form.Field>
              <Form.Field className="form-inputs">
                <input
                  id="enddate"
                  placeholder="End Date"
                  autoComplete="off"
                  autoCorrect="off"
                  value={this.state.enddate}
                  onChange={this.handleChange}
                />
              </Form.Field>
              <Form.Field className="form-inputs">
                <input
                  id="description"
                  placeholder="Degree & Major"
                  autoComplete="off"
                  autoCorrect="off"
                  value={this.state.description}
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
              onClick={() => this.props.closeCertificationModal()}
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