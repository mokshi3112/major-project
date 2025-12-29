import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Card, Grid } from "semantic-ui-react";
import Admin from "../../abis/Admin.json";
import Employee from "../../abis/Employee.json";
import LineChart from "../../components/LineChart";
import SkillCard from "../../components/SkillCard";
import "./Employee.css";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import CodeforcesGraph from "../../components/CodeforcesGraph";
import LoadComp from "../../components/LoadComp";
import { useNavigate } from "react-router-dom";
import { toStringSafe, toNumberSafe } from "../../utils/numerics";

const EmployeePage = () => {
  const [state, setState] = useState({
    employeedata: {},
    overallEndorsement: [],
    skills: [],
    certifications: [],
    workExps: [],
    educations: [],
    colour: ["#b6e498", "#61dafb", "#764abc", "#83cd29", "#00d1b2"],
    readmore: false,
    codeforces_res: [],
    loadcomp: false,
  });

  const navigate = useNavigate();

  const getSkills = async (EmployeeContract) => {
    try {
      const skillCountRaw = await EmployeeContract.methods.getSkillCount().call();
      const count = toNumberSafe(skillCountRaw);
      if (count === 0) return;

      const skills = await Promise.all(
        Array.from({ length: count }, (_, index) =>
          EmployeeContract.methods.getSkillByIndex(index).call()
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
      const certiCountRaw = await EmployeeContract.methods.getCertificationCount().call();
      const count = toNumberSafe(certiCountRaw);
      if (count === 0) return;

      const certifications = await Promise.all(
        Array.from({ length: count }, (_, index) =>
          EmployeeContract.methods.getCertificationByIndex(index).call()
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
      const workExpCountRaw = await EmployeeContract.methods.getWorkExpCount().call();
      const count = toNumberSafe(workExpCountRaw);
      if (count === 0) return;

      const workExps = await Promise.all(
        Array.from({ length: count }, (_, index) =>
          EmployeeContract.methods.getWorkExpByIndex(index).call()
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
      const educationCountRaw = await EmployeeContract.methods.getEducationCount().call();
      const count = toNumberSafe(educationCountRaw);
      if (count === 0) return;

      const educations = await Promise.all(
        Array.from({ length: count }, (_, index) =>
          EmployeeContract.methods.getEducationByIndex(index).call()
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

  useEffect(() => {
    const loadData = async () => {
      setState((prev) => ({ ...prev, loadcomp: true }));
      try {
        if (!window.web3) {
          toast.error("Web3 not initialized. Please install MetaMask.");
          setState((prev) => ({ ...prev, loadcomp: false }));
          return;
        }

        const web3 = window.web3;
        const networkIdRaw = await web3.eth.getChainId();
        const networkId = networkIdRaw.toString();
        const AdminData = Admin.networks[networkId];
        const accounts = await web3.eth.getAccounts();
        if (!AdminData) throw new Error("Admin Contract not found on this network");

        const admin = new web3.eth.Contract(Admin.abi, AdminData.address);
        const employeeContractAddress = await admin.methods
          .getEmployeeContractByAddress(accounts[0])
          .call();

        const EmployeeContract = new web3.eth.Contract(Employee.abi, employeeContractAddress);

        // Fetch all data in parallel
        await Promise.all([
          getSkills(EmployeeContract),
          getCertifications(EmployeeContract),
          getWorkExp(EmployeeContract),
          getEducation(EmployeeContract),
        ]);

        const employeedata = await EmployeeContract.methods.getEmployeeInfo().call();
        const newEmployedata = {
          ethAddress: toStringSafe(employeedata[0]),
          name: toStringSafe(employeedata[1]),
          location: toStringSafe(employeedata[2]),
          description: toStringSafe(employeedata[3]),
          overallEndorsement: toNumberSafe(employeedata[4]),
          endorsecount: toNumberSafe(employeedata[5]),
        };

        const endorseCount = newEmployedata.endorsecount;
        let overallEndorsement = [];
        if (endorseCount > 0) {
          overallEndorsement = await Promise.all(
            Array.from({ length: endorseCount }, async (_, index) => {
              const val = await EmployeeContract.methods.overallEndorsement(index).call();
              return toNumberSafe(val);
            })
          );
        }

        setState((prev) => ({
          ...prev,
          employeedata: newEmployedata,
          overallEndorsement,
          loadcomp: false,
        }));
      } catch (error) {
        console.error("Error loading blockchain data:", error);
        toast.error("Error loading blockchain data");
        setState((prev) => ({ ...prev, loadcomp: false }));
      }
    };

    loadData();
  }, []);

  return state.loadcomp ? (
    <LoadComp />
  ) : (
    <div>
      <Grid>
        <Grid.Row>
          <Grid.Column width={6}>
            <Card className="personal-info">
              <Card.Content>
                <Card.Header>
                  {state.employeedata?.name}
                  <small style={{ wordBreak: "break-word", color: "#c5c6c7", display: "block" }}>
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
                <Card.Header>About:</Card.Header>
                <div>
                  <p style={{ color: "#c5c6c7" }}>
                    {state.employeedata?.description}
                  </p>
                </div>
                <br />
                <div>
                  <Card.Header style={{ fontSize: "19px", fontWeight: "600" }}>
                    Education:
                  </Card.Header>
                  <br />
                  <div className="education">
                    {state.educations?.map((education, index) => (
                      <div className="education-design" key={index}>
                        <div style={{ paddingRight: "50px", color: "#c5c6c7" }}>
                          <p>{education.description}</p>
                          <small style={{ wordBreak: "break-word", fontSize: "10px" }}>
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
                            {education.endorsed ? "Endorsed" : "Not Yet Endorsed"}
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
                <Card.Header>Certifications</Card.Header>
                <br />
                <div>
                  {state.certifications?.map(
                    (certi, index) =>
                      certi.visible && (
                        <div key={index} className="certification-container">
                          <div style={{ color: "#c5c6c7" }}>
                            <p>{certi.name}</p>
                            <small style={{ wordBreak: "break-word" }}>
                              {certi.organization}
                            </small>
                            <p
                              style={{
                                color: certi.endorsed ? "#00d1b2" : "yellow",
                                opacity: "0.7",
                              }}
                            >
                              {certi.endorsed ? "Endorsed" : "Not Yet Endorsed"}
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
                                  pathColor: "#00d1b2",
                                  textColor: "#c5c6c7",
                                  trailColor: "#393b3fa6",
                                  backgroundColor: "#c5c6c7",
                                })}
                              />
                            </div>
                          </div>
                        </div>
                      )
                  )}
                </div>
              </Card.Content>
            </Card>
            <Card className="employee-des">
              <Card.Content>
                <Card.Header>Work Experiences</Card.Header>
                <br />
                <div className="education">
                  {state.workExps?.map(
                    (workExp, index) =>
                      workExp.visible && (
                        <div className="education-design" key={index}>
                          <div style={{ color: "#c5c6c7" }}>
                            <p>{workExp.role}</p>
                            <small style={{ wordBreak: "break-word" }}>
                              {workExp.organization}
                            </small>
                          </div>
                          <div>
                            <small>
                              <em>
                                {workExp.startdate} - {workExp.enddate}
                              </em>
                            </small>
                            <p
                              style={{
                                color: workExp.endorsed ? "#00d1b2" : "yellow",
                                opacity: "0.7",
                              }}
                            >
                              {workExp.endorsed ? "Endorsed" : "Not Yet Endorsed"}
                            </p>
                          </div>
                        </div>
                      )
                  )}
                </div>
              </Card.Content>
            </Card>
            <Card className="employee-des">
              <Card.Content>
                <Card.Header>Skills</Card.Header>
                <br />
                <div className="skill-height-container">
                  {state.skills?.map((skill, index) =>
                    skill.visible ? (
                      <div key={index}>
                        <SkillCard skill={skill} />
                      </div>
                    ) : (
                      <React.Fragment key={index}></React.Fragment>
                    )
                  )}
                </div>
              </Card.Content>
            </Card>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
};

export default EmployeePage;