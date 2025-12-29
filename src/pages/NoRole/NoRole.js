import React, { useState } from "react";
import { Button, Card, Dropdown, Form, Message } from "semantic-ui-react";
import "./NoRole.css";
import { messageAdmin } from "../../firebase/api.js";
import { useNavigate } from "react-router-dom"; // Included for potential future use

const NoRole = () => {
  const [state, setState] = useState({
    name: "",
    location: "",
    description: "",
    role: 0,
    loading: false,
    errorMessage: "",
    message: "",
  });
  const navigate = useNavigate(); // Hook for navigation (not used yet)

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
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const info = {
        name: state.name,
        description: state.description,
        role: state.role,
        location: state.location,
      };
      await messageAdmin(info, state.message);
      setState((prev) => ({
        ...prev,
        name: "",
        description: "",
        role: "0",
        location: "",
        message: "",
        loading: false,
      }));
    } catch (error) {
      setState((prev) => ({ ...prev, errorMessage: error.message, loading: false }));
    }
  };

  return (
    <div className="norole">
      <Card className="card-style">
        <Card.Content>
          <Card.Header centered="true">
            <h2 className="card-heading">Message Admin</h2>
            <small className="norole-heading-subtext">
              Message admin to get added on the blockchain
            </small>
          </Card.Header>
          <hr className="horizontal-line"></hr>
          <br />
          <Form error={!!state.errorMessage}>
            <Form.Field className="form-inputs-admin">
              <input
                id="name"
                placeholder="Your Name"
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
                placeholder="Your Location"
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
                placeholder="Brief Description"
                autoComplete="off"
                autoCorrect="off"
                value={state.description}
                onChange={handleChange}
              />
            </Form.Field>
            <br />
            <Form.Field className="form-inputs-admin">
              <Dropdown
                placeholder="Desired Role"
                fluid
                selection
                options={roleOptions}
                onChange={handleDropdownSelect}
              />
            </Form.Field>
            <br />
            <Form.Field className="form-inputs-admin">
              <textarea
                id="message"
                rows="4"
                placeholder="Short Message for Admin"
                autoComplete="off"
                autoCorrect="off"
                value={state.message}
                onChange={handleChange}
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
                Send
              </Button>
            </div>
          </Form>
        </Card.Content>
      </Card>
      <br />
    </div>
  );
};

export default NoRole;