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
      const web3 = window.web3;
      const accounts = await web3.eth.getAccounts();
      console.log("accounts:", accounts);

      if (accounts && accounts.length > 0) {
        setaccount(accounts[0]);
      } else {
        setaccount("");
      }

      const networkId = await web3.eth.net.getId();
      console.log("Network ID:", networkId);

      const AdminData = await Admin.networks[networkId];

      if (AdminData) {
        const admin = new web3.eth.Contract(Admin.abi, AdminData.address);

        const isEmployee = await admin.methods
          .isEmployee(accounts[0])
          .call();

        const isOrganizationEndorser = await admin.methods
          .isOrganizationEndorser(accounts[0])
          .call();

        const owner = await admin.methods.owner().call();

        setisEmployee(isEmployee);
        setisOrganizationEndorser(isOrganizationEndorser);
        setisOwner(owner === accounts[0]);
      } else {
        toast.error("Admin contract not deployed on this network!");
      }
    } catch (err) {
      console.error("Blockchain load error:", err);
      toast.error("Error connecting to blockchain");
    }
  };

  useEffect(() => {
    const func = async () => {
      setloadcomp(true);

      // ✅ priority 1 — Metamask
      if (window.ethereum) {
        try {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          window.web3 = new Web3(window.ethereum);
          await loadBlockChainData();
          setisMeta(true);
        } catch (e) {
          console.log("MetaMask error:", e);
          setisMeta(false);
        }

      // ✅ priority 2 — Legacy web3
      } else if (window.web3) {
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
