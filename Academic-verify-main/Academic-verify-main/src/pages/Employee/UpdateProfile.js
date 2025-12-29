import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Card, Grid } from "semantic-ui-react";
import Admin from "../../abis/Admin.json";
import Employee from "../../abis/Employee.json";
import LineChart from "../../components/LineChart";
import SkillCard from "../../components/SkillCard";
import "./Employee.css";
import "./UpdateProfile.css";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import GetCertificationModal from "../../components/GetCertificationModal";
import GetWorkExpModal from "../../components/GetWorkExpModal";
import GetSkillsModal from "../../components/GetSkillsModals";
import GetEducationModal from "../../components/GetEducationModal";
import GetEditFieldModal from "../../components/GetEditFieldModal";
import LoadComp from "../../components/LoadComp";
import CodeforcesGraph from "../../components/CodeforcesGraph";
import {
  reqCertiEndorsementFunc,
  reqEducationEndorsementFunc,
  reqWorkexpEndorsementFunc,
} from "../../firebase/api";
import { useNavigate } from "react-router-dom"; // Replaced withRouter with useNavigate

const UpdateProfile = () => {
  const [state, setState] = useState({
    employeedata: {},
    overallEndorsement: [],
    skills: [],
    certifications: [],
    workExps: [],
    educations: [],
    colour: ["#b6e498", "#61dafb", "#764abc", "#83cd29", "#00d1b2"],
    readmore: false,
    certificationModal: false,
    workexpModal: false,
    skillmodal: false,
    educationmodal: false,
    editFieldModal: false,
    isDescription: false,
    loadcomp: false,
    EmployeeContract: {},
  });
  const navigate = useNavigate(); // Hook for navigation (though not used here)

  // Helper functions
  const getSkills = async (EmployeeContract) => {
    try {
      const skillCount = await EmployeeContract?.methods?.getSkillCount().call();
      const skills = await Promise.all(
        Array(parseInt(skillCount))
          .fill()
          .map((_, index) => EmployeeContract?.methods?.getSkillByIndex(index).call())
      );

      const newskills = skills.map((certi) => ({
        name: certi[0],
        overall_percentage: certi[1],
        experience: certi[2],
        endorsed: certi[3],
        endorser_address: certi[4],
        review: certi[5],
        visible: certi[6],
      }));

      setState((prev) => ({ ...prev, skills: newskills }));
    } catch (error) {
      console.error("Error fetching skills:", error);
    }
  };

  const getCertifications = async (EmployeeContract) => {
    try {
      const certiCount = await EmployeeContract?.methods?.getCertificationCount().call();
      const certifications = await Promise.all(
        Array(parseInt(certiCount))
          .fill()
          .map((_, index) => EmployeeContract?.methods?.getCertificationByIndex(index).call())
      );

      const newcertifications = certifications.map((certi) => ({
        name: certi[0],
        organization: certi[1],
        score: certi[2],
        endorsed: certi[3],
        visible: certi[4],
      }));

      setState((prev) => ({ ...prev, certifications: newcertifications }));
    } catch (error) {
      console.error("Error fetching certifications:", error);
    }
  };

  const getWorkExp = async (EmployeeContract) => {
    try {
      const workExpCount = await EmployeeContract?.methods?.getWorkExpCount().call();
      const workExps = await Promise.all(
        Array(parseInt(workExpCount))
          .fill()
          .map((_, index) => EmployeeContract?.methods?.getWorkExpByIndex(index).call())
      );

      const newworkExps = workExps.map((work) => ({
        role: work[0],
        organization: work[1],
        startdate: work[2],
        enddate: work[3],
        endorsed: work[4],
        description: work[5],
        visible: work[6],
      }));

      setState((prev) => ({ ...prev, workExps: newworkExps }));
    } catch (error) {
      console.error("Error fetching work experience:", error);
    }
  };

  const getEducation = async (EmployeeContract) => {
    try {
      const educationCount = await EmployeeContract?.methods?.getEducationCount().call();
      const educations = await Promise.all(
        Array(parseInt(educationCount))
          .fill()
          .map((_, index) => EmployeeContract?.methods?.getEducationByIndex(index).call())
      );

      const neweducation = educations.map((certi) => ({
        institute: certi[0],
        startdate: certi[1],
        enddate: certi[2],
        endorsed: certi[3],
        description: certi[4],
      }));

      setState((prev) => ({ ...prev, educations: neweducation }));
    } catch (error) {
      console.error("Error fetching education:", error);
    }
  };

  const certificationVisibility = async (name) => {
    try {
      if (!window.web3) throw new Error("Web3 not initialized");
      const web3 = window.web3;
      const networkId = await web3.eth.net.getId();
      const AdminData = Admin.networks[networkId];
      const accounts = await web3.eth.getAccounts();
      if (AdminData) {
        const admin = await new web3.eth.Contract(Admin.abi, AdminData.address);
        const employeeContractAddress = await admin?.methods
          ?.getEmployeeContractByAddress(accounts[0])
          .call();
        const EmployeeContract = await new web3.eth.Contract(
          Employee.abi,
          employeeContractAddress
        );
        await EmployeeContract?.methods
          ?.deleteCertification(name)
          .send({ from: accounts[0] });
        toast.success("Certification visibility changed successfully!!");
      } else {
        toast.error("The Admin Contract does not exist on this network!");
      }
    } catch (error) {
      console.error("Error changing certification visibility:", error);
    }
    getCertifications(state.EmployeeContract);
  };

  const workExpVisibility = async (org) => {
    try {
      if (!window.web3) throw new Error("Web3 not initialized");
      const web3 = window.web3;
      const networkId = await web3.eth.net.getId();
      const AdminData = Admin.networks[networkId];
      const accounts = await web3.eth.getAccounts();
      if (AdminData) {
        const admin = await new web3.eth.Contract(Admin.abi, AdminData.address);
        const employeeContractAddress = await admin?.methods
          ?.getEmployeeContractByAddress(accounts[0])
          .call();
        const EmployeeContract = await new web3.eth.Contract(
          Employee.abi,
          employeeContractAddress
        );
        await EmployeeContract?.methods
          ?.deleteWorkExp(org)
          .send({ from: accounts[0] });
        toast.success("Work Exp. visibility changed successfully!!");
      } else {
        toast.error("The Admin Contract does not exist on this network!");
      }
    } catch (error) {
      console.error("Error changing work experience visibility:", error);
    }
    getWorkExp(state.EmployeeContract);
  };

  const reqEducationEndorsement = async (education) => {
    try {
      await reqEducationEndorsementFunc(education);
    } catch (error) {
      console.error("Error requesting education endorsement:", error);
    }
  };

  const reqCertiEndorsement = async (certi) => {
    try {
      await reqCertiEndorsementFunc(certi);
    } catch (error) {
      console.error("Error requesting certification endorsement:", error);
    }
  };

  const reqWorkexpEndorsement = async (workExp) => {
    try {
      await reqWorkexpEndorsementFunc(workExp);
    } catch (error) {
      console.error("Error requesting work experience endorsement:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setState((prev) => ({ ...prev, loadcomp: true }));
      try {
        if (!window.web3) throw new Error("Web3 not initialized");
        const web3 = window.web3;
        const networkId = await web3.eth.net.getId();
        const AdminData = Admin.networks[networkId];
        const accounts = await web3.eth.getAccounts();
        if (AdminData) {
          const admin = await new web3.eth.Contract(Admin.abi, AdminData.address);
          const employeeContractAddress = await admin?.methods
            ?.getEmployeeContractByAddress(accounts[0])
            .call();
          const EmployeeContract = await new web3.eth.Contract(
            Employee.abi,
            employeeContractAddress
          );
          setState((prev) => ({ ...prev, EmployeeContract }));

          await Promise.all([
            getSkills(EmployeeContract),
            getCertifications(EmployeeContract),
            getWorkExp(EmployeeContract),
            getEducation(EmployeeContract),
          ]);

          const employeedata = await EmployeeContract.methods.getEmployeeInfo().call();
          const newEmployedata = {
            ethAddress: employeedata[0],
            name: employeedata[1],
            location: employeedata[2],
            description: employeedata[3],
            overallEndorsement: employeedata[4],
            endorsecount: employeedata[5],
          };
          const endorseCount = newEmployedata.endorsecount;
          const overallEndorsement = await Promise.all(
            Array(parseInt(endorseCount))
              .fill()
              .map((_, index) => EmployeeContract?.methods?.overallEndorsement(index).call())
          );
          console.log(overallEndorsement);
          setState((prev) => ({
            ...prev,
            employeedata: newEmployedata,
            overallEndorsement,
          }));
        } else {
          toast.error("The Admin Contract does not exist on this network!");
        }
      } catch (error) {
        console.error("Error loading profile data:", error);
      }
      setState((prev) => ({ ...prev, loadcomp: false }));
    };

    loadData();
  }, []); // Empty dependency array to run once on mount

  const closeCertificationModal = () => {
    setState((prev) => ({ ...prev, certificationModal: false }));
    getCertifications(state.EmployeeContract);
  };

  const closeWorkExpModal = () => {
    setState((prev) => ({ ...prev, workexpModal: false }));
    getWorkExp(state.EmployeeContract);
  };

  const closeSkillModal = () => {
    setState((prev) => ({ ...prev, skillmodal: false }));
    getSkills(state.EmployeeContract);
  };

  const closeEducationModal = () => {
    setState((prev) => ({ ...prev, educationmodal: false }));
    getEducation(state.EmployeeContract);
  };

  const closeEditFieldModal = () => {
    setState((prev) => ({ ...prev, editFieldModal: false }));
  };

  return state.loadcomp ? (
    <LoadComp />
  ) : (
    <div>
      <GetCertificationModal
        isOpen={state.certificationModal}
        closeCertificationModal={closeCertificationModal}
      />
      <GetWorkExpModal
        isOpen={state.workexpModal}
        closeCertificationModal={closeWorkExpModal}
      />
      <GetSkillsModal
        isOpen={state.skillmodal}
        closeCertificationModal={closeSkillModal}
      />
      <GetEducationModal
        isOpen={state.educationmodal}
        closeCertificationModal={closeEducationModal}
      />

      <GetEditFieldModal
        isOpen={state.editFieldModal}
        closeEditFieldModal={closeEditFieldModal}
        name={state.employeedata?.name}
        location={state.employeedata?.location}
        description={state.employeedata?.description}
        isDescription={state.isDescription}
      />

      <Grid>
        <Grid.Row>
          <Grid.Column width={6}>
            <Card className="personal-info">
              <Card.Content>
                <Card.Header>
                  <div className="edit-heading">
                    <span>{state.employeedata?.name}</span>
                    <span
                      className="add-button"
                      onClick={(e) =>
                        setState((prev) => ({
                          ...prev,
                          editFieldModal: !prev.editFieldModal,
                          isDescription: false,
                        }))
                      }
                    >
                      <i className="fas fa-pencil-alt"></i>
                    </span>
                  </div>
                  <small
                    style={{ wordBreak: "break-word", color: "#c5c6c7" }}
                  >
                    {state.employeedata?.ethAddress}
                  </small>
                </Card.Header>
                <br />
                <div>
                  <p>
                    <em>Location: </em>
                    <span style={{ color: "#c5c6c7" }}>
                      {state.employeedata?.location}
                    </span>
                  </p>
                </div>
                <br />
                <div>
                  <p>
                    <em>Overall Endorsement Rating:</em>
                  </p>
                  <LineChart overallEndorsement={state.overallEndorsement} />
                </div>
              </Card.Content>
            </Card>
            <Card className="employee-des">
              <Card.Content>
                <Card.Header>
                  <div className="edit-heading">
                    <span>About</span>
                    <span
                      className="add-button"
                      onClick={(e) =>
                        setState((prev) => ({
                          ...prev,
                          editFieldModal: !prev.editFieldModal,
                          isDescription: true,
                        }))
                      }
                    >
                      <i className="fas fa-pencil-alt"></i>
                    </span>
                  </div>
                </Card.Header>
                <div>
                  <p style={{ color: "#c5c6c7" }}>
                    {state.employeedata?.description}
                  </p>
                </div>
                <br />
                <div>
                  <span
                    className="add-button"
                    onClick={(e) =>
                      setState((prev) => ({
                        ...prev,
                        educationmodal: !prev.educationmodal,
                      }))
                    }
                  >
                    <i className="fas fa-plus"></i>
                  </span>

                  <Card.Header
                    style={{ fontSize: "19px", fontWeight: "600" }}
                  >
                    Education
                  </Card.Header>
                  <br />
                  <div className="education">
                    {state.educations?.map((education, index) => (
                      <div className="education-design" key={index}>
                        <div
                          style={{ paddingRight: "50px", color: "#c5c6c7" }}
                        >
                          <p>{education.description}</p>
                          <small style={{ wordBreak: "break-word" }}>
                            {education.institute}
                          </small>
                        </div>
                        <div>
                          <small style={{ color: "#c5c6c7" }}>
                            <em>
                              {education.startdate} - {education.enddate}
                            </em>
                          </small>
                          <p
                            style={{
                              color: education.endorsed ? "#00d1b2" : "yellow",
                              opacity: "0.7",
                            }}
                          >
                            {education.endorsed ? (
                              "Endorsed"
                            ) : (
                              <div
                                className="endorsement-req-button"
                                onClick={() => reqEducationEndorsement(education)}
                              >
                                Request Endorsement
                              </div>
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card.Content>
            </Card>
            <Card className="employee-des">
              <Card.Content>
                <Card.Header>Competetive Platform Ratings</Card.Header>
                <CodeforcesGraph />
              </Card.Content>
            </Card>
          </Grid.Column>
          <Grid.Column width={10}>
            <Card className="employee-des">
              <Card.Content>
                <span
                  className="add-button"
                  onClick={(e) =>
                    setState((prev) => ({
                      ...prev,
                      certificationModal: !prev.certificationModal,
                    }))
                  }
                >
                  <i className="fas fa-plus"></i>
                </span>
                <Card.Header>Certifications</Card.Header>
                <br />
                <br />
                <div>
                  {state.certifications?.map((certi, index) => (
                    <div key={index} className="certification-container">
                      <div style={{ color: "#c5c6c7" }}>
                        <p>
                          {certi.name}
                          <span
                            className="delete-button-visiblility"
                            onClick={(e) => certificationVisibility(certi.name)}
                          >
                            {!certi.visible ? (
                              <i className="fas fa-eye-slash"></i>
                            ) : (
                              <i className="fas fa-eye"></i>
                            )}
                          </span>
                        </p>
                        <small style={{ wordBreak: "break-word" }}>
                          {certi.organization}
                        </small>
                        <p
                          style={{
                            color: certi.endorsed ? "#00d1b2" : "yellow",
                            opacity: "0.7",
                          }}
                        >
                          {certi.endorsed ? (
                            "Endorsed"
                          ) : (
                            <div
                              className="endorsement-req-button"
                              onClick={() => reqCertiEndorsement(certi)}
                            >
                              Request Endorsement
                            </div>
                          )}
                        </p>
                      </div>
                      <div>
                        <div style={{ width: "100px" }}>
                          <CircularProgressbar
                            value={certi.score}
                            text={`Score - ${certi.score}%`}
                            strokeWidth="5"
                            styles={buildStyles({
                              strokeLinecap: "round",
                              textSize: "12px",
                              pathTransitionDuration: 1,
                              pathColor: `rgba(255,255,255, ${certi.score / 100})`,
                              textColor: "#c5c6c7",
                              trailColor: "#393b3fa6",
                              backgroundColor: "#c5c6c7",
                            })}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>
            <Card className="employee-des">
              <Card.Content>
                <span
                  className="add-button"
                  onClick={(e) =>
                    setState((prev) => ({ ...prev, workexpModal: !prev.workexpModal }))
                  }
                >
                  <i className="fas fa-plus"></i>
                </span>
                <Card.Header>Work Experiences</Card.Header>
                <br />
                <div className="education">
                  {state.workExps?.map((workExp, index) => (
                    <div className="education-design" key={index}>
                      <div style={{ color: "#c5c6c7" }}>
                        <p>
                          {workExp.role}
                          <span
                            className="delete-button-visiblility"
                            onClick={(e) => workExpVisibility(workExp.organization)}
                          >
                            {!workExp.visible ? (
                              <i className="fas fa-eye-slash"></i>
                            ) : (
                              <i className="fas fa-eye"></i>
                            )}
                          </span>
                        </p>
                        <small style={{ wordBreak: "break-word" }}>
                          {workExp.organization}
                        </small>
                      </div>
                      <div>
                        <small style={{ color: "#c5c6c7" }}>
                          <em>{workExp.startdate} - {workExp.enddate}</em>
                        </small>
                        <p
                          style={{
                            color: workExp.endorsed ? "#00d1b2" : "yellow",
                            opacity: "0.7",
                          }}
                        >
                          {workExp.endorsed ? (
                            "Endorsed"
                          ) : (
                            <div
                              className="endorsement-req-button"
                              onClick={() => reqWorkexpEndorsement(workExp)}
                            >
                              Request Endorsement
                            </div>
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>
            <Card className="employee-des">
              <Card.Content>
                <span
                  className="add-button"
                  onClick={(e) =>
                    setState((prev) => ({ ...prev, skillmodal: !prev.skillmodal }))
                  }
                >
                  <i className="fas fa-plus"></i>
                </span>
                <Card.Header>Skills</Card.Header>
                <br />
                <br />
                <div className="skill-height-container">
                  {state.skills?.map((skill, index) => (
                    <div key={index}>
                      <SkillCard skill={skill} update />
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
};

export default UpdateProfile;