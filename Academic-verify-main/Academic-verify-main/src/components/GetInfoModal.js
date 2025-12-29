import React, { useState, useEffect } from "react";
import { Button, Header, Modal, Table } from "semantic-ui-react";
import "./Modals.css";
import Admin from "../abis/Admin.json";
import Employee from "../abis/Employee.json";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; // Replaced withRouter with useNavigate

const GetInfoModal = ({ isOpen, closeInfoModal, info, isEndorsementReq, org, admin }) => {
  const [state, setState] = useState({ loading: false, errorMessage: "" });
  const navigate = useNavigate(); // Hook for navigation

  const createUser = async (e) => {
    e.preventDefault();
    const { ethAddress, name, location, role, description } = info;
    if (!name || !location || !description || !role || !ethAddress) {
      toast.error("Please fill all the fields!!");
      return;
    }
    setState({ loading: true, errorMessage: "" });
    try {
      if (!window.web3) throw new Error("Web3 not initialized");
      const web3 = window.web3;
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const AdminData = Admin.networks[networkId];
      if (AdminData) {
        const adminContract = new web3.eth.Contract(Admin.abi, AdminData.address);
        const owner = await adminContract.methods.owner().call();
        if (owner !== accounts[0]) {
          setState({ errorMessage: "Sorry! You are not the Admin!!", loading: false });
          return;
        }
        await adminContract.methods
          .registerUser(ethAddress, name, location, description, role)
          .send({ from: accounts[0] });
        toast.success("New user registered successfully!!!!");
        navigate(`${role === "1" ? "/" : "/all-organization-endorser"}`);
      }
    } catch (err) {
      console.error(err);
    }
    setState((prev) => ({ ...prev, loading: false }));
  };

  const endorseEmployee = async (info) => {
    const { req } = info;
    let section = -1;
    if (req === "Education Endorsement Request") section = 1;
    else if (req === "Certification Endorsement Request") section = 2;
    else if (req === "Work Experience Endorsement Request") section = 3;
    setState({ loading: true, errorMessage: "" });
    try {
      if (!window.web3) throw new Error("Web3 not initialized");
      const web3 = window.web3;
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const AdminData = Admin.networks[networkId];
      if (AdminData) {
        const admin = new web3.eth.Contract(Admin.abi, AdminData.address);
        const employeeContractAddress = await admin.methods
          .getEmployeeContractByAddress(info?.ethAddress)
          .call();
        const EmployeeContract = new web3.eth.Contract(Employee.abi, employeeContractAddress);
        if (section === 1) {
          await EmployeeContract.methods?.endorseEducation().send({ from: accounts[0] });
        } else if (section === 2) {
          await EmployeeContract?.methods?.endorseCertification(info.name).send({ from: accounts[0] });
        } else if (section === 3) {
          await EmployeeContract?.methods?.endorseWorkExp().send({ from: accounts[0] });
        }
        toast.success("Endorsement successful!!!!");
      }
    } catch (err) {
      console.error(err);
    }
    setState((prev) => ({ ...prev, loading: false }));
    closeInfoModal();
  };

  return (
    <>
      {isEndorsementReq ? (
        <Modal open={isOpen} size="tiny" className="modal-des">
          <Header
            className="modal-heading"
            icon="pencil"
            content={info?.req}
            as="h2"
          />
          <Modal.Content className="modal-content">
            <Table className="design-info-table">
              <Table.Row>
                <Table.HeaderCell>Fields</Table.HeaderCell>
                <Table.HeaderCell>Values Provided</Table.HeaderCell>
              </Table.Row>
              <hr style={{ border: "none", borderTop: "1px solid white" }} />
              {info?.req === "Education Endorsement Request" && (
                <Table.Body>
                  <Table.Row>
                    <Table.Cell>
                      <p style={{ fontWeight: "700" }}>Institute</p>
                    </Table.Cell>
                    <Table.Cell>
                      <p>{info?.institute}</p>
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>
                      <p style={{ fontWeight: "700" }}>Description</p>
                    </Table.Cell>
                    <Table.Cell>
                      <p>{info?.description}</p>
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>
                      <p style={{ fontWeight: "700" }}>Start date</p>
                    </Table.Cell>
                    <Table.Cell>
                      <p>{info?.startdate}</p>
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>
                      <p style={{ fontWeight: "700" }}>End date</p>
                    </Table.Cell>
                    <Table.Cell>
                      <p>{info?.enddate}</p>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              )}
              {info?.req === "Certification Endorsement Request" && (
                <Table.Body>
                  <Table.Row>
                    <Table.Cell>
                      <p style={{ fontWeight: "700" }}>Name</p>
                    </Table.Cell>
                    <Table.Cell>
                      <p>{info?.name}</p>
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>
                      <p style={{ fontWeight: "700" }}>Organization</p>
                    </Table.Cell>
                    <Table.Cell>
                      <p>{info?.organization}</p>
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>
                      <p style={{ fontWeight: "700" }}>Score</p>
                    </Table.Cell>
                    <Table.Cell>
                      <p>{info?.score}</p>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              )}
              {info?.req === "Work Experience Endorsement Request" && (
                <Table.Body>
                  <Table.Row>
                    <Table.Cell>
                      <p style={{ fontWeight: "700" }}>Role</p>
                    </Table.Cell>
                    <Table.Cell>
                      <p>{info?.role}</p>
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>
                      <p style={{ fontWeight: "700" }}>Organization</p>
                    </Table.Cell>
                    <Table.Cell>
                      <p>{info?.organization}</p>
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>
                      <p style={{ fontWeight: "700" }}>Description</p>
                    </Table.Cell>
                    <Table.Cell>
                      <p>{info?.description}</p>
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>
                      <p style={{ fontWeight: "700" }}>Start Date</p>
                    </Table.Cell>
                    <Table.Cell>
                      <p>{info?.startdate}</p>
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>
                      <p style={{ fontWeight: "700" }}>Enddate</p>
                    </Table.Cell>
                    <Table.Cell>
                      <p>{info?.enddate}</p>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              )}
            </Table>
          </Modal.Content>
          <Modal.Actions className="modal-actions">
            <Button
              className="close-button"
              type="button"
              color="red"
              icon="times"
              content="Close"
              onClick={closeInfoModal}
            />
            {org && (
              <Button
                className="button-css"
                type="submit"
                color="green"
                icon="save"
                content="Endorse"
                loading={state.loading}
                onClick={() => endorseEmployee(info)}
              />
            )}
          </Modal.Actions>
        </Modal>
      ) : (
        <Modal open={isOpen} size="tiny" className="modal-des">
          <Header
            className="modal-heading"
            icon="pencil"
            content="Info Provided to Admins"
            as="h2"
          />
          <Modal.Content className="modal-content">
            <Table className="design-info-table">
              <Table.Row>
                <Table.HeaderCell>Fields</Table.HeaderCell>
                <Table.HeaderCell>Values Provided</Table.HeaderCell>
              </Table.Row>
              <hr style={{ border: "none", borderTop: "1px solid white" }} />
              <Table.Body>
                <Table.Row>
                  <Table.Cell>
                    <p style={{ fontWeight: "700" }}>Name</p>
                  </Table.Cell>
                  <Table.Cell>
                    <p>{info?.name}</p>
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>
                    <p style={{ fontWeight: "700" }}>Eth Address</p>
                  </Table.Cell>
                  <Table.Cell>
                    <p>{info?.ethAddress}</p>
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>
                    <p style={{ fontWeight: "700" }}>Location</p>
                  </Table.Cell>
                  <Table.Cell>
                    <p>{info?.location}</p>
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>
                    <p style={{ fontWeight: "700" }}>Description</p>
                  </Table.Cell>
                  <Table.Cell>
                    <p>{info?.description}</p>
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>
                    <p style={{ fontWeight: "700" }}>Role Requested</p>
                  </Table.Cell>
                  <Table.Cell>
                    <p>{info?.role === "1" ? "Employee" : "Organization Endorser"}</p>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </Modal.Content>
          <Modal.Actions className="modal-actions">
            <Button
              className="close-button"
              type="button"
              color="red"
              icon="times"
              content="Close"
              onClick={closeInfoModal}
            />
            {admin && (
              <Button
                className="button-css"
                type="submit"
                color="green"
                icon="save"
                content="Register User"
                loading={state.loading}
                onClick={createUser}
              />
            )}
          </Modal.Actions>
        </Modal>
      )}
    </>
  );
};

export default GetInfoModal;