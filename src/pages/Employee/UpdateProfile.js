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
import { useNavigate } from "react-router-dom";
import { toStringSafe, toNumberSafe } from "../../utils/numerics";
import { loadContract } from "../../utils/contractHelpers";

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
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      setState((prev) => ({ ...prev, loadcomp: true }));
      try {
        if (!window.web3) throw new Error("Web3 not initialized");
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

          const employeedata = await EmployeeContract.methods.getEmployeeInfo().call();
          const newEmployedata = {
            ethAddress: employeedata[0],
            name: employeedata[1],
            location: employeedata[2],
            description: employeedata[3],
            overallEndorsement: employeedata[4],
            endorsecount: employeedata[5],
          };

          setState((prev) => ({
            ...prev,
            employeedata: newEmployedata,
            EmployeeContract,
          }));

          await getSkills(EmployeeContract);
          await getCertifications(EmployeeContract);
          await getWorkExp(EmployeeContract);
          await getEducation(EmployeeContract);
        } else {
          toast.error("The Admin Contract does not exist on this network!");
        }
      } catch (error) {
        console.error("Error loading profile data:", error);
      }
      setState((prev) => ({ ...prev, loadcomp: false }));
    };

    loadData();
  }, []);

  const getSkills = async (EmployeeContract) => {
    try {
      const skillCountRaw = await EmployeeContract?.methods?.getSkillCount().call();
      const count = toNumberSafe(skillCountRaw);
      if (count === 0) return;

      const skills = await Promise.all(
        Array.from({ length: count }, (_, index) =>
          EmployeeContract?.methods?.getSkillByIndex(index).call()
        )
      );

      const newskills = skills.map((certi) => ({
        name: toStringSafe(certi[0]),
        overall_percentage: toNumberSafe(certi[1]),
        experience: toStringSafe(certi[2]),
        endorsed: Boolean(certi[3]),
        endorser_address: toStringSafe(certi[4]),
        review: toStringSafe(certi[5]),
        visible: Boolean(certi[6]),
      }));

      setState((prev) => ({ ...prev, skills: newskills }));
    } catch (error) {
      console.error("Error fetching skills:", error);
    }
  };

  const getCertifications = async (EmployeeContract) => {
    try {
      const certiCountRaw = await EmployeeContract?.methods?.getCertificationCount().call();
      const count = toNumberSafe(certiCountRaw);
      if (count === 0) return;

      const certifications = await Promise.all(
        Array.from({ length: count }, (_, index) =>
          EmployeeContract?.methods?.getCertificationByIndex(index).call()
        )
      );

      const newcertifications = certifications.map((certi) => ({
        name: toStringSafe(certi[0]),
        organization: toStringSafe(certi[1]),
        score: toNumberSafe(certi[2]),
        endorsed: Boolean(certi[3]),
        visible: Boolean(certi[4]),
      }));

      setState((prev) => ({ ...prev, certifications: newcertifications }));
    } catch (error) {
      console.error("Error fetching certifications:", error);
    }
  };

  const getWorkExp = async (EmployeeContract) => {
    try {
      const workExpCountRaw = await EmployeeContract?.methods?.getWorkExpCount().call();
      const count = toNumberSafe(workExpCountRaw);
      if (count === 0) return;

      const workExps = await Promise.all(
        Array.from({ length: count }, (_, index) =>
          EmployeeContract?.methods?.getWorkExpByIndex(index).call()
        )
      );

      const newworkExps = workExps.map((work) => ({
        role: toStringSafe(work[0]),
        organization: toStringSafe(work[1]),
        startdate: toStringSafe(work[2]),
        enddate: toStringSafe(work[3]),
        endorsed: Boolean(work[4]),
        description: toStringSafe(work[5]),
        visible: Boolean(work[6]),
      }));

      setState((prev) => ({ ...prev, workExps: newworkExps }));
    } catch (error) {
      console.error("Error fetching work experience:", error);
    }
  };

  const getEducation = async (EmployeeContract) => {
    try {
      const educationCountRaw = await EmployeeContract?.methods?.getEducationCount().call();
      const count = toNumberSafe(educationCountRaw);
      if (count === 0) return;

      const educations = await Promise.all(
        Array.from({ length: count }, (_, index) =>
          EmployeeContract?.methods?.getEducationByIndex(index).call()
        )
      );

      const neweducation = educations.map((certi) => ({
        institute: toStringSafe(certi[0]),
        startdate: toStringSafe(certi[1]),
        enddate: toStringSafe(certi[2]),
        endorsed: Boolean(certi[3]),
        description: toStringSafe(certi[4]),
      }));

      setState((prev) => ({ ...prev, educations: neweducation }));
    } catch (error) {
      console.error("Error fetching education:", error);
    }
  };

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

  const reqCertiEndorsement = async (certi) => {
    await reqCertiEndorsementFunc(certi);
  };

  const reqEducationEndorsement = async (education) => {
    await reqEducationEndorsementFunc(education);
  };

  const reqWorkexpEndorsement = async (workExp) => {
    await reqWorkexpEndorsementFunc(workExp);
  };

  const certificationVisibility = async (name) => {
    // Implement visibility toggle logic if needed, or keep as placeholder
  };

  const workExpVisibility = async (organization) => {
    // Implement visibility toggle logic if needed
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
                  <LineChart overallEndorsement={state.overallEndorsement || []} />
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
                            value={toNumberSafe(certi.score)}
                            text={`Score - ${toNumberSafe(certi.score)}%`}
                            strokeWidth="5"
                            styles={buildStyles({
                              strokeLinecap: "round",
                              textSize: "12px",
                              pathTransitionDuration: 1,
                              pathColor: `rgba(255,255,255, ${toNumberSafe(certi.score) / 100})`,
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