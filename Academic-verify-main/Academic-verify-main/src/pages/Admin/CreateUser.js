import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  Dropdown,
  Form,
  Input,
  Message,
} from "semantic-ui-react";
import Admin from "../../abis/Admin.json";
import { toast } from "react-toastify";
import ScanQR from "../../components/ScanQR";
import "./Admin.css";
import { useNavigate } from "react-router-dom"; // Replaced withRouter with useNavigate

const CreateUser = () => {
  const [state, setState] = useState({
    name: "",
    location: "",
    ethAddress: "",
    description: "",
    role: 0,
    loading: false,
    errorMessage: "",
    scanQR: false,
  });
  const navigate = useNavigate(); // Hook for navigation

  const roleOptions = [
    { key: "0", text: "No-Role-Selected", value: "0" },
    { key: "1", text: "Employee", value: "1" },
    { key: "2", text: "OrganizationEndorser", value: "2" },
  ];

  const handleDropdownSelect = (e, data) => {
    setState((prev) => ({ ...prev, role: data.value }));
  };

  const handleChange = (e) => {
    e.preventDefault();
    setState((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { ethAddress, name, location, role, description } = state;
    if (!name || !location || !description || !role || !ethAddress) {
      toast.error("Please fill all the fields!!");
      return;
    }
    setState((prev) => ({ ...prev, loading: true, errorMessage: "" }));
    try {
      if (!window.web3) throw new Error("Web3 not initialized");
      const web3 = window.web3;
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const AdminData = Admin.networks[networkId];
      if (AdminData) {
        const admin = new web3.eth.Contract(Admin.abi, AdminData.address);
        const owner = await admin.methods.owner().call();
        if (owner !== accounts[0]) {
          setState((prev) => ({
            ...prev,
            errorMessage: "Sorry! You are not the Admin!!",
            loading: false,
          }));
          return;
        }
        await admin.methods
          .registerUser(ethAddress, name, location, description, role)
          .send({ from: accounts[0] });
        toast.success("New user registered successfully!!!!");
        navigate(`${role === "1" ? "/" : "/all-organization-endorser"}`);
        setState((prev) => ({
          ...prev,
          name: "",
          location: "",
          ethAddress: "",
          description: "",
          role: 0,
        }));
      }
    } catch (err) {
      setState((prev) => ({ ...prev, errorMessage: err.message }));
    }
    setState((prev) => ({ ...prev, loading: false }));
  };

  const closeScanQRModal = () => {
    setState((prev) => ({ ...prev, scanQR: false }));
  };

  const handleAddAddress = (res) => {
    setState((prev) => ({ ...prev, ethAddress: res }));
  };

  return (
    <>
      <ScanQR
        isOpen={state.scanQR}
        closeScanQRModal={closeScanQRModal}
        handleAddAddress={handleAddAddress}
      />
      <div className="create-user">
        <Card className="card-style">
          <Card.Content>
            <Card.Header centered>
              <h2 className="card-heading">Register New User</h2>
            </Card.Header>
            <hr className="horizontal-line"></hr>
            <br />
            <Form error={!!state.errorMessage}>
              <Form.Field className="form-inputs-admin">
                <input
                  id="name"
                  placeholder="Name"
                  autoComplete="off"
                  autoCorrect="off"
                  value={state.name}
                  onChange={handleChange}
                />
              </Form.Field>
              <br />
              <Form.Field className="form-inputs-admin">
                <input
                  id="location"
                  placeholder="Location"
                  autoComplete="off"
                  autoCorrect="off"
                  value={state.location}
                  onChange={handleChange}
                />
              </Form.Field>
              <br />
              <Form.Field className="form-inputs-admin">
                <input
                  id="description"
                  placeholder="Description"
                  autoComplete="off"
                  autoCorrect="off"
                  value={state.description}
                  onChange={handleChange}
                />
              </Form.Field>
              <br />
              <Form.Field className="form-inputs-admin">
                <Input action className="form-inputs-admin">
                  <input
                    id="ethAddress"
                    placeholder="0x0"
                    autoComplete="off"
                    autoCorrect="off"
                    value={state.ethAddress}
                    onChange={handleChange}
                  />
                  <Button
                    type="button"
                    content="QR"
                    icon="qrcode"
                    onClick={() => setState((prev) => ({ ...prev, scanQR: true }))}
                  />
                </Input>
              </Form.Field>
              <br />
              <Form.Field className="form-inputs-admin">
                <Dropdown
                  placeholder="Select Role"
                  fluid
                  selection
                  options={roleOptions}
                  onChange={handleDropdownSelect}
                />
              </Form.Field>
              <br />
              <Message
                error
                header="Oops!!"
                content={state.errorMessage}
              />
              <br />
              <div className="button-holder">
                <Button
                  className="button-css-admin"
                  type="submit"
                  onClick={handleSubmit}
                  loading={state.loading}
                >
                  Register
                </Button>
              </div>
            </Form>
          </Card.Content>
        </Card>
      </div>
    </>
  );
};

export default CreateUser;