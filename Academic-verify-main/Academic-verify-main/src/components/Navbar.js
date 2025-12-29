import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Menu, Segment, Image, Label, Icon } from "semantic-ui-react";
import Admin from "../abis/Admin.json";
import { Link, useNavigate } from "react-router-dom"; // Replaced withRouter with useNavigate
import SearchBar from "./SearchBar";
import GenererateQR from "./GenererateQR";

const Navbar = () => {
  const [state, setState] = useState({ activeItem: "home", role: -1, account: "", showQr: false });
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!window.web3) throw new Error("Web3 not initialized");

        const web3 = window.web3;
        const accounts = await web3.eth.getAccounts();
        if (accounts) {
          setState((prev) => ({ ...prev, account: accounts[0] }));
        }
        const networkId = await web3.eth.net.getId();
        const AdminData = Admin.networks[networkId];
        if (AdminData) {
          const admin = new web3.eth.Contract(Admin.abi, AdminData.address);
          const isEmployee = await admin.methods.isEmployee(accounts[0]).call();
          const isOrganizationEndorser = await admin.methods
            .isOrganizationEndorser(accounts[0])
            .call();
          const owner = await admin.methods.owner().call();
          let role = -1;
          if (accounts[0] === owner) {
            role = 0;
          } else if (isEmployee) {
            role = 1;
          } else if (isOrganizationEndorser) {
            role = 2;
          }
          setState((prev) => ({ ...prev, role }));
        } else {
          toast.error("The Admin Contract does not exist on this network!");
        }
      } catch (error) {
        toast.error(error.message || "Error loading blockchain data");
      }
    };

    loadData();
  }, []); // Empty dependency array to run once on mount

  const handleItemClick = (e, { name }) => setState({ activeItem: name });

  const closeQRModal = () => {
    setState((prev) => ({ ...prev, showQr: false }));
  };

  const { activeItem } = state;
  const roles = ["Admin", "Employee", "Organization"];

  return (
    <>
      <GenererateQR isOpen={state.showQr} closeQRModal={closeQRModal} />
      <Segment
        inverted
        style={{
          borderRadius: "0",
          background: "#1e2022ea",
          boxShadow: "0 0 5px 0px white",
        }}
      >
        <Menu
          style={{ marginLeft: "80px", border: "none" }}
          inverted
          pointing
          secondary
        >
          <Menu.Item
            as={Link}
            to="/"
            style={{ marginRight: "25px", padding: "0px" }}
          >
            <div
              style={{
                background: "white",
                display: "grid",
                justifyItems: "center",
                alignItems: "center",
                justifyContent: "center",
                height: "50px",
                width: "50px",
                borderRadius: "100%",
                padding: "10px",
                marginBottom: "-5px",
              }}
            >
              <Image src="https://static.thenounproject.com/png/3293529-200.png" />
            </div>
          </Menu.Item>
          <Menu.Item style={{ marginRight: "25px", padding: "0px" }} position="left">
            <SearchBar />
          </Menu.Item>
          {state.role === 0 && (
            <>
              <Menu.Item
                as={Link}
                to="/"
                name="Employees"
                active={activeItem === "Employees"}
                onClick={handleItemClick}
              />
              <Menu.Item
                as={Link}
                to="/all-organization-endorser"
                name="Organization Endorsers"
                active={activeItem === "Organization Endorsers"}
                onClick={handleItemClick}
              />
              <Menu.Item
                as={Link}
                to="/create-user"
                name="Create User"
                active={activeItem === "Create User"}
                onClick={handleItemClick}
              />
              <Menu.Item
                as={Link}
                to="/notifications"
                name="Notifications"
                active={activeItem === "Notifications"}
                onClick={handleItemClick}
              />
            </>
          )}
          {state.role === 1 && (
            <>
              <Menu.Item
                as={Link}
                to="/"
                name="Profile"
                active={activeItem === "Profile"}
                onClick={handleItemClick}
              />
              <Menu.Item
                as={Link}
                to="/update-profile"
                name="Update Profile"
                active={activeItem === "Update Profile"}
                onClick={handleItemClick}
              />
              <Menu.Item
                as={Link}
                to="/notifications"
                name="Notifications"
                active={activeItem === "Notifications"}
                onClick={handleItemClick}
              />
            </>
          )}
          {state.role === 2 && (
            <>
              <Menu.Item
                as={Link}
                to="/"
                name="Info Page"
                active={activeItem === "Info Page"}
                onClick={handleItemClick}
              />
              <Menu.Item
                as={Link}
                to="/endorse-skill"
                name="Endorse Skill"
                active={activeItem === "Endorse Skill"}
                onClick={handleItemClick}
              />
              <Menu.Item
                as={Link}
                to="/endorse-section"
                name="Endorse Section"
                active={activeItem === "Endorse Section"}
                onClick={handleItemClick}
              />
              <Menu.Item
                as={Link}
                to="/notifications"
                name="Notifications"
                active={activeItem === "Notifications"}
                onClick={handleItemClick}
              />
            </>
          )}
          {state.role === -1 && (
            <>
              <Menu.Item
                as={Link}
                to="/"
                name="Request Admin For Role"
                active={activeItem === "Request Admin For Role"}
                onClick={handleItemClick}
              />
              <Menu.Item
                as={Link}
                to="/notifications"
                name="Notifications"
                active={activeItem === "Notifications"}
                onClick={handleItemClick}
              />
            </>
          )}
          <Menu.Item position="right">
            <Label style={{ color: "black", background: "white" }}>
              {state.role === -1 ? "No Role" : roles[state.role]}
            </Label>
            &nbsp;&nbsp;&nbsp;
            <div style={{ color: "lightgray" }}>
              <em>
                <small>{state.account}</small>
              </em>
              &nbsp;&nbsp;&nbsp;
              <Icon
                name="qrcode"
                size="large"
                style={{ color: "white", cursor: "pointer" }}
                onClick={() => setState((prev) => ({ ...prev, showQr: true }))}
              />
            </div>
          </Menu.Item>
        </Menu>
      </Segment>
    </>
  );
};

export default Navbar;