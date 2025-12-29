import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import Web3 from "web3";
import Admin from "./abis/Admin.json";
import "react-toastify/dist/ReactToastify.css";
import MetaMaskGuide from "./MetaMaskGuide";
import { Container } from "semantic-ui-react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import AdminPageCreate from "./pages/Admin/CreateUser";
import AllEmployees from "./pages/Admin/AllEmployees";
import AllOrganizationEndorser from "./pages/Admin/AllOrganizationEndorser";

import EmployeePage from "./pages/Employee/Employee";
import UpdateProfile from "./pages/Employee/UpdateProfile";

import Organization from "./pages/OrganizationEndorser/Organization";
import EndorseSkill from "./pages/OrganizationEndorser/EndorseSkill";
import Endorse from "./pages/OrganizationEndorser/EndorseSection";

import Navbar from "./components/Navbar";

import GetEmployee from "./pages/GetRoutes/GetEmployee";
import GetOrg from "./pages/GetRoutes/GetOrg";

import NoRole from "./pages/NoRole/NoRole";
import Notifications from "./pages/NoRole/Notifications";

import NotificationsAdmin from "./pages/Admin/Notifications";
import NotificationsEmployee from "./pages/Employee/Notifications";
import NotificationsOrg from "./pages/OrganizationEndorser/Notifications";

import LoadComp from "./components/LoadComp";

function App() {
  const [isMeta, setisMeta] = useState(false);
  const [isEmployee, setisEmployee] = useState(false);
  const [account, setaccount] = useState("");
  const [isOrganizationEndorser, setisOrganizationEndorser] = useState(false);
  const [isOwner, setisOwner] = useState(false);
  const [loadcomp, setloadcomp] = useState(true);

  const loadBlockChainData = async () => {
    try {
      console.log("loadBlockChainData: Starting...");
      const web3 = window.web3;
      const accounts = await web3.eth.getAccounts();
      console.log("accounts:", accounts);

      if (accounts && accounts.length > 0) {
        setaccount(accounts[0]);
      } else {
        setaccount("");
      }

      console.log("loadBlockChainData: Fetching Chain ID...");
      const networkIdRaw = await web3.eth.getChainId();
      const networkId = networkIdRaw.toString();
      console.log("Network ID:", networkId);

      let AdminData = Admin.networks[networkId];
      if (!AdminData && networkId === "1337") {
        console.log("Falling back to network ID 5777 for local Ganache");
        AdminData = Admin.networks["5777"];
      }

      if (AdminData) {
        console.log("loadBlockChainData: Admin contract found at", AdminData.address);

        // Check if code exists at this address
        const code = await web3.eth.getCode(AdminData.address);
        console.log("loadBlockChainData: Code at address:", code === "0x" ? "EMPTY (0x)" : "EXISTS (" + code.substring(0, 10) + "...)");

        if (code === "0x") {
          console.error("CRITICAL: No contract code found at address " + AdminData.address + " on network " + networkId);
          toast.error("Contract not found on network! Please redeploy.");
          setloadcomp(false);
          return;
        }

        const admin = new web3.eth.Contract(Admin.abi, AdminData.address);

        // Try owner() first as it has no arguments
        console.log("loadBlockChainData: Calling owner()...");
        const owner = await admin.methods.owner().call();
        console.log("loadBlockChainData: owner:", owner);

        console.log("loadBlockChainData: Calling isEmployee(" + accounts[0] + ")...");
        const isEmployee = await admin.methods
          .isEmployee(accounts[0])
          .call();
        console.log("loadBlockChainData: isEmployee:", isEmployee);

        console.log("loadBlockChainData: Calling isOrganizationEndorser(" + accounts[0] + ")...");
        const isOrganizationEndorser = await admin.methods
          .isOrganizationEndorser(accounts[0])
          .call();
        console.log("loadBlockChainData: isOrganizationEndorser:", isOrganizationEndorser);

        setisEmployee(isEmployee);
        setisOrganizationEndorser(isOrganizationEndorser);
        setisOwner(owner.toLowerCase() === accounts[0].toLowerCase());
      } else {
        console.error("Admin contract not deployed on this network!");
        toast.error("Admin contract not deployed on this network!");
      }
    } catch (err) {
      console.error("Blockchain load error:", err);
      toast.error("Error connecting to blockchain");
    }
  };

  useEffect(() => {
    const func = async () => {
      console.log("App: Initialization started");
      setloadcomp(true);

      // ✅ priority 1 — Metamask
      if (window.ethereum) {
        console.log("App: MetaMask detected");
        try {
          console.log("App: Requesting accounts...");
          await window.ethereum.request({ method: "eth_requestAccounts" });
          console.log("App: Accounts received");
          window.web3 = new Web3(window.ethereum);
          await loadBlockChainData();
          setisMeta(true);
        } catch (e) {
          console.log("MetaMask error:", e);
          setisMeta(false);
        }

        // ✅ priority 2 — Legacy web3
      } else if (window.web3) {
        console.log("App: Legacy Web3 detected");
        window.web3 = new Web3(window.web3.currentProvider);
        await loadBlockChainData();
        setisMeta(true);

        // ✅ priority 3 — FALLBACK to GANACHE CLI
      } else {
        console.log("Using Ganache CLI fallback...");
        window.web3 = new Web3("http://127.0.0.1:7545");
        try {
          await loadBlockChainData();
          setisMeta(true);
        } catch {
          setisMeta(false);
        }
      }

      console.log("App: Initialization complete, turning off loader");
      setloadcomp(false);
    };

    func();
  }, []);

  if (loadcomp) return <LoadComp />;

  return (
    <div>
      {isMeta && account !== "" ? (
        <BrowserRouter>
          <Navbar />
          <Container>
            <ToastContainer />

            <Routes>
              <Route
                path="/getemployee/:employee_address"
                element={<GetEmployee />}
              />
              <Route path="/getOrg/:orgAddress" element={<GetOrg />} />

              {/* Default redirect */}
              <Route
                path="/"
                element={
                  isOwner ? (
                    <Navigate to="/admin" />
                  ) : isEmployee ? (
                    <Navigate to="/employee" />
                  ) : isOrganizationEndorser ? (
                    <Navigate to="/org" />
                  ) : (
                    <Navigate to="/norole" />
                  )
                }
              />

              {/* Admin Routes */}
              {isOwner && (
                <>
                  <Route path="/admin" element={<AllEmployees />} />
                  <Route
                    path="/all-organization-endorser"
                    element={<AllOrganizationEndorser />}
                  />
                  <Route path="/create-user" element={<AdminPageCreate />} />
                  <Route path="/notifications" element={<NotificationsAdmin />} />
                </>
              )}

              {/* Employee Routes */}
              {isEmployee && (
                <>
                  <Route path="/employee" element={<EmployeePage />} />
                  <Route path="/update-profile" element={<UpdateProfile />} />
                  <Route
                    path="/notifications"
                    element={<NotificationsEmployee />}
                  />
                </>
              )}

              {/* Organization Endorser Routes */}
              {isOrganizationEndorser && (
                <>
                  <Route path="/org" element={<Organization />} />
                  <Route path="/endorse-skill" element={<EndorseSkill />} />
                  <Route path="/endorse-section" element={<Endorse />} />
                  <Route path="/notifications" element={<NotificationsOrg />} />
                </>
              )}

              {/* No role */}
              {!isOwner && !isEmployee && !isOrganizationEndorser && (
                <>
                  <Route path="/norole" element={<NoRole />} />
                  <Route path="/notifications" element={<Notifications />} />
                </>
              )}
            </Routes>
          </Container>
        </BrowserRouter>
      ) : (
        <MetaMaskGuide />
      )}
    </div>
  );
}

export default App;
