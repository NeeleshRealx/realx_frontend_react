import React, { useState, useEffect, useRef } from "react";
import Select from 'react-select';
import { useParams } from "react-router-dom";
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  CardHeader,
  Collapse,
  Button,
  Input,
  TabPane,
  Label,
  TabContent,
  Nav,
  NavLink,
  NavItem,
} from "reactstrap";
import classnames from "classnames";
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";
import { toast, ToastContainer } from "react-toastify";
import DeleteModal from "../../Components/Common/DeleteModal";
import "react-toastify/dist/ReactToastify.css";
import Flatpickr from "react-flatpickr";
import { get_cookie } from "../../helpers/get_cookie";
import axios from "axios";
import CustomOpportunityModal from "../../Components/Common/CustomOpportunityModal";
import { Link } from "react-router-dom";
import { Activities } from "./OpportunityTabPages/Activities";
import { Removals } from "./OpportunityTabPages/Removals";
import { Inventory } from "./OpportunityTabPages/Inventory";
// dateformat
import moment from 'moment';
import { format } from 'date-fns';
import { Storage } from "./OpportunityTabPages/Storage";
import { Estimate } from "./OpportunityTabPages/Estimate";
import Loader from "../../Components/Common/Loader";

const OpportunityDetails = () => {
  const [componentToShow, setComponentToShow] = useState(null);
  const [customActiveTab, setcustomActiveTab] = useState(window.location.hash.slice(1) ? window.location.hash.slice(1) : "Activity");
  const [companieslist, setCompaniesList] = useState([]);
  const [jobdetails, setJobDetails] = useState(null);
  const [date, setDate] = useState(null);
  const [selectedElement, setSelectedElement] = useState(null);
  const [selectedValue, setSelectedValue] = useState(null);
  const [formVisible, setFormVisible] = useState(false);
  const [contactname, setContactName] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [contacttype, setContactType] = useState();
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [contact, setContactId] = useState(null);
  const [expandedoppId, setExpandedoppId] = useState(null);
  const [Taskuser, setTaskUser] = useState("");
  const [status, setStatus] = useState("");
  // const [deleteopportunity, handleOpportunity] = useState("");
  const [tags, setTags] = useState([]);
  const [statuses, setStatuses] = useState("");
  const [contacts, setContacts] = useState("");
  const [leadinfo, setLeadInfo] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [expandedContactId, setExpandedContactId] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteModaltask, setDeleteModalTask] = useState(false);
  const [deleteModalOpp, setDeleteModalOpp] = useState(false);
  const [contacttitle, setContactTitle] = useState("");
  const [crmleadtype, setCrmLeadType] = useState("");
  const [leadTypes, setLeadTypes] = useState([]);
  const [addTask, setAddTask] = useState(false);
  const [contactdetail, setContactDetail] = useState([]);
  const [addcontact, setContact] = useState(false);
  const [estjobdate, setEstJobdate] = useState(null);
  const [showeditTask, seteditTask] = useState(false);
  const [description, setDescription] = useState("");
  const [companyname, setCompanyName] = useState("");
  const [users, setUsers] = useState("");
  const [time, setTime] = useState();
  const [crmlead, setleadtypecrm] = useState();
  const [optype, setOpType] = useState();
  const [customername, setCustomername] = useState();
  const [jobIdVal, setjobIdVal] = useState("");
  const [isAddEnabled, setIsAddEnabled] = useState(false);
  const [opportunityModal, setOpportunityModal] = useState(false);
  const [org_date, setOrg_Date] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isNavLinkLoading, setIsNavlinkLoading] = useState(true);

  

    useEffect(() => {
      console.log("tesat")
      let keysToRemove = ["act_attname", "act_notes", "act_ppl_people", "act_sms", "act_smstemp", "act_subject", "act_tempid", "act_smsto", "act_toemail", "act_fromemail", "act_emailcc", "act_emailbcc"];
      keysToRemove.map(key => {
        localStorage.removeItem(key);
      });
    }, []);


  const [newContact, setNewContact] = useState([]);

  // const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const handleClick = (component) => {
    setComponentToShow(component);
    if (customActiveTab !== component) {
      setcustomActiveTab(component);
    }
  };
  const [taskdata, settaskData] = useState();
  const handleDeleteTask = (data) => {
    settaskData(data);
    setDeleteModalTask(true);
  }
  const DeleteTask = () => {
    var postData = {
      lead_id: taskdata.lead_id,
      task_id: taskdata.id,
    };
    axios.post("/api/crm-leads/ajaxDestroyTask", postData).then((response) => {
      setDeleteModalTask(false)
      getJobDetails(response);
      toast.success(response.message, { theme: "light" });

    });
  };

  ////

  const crmleadid = jobdetails?.crmlead?.id;
  const crmleadstatus = jobdetails?.crmlead?.lead_status;

  ///
  const params = useParams();
  const lead_id = params.id;
  const job_id = params.job_id;

  // useEffect(() => {
  //   // Add the following code to trigger a page reload when the component mounts
  //   window.location.reload();
  // }, []);

  const [currentUserId,setCurrentUserId]=useState("")
  const [userOpt,setUserOpt]=useState([])
  const [defltUserOption,setDefltUserOption]=useState([])
  const [selectedUserTask,setSelectedUserTask]=useState([])

  useEffect(()=>{
    let userDetailId=""
    axios.get('/api/profile-settings/data')
    .then(response => {
        console.log(response)
        setCurrentUserId(response.userdetail.id)
        userDetailId=response.userdetail.id
      axios
      .get("/api/listdata")
      .then((response) => {
        setUsers(response.users);
        const forUserMap = response.users.map((user) => ({ value: user.id, label: user.name }))
        const defltUserOption1=forUserMap.filter(option =>{
          if(option.value===userDetailId){ 
            return true
          }
        })
        setDefltUserOption(defltUserOption1)
        console.log(defltUserOption1,"defltUserOption")
        setUserOpt(forUserMap)
        setSelectedUserTask(defltUserOption1[0])
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
    })
    .catch(error => {
        console.log(error);
    })
  },[])

  useEffect(() => { 
    axios
      .get("/api/listdata")
      .then((response) => {
        setLeadTypes(response.lead_type);
        setUsers(response.users);
        // const forUserMap = response.users.map((user) => ({ value: user.id, label: user.name }))
        // const defltUserOption=forUserMap.filter(option =>{
        //   if(option.value===currentUserId){ 
        //     return true
        //   }
        // })
        // console.log(currentUserId,"currentUserId")
        // console.log(defltUserOption,"defltUserOption")
        // setUserOpt(forUserMap)
        // setSelectedUser(defltUserOption)
        setStatus(response.status);
        setCompaniesList(response.companies_list);
        setContacts(response.contacts);
        setOrg_Date(response.organisation_settings);
        // console.log(response.organisation_settings?.date_format_js,"1111111111111111");
        setDate(moment().format(response.organisation_settings?.date_format_js));
        // Other state updates can be done here
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        setIsLoading(false);
    });


    getJobDetails();
  }, [lead_id,job_id]);

  // useEffect(() => {
  //   setcustomActiveTab(window.location.hash.slice(1) ? window.location.hash.slice(1): "Activity")
  //   setComponentToShow(window.location.hash.slice(1) ? window.location.hash.slice(1): "Activity");

  // }, [jobdetails])

  const getJobDetails = () => {
    axios
      .get(`/api/view-opportunity/${lead_id}/${job_id}`)
      .then((response) => {
        response?.contact.map(contact => {
          contact.contact_detail_data.push({ "detail_type": response.contact_types[0].list_option })
        })
        setJobDetails(response);
        setContacts(response.contact);
        setContactId(response.contact[0].id);
        setCustomername(response.crmlead.name);
        setCrmLeadType(response.crmlead.lead_type);
        setleadtypecrm(response.crmlead);
        setSelectedValue(response.crmlead.lead_status === "" ? "Potential" : response.crmlead.lead_status)
        setOpType(response?.op_type?.length > 0 ? response?.op_type[0].options : "")
        let parsedTags = [];
        setjobIdVal(response.job.job_id);
        if (response.tags.length > 0) {
          parsedTags = JSON.parse(response.tags[0].tag.replace(/'/g, ''));
        }
        else {
          parsedTags = []
        }
        newContact.push({ "contacttype": response.contact_types[0].list_option })
        setTags(parsedTags);
        setcustomActiveTab(window.location.hash.slice(1) ? window.location.hash.slice(1) : "Activity")
        setComponentToShow(window.location.hash.slice(1) ? window.location.hash.slice(1) : "Activity");
        setIsLoading(true);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        setIsNavlinkLoading(false)
        setIsLoading(false);
      })
  };

  const UpdateTask = (data) => {
    // event.preventDefault();
    var date_format_task = moment(data.task_date).format(org_date.date_format_js);
    let formData = {
      lead_id: data.lead_id,
      task_id: data.id,
      description: data.description,
      task_date: date_format_task,
      task_time: data.task_time,
      user_assigned_id: data.user_assigned_id,
      selected_date_format: org_date.date_format
    };


    axios.post("/api/crm-leads/ajaxUpdateTask", formData).then((response) => {

      getJobDetails(response);
      handleTaskEdit();
      toast.success("Task updated successfully", { theme: "light" });
    });
  };

  const renderComponent = () => {
    switch (componentToShow) {
      case "Activity":
        return <Activities data={jobdetails} onChangeData={() => { getJobDetails(); }} />;
      case "Removals":
        return <Removals data={jobdetails} onChangeData={() => {
          getJobDetails();
        }} />;
      case "Inventory":
        return (
          <Inventory
            data={jobdetails}
            onChangeData={() => {
              getJobDetails();
            }}
          />
        );
      case "Storage":
        return (
          <Storage postdatas={jobdetails}
            onChangeData={() => {
              getJobDetails();
            }} />
        );
      case "Estimate":
        return (
          <Estimate
            data={jobdetails}
            onChangeData={() => {
              getJobDetails();
            }}
          />
        );
      default:
        return <Activities data={jobdetails} onChangeData={() => { getJobDetails(); }} />;
    }
  };
  const [addTag, setaddTag] = useState(false);
  const [addopp, setAddOpp] = useState(false);

  const t_addTag = () => {
    setaddTag(!addTag);
    setIsAddEnabled(!isAddEnabled)
  };

  const t_addtask = () => {
    setAddTask(!addTask);
  };

  const add_opp = () => {
    setAddOpp(!addopp);

  };
  // const [addTask, setAddTask] = useState(false);

  const col_addTask = () => {
    setAddTask(!addTask);
    // setDate(moment(new Date()).format("DD/MM/YYYY"))
    setTime(moment(new Date()).format("HH:mm:ss"))

    resetTaskFields();
  };

  const add_contact = () => {
    setContactType(jobdetails?.contact_types > 0 ? jobdetails?.contact_types[0].list_option : "");

    setContact(!addcontact);
  };



  const Updateopportunity = (data) => {
    // event.preventDefault();
    let formData = {
      lead_id: data.lead_id,
      opp_id: data.id,
      company_id: data.company_id,
      op_type: data.op_type,
      op_status: data.op_status,
      est_job_date: data.est_job_date,
      job_start_time: data.job_start_time,
      contact_id: data.contact_id,
      user_id: data.user_id===0?currentUserId:data.user_id,
      lead_info: data.lead_info,
      notes: data.notes,
    };

    console.log(data,"dataUser")
    axios.post("/api/crm-leads/ajaxUpdateOpportunity", formData).then((res) => {
      getJobDetails(res);
      handleoppEdit();
      toast.success("Task updated successfully", { theme: "light" });
    });
  };

  const [deletedata, setDeleteData] = useState('');

  const handleContactDelete = (data) => {
    setDeleteData(data);
    setDeleteModal(true);

    //seteditTask(!showeditTask);
  };
  const deletecontact = () => {
    var postData = {
      lead_id: deletedata.lead_id,
      contact_id: deletedata.id,
    };

    axios
      .post("/api/crm-leads/ajaxDestroyContact", postData)
      .then((response) => {
        // dispatch(getJobDetails(job_id));
        getJobDetails(response);
        toast.success(response.message, { theme: "light" });
        setDeleteModal(false);


      });
  }
  const [oppdata, setOppData] = useState();
  const handleDestroyOpportunity = (data) => {
    setOppData(data);
    setDeleteModalOpp(true);
  }
  const DeleteOpp = () => {
    var postData = {
      lead_id: oppdata.lead_id,
      opp_id: oppdata.crm_opportunity_id,
    };
    axios
      .post("/api/crm-leads/ajaxDestroyOpportunity", postData)
      .then((response) => {
        setDeleteModalOpp(false)
        getJobDetails(response);
        toast.success(response.message, { theme: "light" });
        window.location.href = '/opportunities';
      });

  };

  const Update_Contact = (data) => {
    var contact_detail = [];
    var contact_type = [];
    data?.contact_detail_data?.map((response) => {
      contact_detail.push(response.detail);
      contact_type.push(response.detail_type);
    });
    if (contactdetail != "") {
      contact_detail.push(contactdetail);
    }
    if (contacttype != "") {
      contact_type.push(contacttype);
    }

    var data = {
      name: data.name,
      description: data.description,
      contact_detail: contact_detail,
      contact_detail_type: contact_type,
      lead_id: data.lead_id,
      contact_id: data.id,
    };
    if (data.name == "") {
      toast.error("Contact name must be entered", { theme: "light" });
      return false;
    } else if (data.description == "") {
      toast.error("Contact title must be entered", { theme: "light" });
      return false;
    }
    axios.post("/api/crm-leads/ajaxUpdateContact", data).then((response) => {
      getJobDetails(response);
      resetContactFields();
      handleContactEdit(data.id);
      toast.success(response.message, { theme: "light" });

    })



  };
  const [res, setRes] = useState({ company_id: "" });

  const [selectedTime, setSelectedTime] = useState("");

  const handleContactEdit = (taskId) => {
    setExpandedContactId(taskId);
  };

  const handleForm1Submit = (event) => {
    event.preventDefault();
    let formData = {
      // selected_date_format: "d/m/Y",
      lead_id: jobdetails?.job?.customer_id,
      description: description,
      task_date: date,
      task_time: time,
      user_assigned_id: selectedUserTask.value,
      selected_date_format: org_date.date_format
    };

    const user = JSON.parse(get_cookie("authUser"));

    if (formData.description === "" || formData.description === undefined) {
      toast.error("Enter the Task Description", { theme: "light" });
    }
    else {
      axios.post("/api/crm-leads/ajaxStoreTask", formData).then((res) => {

        // Set loading to false when the submission is complete
        setIsLoading(false);

        getJobDetails(res.data);
        // setJobDetails(res);
        t_addtask();
        toast.success("Task has been added!")
        resetTaskFields();
      });
    }
  };
  const resetTaskFields = () => {
    setDescription("");
    setSelectedUser(users[0].id);
    setSelectedUserTask(defltUserOption[0])
    setTime(moment(new Date()).format("HH:mm:ss"));
  }
  const resetOppFields = () => {
    setCompanyName(companieslist[0].id);
    setStatuses(status[0].pipeline_status);
    setEstJobdate(moment(new Date()).format("DD/MM/YYYY"));
    setSelectedUser(users[0].id);
    setSelectedUserTask(defltUserOption[0])
    setLeadInfo(leadTypes[0].options);
    setDescription("")
  }
  const resetContactFields = () => {
    setContactDetail("");
    setContactType(jobdetails?.contact_types[0].list_option);
    setContactTitle("");
    setContactName("");
  }
  const handleTaskEdit = (taskId) => {
    setExpandedTaskId(taskId);
  };

  const handleForm2Submit = (event) => {
    event.preventDefault();

    let formData = {
      lead_id: jobdetails.job.customer_id,
      company_id: companyname,
      op_type: optype,
      op_status: statuses,
      est_job_date: estjobdate,
      job_start_time: time,
      contact_id: contact,
      user_id: selectedUser,
      lead_info: leadinfo,
      notes: description,
    };
    axios.post("/api/crm-leads/ajaxStoreOpportunity", formData)
      .then((res) => {
        getJobDetails(res);
        handleoppEdit();
        add_opp();
        toast.success("Opportunity has been added!")
        resetOppFields();
      })

  };


  const Add_newContact = () => {
    let contactDetail = [];
    let contactType = [];
    newContact.map(item => {
      contactDetail.push(item.contactdetail);
      contactType.push(item.contacttype)
    })
    if (contactdetail != "") {
      contactDetail.push(contactdetail);
    }
    if (contacttype != "") {
      contactType.push(contacttype);
    }
    var data = {
      name: contactname,
      description: contacttitle,
      contact_detail: contactDetail,
      contact_detail_type: contactType,
      lead_id: jobdetails.job.customer_id,
    };

    if (contactname == "") {
      toast.error('Enter Contact Name', { theme: "light" });
      return false;
    }

    else if (contacttitle == "") {
      toast.error('Enter Contact Title', { theme: "light" });
      return false;
    }

    else if (data.contact_detail == "") {
      toast.error("Contact detail must be entered", { theme: "light" });
      return false;
    }
    axios.post("/api/crm-leads/ajaxStoreContact", data).then((response) => {
      // dispatch(getJobDetails(job_id));
      getJobDetails(response);
      handleTaskEdit();
      add_contact();
      resetContactFields();
      toast.success(response.message, { theme: "light" });
      setContactTitle("");
      setContactName("");
      setNewContact([{ "contacttype": jobdetails.contact_types[0].list_option, "contactdetail": "" }])

    });

  };

  const removeTag = (index) => {
    const updatedTags = [...tags];
    updatedTags.splice(index, 1);
    setTags(updatedTags);
  };

  const save_tags = () => {
    // if (tags == "") {
    //   toast.error("Tags cannot be empty", { theme: "light" });
    //   return false;
    // }
    var data = {
      // id: job_id,
      id: jobIdVal,
      items: tags,
    };
    axios.post("/api/ajaxSaveTag", data).then((res) => {
      getJobDetails(res);
      t_addTag();
      toast.success("Tags saved successfully", { theme: "light" });
    });
  };

  const toggleForm = () => {
    setFormVisible(!formVisible);
  };

  const updateStatus = (crmleadid, crmleadstatus) => {
    let formData = {
      id: crmleadid,
      cname: customername,
      ctype: crmleadtype,
      cstatus: selectedValue,
    };
    axios.post("/api/updateStatus", formData).then((res) => {
      toggleForm();
      toast.success(res.message, { theme: "light" });
      getJobDetails();

    });
  };

  const handlesClick = (item) => {
    const value = item.lead_status;
    setSelectedValue(value);
  };

  const customer = jobdetails?.crmlead?.name;
  const handleKeyDown = (event) => {
    if (event.key === "Enter" && inputValue.trim() !== "") {
      event.preventDefault();
      setTags([...tags, inputValue.trim()]);
      setInputValue("");
    }
  };
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };
  const handleoppEdit = (OppId) => {
    setExpandedoppId(OppId);

  };
  const handleAddOpp = () => {
    setOpportunityModal(true)
    resetOppFields();

  }

  //Active user in tasks and opportunity

  const handleChange = (selectedOption) => {
    console.log(selectedOption,'selectedOption')
    setSelectedUserTask(selectedOption);
  };

  const [userDefltOption,setUserDefltOption]=useState(true)

  
  console.log(currentUserId,"currentUserId")

  return (
    <div className="page-content">
      <DeleteModal
        show={deleteModal}
        orderId={selectedOrderId}
        onDeleteClick={deletecontact}
        onCloseClick={() => setDeleteModal(false)}
      />
      <DeleteModal
        show={deleteModaltask}
        onDeleteClick={DeleteTask}
        onCloseClick={() => setDeleteModalTask(false)}
      />
      <DeleteModal
        show={deleteModalOpp}
        onDeleteClick={DeleteOpp}
        onCloseClick={() => setDeleteModalOpp(false)}
      />
      <CustomOpportunityModal
        show={opportunityModal}
        onDeleteClick={() => {
          add_opp();
          setOpportunityModal(false)
        }}
        onCloseClick={() => setOpportunityModal(false)}
      />
      <Container fluid>
        <Row>
          <Col xl={3}>
            <Card className="mb-2">
              <CardHeader>
                <div style={{ position: "absolute", right: 0, top: 0 }}>
                  <img
                    id="imgplus"
                    className="ri-pencil-fill align-bottom me-2 text-muted"
                    style={{ margin: "15px 0px 0px 0px", cursor: "pointer" }}
                    alt=""
                    onMouseOver={(e) => (e.target.style.cursor = "pointer")}
                    onClick={toggleForm}
                    src="{{asset('img/icons/edit_pencil_icon (1).png')}}"
                  />
                  {/* ...rest of your code... */}
                </div>

                <div className="cnameal" style={{ fontSize: '24px', textAlign: 'center' }}>
                  <h5 className="font-weight-semibold mb-1 view_blade_1_person_name">
                    <Link to={"/customerdetails/" + jobdetails?.crmlead?.id} className="fw-medium link-primary"> {customername}</Link>

                    {/* {customername} */}
                  </h5>
                </div>
                <div className="cnameafl" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div className="mt-2 mb-2" style={{ fontSize: "16px" }}>
                    <h5 className="font-weight-semibold mb-1  view_blade_1_person_name">
                      {crmleadtype}
                    </h5>
                  </div>
                  <div style={{ fontSize: "16px" }} className="mt-2 mb-2">
                    {jobdetails?.crmleadstatuses?.map((st) => {
                      if (st.lead_status === crmlead?.lead_status) {
                        return (
                          <div
                            className="badge"
                            style={{
                              color: "#000",
                              backgroundColor: st.status_colour,
                              cursor: "pointer",
                            }}
                            key={st.id} // Use a unique identifier from crmleadstatuses
                          >
                            {st.lead_status}
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              </CardHeader>
              {formVisible && (
                <CardBody>

                  <div>
                    <div className="form-group">
                      <label htmlFor="email" className="mb-1">Customer Name</label>
                      <input
                        type="text"
                        style={{ color: "black", fontSize: "inherit" }}
                        className="form-control"
                        id="custname"
                        value={customername}
                        onChange={(e) => setCustomername(e.target.value)}
                        name="email"
                      />
                    </div>

                    <div className="mb-3 mt-3">
                      <label htmlFor="userSelect" className="form-label mb-1">
                        Customer Type
                      </label>
                      <select
                        style={{ color: "black", fontSize: "inherit" }}
                        className="form-select"
                        id="custtype"
                        name="sellist1"
                        value={crmleadtype}
                        onChange={(e) => setCrmLeadType(e.target.value)}
                      >
                        <option
                          value="Residential"
                          selected={crmleadtype === "Residential"}
                        >
                          Residential
                        </option>
                        <option
                          value="Commercial"
                          selected={crmleadtype === "Commercial"}
                        >
                          Commercial
                        </option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="pwd">Customer Status</label>
                      <div
                        className="dropdown-menu"
                        style={{
                          display: "block",
                          position: "static",
                          width: "100%",
                          marginTop: 0,
                          float: "none",
                          zIndex: "auto",
                          padding: "10px", // Add padding for spacing
                        }}
                      >
                        {jobdetails?.crmleadstatuses?.map((item) => (
                          <div
                            className={`badgex ${item.lead_status === selectedValue ? "selected" : ""
                              }`}
                            style={{
                              color: "#000",
                              backgroundColor: item.status_colour,
                              cursor: "pointer",
                              border: item.lead_status === selectedValue ? "2px solid black" : "none",
                              padding: "5px", // Add padding for spacing
                              marginBottom: "5px", // Add margin bottom for spacing between items
                            }}
                            key={item.lead_status}
                            onClick={() => handlesClick(item)}
                          >
                            {item.lead_status}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 hstack gap-3" >
                      <Button
                        type="reset"
                        className="btn btn-light "
                        onClick={toggleForm}
                      >
                        Cancel
                      </Button>
                      <Button
                        id=""
                        type="button"
                        className="btn btn-info"
                        onClick={() => updateStatus(crmleadid, crmleadstatus)}
                      >
                        Update
                      </Button>
                    </div>

                  </div>

                </CardBody>
              )}
            </Card>
            <Card className="mb-2" >

              <CardBody>
                <div className="header-elements-inline" style={{ padding: "10px" }} >
                  <div className="d-flex align-items-center">
                    <h5 className="card-title flex-grow-1 mb-0">
                      <i className="ri-map-pin-line align-middle me-1 text-muted"></i>
                      TASKS {jobdetails?.tasks?.length}
                    </h5>
                    <h3 className="mt-1"> <i className="bx bx-plus " style={{ marginLeft: 'auto', cursor: "pointer" }} onClick={col_addTask}>
                    </i>
                    </h3>
                  </div>
                </div>
                <Collapse isOpen={addTask} id="collapseWithicon">
                  <div className="mb-2 mt-2 contact-sec-bottom">
                    <Label>Task Description</Label>
                    <Input
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="form-control"
                    >
                    </Input>
                    <Col >
                      <div>
                        <label htmlFor="dateInput" className="form-label mt-2">
                          Date
                        </label>
                        <div className="input-group">
                          <span className="input-group-text ">
                            <i className="bx bx-calendar"></i>
                          </span>
                          {/* <Flatpickr
                            id="dateInput"
                            className="form-control"
                            value={date}
                            onChange={(date) =>
                              setDate(moment(date[0]).format("DD/MM/YYYY"))
                            }
                            options={{
                              dateFormat: "d/m/Y",
                              enableTime: false,
                            }}
                          /> */}
                          <Flatpickr
                            className="form-control"
                            options={{
                              dateFormat: org_date.date_format,
                              // defaultDate: moment().format('YYYY-MM-DD'),
                            }}
                            // ref={flatpickrtaskdate}
                            value={date}
                            onChange={(selectedDates) => {
                              console.log(selectedDates[0])
                              if (selectedDates && selectedDates.length > 0) {
                                setDate(moment(selectedDates[0]).format(org_date.date_format_js));
                              }
                            }} />
                        </div>
                      </div>
                    </Col>


                    <div>
                      <label htmlFor="timeInput" className="form-label mt-2">
                        Time
                      </label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="bx bx-alarm"></i>
                        </span>
                        <Flatpickr
                          id="timeInput"
                          className="form-control"
                          options={{
                            enableTime: true,
                            noCalendar: true,
                            dateFormat: "H:i:S",
                            time_24hr: true,
                            altInput: true,
                            altFormat: "H:i:S",
                            altInputClass: "form-control",
                          }}
                          value={time || moment(new Date()).format("HH:mm:ss")}
                          onChange={(time) => {
                            const formattedTime = moment(time[0]).format(
                              "HH:mm:ss"
                            );
                            setTime(formattedTime);
                          }}
                        />
                      </div>
                    </div>
                    <Col >
                      <div className="mt-2">
                        <label htmlFor="userSelect" className="form-label">
                          Assign User
                        </label>
                        <Select
                        options={userOpt}
                        value={selectedUserTask}
                        onChange={handleChange}
                        placeholder="Select a user"
                        />
                        {/* <select
                          id="userSelect"
                          className="form-select mb-3"
                          value={userDefltOption?currentUserId:selectedUser}
                          onChange={(e) =>{ setUserDefltOption(false);setSelectedUser(e.target.value)}}
                        >
                          {users.length > 0 ? (
                            users.map((user) => (
                              <option key={user.id} value={user.id}>
                                {user.name}
                              </option>
                            ))
                          ) : (
                            <option value="">No users found</option>
                          )}
                        </select> */}
                      </div>
                    </Col>
                    <div className="hstack gap-2 mt-2 mb-2">
                      <Button className="btn btn-light" onClick={col_addTask}>
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="btn btn-brown"
                        onClick={handleForm1Submit}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                </Collapse>

                {jobdetails?.tasks?.map((response) => (
                  <div className="header-elements-inline" key={response.id}>
                    <div className="d-flex align-items-center justify-content-between"></div>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex m-2">
                        <button className="btn btn-light btn-icon btn-md txt-dark me-3">
                          FM
                        </button>
                        <span className="fs-15 fw-medium">
                          {response.description}

                          <small className="d-block text-muted fs-12">
                            {moment(response.task_date).format(org_date.date_format_js)}
                            {/* {response.task_date} */}
                          </small>
                        </span>
                      </div>

                      <UncontrolledDropdown className="dropdown d-inline-block" >
                        <DropdownToggle className="btn fs-18" tag="button">
                          <i className="ri-more-2-line"></i>
                        </DropdownToggle>
                        <DropdownMenu className="dropdown-menu-end">
                          <DropdownItem
                            className="edit-item-btn"
                            onClick={() => {
                              handleTaskEdit(response.id);
                            }}
                          >
                            <i className="ri-pencil-fill align-bottom me-2 text-muted"></i>
                            Edit
                          </DropdownItem>
                          <DropdownItem
                            className="remove-item-btn text-danger"
                            onClick={() => {
                              handleDeleteTask(response);
                            }}
                          >
                            <i className="ri-delete-bin-fill align-bottom me-2 text-danger"></i>
                            Delete
                          </DropdownItem>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </div>
                    <div>
                      {expandedTaskId === response.id && (
                        <div className="collapse-section">
                          Task Description
                          <div className="pd-field">
                            <Input
                              className="form-control"
                              type="text"
                              value={response.description}
                              placeholder="Task Description"
                              onChange={(e) => {
                                const updatedTasks = [...jobdetails.tasks];
                                const taskIndex = updatedTasks.findIndex(
                                  (task) => task.id === response.id
                                );
                                updatedTasks[taskIndex].description =
                                  e.target.value;
                                setJobDetails({
                                  ...jobdetails,
                                  tasks: updatedTasks,
                                });
                              }}
                            />
                          </div>
                          Date
                          <div className="pd-field">
                            {/* <Flatpickr
                              className="form-control"
                              options={{
                                dateFormat: "Y-m-d",
                                defaultDate: [response.task_date],
                              }}
                              value={response.task_date}
                              onChange={(selectedDates) => {
                                if (selectedDates && selectedDates.length > 0) {
                                  response.task_date = moment(
                                    selectedDates[0]
                                  ).format("YYYY-MM-DD");
                                }
                              }}
                            /> */}
                            <Flatpickr
                              className="form-control"
                              options={{
                                dateFormat: org_date.date_format,
                                defaultDate: moment(response.task_date).format(org_date.date_format_js)
                              }}
                              value={moment(response.task_date).format(org_date.date_format_js)}
                              onChange={(selectedDates) => {
                                if (selectedDates && selectedDates.length > 0) {
                                  response.task_date = moment(selectedDates[0]).format(org_date.date_format_js)
                                }
                              }} />
                          </div>
                          Time
                          <div className="pd-field">
                            <Flatpickr
                              className="form-control"
                              options={{
                                enableTime: true,
                                noCalendar: true,
                                dateFormat: "H:i",
                              }}
                              value={response.task_time}
                              onChange={(selectedDates) => {
                                if (selectedDates && selectedDates.length > 0) {
                                  response.task_time = moment(
                                    selectedDates[0]
                                  ).format("H:m:s");
                                }
                              }}
                            />
                          </div>
                          Assign User
                          <div>
                            <select
                              className="form-select"
                              value={response.user_assigned_id}
                              onChange={(e) => {
                                const updatedTasks = [...jobdetails.tasks];
                                const taskIndex = updatedTasks.findIndex(
                                  (task) => task.id === response.id
                                );
                                updatedTasks[taskIndex].user_assigned_id = e.target.value;
                                setJobDetails({
                                  ...jobdetails,
                                  tasks: updatedTasks,
                                });
                              }}

                            >
                              {jobdetails.users?.map((res) => (
                                <option key={res.id} value={res.id}>
                                  {res.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="hstack gap-2 mt-2">
                            <Button
                              className="btn btn-light"
                              onClick={() => {
                                handleTaskEdit();
                              }}
                            >
                              Cancel
                            </Button>
                            <Button
                              className="btn btn-info"
                              onClick={() => {
                                UpdateTask(response);
                              }}
                            >
                              Update
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </CardBody>
            </Card>
            <Card className="mb-2">
              <CardBody style={{ overflow: "auto" }}>

                <div className="header-elements-inline" style={{ padding: "10px" }}>
                  <div className="d-flex align-items-center">
                    <h5 className="card-title flex-grow-1 mb-0">
                      OPPORTUNITIES {jobdetails?.opportunities?.length}</h5>
                    <h3 className="mt-1"> <i className="bx bx-plus " style={{ marginLeft: 'auto', cursor: "pointer" }} onClick={handleAddOpp}>
                    </i>
                    </h3>
                  </div>
                </div>
                <Collapse isOpen={addopp} id="collapseWithicon">
                  <div className="mb-2 mt-3 contact-sec-bottom">
                    <Col lg={6}>
                      <div className="mb-3">
                        <Label htmlFor="company" className="form-label">
                          Company
                        </Label>
                        <select
                          value={companyname}
                          onChange={(e) => setCompanyName(e.target.value)}
                          className="form-select mb-3"
                        >
                          {companieslist && companieslist.length > 0 ? (
                            companieslist.map((company, index) => (
                              <option key={index} value={company.id}>
                                {company.company_name}
                              </option>
                            ))
                          ) : (
                            <option value="">No companies found</option>
                          )}
                        </select>
                      </div>
                    </Col>

                    <div className="mb-3">
                      <label htmlFor="Company" className="form-label">
                        Job Type
                      </label>
                      <select id="Companys" className="form-select mb-3"
                        value={optype}
                        onChange={(e) => setOpType(e.target.value)}>
                        {jobdetails?.op_type?.map((res) => (
                          <option key={res.id} value={res.options}>
                            {res.options}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <Label htmlFor="status" className="form-label">
                        Status
                      </Label>
                      <select
                        className="form-select mb-3"
                        value={statuses}
                        onChange={(e) => setStatuses(e.target.value)}
                      >
                        {status && status.length > 0 ? (
                          status.map((status, index) => (
                            <option key={index} value={status.pipeline_status}>
                              {status.pipeline_status}
                            </option>
                          ))
                        ) : (
                          <option value="">No status found</option>
                        )}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="dateInput" className="form-label">
                        Estimated Job Date
                      </label>
                      <Flatpickr
                        id="dateInput"
                        className="form-control"
                        value={estjobdate || moment(new Date()).format("DD/MM/YYYY")}
                        onChange={(date) =>
                          setEstJobdate(moment(date[0]).format("DD/MM/YYYY"))
                        }
                        options={{
                          dateFormat: "d/m/Y",
                          enableTime: false,
                        }}
                      />
                    </div>

                    <div>
                      <label htmlFor="timeInput" className="form-label">
                        Estimated Start Time
                      </label>
                      <Flatpickr
                        id="timeInput"
                        className="form-control"
                        options={{
                          enableTime: true,
                          noCalendar: true,
                          dateFormat: "H:i:S",
                          time_24hr: true,
                          altInput: true,
                          altFormat: "H:i:S",
                          altInputClass: "form-control",
                        }}
                        value={time || moment(new Date()).format("HH:mm:ss")}
                        onChange={(time) => {
                          const formattedTime = moment(time[0]).format(
                            "HH:mm:ss"
                          );
                          setTime(formattedTime);
                        }}
                      />
                    </div>

                    <div className="mb-3">
                      <Label htmlFor="contact" className="form-label">
                        Contact
                      </Label>
                      <select
                        className="form-select mb-3"
                        value={contact}
                        onChange={(e) => setContactId(e.target.value)}
                      >
                        {contacts && contacts.length > 0 ? (
                          contacts.map((contacts, index) => (
                            <option key={index} value={contacts.id}>
                              {contacts.name}
                            </option>
                          ))
                        ) : (
                          <option value="">No contacts found</option>
                        )}
                      </select>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="userSelect" className="form-label">
                        Select User
                      </label>
                      <select
                        id="userSelect"
                        className="form-select mb-3"
                        value={selectedUser}
                        onChange={(e) => setSelectedUser(e.target.value)}
                      >
                        {users.length > 0 ? (
                          users.map((user) => (
                            <option key={user.id} value={user.id}>
                              {user.name}
                            </option>
                          ))
                        ) : (
                          <option value="">No users found</option>
                        )}
                      </select>
                    </div>

                    <div className="mb-3">
                      <Label htmlFor="leadInfo" className="form-label">
                        Lead Info
                      </Label>
                      <select
                        value={leadinfo}
                        onChange={(e) => setLeadInfo(e.target.value)}
                        className="form-select mb-3"
                      >
                        {leadTypes.length > 0 ? (
                          leadTypes.map((leadType, index) => (
                            <option key={index} value={leadType.name}>
                              {leadType.options}
                            </option>
                          ))
                        ) : (
                          <option value="">No lead types found</option>
                        )}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="descriptionInput" className="form-label">
                        Notes
                      </label>
                      <textarea
                        id="descriptionInput"
                        className="form-control"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>

                    <div className="hstack gap-2 mt-2 mb-2">
                      <Button className="btn btn-light" onClick={add_opp}>
                        Cancel
                      </Button>
                      <Button
                        className="btn btn-info"
                        type="submit"
                        onClick={handleForm2Submit}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                </Collapse>{" "}
                {jobdetails?.opportunities?.map((res) => (
                  <div className="header-elements-inline" key={res.id}>
                    <div className={(job_id == res.id) ? " d-flex  justify-content-between current_opportunity" : " d-flex  justify-content-between"}>
                      <div className="d-flex align-items-center mt-2 mb-2">
                        {/* <button className="btn bg-dark btn-icon btn-md txt-white">FM</button> */}
                        <span className="fs-15 fw-medium">
                          {res.op_type} - {res.job_number}
                          <br />
                          {jobdetails?.opportunities
                            ?.filter(
                              (opportunity) =>
                                opportunity.job_number === res.job_number
                            )
                            .map((filteredOpportunity) => {
                              const company = companieslist.find(
                                (data) =>
                                  data.id === filteredOpportunity.company_id
                              );
                              return (
                                company && (
                                  <div key={company.id}>
                                    {company.company_name}
                                  </div>
                                )
                              );
                            })}

                          <small className="d-block text-muted fs-12">
                            {moment(res.est_job_date).format(org_date.date_format_js)}
                          </small>
                        </span>
                      </div>
                      <div className="m-2">
                        {res.op_status.toUpperCase()}

                      </div>
                      <UncontrolledDropdown className="dropdown d-inline-block">
                        <DropdownToggle className="btn fs-18" tag="button">
                          <i className="ri-more-2-line"></i>
                        </DropdownToggle>
                        <DropdownMenu className="dropdown-menu-end">
                          <DropdownItem
                            className="edit-item-btn"
                            onClick={() => {
                              handleoppEdit(res.id);
                            }}
                          >
                            <i className="ri-pencil-fill align-bottom me-2 text-muted"></i>
                            Edit
                          </DropdownItem>
                          <DropdownItem
                            className="remove-item-btn text-danger"
                            onClick={() => {
                              handleDestroyOpportunity(res);
                            }}
                          >
                            <i className="ri-delete-bin-fill align-bottom me-2 text-danger"></i>
                            Delete
                          </DropdownItem>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </div>
                    <div>
                      {expandedoppId === res.id && (
                        <div className="collapse-section">
                          Company
                          <div>
                            <select
                              className="form-select"
                              value={res.company_id}
                              onChange={(e) => {
                                const updatedTasks = [
                                  ...jobdetails.opportunities,
                                ];
                                const taskIndex = updatedTasks.findIndex(
                                  (task) => task.id === res.id
                                );
                                updatedTasks[taskIndex].company_id =
                                  e.target.value;
                                setJobDetails({
                                  ...jobdetails,
                                  opportunities: updatedTasks,
                                });
                              }}
                            >
                              {jobdetails?.companies_list?.map((res) => (
                                <option key={res.id} value={res.id}>
                                  {res.company_name}
                                </option>
                              ))}
                            </select>
                          </div>
                          Job Type
                          <div>
                            <select id="Companys" className="form-select mb-3"
                              value={res.op_type}
                              onChange={(e) => setOpType(e.target.value)}>
                              {jobdetails?.op_type?.map((res) => (
                                <option key={res.id} value={res.options}>
                                  {res.options}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label
                              htmlFor="statusSelect"
                              className="form-label"
                            >
                              Status
                            </label>
                            <select
                              id="statusSelect"
                              className="form-select mb-3"
                              value={res.op_status}
                              onChange={(e) => {

                                const updatedTasks = [
                                  ...jobdetails.opportunities,
                                ];
                                const taskIndex = updatedTasks.findIndex(
                                  (task) => task.id === res.id
                                );
                                updatedTasks[taskIndex].op_status =
                                  e.target.value;
                                setJobDetails({
                                  ...jobdetails,
                                  opportunities: updatedTasks,
                                });
                              }}
                            >
                              {jobdetails?.op_status?.map((res) => (
                                <option
                                  key={res.id}
                                  value={res.pipeline_status}
                                >
                                  {res.pipeline_status}
                                </option>
                              ))}
                            </select>
                          </div>
                          Estimated Job date
                          <div className="pd-field">
                            <Flatpickr
                              className="form-control"
                              options={{
                                dateFormat: "Y-m-d",
                                defaultDate: [res.est_job_date],
                              }}
                              value={res.est_job_date}
                              onChange={(selectedDates) => {
                                if (selectedDates && selectedDates.length > 0) {
                                  res.est_job_date = moment(
                                    selectedDates[0]
                                  ).format("YYYY-MM-DD");
                                }
                              }}
                            />
                          </div>
                          Estimated Start Time
                          <div className="pd-field">
                            <Flatpickr
                              className="form-control"
                              options={{
                                enableTime: true,
                                noCalendar: true,
                                dateFormat: "H:i",
                                defaultTime: [res.job_start_time],
                              }}
                              value={res.job_start_time}
                              onChange={(selectedDates) => {
                                if (selectedDates && selectedDates.length > 0) {
                                  res.job_start_time = moment(
                                    selectedDates[0]
                                  ).format("H:m:s");
                                }
                              }}
                            />
                          </div>
                          Users
                          <div>
                            <select
                              className="form-select"
                              value={res.user_id || currentUserId}
                              onChange={(e) => {
                                const updatedTasks = [
                                  ...jobdetails.opportunities,
                                ];
                                const taskIndex = updatedTasks.findIndex(
                                  (task) => task.id === res.id
                                );
                                updatedTasks[taskIndex].user_id =
                                  e.target.value;
                                setJobDetails({
                                  ...jobdetails,
                                  opportunities: updatedTasks,
                                });
                              }}
                            >
                              {jobdetails?.users?.map((val) => (
                                <option key={val.id} value={val.id}>
                                  {val.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          Contact
                          <div>
                            <select
                              className="form-select"
                              value={res.contact_id}
                              onChange={(e) => {
                                const updatedTasks = [
                                  ...jobdetails.opportunities,
                                ];
                                const taskIndex = updatedTasks.findIndex(
                                  (task) => task.id === res.id
                                );
                                updatedTasks[taskIndex].contact_id =
                                  e.target.value;

                                setJobDetails({
                                  ...jobdetails,
                                  opportunities: updatedTasks,
                                });
                              }}
                            >
                              {jobdetails?.contact?.map((res) => (
                                <option key={res.id} value={res.id}>
                                  {res.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          Lead info
                          <div>
                            <select
                              className="form-select"
                              value={res.lead_info}
                              onChange={(e) => {
                                const updatedTasks = [
                                  ...jobdetails.opportunities,
                                ];
                                const taskIndex = updatedTasks.findIndex(
                                  (task) => task.id === res.id
                                );
                                updatedTasks[taskIndex].lead_info =
                                  e.target.value;

                                setJobDetails({
                                  ...jobdetails,
                                  opportunities: updatedTasks,
                                });
                              }}
                            >
                              {leadTypes?.map((res) => (
                                <option key={res.id} value={res.options}>
                                  {res.options}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label htmlFor="notesInput" className="form-label">
                              Notes
                            </label>
                            <textarea
                              className="form-control"
                              id="notesInput"
                              style={{ overflow: "hidden" }}
                              value={res.notes}
                              onChange={(e) => {
                                const updatedTasks = [
                                  ...jobdetails.opportunities,
                                ];
                                const oppindex = updatedTasks.findIndex((opp) => opp.id == res.id);
                                updatedTasks[oppindex].notes = e.target.value;
                                setJobDetails({
                                  ...jobdetails,
                                  opportunities: updatedTasks,
                                });
                              }}
                            />
                          </div>
                          <div className="hstack gap-2 mt-2">
                            <Button
                              className="btn btn-light"
                              onClick={() => {
                                handleoppEdit();
                              }}
                            >
                              Cancel
                            </Button>
                            <Button
                              className="btn btn-info"
                              onClick={() => {
                                Updateopportunity(res);
                              }}
                            >
                              Update
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                <Button className="btn btn-success btn-sm mt-2" onClick={t_addTag}>
                  + Tag
                </Button>
                <div className="hstack gap-2">
                  {
                    isAddEnabled ? (
                      null
                    ) : (
                      tags.map((tag, index) => (
                        <p
                          className="badge mt-3 fs-6"
                          style={{
                            color: "#000",
                            backgroundColor: "#F9DADA",
                            cursor: "pointer",
                          }}
                          key={index}
                        // Use a unique identifier from crmleadstatuses
                        >
                          # {tag}
                        </p>
                      ))
                    )
                  }
                </div>
                <Collapse isOpen={addTag} id="collapseWithicon">
                  <div className="mb-0">
                    <div className="tags-section">
                      {tags.map((tag, index) => (
                        <span key={index} className="tags">
                          {tag}
                          <i
                            className="ri-close-fill"
                            onClick={() => removeTag(index)}
                          ></i>
                        </span>
                      ))}
                    </div>
                    <Input
                      className="form-control mt-2"
                      placeholder="Add Tags..."
                      value={inputValue}
                      onKeyDown={handleKeyDown}
                      onChange={handleInputChange}
                    />
                    <div className="hstack gap-2 mt-2">
                      <Button className="btn btn-light" onClick={t_addTag}>
                        Cancel
                      </Button>
                      <Button
                        className="btn btn-info"
                        onClick={() => {
                          save_tags();
                        }}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                </Collapse>
              </CardBody>
            </Card>
            <Card className="mb-2">
              <CardBody>
                <div className="header-elements-inline" style={{ padding: "10px" }}>

                  <div className="d-flex align-items-center">
                    <h5 className="card-title flex-grow-1 mb-0">
                      CONTACTS {jobdetails?.contact?.length}
                    </h5>
                    <h3 className="mt-1"> <i className="bx bx-plus " style={{ marginLeft: 'auto', cursor: "pointer" }} onClick={add_contact}>
                    </i></h3>

                  </div>
                </div>

                <Collapse isOpen={addcontact} id="collapseWithicon">
                  <div className="collapse-section ">
                    Name
                    <div className="pd-field">
                      <Input
                        className="form-control"
                        type="text"
                        value={contactname}
                        placeholder="Contact Name"
                        onChange={(e) => {
                          setContactName(e.target.value);
                        }}
                      />
                    </div>
                    Title
                    <div className="pd-field">
                      <Input
                        className="form-control"
                        type="text"
                        value={contacttitle}
                        placeholder="Contact Title"
                        onChange={(e) => {
                          setContactTitle(e.target.value);
                        }}
                      />
                    </div>
                    Contact Detail
                    {newContact?.map(function (data, index) {
                      return (
                        <div className="input-group mgb-10" key={index}>
                          <Input type="text" className="form-control contact_detail" placeholder="Phone, email or URL" value={data.contactdetail}
                            onChange={(e) => {
                              const updatedStorageDetails = [...newContact];
                              // const taskIndex = updatedStorageDetails.findIndex((contact, id) => id == index);
                              updatedStorageDetails[index].contactdetail = e.target.value;
                              if (newContact.length == index + 1) {
                                updatedStorageDetails.push({ "contacttype": jobdetails.contact_types[0].list_option, "contactdetail": "" })
                              }
                              setNewContact(updatedStorageDetails);

                            }} />
                          <div className="input-group-append">
                            <select className="form-control form-control-uniform" value={data.contacttype} onChange={(e) => {
                              const updatedStorageDetails = [...newContact];

                              updatedStorageDetails[index].contacttype = e.target.value;
                              setNewContact(updatedStorageDetails);
                            }}>
                              {jobdetails?.contact_types?.map((res) => (
                                <option key={res.list_option} value={res.list_option}>
                                  {res.list_option}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>)
                    })}
                    <div className="hstack gap-2 mt-2">
                      <Button
                        className="btn btn-light"
                        onClick={() => setContact(!addcontact)}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="btn btn-info"
                        onClick={() => {
                          Add_newContact();
                        }}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                </Collapse>

                {jobdetails?.contact?.map((response) => (
                  <>
                    <div className="header-elements-inline" key={response.id}>
                      <div className="d-flex align-items-center mt-2 justify-content-between">
                        <div className=" align-items-center mb-0 contact-sec-top">
                          <div className="">
                            <h6 className=" mb-1">{response.name}</h6>
                          </div>
                          <div className="">
                            <p className="mb-0 text-muted">
                              {response?.description?.substring(0, 25)}
                            </p>
                          </div>
                        </div>
                        <UncontrolledDropdown className="dropdown d-inline-block">
                          <DropdownToggle className="btn fs-18" tag="button">
                            <i className="ri-more-2-line"></i>
                          </DropdownToggle>
                          <DropdownMenu className="dropdown-menu-end">
                            <DropdownItem
                              className="edit-item-btn"
                              onClick={() => {
                                handleContactEdit(response.id);
                              }}
                            >
                              <i className="ri-pencil-fill align-bottom me-2 text-muted"></i>
                              Edit
                            </DropdownItem>
                            <DropdownItem
                              className="remove-item-btn text-danger"
                              onClick={() => {
                                handleContactDelete(response);
                              }}
                            >
                              <i className="ri-delete-bin-fill align-bottom me-2 text-danger"></i>
                              Delete
                            </DropdownItem>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </div>
                      {expandedContactId === response.id && (
                        <div className="collapse-section">
                          Name
                          <div className="pd-field">
                            <Input
                              className="form-control"
                              type="text"
                              value={response.name}
                              placeholder="Contact Name"
                              onChange={(e) => {
                                const updatedTasks = [...jobdetails.contact];
                                const taskIndex = updatedTasks.findIndex(
                                  (contact) => contact.id === response.id
                                );
                                updatedTasks[taskIndex].name = e.target.value;
                                setJobDetails({
                                  ...jobdetails,
                                  contact: updatedTasks,
                                });
                              }}
                            />
                          </div>
                          Title
                          <div className="pd-field">
                            <Input
                              className="form-control"
                              type="text"
                              value={response?.description}
                              placeholder="Contact Title"
                              onChange={(e) => {
                                const updatedTasks = [...jobdetails.contact];
                                const taskIndex = updatedTasks.findIndex(
                                  (contact) => contact.id === response.id
                                );
                                updatedTasks[taskIndex].description =
                                  e.target.value;
                                setJobDetails({
                                  ...jobdetails,
                                  contact: updatedTasks,
                                });
                              }}
                            />
                          </div>
                          Contact Detail
                          {response?.contact_detail_data.map(function (data, index) {
                            return (
                              <div className="input-group mgb-10" key={index}>
                                <Input type="text" className="form-control contact_detail" placeholder="Phone, email or URL" value={data.detail}
                                  onChange={(e) => {
                                    const updatedContactDetail = response.contact_detail_data.map((item, id) => {
                                      if (id === index) {
                                        return { ...item, detail: e.target.value };
                                      }
                                      return item;
                                    });
                                    const updatedStorageDetails = { ...jobdetails };
                                    const taskIndex = updatedStorageDetails.contact.findIndex((contact) => contact.id === response.id);
                                    updatedStorageDetails.contact[taskIndex].contact_detail_data = updatedContactDetail;
                                    setJobDetails(updatedStorageDetails);
                                    if (index == response.contact_detail_data.length - 1) {
                                      response.contact_detail_data.push({ "detail_type": jobdetails.contact_types[0].list_option, "detail": "" })
                                    }
                                  }} />
                                <div className="input-group-append">
                                  <select className="form-control form-control-uniform" value={data.detail_type} onChange={(e) => {
                                    // const updatedContactDetail = response.contact_detail_data.map((item) => {
                                    //   console.log(item,"updatedContactDetailItem")
                                    //   console.log(index,"updatedContactDetailIndex")
                                    //   console.log(data,"updatedContactDetailData")
                                    //   console.log(e.target.value,data.id,"updatedContactDetailTargetValue")
                                    //   if (item.id === data.id) {
                                    //     return { ...item, detail_type: e.target.value };
                                    //   }
                                    //   return item;
                                    // });
                                    // const updatedStorageDetails = [...(response?.contact_detail_data ?? [])];
                                    const updatedContactDetail=[...(response?.contact_detail_data ?? [])];
                                     updatedContactDetail[index].detail_type=e.target.value

                                    const updatedStorageDetails = { ...jobdetails };
                                    const taskIndex = updatedStorageDetails.contact.findIndex((contact) => contact.id === response.id);
                                    updatedStorageDetails.contact[taskIndex].contact_detail_data = updatedContactDetail;
                                    setJobDetails(updatedStorageDetails);
                                  }}>
                                    {jobdetails.contact_types?.map((res) => (
                                      <option key={res.list_option} value={res.list_option}>
                                        {res.list_option}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>);
                          })}
                          {/* <div className="input-group mgb-10">
                            <Input
                              type="text"
                              className="form-control contact_detail"
                              placeholder="Phone, email or URL"
                              value={response.detail}
                              onBlur={(e) => {
                                console.log(response.contact_detail_data)
                                setContactDetail(e.target.value);
                              }}
                            />
                            <div className="input-group-append">
                              <select
                                className="form-control form-control-uniform"
                                value={contacttype}
                                onChange={(e) => {
                                  setContactType(e.target.value);
                                }}
                              >
                                {jobdetails.contact_types?.map((response) => (
                                  <option
                                    key={response.list_option}
                                    value={response.list_option}
                                  >
                                    {response.list_option}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div> */}
                          <div className="hstack gap-2 mt-2">
                            <Button
                              className="btn btn-light"
                              onClick={() => {
                                handleContactEdit();
                              }}
                            >
                              Cancel
                            </Button>
                            <Button
                              className="btn btn-info"
                              onClick={() => {
                                Update_Contact(response);
                              }}
                            >
                              Update
                            </Button>
                          </div>
                        </div>
                      )}
                      {(response.name && response.description) ? (
                        <div> </div>
                      ) : (null)}
                      <Row className="mt-2 m-auto contact-sec-bottom p-0">
                        {/* Header Column */}
                        <Col sm={5} className="text-start">
                          <p className="mt-2" style={{ fontWeight: "500" }}>Name</p>
                          <p className="mt-2" style={{ fontWeight: "500" }}>Description</p>
                          {response.contact_detail_data.map(function (data) {
                            return (
                              <p className="mt-2" style={{ fontWeight: "500" }} key={data.id}>{data.detail && data.detail_type}</p>
                            );
                          })}
                        </Col>

                        {/* Detail Column */}
                        <Col sm={7} className="text-end">
                          <p className="mt-2 text-muted" style={{ wordBreak: 'break-word' }}>
                            {(response?.name) ? response.name : "- "}</p>
                          <p className="mt-2 text-muted" style={{ wordBreak: 'break-word' }}>
                            {(response?.description) ? response.description.substring(0, 25) : "- "}
                          </p>
                          {response.contact_detail_data.map(function (data) {
                            return (
                              <p className="mt-2 text-muted" style={{ wordBreak: 'break-word' }} key={data.id}>
                                {data.detail}
                              </p>
                            );
                          })}
                        </Col>
                      </Row>
                    </div>

                  </>
                ))}
              </CardBody>
            </Card>
          </Col>

          <Col xl={9}>
            <Card className="mb-3">
              <CardHeader>
                <div className="row align-items-center">
                  <div className="col">
                    {
                      !isNavLinkLoading ? (
                        <Nav
                          className="nav-tabs-custom card-header-tabs border-bottom-0"
                          role="tablist"
                        >
                          <NavItem className="flex-grow-1">
                            <NavLink
                              href="#Activity"
                              className={classnames({
                                active: customActiveTab === "Activity",
                              })}
                              onClick={() => {
                                handleClick("Activity");
                              }}
                            >
                              <h5 className="text-primary text-center">Activity</h5>
                            </NavLink>
                          </NavItem>
                          <NavItem className="flex-grow-1">
                            {isLoading?(
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    width: '100%',
                                                    height: '100%',
                                                    background: 'rgba(255, 255, 255, 0.8)',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    zIndex: 9999,
                                                }}
                                            >
                                                <Loader />
                                            </div>
                                        ):(<NavLink
                                          href="#Removals"
                                          className={classnames({
                                            active: customActiveTab === "Removals",
                                          })}
                                          onClick={() => {
                                            handleClick("Removals");
                                          }}
                                        >
                                          <h5 className="text-primary text-center">Removals</h5>
                                        </NavLink>)}
                          </NavItem>
                          <NavItem className="flex-grow-1">
                            <NavLink
                              href="#Inventory"
                              className={classnames({
                                active: customActiveTab === "Inventory",
                              })}
                              onClick={() => {
                                handleClick("Inventory");
                              }}
                            >
                              <h5 className="text-primary text-center">
                                Inventory
                              </h5>
                            </NavLink>
                          </NavItem>
                          <NavItem className="flex-grow-1">
                            <NavLink
                              href="#Storage"
                              className={classnames({
                                active: customActiveTab === "Storage",
                              })}
                              onClick={() => {
                                handleClick("Storage");
                              }}
                            >
                              <h5 className="text-primary text-center">Storage</h5>
                            </NavLink>
                          </NavItem>
                          <NavItem className="flex-grow-1">
                            <NavLink
                              href="#Estimate"
                              className={classnames({
                                active: customActiveTab === "Estimate",
                              })}
                              onClick={() => {
                                handleClick("Estimate");
                              }}
                            >
                              <h5 className="text-primary text-center">Estimate</h5>
                            </NavLink>
                          </NavItem>
                        </Nav>
                      ) : (<Nav
                        className="nav-tabs-custom card-header-tabs border-bottom-0"
                        role="tablist"
                      >
                        <NavItem>
                          <NavLink className="text-white">Loading</NavLink>
                        </NavItem>

                      </Nav>)
                    }

                  </div>
                </div>
              </CardHeader>
            </Card>
            {renderComponent()}
          </Col>
        </Row>
      </Container>
      <ToastContainer closeButton={false} limit={1} theme="light" />
    </div>
  );
};
export default OpportunityDetails;
