import React, { useState } from "react";
import { Modal, Header, Table, Button } from "semantic-ui-react";
import { loadContract } from "../utils/contractHelpers";
import Admin from "../abis/Admin.json";
import Organization from "../abis/OrganizationEndorser.json";
import { toast } from "react-toastify";

const GetInfoModal = ({
  isOpen,
  closeInfoModal,
  info,
  isEndorsementReq,
  org,
  admin,
}) => {
  const [state, setState] = useState({
    loading: false,
  });

  const endorseEmployee = async (info) => {
    setState({ loading: true });
    try {
      const web3 = window.web3;
      const accounts = await web3.eth.getAccounts();
      const adminContract = await loadContract(web3, Admin);

      if (adminContract) {
        const orgContractAddress = await adminContract.methods
          .getOrganizationContractByAddress(accounts[0])
          .call();
        const orgContract = new web3.eth.Contract(
          Organization.abi,
          orgContractAddress
        );

        if (info.req === "Education Endorsement Request") {
          await orgContract.methods
            .endorseEducation(info.ethAddress, info.institute)
            .send({ from: accounts[0] });
        } else if (info.req === "Certification Endorsement Request") {
          await orgContract.methods
            .endorseCertification(info.ethAddress, info.name)
            .send({ from: accounts[0] });
        } else if (info.req === "Work Experience Endorsement Request") {
          await orgContract.methods
            .endorseWorkExp(info.ethAddress, info.organization)
            .send({ from: accounts[0] });
        }
        toast.success("Endorsed Successfully!!");
        closeInfoModal();
      } else {
        toast.error("Admin Contract not found");
      }
    } catch (error) {
      console.error(error);
      toast.error("Endorsement Failed");
    }
    setState({ loading: false });
  };

  const createUser = async () => {
    setState({ loading: true });
    try {
      const web3 = window.web3;
      const accounts = await web3.eth.getAccounts();
      const adminContract = await loadContract(web3, Admin);
      if (adminContract) {
        if (info.role === "1") { // Employee
          await adminContract.methods.createEmployee(info.ethAddress, info.name, info.location, info.description).send({ from: accounts[0] });
        } else { // Organization
          await adminContract.methods.createOrganizationEndorser(info.ethAddress, info.name, info.location, info.description).send({ from: accounts[0] });
        }
        toast.success("User Registered Successfully!!");
        closeInfoModal();
      } else {
        toast.error("Admin Contract not found");
      }
    } catch (err) {
      console.error(err);
      toast.error("Registration Failed");
    }
    setState({ loading: false });
  }

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