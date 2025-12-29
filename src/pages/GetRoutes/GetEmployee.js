import React, { Component } from "react";
import { Card, Grid } from "semantic-ui-react";
import Employee from "../../abis/Employee.json";
import LineChart from "../../components/LineChart";
import SkillCard from "../../components/SkillCard";
import "./Employee.css";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import LoadComp from "../../components/LoadComp";
import CodeforcesGraph from "../../components/CodeforcesGraph";
import { toStringSafe, toNumberSafe } from "../../utils/numerics";

export default class GetEmployee extends Component {
  state = {
    employeedata: {},
    overallEndorsement: [],
    skills: [],
    certifications: [],
    workExps: [],
    educations: [],
    colour: ["#b6e498", "#61dafb", "#764abc", "#83cd29", "#00d1b2"],
    readmore: false,
    loadcomp: false,
  };

  componentDidMount = async () => {
    this.setState({ loadcomp: true });
    try {
      const employee_address = this.props?.match?.params?.employee_address;
      const web3 = window.web3;
      if (!web3) return;

      const EmployeeContract = new web3.eth.Contract(
        Employee.abi,
        employee_address
      );

      // Execute all fetches
      await Promise.all([
        this.getSkills(EmployeeContract),
        this.getCertifications(EmployeeContract),
        this.getWorkExp(EmployeeContract),
        this.getEducation(EmployeeContract)
      ]);

      const employeedata = await EmployeeContract.methods
        .getEmployeeInfo()
        .call();

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

      this.setState({
        employeedata: newEmployedata,
        overallEndorsement,
        loadcomp: false,
      });
    } catch (error) {
      console.error("Error in componentDidMount:", error);
      this.setState({ loadcomp: false });
    }
  };

  getSkills = async (EmployeeContract) => {
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

      this.setState({ skills: newskills });
    } catch (error) {
      console.error("Error fetching skills:", error);
    }
  };

  getCertifications = async (EmployeeContract) => {
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

      this.setState({ certifications: newcertifications });
    } catch (error) {
      console.error("Error fetching certifications:", error);
    }
  };

  getWorkExp = async (EmployeeContract) => {
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

      this.setState({ workExps: newworkExps });
    } catch (error) {
      console.error("Error fetching work experience:", error);
    }
  };

  getEducation = async (EmployeeContract) => {
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

      this.setState({ educations: neweducation });
    } catch (error) {
      console.error("Error fetching education:", error);
    }
  };

  render() {
    return this.state.loadcomp ? (
      <LoadComp />
    ) : (
      <div>
        <Grid>
          <Grid.Row>
            <Grid.Column width={6}>
              <Card className="personal-info">
                <Card.Content>
                  <Card.Header>
                    {this.state.employeedata?.name}
                    <small
                      style={{ wordBreak: "break-word", color: "#c5c6c7" }}
                    >
                      {this.state.employeedata?.ethAddress}
                    </small>
                  </Card.Header>
                  <br />
                  <div>
                    <p>
                      <em>Location: </em>
                      <span style={{ color: "#c5c6c7" }}>
                        {this.state.employeedata?.location}
                      </span>
                    </p>
                  </div>
                  <br />
                  <div>
                    <p>
                      <em>Overall Endorsement Rating:</em>
                    </p>
                    <LineChart
                      overallEndorsement={this.state.overallEndorsement || []}
                    />
                  </div>
                </Card.Content>
              </Card>
              <Card className="employee-des">
                <Card.Content>
                  <Card.Header>About:</Card.Header>
                  <div>
                    <p style={{ color: "#c5c6c7" }}>
                      {this.state.employeedata?.description}
                    </p>
                  </div>
                  <br />
                  <div>
                    <Card.Header
                      style={{ fontSize: "19px", fontWeight: "600" }}
                    >
                      Education:
                    </Card.Header>
                    <br />
                    <div className="education">
                      {this.state.educations?.map((education, index) => (
                        <div className="education-design" key={index}>
                          <div
                            style={{ paddingRight: "50px", color: "#c5c6c7" }}
                          >
                            <p>{education.description}</p>
                            <small
                              style={{
                                wordBreak: "break-word",
                                fontSize: "10px",
                              }}
                            >
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
                                color: education.endorsed
                                  ? "#00d1b2"
                                  : "yellow",
                                opacity: "0.7",
                              }}
                            >
                              {education.endorsed
                                ? "Endorsed"
                                : "Not Yet Endorsed"}
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
                    {this.state.certifications?.map(
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
                                {certi.endorsed
                                  ? "Endorsed"
                                  : "Not Yet Endorsed"}
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
                                    pathColor: `rgba(255,255,255, ${toNumberSafe(certi.score) / 100
                                      })`,
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
                    {this.state.workExps?.map(
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
                                  color: workExp.endorsed
                                    ? "#00d1b2"
                                    : "yellow",
                                  opacity: "0.7",
                                }}
                              >
                                {workExp.endorsed
                                  ? "Endorsed"
                                  : "Not Yet Endorsed"}
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
                    {this.state.skills?.map((skill, index) =>
                      skill.visible ? (
                        <div key={index}>
                          <SkillCard skill={skill} />
                        </div>
                      ) : (
                        <></>
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
  }
}