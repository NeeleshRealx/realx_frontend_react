import React, { useState, useEffect, useRef } from "react";
import {
  Accordion,
  AccordionItem,
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Collapse,
  Form,
  Label,
  Input,
  Container,
  Row,
  Modal,
  ModalBody,
  ButtonGroup,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu
} from "reactstrap";
import { Link } from "react-router-dom";
import DeleteModal from "../../../Components/Common/DeleteModal";
// import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import moment from 'moment-timezone';
import Loader from "../../../Components/Common/Loader";
import api from "../../../config";
import { es } from "date-fns/locale";
import { get_cookie } from "../../../helpers/get_cookie";
import { useQuill } from "react-quilljs";
import ReactQuill from "react-quill";
import "quill/dist/quill.snow.css";
import {
  useCKEditor,
} from 'ckeditor4-react';
import { setDate } from "date-fns";


export const Activities = ({ data, onChangeData, res }) => {

  const user = JSON.parse(get_cookie("authUser"));
  var tenant_id = user.email;

  const [notes, setNotes] = useState([]);
  const [emailtemplates, setEmailTemplates] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showmodaledit, setShowModalEdit] = useState(false);
  const [showmodelemail, setShowModalemail] = useState(false);
  const [showmodelemailfw, setShowModalemailFw] = useState(false);
  const [showmodelemailrpy, setShowModalemailrpy] = useState(false);
  const [showmodelemailrpyrec, setShowModalemailrpyrec] = useState(false);
  const [ppl_people, setPPL_People] = useState([]);
  const [ppl_peoples, setPPL_Peoples] = useState("");
  const [smstemplates, setSMSTemplates] = useState([]);
  const [sms_contacts, setSMSContacts] = useState([]);
  const [job, setjobid] = useState([]);
  const [leademail, setleademail] = useState([]);
  const [removal, setremoval] = useState([]);
  const [templateid, setTemplateid] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [cc, setcc] = useState("");
  const [bcc, setbcc] = useState("");
  const [companyname, setCompanyname] = useState();
  const [smsfrom, setsmsfrom] = useState("");
  const [edit_notes, setEditNotes] = useState("");
  const [edit_email, setEditemail] = useState("");
  const [edit_emaill, setEditemaill] = useState("");
  const [edit_emailreciv, setEditemailreciv] = useState("");
  const [initialSub, setInitialSub] = useState('');
  const [sub, setSub] = useState('');
  const [subrpy, setSubrpy] = useState('');
  const [subrpyrec, setSubrpyrec] = useState('');
  const [edit_email_reply, setEditemailreply] = useState("");
  const [coll3, setcoll3] = useState(false);
  const [emailcontent, setemailcontent] = useState([]);
  const [coll4, setcoll4] = useState(false);
  const [editedLogSubject, setEditedLogSubject] = useState("");

  const [toemail, setToEmail] = useState("");
  const [toemailfw, setToEmailfw] = useState("");
  const [toemailrpy, setToEmailrpy] = useState("");
  const [toemailrpyrec, setToEmailrpyrec] = useState("");
  const [leadid, setleadid] = useState("");
  const [tempid, setTempid] = useState();
  const [forwardto, setforwardto] = useState("");
  const [smsMessage, setSmsMessage] = useState("");
  const [smsCredits, setSmsCredits] = useState(1);
  const [smsto, SetSmsto] = useState();
  const [smsTotalWords, setSmsTotalWords] = useState(0);
  const [smsTemplates, setSmsTemplates] = useState([]);
  //notes attachemnt
  const [file, selectedFile] = useState(null);
  const [fileEdit, selectedFileEdit] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState("");
  //email attachment
  const [fileemail, selectedFileemail] = useState(null);
  const [fileemailfw, selectedFileemailfw] = useState(null);
  const [fileemailrpy, selectedFileemailrpy] = useState(null);
  const [fileemailrpyrec, selectedFileemailrpyrec] = useState(null);
  const [selectedFileNameEmail, setSelectedFileNameEmail] = useState("");
  const [selectedFileNameEmailfw, setSelectedFileNameEmailfw] = useState("");
  const [selectedFileNameEmailrpy, setSelectedFileNameEmailrpy] = useState("");
  const [isLoader, setLoader] = useState(true);
  const [credits, setCredits] = useState(0);
  const [org_date, setOrg_Date] = useState([]);
  const [emailClassName, setEmailClassName] = useState('timeline-right')
  const [smsClassName, setSmsClassName] = useState('timeline-right ')
  const [noteClassName, setNoteClassName] = useState('timeline-right ')
  const [selectedType, setSelectedType] = useState('allactivities');

  //LocalStorage setItem

  const hash = window.location.hash
  const currentPageUrl = window.location.href;
  const currentUrl = new URL(currentPageUrl);
  const pathname = currentUrl.pathname;
  localStorage.setItem("expiredSessionRedirectUrl", pathname + hash);

  useEffect(() => {
    console.log(data,"data")
    setNotes(data?.notes);
    setEmailTemplates(data?.email_templates);
    setSMSTemplates(data?.sms_templates);
    setPPL_People(data?.ppl_people);
    setPPL_Peoples(`<br />${data?.ppl_people?.email_signature}`|| '');
    setSMSContacts(data?.sms_contacts);
    setjobid(data?.job);
    setremoval(data?.companies_list);
    setleademail(data?.lead_email);
    // const smsNumbersArray = data?.contact?.map((company) => company.lead_id);
    // setsmsfrom(smsNumbersArray[0]);
    setsmsfrom(data?.Companies[0]?.sms_number);
    setleadid(data?.contact[0]?.lead_id);
    localStorage.setItem("lead_id",data?.contact[0]?.lead_id)
    setforwardto(data?.notes?.log_to);
    if (data) {
      setTimeout(function () {
        setLoader(false);
      }, 2000);
    }
  }, [data]);
  useEffect(() => {
    console.log(ppl_peoples,"ppl")
  }, [ppl_peoples]);
  useEffect(() => {
    setToEmail(leademail);
  }, [leademail]);
  useEffect(() => {
    axios.get("/api/all-invoices/date")
      .then((res) => {
        setOrg_Date(res?.organisation_settings);
        // setFromDate(moment().format(res?.organisation_settings?.date_format_js));
        // setToDate(moment().format(res?.organisation_settings?.date_format_js));
      })
      .catch((err) => {
        console.log(err);
      })
  }, [])

  // useEffect(() => {
  //   if (notes && notes.length > 0) {
  //     if (notes[0].log_subject == null) {
  //       setEditedLogSubject("");
  //     } else {
  //       setEditedLogSubject(notes[0].log_subject);
  //     }
  //   }
  // }, [notes]);


  const [bookingDetails, setBookingdetails] = useState(false);
  const t_bookingDetails = () => {
    setBookingdetails(!bookingDetails);
  };

  const handleAddNotes = () => {
    setLoader(true);

    if (editedLogSubject === '') {
      toast.error("Notes should not be empty..", { theme: "light" });
      setLoader(false);
      return; // Stop form submission if editedLogSubject is empty
    }
    if (editedLogSubject.length > 0) {
      var postdata = editedLogSubject;
    } else {
      var postdata = "";
    }
    const formData = new FormData();
    formData.append("lead_id", notes[0].lead_id);
    // formData.append("notes", editedLogSubject);
    formData.append("notes", notesData);
    formData.append("job_id", notes[0].job_id);
    formData.append("notes_attachment", JSON.stringify(attch));

    axios
      .post("/api/crm-leads/ajaxStoreNote", formData)
      .then((response) => {
        t_editnotes();
        setEditedLogSubject("")
        localStorage.setItem("act_notes1","")
        toast.success(response.message, { theme: "light" });
        t_bookingDetails();
        onChangeData();
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setnote(false);
        setLoader(false);
      })
    
  };

  const t_coll3 = () => {
    setcoll3(!coll3);
  };

  const t_coll4 = () => {
    setcoll4(!coll4);
  };

  const t_editnotes = (id) => {
    console.log(id,"vv")
    setEditNotes(id);
    notes.forEach((res) => {
      if (res.log_type === 7) {
        if (id == res.id) {
          setAttachEdit(res.attachments);
          setLogMessageEdit(res.log_message)
        }
      }
    });
  };

  // const t_editemail = (id) => {
  //   setCompanyname(data?.companies_list[0].email);
  //   setEditemail(id);
  // };
  // const t_editemailreplyreciv = (id) => {
  //   setCompanyname(data?.companies_list[0].email);
  //   setEditemailreciv(id);
  // };
  // const t_editemailreply = (id) => {
  //   setCompanyname(data?.companies_list[0].email);
  //   setEditemaill(id);
  // };

  const t_editemail = (id) => {
    if (edit_email === id) {

      // If the content is already open, close it by setting edit_email to an empty string
      setCompanyname((data?.companies_list[0]?.email) || "");
      setEditemail("");
    } else {
      // If the content is closed, open it by setting edit_email to the current id
      setCompanyname((data?.companies_list[0]?.email) || "");
      setEditemail(id);
    }
  };

  const t_editemailreply = (id) => {
    if (edit_emaill === id) {
      // If the content is already open, close it by setting edit_emaill to an empty string
      // setCompanyname((data?.companies_list[0]?.email) || "");
      setEditemaill("");
    } else {
      // If the content is closed, open it by setting edit_emaill to the current id
      //setCompanyname((data?.companies_list[0]?.email) || "");
      setEditemaill(id);
    }
  };

  const t_editemailreplyreciv = (id) => {
    if (edit_emailreciv === id) {
      // If the content is already open, close it by setting edit_emailreciv to an empty string
      setCompanyname((data?.companies_list[0]?.email) || "");
      setEditemailreciv("");
    } else {
      // If the content is closed, open it by setting edit_emailreciv to the current id
      setCompanyname((data?.companies_list[0]?.email) || "");
      setEditemailreciv(id);
    }
  };


  const sendEmail = () => {
    setLoader(true);
    if (companyname === '') {
      toast.error("The email field is required.", { theme: "light" });
      setLoader(false);
      return; // Stop form submission if orgDate is empty
    } else if (toemail === '') {
      toast.error("The email field is required.", { theme: "light" });
      setLoader(false);
      return; // Stop form submission if orgDate is empty
    }
    else if (companyname !== '') {
      const emailPattern = /^[A-Za-z0-9._+-]+@[A-Za-z._-]+\.[A-Za-z]{2,}$/;
      const isValid = emailPattern.test(companyname);
      if (!isValid) {
        toast.error('Invalid email', { theme: "light" });
        setLoader(false);
        return;
      }
    } else if (toemail !== '') {
      const emailPattern = /^[A-Za-z0-9._+-]+@[A-Za-z._-]+\.[A-Za-z]{2,}$/;
      const isValid = emailPattern.test(toemail);
      if (!isValid) {
        toast.error('Invalid email', { theme: "light" });
        setLoader(false);
        return;
      }
    } else if (cc !== '') {
      const emailPattern = /^[A-Za-z0-9._+-]+@[A-Za-z._-]+\.[A-Za-z]{2,}$/;
      const isValid = emailPattern.test(cc);
      if (!isValid) {
        toast.error('Invalid email', { theme: "light" });
        setLoader(false);
        return;
      }
    } else if (bcc !== '') {
      const emailPattern = /^[A-Za-z0-9._+-]+@[A-Za-z._-]+\.[A-Za-z]{2,}$/;
      const isValid = emailPattern.test(bcc);
      if (!isValid) {
        toast.error('Invalid email', { theme: "light" });
        setLoader(false);
        return;
      }
    }
    const logType3Note = removal?.find((res) => res.email === companyname);
    let contact_Name = "";
    if (logType3Note) {
      contact_Name = logType3Note.contact_name;
    } else {
      contact_Name = "";
    }
    const fileNames = attname.map((file) => file.name);

    const formData = new FormData();
    formData.append("lead_id", leadid);
    formData.append("job_id", job.job_id);
    formData.append("from_name", contact_Name);
    formData.append("from_email", companyname);
    formData.append("to", toemail);
    formData.append("cc", cc);
    formData.append("bcc", bcc);
    formData.append("email_subject", subject);
    formData.append("email_template", selectedTemplate);
    formData.append("email_body", emailData);
    formData.append("email_attachment", JSON.stringify(attname));

    setTimeout(() => {
      axios
      .post("/api/crm-leads/ajaxSendEmail", formData)
      .then((response) => {
        toast.success(response.message, { theme: "light" });
        onChangeData();
        t_editemail();
        setbcc("");
        setcc("");
  
        // setSelectedTemplate("");
        setEmailBody("");
        setAttName([]);
      })
      .catch((error) => {
        console.error(error);
      }).finally(() => {
        setemail(false);
        setsubject("");
        // window.location.reload();
        setLoader(false);
      })
    }, 1);
    
  };



  const updateedit = (editlog, id) => {
    setLoader(true);
    console.log(attchedit, "attchedit214");
    const updatededitNote = {
      lead_id: notes[0].lead_id,
      notes: editlog,
      id: id,
      notes_attachment: JSON.stringify(attchedit),
    };
    axios
      .post("/api/crm-leads/ajaxUpdateNote", updatededitNote)
      .then((response) => {
        toast.success(response.message, { theme: "light" });
        onChangeData();
        t_editnotes();
      })
      .catch((error) => {
        console.error(error);
      }).finally(() => {
        setLoader(false);
      })
  };



  ///
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const destroynotes = (id) => {
    setDeleteItemId(id);
    setDeleteModal(true);

  }


  ///
  const handleDeleteOrder = () => {
    setLoader(true);
    const destroynotes = {
      lead_id: notes[0].lead_id,
      id: deleteItemId,
    };

    axios
      .post("/api/crm-leads/ajaxDestroyNote", destroynotes)
      .then((response) => {
        toast.success(response.message, { theme: "light" });
        // window.location.reload();
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoader(false);
      });
    onChangeData();
    setDeleteModal(false);
  };

  //attachment for note tab
  const fileInputRef = useRef(null);
  const fileInputRefEdit = useRef(null);

  const handleClick = () => {
    fileInputRef.current.click();
  };
  const handleClickEdit = () => {
    fileInputRefEdit.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    event.preventDefault();
    selectedFile(file);
    setIsNote(file);
    const formData = new FormData();
  };
  const handleFileChangeEdit = (event) => {
    const file = event.target.files[0];
    event.preventDefault();
    selectedFileEdit(file);
    setIsNoteEdit(file);
    const formData = new FormData();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    selectedFile(file);
    setIsNote(file);
    setSelectedFileName(file.name);
  };
  const handleDropEdit = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    selectedFileEdit(file);
    setIsNoteEdit(file);
    setSelectedFileName(file.name);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };
  const handleDragOverEdit = (event) => {
    event.preventDefault();
  };
  const [isNote, setIsNote] = useState(null);
  const [isNoteEdit, setIsNoteEdit] = useState(null);
  const [isEmail, setIsEmail] = useState(null);
  const [isEmailfw, setIsEmailfw] = useState(null);
  const [isEmailrpy, setIsEmailrpy] = useState(null);
  const [isSms, setIsSms] = useState(null);

  const [attch, setAttach] = useState([]);
  const [attchedit, setAttachEdit] = useState([]);
  const [key, setKey] = useState([]);

  const fileuploadnotes = () => {
    setLoader(true);
    const formData = new FormData();
    formData.append("id", leadid);
    formData.append("type", "notes"); //dd
    formData.append("is_reply", 0); //dd
    formData.append("attachment", file);
    formData.append("note_id", "");
    if (isNote) {
      axios
        .post("/api/crm-leads/uploadActivityAttachment", formData)
        .then((response) => {
          toast.success(response.message, { theme: "light" });
          setAttach([...attch, response.attachment]);
          selectedFile(null);
          setIsNote(null);
        })
        .catch((error) => {
          console.error(error);
        }).finally(() => {
          setLoader(false);
        });
      setShowModal(false);
    }

  };
  const fileuploadeditnotes = () => {
    setLoader(true);
    const formData = new FormData();
    formData.append("id", notes[0].lead_id);
    formData.append("type", "notes"); //dd
    formData.append("is_reply", 0); //dd
    formData.append("attachment", fileEdit);
    formData.append("note_id", "");
    if (isNoteEdit) {
      axios
        .post("/api/crm-leads/uploadActivityAttachment", formData)
        .then((response) => {
          toast.success(response.message, { theme: "light" });
          setAttachEdit([...attchedit, response.attachment]);
          selectedFileEdit(null);
          setIsNoteEdit(null);
        })
        .catch((error) => {
          console.error(error);
        }).finally(() => {
          setLoader(false);
        });
      setShowModalEdit(false);
    }

  };

  //send email attachment
  const fileInputRefemail = useRef(null);

  const handleClicks = () => {
    fileInputRefemail.current.click();
  };
  const handleFileChangesemail = (event) => {

    const fileemail = event.target.files[0];
    event.preventDefault();
    selectedFileemail(fileemail);
    const formData = new FormData();
    setIsEmail(fileemail);
  };
  const handleDropemail = (event) => {
    event.preventDefault();
    const fileemail = event.dataTransfer.files[0];
    selectedFileemail(fileemail);
    setSelectedFileNameEmail(fileemail.name);
  };

  const handleDragOveremail = (event) => {
    event.preventDefault();
  };

  const [attname, setAttName] = useState([]);

  const fileuploademail = () => {
    const formData = new FormData();
    formData.append("id", notes[0].lead_id);
    formData.append("type", "email");
    formData.append("is_reply", 0);
    formData.append("attachment", fileemail);
    formData.append("note_id", "");
    if (isEmail) {
      axios
        .post("/api/crm-leads/uploadActivityAttachment", formData)
        .then((response) => {
          toast.success(response.message, { theme: "light" });
          // setAttach([...attch, response.attachment]);
          setAttName([...attname, response.attachment]);
          selectedFileemail(null);
          setShowModalemail(false);
          setIsEmail(null);
        })
        .catch((error) => {
          console.error(error);
        });
    }

  };

  //email forward
  const fileInputRefemailfw = useRef(null);

  const handleClicksfw = () => {
    fileInputRefemailfw.current.click();
  };
  const handleFileChangesemailfw = (event) => {
    const fileemail = event.target.files[0];
    event.preventDefault();
    selectedFileemailfw(fileemail);
    const formData = new FormData();
    setIsEmailfw(fileemail);
  };
  const handleDropemailfw = (event) => {
    event.preventDefault();
    const fileemail = event.dataTransfer.files[0];
    selectedFileemailfw(fileemail);
    setSelectedFileNameEmailfw(fileemail.name);
  };

  const handleDragOveremailfw = (event) => {
    event.preventDefault();
  };

  const [attnamefw, setAttNameFw] = useState([]);

  const fileuploademailfw = () => {
    const formData = new FormData();
    formData.append("id", notes[0].lead_id);
    formData.append("type", "email");
    formData.append("is_reply", 0);
    formData.append("attachment", fileemailfw);
    formData.append("note_id", "");
    if (isEmailfw) {
      axios
        .post("/api/crm-leads/uploadActivityAttachment", formData)
        .then((response) => {
          toast.success(response.message, { theme: "light" });
          // setAttach([...attch, response.attachment]);
          setAttNameFw([...attnamefw, response.attachment]);
          selectedFileemailfw(null);
          setShowModalemailFw(false);
          setIsEmailfw(null);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  //email reply
  const fileInputRefemailrpy = useRef(null);

  const handleClicksrpy = () => {
    fileInputRefemailrpy.current.click();
  };
  const handleFileChangesemailrpy = (event) => {
    const fileemail = event.target.files[0];
    event.preventDefault();
    selectedFileemailrpy(fileemail);
    const formData = new FormData();
    setIsEmailrpy(fileemail);
  };
  const handleDropemailrpy = (event) => {
    event.preventDefault();
    const fileemail = event.dataTransfer.files[0];
    selectedFileemailrpy(fileemail);
    setSelectedFileNameEmailrpy(fileemail.name);
  };

  const handleDragOveremailrpy = (event) => {
    event.preventDefault();
  };

  const [attnamerpy, setAttNamerpy] = useState([]);

  const fileuploademailrpy = () => {
    const formData = new FormData();
    formData.append("id", notes[0].lead_id);
    formData.append("type", "email");
    formData.append("is_reply", 0);
    formData.append("attachment", fileemailrpy);
    formData.append("note_id", "");

    axios
      .post("/api/crm-leads/uploadActivityAttachment", formData)
      .then((response) => {
        toast.success(response.message, { theme: "light" });
        // setAttach([...attch, response.attachment]);
        setAttNamerpy([...attnamerpy, response.attachment]);
        selectedFileemailrpy(null);
        setShowModalemailrpy(false);
        setIsEmailrpy(null);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  //email reply(email recieved)
  const fileInputRefemailrpyrec = useRef(null);

  const handleClicksrpyrec = () => {
    fileInputRefemailrpyrec.current.click();
  };
  const handleFileChangesemailrpyrec = (event) => {
    const fileemail = event.target.files[0];
    event.preventDefault();
    selectedFileemailrpyrec(fileemail);
    const formData = new FormData();
  };
  const handleDropemailrpyrec = (event) => {
    event.preventDefault();
    const fileemail = event.dataTransfer.files[0];
    selectedFileemailrpyrec(fileemail);
    setSelectedFileNameEmailrpy(fileemail.name);
  };

  const handleDragOveremailrpyrec = (event) => {
    event.preventDefault();
  };

  const [attnamerpyrec, setAttNamerpyrec] = useState([]);

  const fileuploademailrpyrec = () => {

    const formData = new FormData();
    formData.append("id", notes[0].lead_id);
    formData.append("type", "email");
    formData.append("is_reply", 0);
    formData.append("attachment", fileemailrpyrec);
    formData.append("note_id", "");
    // if (isEmailrpy) {
    axios
      .post("/api/crm-leads/uploadActivityAttachment", formData)
      .then((response) => {
        toast.success(response.message, { theme: "light" });
        // setAttach([...attch, response.attachment]);
        setAttNamerpyrec([...attnamerpyrec, response.attachment]);
        selectedFileemailrpyrec(null);
        setShowModalemailrpyrec(false);
      })
      .catch((error) => {
        console.error(error);
      });
    // }
  };

  const chooseTemplate = (event) => {
    setLoader(true);
    const selectedTemplateId = event.target.value;
    setTemplateid(selectedTemplateId);
    localStorage.setItem("act_smstemp", JSON.stringify(selectedTemplateId));
    const url = `/api/crm-leads/getSmsTemplate/${selectedTemplateId}`;
    const data = {
      lead_id: leadid,
      job_id: job.job_id,
      job_type: job.job_type,
    };

    axios
      .post(url, data)
      .then((response) => {
        const { sms_message } = response;
        // setSmsMessage(sms_message);
        const message = sms_message;
        const len = message.length;
        const credits = len > 0 ? Math.ceil(len / 160) : 0;
        setSmsMessage(message);
        localStorage.setItem("act_sms", JSON.stringify(message));
        setSmsCredits(credits);
        setSmsTotalWords(len);
        // countChar();
      })
      .catch((error) => {
        console.error(error);
      }).finally(() => {
        setLoader(false);
      })
  };
  const [modalerr, setModalErr] = useState(false);
  const [errormsg, setErrorMsg] = useState("");

  const sendsms = () => {
    setLoader(true);
    if (smsfrom === '') {
      toast.error("The email field is required.", { theme: "light" });
      setLoader(false);
      return; // Stop form submission if orgDate is empty
    } else if (smsto === '') {
      toast.error("The email field is required.", { theme: "light" });
      setLoader(false);
      return; // Stop form submission if orgDate is empty
    } else if (smsMessage === '') {
      toast.error("Please enter Message!.", { theme: "light" });
      setLoader(false);
      return; // Stop form submission if orgDate is empty
    }
    const len = smsMessage.length;
    if (len > 0) {
      const calculatedCredits = Math.ceil(len / 160);
      setCredits(calculatedCredits);
    }

    let smsend = {
      'lead_id': leadid,
      'sms_from': smsfrom,
      'sms_to': smsto,
      'sms_templates': templateid,
      'sms_message': smsMessage,
      'sms_total_credits': smsCredits,
      'job_id': job.job_id,
      // 'sms_total_credits': credits,
    };

    axios
      .post("/api/crm-leads/ajaxSendSms", smsend)
      .then((response) => {
        if (response.error == 0) {
          col_sms();
          toast.success(response.message, { theme: "light" });
          onChangeData();
        } else {
          setErrorMsg(response.message);
          setModalErr(true);
          // col_sms();
        }
      })
      .catch((error) => {
        console.error(error);
      }).finally(() => {
        setLoader(false);
      })
  };

  const forwardemail = (res) => {
    setLoader(true);
    if (companyname === '') {
      toast.error("The email field is required.", { theme: "light" });
      setLoader(false);
      return; // Stop form submission if orgDate is empty
    } else if (toemailfw === '') {
      toast.error("The email field is required.", { theme: "light" });
      setLoader(false);
      return; // Stop form submission if orgDate is empty
    }
    else if (companyname !== '') {
      const emailPattern = /^[A-Za-z0-9._+-]+@[A-Za-z._-]+\.[A-Za-z]{2,}$/;
      const isValid = emailPattern.test(companyname);
      if (!isValid) {
        toast.error('Invalid email', { theme: "light" });
        setLoader(false);
        return;
      }
    } else if (toemailfw !== '') {
      const emailPattern = /^[A-Za-z0-9._+-]+@[A-Za-z._-]+\.[A-Za-z]{2,}$/;
      const isValid = emailPattern.test(toemailfw);
      if (!isValid) {
        toast.error('Invalid email', { theme: "light" });
        setLoader(false);
        return;
      }
    } else if (cc !== '') {
      const emailPattern = /^[A-Za-z0-9._+-]+@[A-Za-z._-]+\.[A-Za-z]{2,}$/;
      const isValid = emailPattern.test(cc);
      if (!isValid) {
        toast.error('Invalid email', { theme: "light" });
        setLoader(false);
        return;
      }
    } else if (bcc !== '') {
      const emailPattern = /^[A-Za-z0-9._+-]+@[A-Za-z._-]+\.[A-Za-z]{2,}$/;
      const isValid = emailPattern.test(bcc);
      if (!isValid) {
        toast.error('Invalid email', { theme: "light" });
        setLoader(false);
        return;
      }
    }

    if (quil2.length > 0) {
      var post = quil2;
    } else {
      var post =
        "<p><br/><br/><br/>" +
        ppl_people.email_signature +
        "</p><hr/><p><b>From: </b>" +
        res.log_from +
        "<br/><b>Sent: </b>" +
        moment(res.log_date).format("dddd, MMMM DD, YYYY h:mm:ss A") +
        "<br/><b>To: </b>" +
        res.log_to +
        "<br/><b>Subject: </b>" +
        res.log_subject +
        "</p><br/>" +
        res.log_message;
    }
    const formData = new FormData();
    formData.append("lead_id", leadid);
    formData.append("is_reply", "");
    formData.append("from_email", companyname);
    formData.append("to", toemailfw);
    formData.append("cc", cc);
    formData.append("bcc", bcc);
    formData.append("email_subject", sub);
    formData.append("email_body", post);
    formData.append("job_id", job.job_id);
    formData.append("email_attachment", JSON.stringify(attnamefw));

    axios
      .post("/api/crm-leads/ajaxSendEmail", formData)
      .then((response) => {
        t_editemail();
        onChangeData();
        toast.success(response.message, { theme: "light" });
      })
      .catch((error) => {
        console.error(error);
      }).finally(() => {
        setLoader(false);
      })
  };

  const replyemail = (res) => {
    setLoader(true);
    if (companyname === '') {
      toast.error("The email field is required.", { theme: "light" });
      setLoader(false);
      return; // Stop form submission if orgDate is empty
    } else if (toemailrpy === '') {
      toast.error("The email field is required.", { theme: "light" });
      setLoader(false);
      return; // Stop form submission if orgDate is empty
    }
    else if (companyname !== '') {
      const emailPattern = /^[A-Za-z0-9._+-]+@[A-Za-z._-]+\.[A-Za-z]{2,}$/;
      const isValid = emailPattern.test(companyname);
      if (!isValid) {
        toast.error('Invalid email', { theme: "light" });
        setLoader(false);
        return;
      }
    } else if (toemailrpy !== '') {
      const emailPattern = /^[A-Za-z0-9._+-]+@[A-Za-z._-]+\.[A-Za-z]{2,}$/;
      const isValid = emailPattern.test(toemailrpy);
      if (!isValid) {
        toast.error('Invalid email', { theme: "light" });
        setLoader(false);
        return;
      }
    } else if (cc !== '') {
      const emailPattern = /^[A-Za-z0-9._+-]+@[A-Za-z._-]+\.[A-Za-z]{2,}$/;
      const isValid = emailPattern.test(cc);
      if (!isValid) {
        toast.error('Invalid email', { theme: "light" });
        setLoader(false);
        return;
      }
    } else if (bcc !== '') {
      const emailPattern = /^[A-Za-z0-9._+-]+@[A-Za-z._-]+\.[A-Za-z]{2,}$/;
      const isValid = emailPattern.test(bcc);
      if (!isValid) {
        toast.error('Invalid email', { theme: "light" });
        setLoader(false);
        return;
      }
    }
    if (quil3.length > 0) {
      var post = quil3;
    } else {
      var post =
        "<p><br/><br/><br/>" +
        ppl_people.email_signature +
        "</p><hr/><p><b>From: </b>" +
        res.log_from +
        "<br/><b>Sent: </b>" +
        moment(res.log_date).format("dddd, MMMM DD, YYYY h:mm:ss A") +
        "<br/><b>To: </b>" +
        res.log_to +
        "<br/><b>Subject: </b>" +
        res.log_subject +
        "</p><br/>" +
        res.log_message;
    }
    const formData = new FormData();
    formData.append("lead_id", leadid);
    formData.append("is_reply", tenant_id);
    formData.append("from_email", companyname);
    formData.append("to", toemailrpy);
    formData.append("cc", cc);
    formData.append("bcc", bcc);
    formData.append("email_subject", subrpy);
    formData.append("email_body", post);
    formData.append("job_id", job.job_id);
    formData.append("email_attachment", JSON.stringify(attnamerpy));
    axios
      .post("/api/crm-leads/ajaxSendEmail", formData)
      .then((response) => {
        t_editemailreply();
        onChangeData();
        toast.success(response.message, { theme: "light" });
      })
      .catch((error) => {
        console.error(error);
      }).finally(() => {
        setLoader(false);
      })
  };

  //email recieved(reply)
  const replyemailrec = (res) => {

    setLoader(true);
    if (companyname === '') {
      toast.error("The email field is required.", { theme: "light" });
      setLoader(false);
      return; // Stop form submission if orgDate is empty
    } else if (toemailrpyrec === '') {
      toast.error("The email field is required.", { theme: "light" });
      setLoader(false);
      return; // Stop form submission if orgDate is empty
    }
    else if (companyname !== '') {
      const emailPattern = /^[A-Za-z0-9._+-]+@[A-Za-z._-]+\.[A-Za-z]{2,}$/;
      const isValid = emailPattern.test(companyname);
      if (!isValid) {
        toast.error('Invalid email', { theme: "light" });
        setLoader(false);
        return;
      }
    } else if (toemailrpyrec !== '') {
      const emailPattern = /^[A-Za-z0-9._+-]+@[A-Za-z._-]+\.[A-Za-z]{2,}$/;
      const isValid = emailPattern.test(toemailrpyrec);
      if (!isValid) {
        toast.error('Invalid email', { theme: "light" });
        setLoader(false);
        return;
      }
    } else if (cc !== '') {
      const emailPattern = /^[A-Za-z0-9._+-]+@[A-Za-z._-]+\.[A-Za-z]{2,}$/;
      const isValid = emailPattern.test(cc);
      if (!isValid) {
        toast.error('Invalid email', { theme: "light" });
        setLoader(false);
        return;
      }
    } else if (bcc !== '') {
      const emailPattern = /^[A-Za-z0-9._+-]+@[A-Za-z._-]+\.[A-Za-z]{2,}$/;
      const isValid = emailPattern.test(bcc);
      if (!isValid) {
        toast.error('Invalid email', { theme: "light" });
        setLoader(false);
        return;
      }
    }
    if (quil4.length > 0) {
      var post = quil4;
    } else {
      var post =
        "<p><br/><br/><br/>" +
        ppl_people.email_signature +
        "</p><hr/><p><b>From: </b>" +
        res.log_from +
        "<br/><b>Sent: </b>" +
        moment(res.log_date).format("dddd, MMMM DD, YYYY h:mm:ss A") +
        "<br/><b>To: </b>" +
        res.log_to +
        "<br/><b>Subject: </b>" +
        res.log_subject +
        "</p><br/>" +
        res.log_message;
    }

    const formData = new FormData();
    formData.append("lead_id", leadid);
    formData.append("is_reply", tenant_id);
    formData.append("from_email", companyname);
    formData.append("to", toemailrpyrec);
    formData.append("cc", cc);
    formData.append("bcc", bcc);
    formData.append("email_subject", subrpyrec);
    formData.append("email_body", post);
    formData.append("job_id", job.job_id);
    formData.append("email_attachment", JSON.stringify(attnamerpyrec));
    axios
      .post("/api/crm-leads/ajaxSendEmail", formData)
      .then((response) => {

        t_editemailreplyreciv();
        onChangeData();
        toast.success(response.message, { theme: "light" });
      })
      .catch((error) => {
        console.error(error);
      }).finally(() => {
        setLoader(false);
      })
  };



  //notes
  const removenotesattachment = (res, index) => {
    const remove = {
      key: res.key,
      type: res.type,
      is_reply: res.note_id,
      name: res.name
    };
    console.log(remove, "remove2334");
    axios
      .post("/api/crm-leads/removeActivityAttachment", remove)
      .then((response) => {
        const removeIndex = attch.findIndex((item) => item.key === response.key);
        if (removeIndex !== -1) {
          // Create a copy of the current state array and remove the file at the found index
          const updatedAttach = [...attch];
          updatedAttach.splice(removeIndex, 1);
          setAttach(updatedAttach);
        }
        toast.success(response.message, { theme: "light" });
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const removenoteseditattachment = (res, index) => {
    // console.log(res,"err34");
    const remove = {
      key: res.key ? res.key : res.id,
      type: res.type ? res.type : "notes",
      is_reply: res.note_id ? res.note_id : 0,
      name: res.name ? res.name : res.attachment_type
    };
    console.log(remove, "err34");
    axios
      .post("/api/crm-leads/removeActivityAttachment", remove)
      .then((response) => {
        console.log(attchedit, "dssgf34");
        const removeIndex = attchedit.findIndex((item) => item.key ? item.key : item.id === response.key);
        if (removeIndex !== -1) {
          // Create a copy of the current state array and remove the file at the found index
          const updatedAttachEdit = [...attchedit];
          updatedAttachEdit.splice(removeIndex, 1);
          setAttachEdit(updatedAttachEdit);
        }
        toast.success(response.message, { theme: "light" });
      })
      .catch((error) => {
        console.error(error);
      });
  };


  //email
  const removeemailattachment = (res, index) => {

    const remove = {
      key: res.key,
      type: res.type,
      is_reply: res.note_id
    };
    axios
      .post("/api/crm-leads/removeActivityAttachment", remove)
      .then((response) => {
        const removeIndex = attname.findIndex((item) => item.key === response.key);
        if (removeIndex !== -1) {
          // Create a copy of the current state array and remove the file at the found index
          const updatedAttach = [...attname];
          updatedAttach.splice(removeIndex, 1);
          setAttName(updatedAttach);
        }
        toast.success(response.message, { theme: "light" });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  //email forward
  const removeemailattachmentfw = (res, index) => {
    const remove = {
      key: res.key,
      type: res.type,
      is_reply: res.note_id
    };
    axios
      .post("/api/crm-leads/removeActivityAttachment", remove)
      .then((response) => {
        const removeIndex = attnamefw.findIndex((item) => item.key === response.key);
        if (removeIndex !== -1) {
          // Create a copy of the current state array and remove the file at the found index
          const updatedAttach = [...attnamefw];
          updatedAttach.splice(removeIndex, 1);
          setAttNameFw(updatedAttach);
        }
        toast.success(response.message, { theme: "light" });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  //email reply
  const removeemailattachmentrpy = (res, index) => {
    const remove = {
      key: res.key,
      type: res.type,
      is_reply: res.note_id
    };
    axios
      .post("/api/crm-leads/removeActivityAttachment", remove)
      .then((response) => {
        const removeIndex = attnamerpy.findIndex((item) => item.key === response.key);
        if (removeIndex !== -1) {
          // Create a copy of the current state array and remove the file at the found index
          const updatedAttach = [...attnamerpy];
          updatedAttach.splice(removeIndex, 1);
          setAttNamerpy(updatedAttach);
        }
        toast.success(response.message, { theme: "light" });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  //email reply(email recieved)
  const removeemailattachmentrpyrec = (res, index) => {
    const remove = {
      key: res.key,
      type: res.type,
      is_reply: res.note_id
    };
    axios
      .post("/api/crm-leads/removeActivityAttachment", remove)
      .then((response) => {
        const removeIndex = attnamerpyrec.findIndex((item) => item.key === response.key);
        if (removeIndex !== -1) {
          // Create a copy of the current state array and remove the file at the found index
          const updatedAttach = [...attnamerpyrec];
          updatedAttach.splice(removeIndex, 1);
          setAttNamerpyrec(updatedAttach);
        }
        toast.success(response.message, { theme: "light" });
      })
      .catch((error) => {
        console.error(error);
      });
  };


  //pinned for notes 
  const chngimg = (id, job_id, lead_id) => {
    setLoader(true);
    const remove = {
      activity_log_id: id,
      job_id: job_id,
      lead_id: lead_id
    };
    axios
      .post("/api/updatePinStatus", remove)
      .then((response) => {
        toast.success(response.message, { theme: "light" });
        onChangeData();
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  //pinned for email 
  const chngimgemail = (id, job_id, lead_id) => {
    setLoader(true);
    const remove = {
      activity_log_id: id,
      job_id: job_id,
      lead_id: lead_id
    };
    axios
      .post("/api/updatePinStatus", remove)
      .then((response) => {
        toast.success(response.message, { theme: "light" });
        onChangeData();
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  //pinned for email(Email Recieved)
  const chngimgemailreciv = (id, job_id, lead_id) => {
    setLoader(true);
    const remove = {
      activity_log_id: id,
      job_id: job_id,
      lead_id: lead_id
    };
    axios
      .post("/api/updatePinStatus", remove)
      .then((response) => {
        toast.success(response.message, { theme: "light" });
        onChangeData();
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  const handleSelectChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedType(selectedValue);
    SelectType(selectedValue);
  };
  const SelectType = (selectedValue) => {
    const remove = {
      type: selectedValue,
      job_id: job?.job_id,
      lead_id: leadid
    };
    axios
      .post("api/crm-leads/getActivitiesForCustom", remove)
      .then((response) => {
        toast.success(response.message, { theme: "light" });
        setNotes(response.notes);
        setPPL_People(response.ppl_people);
        setleadid(response.lead_id);
        //onChangeData();
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const [isCollapsed, setIsCollapsed] = useState(true);
  const toggleCollapse = (noteId) => {
    setIsCollapsed((prevState) => ({
      ...prevState,
      [noteId]: !prevState[noteId]
    }));
  };

  // down arrow icon(collapse) for email
  const [isCollapsedemail, setIsCollapsedemail] = useState(true);
  const toggleCollapseemail = (emailId) => {
    setIsCollapsedemail((prevStates) => ({
      ...prevStates,
      [emailId]: !prevStates[emailId]
    }));
  };

  // down arrow icon(collapse) for email recieve
  const [isCollapsedemailreciv, setIsCollapsedemailreciv] = useState(true);
  const toggleCollapseemailreciv = (emailId) => {
    setIsCollapsedemailreciv((prevStatesrec) => ({
      ...prevStatesrec,
      [emailId]: !prevStatesrec[emailId]
    }));
  };

  // down arrow icon(collapse) for inventory created
  const [isCollapsedinv, setIsCollapsedinv] = useState(true);
  const toggleCollapseinv = (emailId) => {
    setIsCollapsedinv((prevStatesinv) => ({
      ...prevStatesinv,
      [emailId]: !prevStatesinv[emailId]
    }));
  };

  // down arrow icon(collapse) for inventory modified
  const [isCollapsedinvm, setIsCollapsedinvm] = useState(true);
  const toggleCollapseinvm = (emailId) => {
    setIsCollapsedinvm((prevStatesinvm) => ({
      ...prevStatesinvm,
      [emailId]: !prevStatesinvm[emailId]
    }));
  };

  // down arrow icon(collapse) for Driver Notes
  const [isCollapsedinvd, setIsCollapsedinvd] = useState(true);
  const toggleCollapseinvd = (emailId) => {
    setIsCollapsedinvd((prevStatesinvd) => ({
      ...prevStatesinvd,
      [emailId]: !prevStatesinvd[emailId]
    }));
  };

  // down arrow icon(collapse) for Email Opened
  const [isCollapsedinve, setIsCollapsedinve] = useState(true);
  const toggleCollapseinve = (emailId) => {
    setIsCollapsedinve((prevStatesinve) => ({
      ...prevStatesinve,
      [emailId]: !prevStatesinve[emailId]
    }));
  };
  const [emailBody, setEmailBody] = useState("");

  const [subject, setsubject] = useState("");

  const handleTemplateChange = (event) => {
    setLoader(true);
    const templateId = event.target.value;

    const template = {
      lead_id: notes.lead_id,
      id: templateId,
      job_id: job.job_id,
      job_type: job.job_type,
      crm_opportunity_id: job.crm_opportunity_id,
    };

    axios
      .post(`/api/crm-leads/getEmailTemplate/${templateId}`, template)
      .then((response) => {
        console.log(templateId,"temp")
        console.log(response.body,"ppl")
        setAttName(response.attach_html);
        setPPL_Peoples(response.body);
        // document.getElementById('react-trumbowyg').insertAdjacentHTML('beforeend', response.body);
        //document.getElementById("react-trumbowyg").innerHTML(response.body);
        setsubject(response.subject);
        setTempid(templateId);
        localStorage.setItem("act_ppl_people", JSON.stringify(response.body));
        localStorage.setItem("act_subject", JSON.stringify(response.subject));
        localStorage.setItem("act_attname", JSON.stringify(response.attach_html));
        localStorage.setItem("act_tempid", JSON.stringify(templateId));
        const updatedEmailTemplates = emailtemplates.map((res) => {
          if (res.id === templateId) {
            return { ...res, email_body: response.data.email_body };
          }
          return res;
        });
        setEmailTemplates(updatedEmailTemplates);
      })
      .catch((error) => {
        console.error(error);
      }).finally(() => {
        setLoader(false);
      })
    setSelectedTemplate(templateId);
  };

  // Trumbowyg Editor
  const [imageWidth, setImageWidth] = useState(200); // Default width
  const [imageHeight, setImageHeight] = useState(150); // Default height

  const handleWidthChange = (event) => {
    setImageWidth(event.target.value);
    updateImageSize(event.target.value, imageHeight);
  };

  const handleHeightChange = (event) => {
    setImageHeight(event.target.value);
    updateImageSize(imageWidth, event.target.value);
  };

  const updateImageSize = (width, height) => {
    // Get the Trumbowyg editor content
    const content = document.getElementById('react-trumbowyg_email').innerHTML;

    // Update image size using regex or any HTML parsing library
    const updatedContent = content.replace(/<img[^>]+>/g, (imgTag) => {
        // Modify the img tag to include width and height attributes
        return imgTag.replace(/width="[^"]*"/, `width="${width}"`).replace(/height="[^"]*"/, `height="${height}"`);
    });

    // Set the updated content back to the editor
    document.getElementById('react-trumbowyg_email').innerHTML = updatedContent;
  };

  const countChar = (event) => {
    const message = event.target.value;
    const len = message.length;
    const credits = len > 0 ? Math.ceil(len / 160) : 0;
    setSmsMessage(message);
    localStorage.setItem("act_sms", JSON.stringify(message));
    setSmsCredits(credits);
    setSmsTotalWords(len);
  };

  // Collapse with Icon

  const [note, setnote] = useState(false);
  const [email, setemail] = useState(false);
  const [sms, setsms] = useState(false);
  const [inventory, setinventory] = useState(false);

  const col_note = () => {
    setnote(!note);
    console.log(localStorage.getItem("actNotes1"),"notes")
    if (localStorage.getItem("act_notes1")&&leadid===parseInt(localStorage.getItem("lead_id"))) {
      setEditedLogSubject(JSON.parse(localStorage.getItem("act_notes1")))
    }
    // setEditedLogSubject("");
    // setAttach([]);
  };

  const col_email = () => {
    // setQuill1("");
    console.log(ppl_peoples, "ppl")
    // if (ppl_peoples) {
    //   setQuill1(ppl_peoples);
    //   localStorage.setItem("act_ppl_people1", JSON.stringify(ppl_peoples));
    // }
    setCompanyname(data?.companies_list[0].email);
    setemail(!email);

  
    if (localStorage.getItem("act_ppl_people")&&leadid===parseInt(localStorage.getItem("lead_id"))) {
      setPPL_Peoples(JSON.parse(localStorage.getItem("act_ppl_people")));
    }
    if (localStorage.getItem("act_subject")&&leadid===parseInt(localStorage.getItem("lead_id"))) {
      setsubject(JSON.parse(localStorage.getItem("act_subject")));
    }
    if (localStorage.getItem("act_attname")&&leadid===parseInt(localStorage.getItem("lead_id"))) {
      setAttName(JSON.parse(localStorage.getItem("act_attname")));
    }
    if (localStorage.getItem("act_tempid")&&leadid===parseInt(localStorage.getItem("lead_id"))) {
      setTempid(JSON.parse(localStorage.getItem("act_tempid")));
    }
    if (localStorage.getItem("act_toemail")&&leadid===parseInt(localStorage.getItem("lead_id"))) {
      setToEmail(JSON.parse(localStorage.getItem("act_toemail")))
    }
    if (localStorage.getItem("act_fromemail")&&leadid===parseInt(localStorage.getItem("lead_id"))) {
      setCompanyname(JSON.parse(localStorage.getItem("act_fromemail")))
    }
    if (localStorage.getItem("act_emailcc")&&leadid===parseInt(localStorage.getItem("lead_id"))) {
      setcc(JSON.parse(localStorage.getItem("act_emailcc")))
    }
    if (localStorage.getItem("act_emailbcc")&&leadid===parseInt(localStorage.getItem("lead_id"))) {
      setbcc(JSON.parse(localStorage.getItem("act_emailbcc")))
    }
  };
  const col_sms = () => {
    setsms(!sms);
    if (localStorage.getItem("act_sms")) {
      setSmsMessage(JSON.parse(localStorage.getItem("act_sms")))
    }
    if (localStorage.getItem("act_smstemp")) {
      setTemplateid(JSON.parse(localStorage.getItem("act_smstemp")))
    }
    if (localStorage.getItem("act_smsto")) {
      SetSmsto(JSON.parse(localStorage.getItem("act_smsto")));
    }
    //setSmsMessage("");
  };

  const col_inventory = () => {
    setinventory(!inventory);
  };

  // const divRef = useRef(null);
  // ------------------ckeditor-------------
  const [cbm, setCBM] = useState("");

  useEffect(() => {
    // Parse the emailBody string into a DOM tree
    const parser = new DOMParser();
    const doc = parser.parseFromString(emailBody, 'text/html');

    // Find the <a> tags and update the class attribute
    const anchorTags = doc.querySelectorAll('a');
    anchorTags.forEach((anchor) => {
      // Remove the default class name, if any
      anchor.classList.remove('ck-link_selected');

      // Add the new class name to the <a> tag
      anchor.classList.add('new-class-name');
    });

    // Get the updated HTML content with modified class names
    const updatedEmailBody = doc.documentElement.outerHTML;

    // Set the updated HTML as the data for CKEditor
    setCBM(updatedEmailBody);

    // Log the updated emailBody
  }, [emailBody]);
  // ------------------ckeditor-------------


  useEffect(() => {
    // Check if 'notes' is not empty and find the first 'log_type' with value 3
    const logType3Note = notes?.find((res) => res.log_type === 3);
    if (logType3Note) {
      setSub(`Fw: ${logType3Note.log_subject}`);
    } else {
      setSub('');
    }
  }, [notes]);

  // forward email
  useEffect(() => {
    // Check if 'notes' is not empty and find the first 'log_type' with value 3
    const logType3Note = notes?.find((res) => res.log_type === 3);
    if (logType3Note) {
      setSubrpy(`Re: ${logType3Note.log_subject}`);
    } else {
      setSubrpy('');
    }
  }, [notes]);

  // forward email
  useEffect(() => {
    // Check if 'notes' is not empty and find the first 'log_type' with value 3
    const logType3Note = notes?.find((res) => res.log_type === 3);
    if (logType3Note) {
      setToEmailrpy(logType3Note.log_to);
    } else {
      setToEmailrpy('');
    }
  }, [notes]);

  // reply email recieved(to)
  useEffect(() => {
    // Check if 'notes' is not empty and find the first 'log_type' with value 3
    const logType3Note = notes?.find((res) => res.log_type === 5);
    if (logType3Note) {
      setToEmailrpyrec(logType3Note.log_to);
    } else {
      setToEmailrpyrec('');
    }
  }, [notes]);

  // reply email recieved(subject)
  useEffect(() => {
    // Check if 'notes' is not empty and find the first 'log_type' with value 3
    const logType3Note = notes?.find((res) => res.log_type === 5);
    if (logType3Note) {
      setSubrpyrec(`Re: ${logType3Note.log_subject}`);
    } else {
      setSubrpyrec('');
    }
  }, [notes]);

  //date and time format(logtype == 18,17)
  const formatDate = (logDate) => {
    const date = new Date(logDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const amOrPm = hours >= 12 ? 'PM' : 'AM';
    const formattedTime = `${hours % 12}:${minutes} ${amOrPm}`;
    const format = moment(logDate).format(org_date?.date_format_js);

    return `${format} ${formattedTime}`;
  };

  // Quill code for Send Email
  // -------------------------
  // const { quill, quillRef } = useQuill({
  //   modules: {
  //     toolbar: [
  //       [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
  //       [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  //       ['bold', 'italic', 'underline'],
  //       [{ 'list': 'ordered'}, { 'list': 'bullet' }],
  //       [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
  //       ['blockquote', 'code-block'],   
  //       ['undo', 'redo'],
  //       ['link', 'image', 'video'],
  //       [{ 'align': ['right', 'left'] }],
  //     ],
  //   },
  // });
  const modules = {
    toolbar: [
      [{ font: [] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ script: "sub" }, { script: "super" }],
      ["blockquote", "code-block"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image", "video"],
      ["clean"],
    ],
  };


  const [quil1, setQuill1] = useState("");
  const { quill, quillRef } = useQuill();

  // useEffect(() => {
  //   try {
  //     if (quill) {
  //       quill.clipboard.dangerouslyPasteHTML(ppl_peoples);
  //     }
  //   } catch (error) {
  //     console.error('Quill Initialization Error:', error);
  //   }
  // }, [ppl_peoples]);

  // useEffect(() => {
  //   if (quill) {
  //     const handleChange = () => {
  //       const content = quill.root.innerHTML;
  //       const parser = new DOMParser();
  //       const doc = parser.parseFromString(content, 'text/html');
  //       let anchorElement = doc.querySelectorAll('a');
  //       const anchorElements = doc.querySelectorAll('a');
  //       anchorElements.forEach((anchorElement) => {
  //         anchorElement.style.padding = '10px';
  //         anchorElement.style.borderRadius = '5px';
  //       });

  //     const modifiedContent = doc.body.innerHTML;
  //     setPPL_Peoples(modifiedContent);
  //     console.log(modifiedContent)
  //     localStorage.setItem("act_ppl_people1", JSON.stringify(modifiedContent));
  //     };
  //     quill.root.addEventListener('blur', handleChange);

  //     return () => {
  //       quill.root.removeEventListener('blur', handleChange);
  //     };
  //   }   
  // }, [quill]);
  // useEffect(() => {
  //   if (email) {
  //     setEmailClassName('timeline-right mb-3');
  //   } else {
  //     setTimeout(() => {
  //       setEmailClassName('timeline-right your-custom-class');
  //     }, 500);
  //   }
  // }, [email]);

  // useEffect(() => {
  //   if (quill) {
  //     localStorage.setItem("act_ppl_people1", JSON.stringify(quill));
  //   }
  // }, [quill]);

  // useEffect(() => {
  //   if (quil1) {
  //     localStorage.setItem("act_ppl_people1", JSON.stringify(quil1));
  //   }
  // }, [quil1]);




  // Forward Email - Quill editor
  const [ppl_peoplesfwd, setPPL_Peoplesfwd] = useState([]);

  useEffect(() => {
    if (notes) {
      const logType3Note = notes.find((res) => res.log_type === 3);
      if (logType3Note) {
        setPPL_Peoplesfwd(logType3Note);
      } else {
        setPPL_Peoplesfwd([]);
      }
    }
  }, [notes]);

  const [ppl_peoplesafwd, setPPL_Peoplesafwd] = useState([]);


  // const { quill: quill2, quillRef: quillRef2 } = useQuill();
  const [quil2, setQuill2] = useState("");

  useEffect(() => {
    if (ppl_peoplesfwd && ppl_people) {
      const a =
        "<p><br/><br/><br/>" +
        ppl_people.email_signature +
        "</p><hr/><p><b>From: </b>" +
        ppl_peoplesfwd.log_from +
        "<br/><b>Sent: </b>" +
        moment(ppl_peoplesfwd.log_date).format(
          "dddd, MMMM DD, YYYY h:mm:ss A"
        ) +
        "<br/><b>To: </b>" +
        ppl_peoplesfwd.log_to +
        "<br/><b>Subject: </b>" +
        ppl_peoplesfwd.log_subject +
        "</p><br/>" +
        ppl_peoplesfwd.log_message;

      // Assuming quill2 is a reference to a Quill instance
      setQuill2(a)
    }
  }, [ppl_peoplesfwd, ppl_people]);

  // React.useEffect(() => {
  //   if (quill2) {
  //     quill2.on('text-change', (delta, oldDelta, source) => {
  //       const content = quill2.root.innerHTML;
  //       setPPL_Peoplesafwd(content);
  //     });
  //   }
  // }, [quill2]);

  // Reply Email - Quill editor
  const [ppl_peoplesrpy, setPPL_Peoplesrpy] = useState([]);

  useEffect(() => {
    if (notes) {
      const logType3Note = notes.find((res) => res.log_type === 3);
      if (logType3Note) {
        setPPL_Peoplesrpy(logType3Note);
      } else {
        setPPL_Peoplesrpy([]);
      }
    }
  }, [notes]);

  const [ppl_peoplesarpy, setPPL_Peoplesarpy] = useState([]);

  const [quil3, setQuill3] = useState("");

  useEffect(() => {
    if (ppl_peoplesrpy && ppl_people) {
      const a =
        "<p><br/><br/><br/>" +
        ppl_people.email_signature +
        "</p><hr/><p><b>From: </b>" +
        ppl_peoplesrpy.log_from +
        "<br/><b>Sent: </b>" +
        moment(ppl_peoplesrpy.log_date).format(
          "dddd, MMMM DD, YYYY h:mm:ss A"
        ) +
        "<br/><b>To: </b>" +
        ppl_peoplesrpy.log_to +
        "<br/><b>Subject: </b>" +
        ppl_peoplesrpy.log_subject +
        "</p><br/>" +
        ppl_peoplesrpy.log_message;

      // Assuming quill2 is a reference to a Quill instance
      setQuill3(a)
      // quil3.clipboard.dangerouslyPasteHTML(a);
    }
  }, [ppl_peoplesrpy, ppl_people]);

  // Email Recieved Quill
  const [ppl_peoplesrpyrec, setPPL_Peoplesrpyrec] = useState([]);

  useEffect(() => {
    if (notes) {
      const logType3Note = notes.find((res) => res.log_type === 5);
      if (logType3Note) {
        setPPL_Peoplesrpyrec(logType3Note);
      } else {
        setPPL_Peoplesrpyrec([]);
      }
    }
  }, [notes]);

  // const [ppl_peoplesarpyrec, setPPL_Peoplesarpyrec] = useState([]);
  useEffect(() => {
    if (email) {
      setEmailClassName('timeline-right mb-3');
    } else {
      setTimeout(() => {
        setEmailClassName('timeline-right your-custom-class');
      }, 500);
    }
  }, [email]);

  useEffect(() => {
    if (sms) {
      setSmsClassName('timeline-right mb-3');
    } else {
      setTimeout(() => {
        setSmsClassName('timeline-right your-custom-class');
      }, 500);
    }
  }, [sms]);

  useEffect(() => {
    if (note) {
      setNoteClassName('timeline-right mb-3');
    } else {
      setTimeout(() => {
        setNoteClassName('timeline-right your-custom-class');
      }, 500);
    }
  }, [note]);

  // const { quill: quill4, quillRef: quillRef4 } = useQuill();
  const [quil4, setQuill4] = useState("");
  useEffect(() => {
    if (ppl_peoplesrpyrec && ppl_people) {
      const a =
        "<p><br/><br/><br/>" +
        ppl_people.email_signature +
        "</p><hr/><p><b>From: </b>" +
        ppl_peoplesrpyrec.log_from +
        "<br/><b>Sent: </b>" +
        moment(ppl_peoplesrpyrec.log_date).format(
          "dddd, MMMM DD, YYYY h:mm:ss A"
        ) +
        "<br/><b>To: </b>" +
        ppl_peoplesrpyrec.log_to +
        "<br/><b>Subject: </b>" +
        ppl_peoplesrpyrec.log_subject +
        "</p><br/>" +
        ppl_peoplesrpyrec.log_message;

      // Assuming quill2 is a reference to a Quill instance
      setQuill4(a)
    }
  }, [ppl_peoplesrpyrec, ppl_people]);

  // CKeditor Notes
  const [elementNotes, setElementNotes] = useState();
  const { editor: editor1 } = useCKEditor( {
    element: elementNotes,
    config: {
      extraPlugins: 'image2',
      uiColor:'#912a4e2e'
    },
} );
const [notesData,setNotesData]=useState("")
useEffect(() => {
  if (editor1 && editedLogSubject) {
      editor1.setData(editedLogSubject);
  }
}, [editor1, editedLogSubject]);

useEffect(() => {
  console.log(editor1,"ckCheck5")
  if (editor1) {
      editor1.on('change', () => {
        const editorNotesData = editor1.getData();
        localStorage.setItem("lead_id", JSON.stringify(data?.contact[0]?.lead_id))
        localStorage.setItem("act_notes1", JSON.stringify(editorNotesData));
        setNotesData(editorNotesData)
      });
  }
}, [editor1]);

// CKeditor Notes Edit
const [logMessageEdit,setLogMessageEdit]=useState("")
const [elementNotesEdit, setElementNotesEdit] = useState();
const { editor: editor2 } = useCKEditor( {
  element: elementNotesEdit,
  config: {
    extraPlugins: 'image2',
    uiColor:'#912a4e2e'
  },
} );
  useEffect(() => {
    console.log(logMessageEdit,"ckNotes")
  if (editor2&&logMessageEdit) {
    console.log(logMessageEdit,"ckNotes")
    editor2.setData(logMessageEdit);
  }
  }, [editor2,logMessageEdit]);

useEffect(() => {
console.log(editor2,"ckCheck5")
if (editor2) {
  editor2.on('blur', () => {
    const editorNotesEditData = editor2.getData();
    localStorage.setItem("act_notes1", JSON.stringify(editorNotesEditData));
  });
  editor2.on('change', () => {
      const editorNotesEditData = editor2.getData();
      console.log(editorNotesEditData,"ckNotesedit")
      setEditedLogSubject(editorNotesEditData)
    });
}
}, [editor2]);

  // CKeditor Email
  const [element, setElement] = useState();
  const { editor: editor3 } = useCKEditor( {
    element: element,
    config: {
      allowedContent: true, 
      extraAllowedContent: 'a',
      extraPlugins: 'image2',
      uiColor:'#912a4e2e'
    }
} );

const [emailData,setEmailData]=useState("")
useEffect(() => {
  if (editor3 && ppl_peoples) {
    editor3.setData(ppl_peoples);
  }
}, [editor3, ppl_peoples]);

useEffect(() => {
  console.log(editor3,"ckCheck5")
  if (editor3) {
    editor3.on('blur', () => {
        const editorData = editor3.getData();
        setPPL_Peoples(editorData)
        localStorage.setItem("act_ppl_people", JSON.stringify(editorData));
        console.log(editorData,"ckCheck5")
      });
      editor3.on('change', () => {
        const editorData = editor3.getData();
        localStorage.setItem("lead_id", JSON.stringify(data?.contact[0]?.lead_id))
        localStorage.setItem("act_ppl_people", JSON.stringify(editorData))
        setEmailData(editorData)
      });
  }
}, [editor3]);
  

  console.log(ppl_peoples,"ppl")
  console.log(ppl_peoples,"ckCheck")
  return (
    <div className="live-preview">
      <DeleteModal
        show={deleteModal}
        orderId={selectedOrderId}
        onDeleteClick={handleDeleteOrder}
        onCloseClick={() => setDeleteModal(false)}
      />
      <ToastContainer closeButton={false} limit={1} theme="light" />
      <Modal
        id="showModal"
        className="modal-dialog-edit"
        isOpen={modalerr}
        centered
      >
        <ModalBody className="py-2 px-3">
          <div className="mt-2 text-center">
            <i className=" bx bx-x-circle" style={{ fontSize: "80px", color: "#F27474" }}></i>
            <div className="   pt-2 fs-15 mx-4 mx-sm-5">
              <h3>Error</h3>
              <p className="text-muted mx-4 mb-0" style={{ marginTop: "20px" }}>
                {errormsg}
              </p>
            </div>
          </div>
          <div className="d-flex gap-2 justify-content-center mt-4 mb-2">
            <button
              type="button"
              className="btn w-sm btn-light"
              data-bs-dismiss="modal" onClick={() => setModalErr(false)} style={{ backgroundColor: "#8CD4F5", color: "white", fontWeight: "450", border: "none", fontSize: "17px" }}>
              OK
            </button>
          </div>
        </ModalBody>
      </Modal>
      {!isLoader &&
        <div className="mb-3 d-flex justify-content-between">
          <div className="hstack gap-3">
            <Button
              color="light"
              onClick={() => col_note()}
              style={{ cursor: "pointer", display: "flex", alignItems: "center", borderRadius: "18px", backgroundColor: "#912a4e", color: "#fff" }}
            >
              <i className="bx bxs-pencil" style={{ marginRight: "8px", color: "#fff", fontSize: "17px" }}></i> Note
            </Button>
            <Button
              color="light"
              onClick={col_email}
              style={{ cursor: "pointer", display: "flex", alignItems: "center", borderRadius: "18px", backgroundColor: "#912a4e", color: "#fff" }}
            >
              <i className="bx bxs-envelope" style={{ marginRight: "8px", color: "#fff", fontSize: "17px" }}></i> Email
            </Button>

            <Button
              color="light"
              onClick={col_sms}
              style={{ cursor: "pointer", display: "flex", alignItems: "center", borderRadius: "18px", backgroundColor: "#912a4e", color: "#fff" }}
            >

              <i className="bx bx-message-square-dots" style={{ marginRight: "8px", color: "#fff", fontSize: "17px" }}></i> SMS
            </Button>
          </div>
          <div className="text-end">
            <select
              className="form-select text-end"
              aria-label="Default select example"
              value={selectedType}
              onChange={handleSelectChange} style={{ border: "none", backgroundColor: "#f3f6f9", width: "136px" }}
            >
              <option className="text-start" value="allactivities">All Activities</option>
              <option className="text-start" value="notes"> <i className="bx bx-menu" /> Notes</option>
              <option className="text-start" value="email"> <i className="bx bx-menu" /> Email</option>
              <option className="text-start" value="sms"> <i className="bx bx-menu" /> SMS</option>
            </select>
          </div>

        </div>}

      {isLoader && <><div
        style={{
          position: 'absolute',
          // top: 0,
          left: "10px",
          width: '100%',
          height: '100%',
          background: 'rgba(255, 255, 255, 0.8)',
          // display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
        }}
      >
        <Loader />
      </div></>}
      <div className="timeline-2">
        <div className="timeline-continue">
          <Row className={noteClassName}>
            <Col xs={12}>
              <Collapse
                isOpen={note}
                id="collapseWithicon"
              // className="timeline-date"
              >
                <div style={{ marginLeft: "0px", marginTop: "17px", backgroundColor: "#912a4e", display: "inline-flex", alignItems: "center", justifyContent: "center", width: "33px", height: "30px", borderRadius: "50%", lineHeight: "0", zIndex: "999", position: "absolute" }}>
                  <i className="bx bxs-pencil timelineicon" style={{ color: "white", fontSize: "14px" }}></i>
                </div>
                {notes && notes.length > 0 && (
                <div className="card mb-0" style={{ marginLeft: "50px" }} key={notes[0].id}>
                  {/* <CardHeader className="align-items-center d-flex">
                      <h4 className="card-title mb-0">
                        Notes
                      </h4>
                    </CardHeader> */}
                  <CardBody>
                    <Form method="post">
                      <div ref={setElementNotes} />
                    </Form>
                    {notes && notes.length > 0 && (
                      <div key={notes[0].id}>
                        {attch.length > 0 ? (
                          <div className="hstack gap-4 justify-content-start mt-3 " style={{ flexWrap: 'wrap' }}>
                            {attch.map((res, index) => (
                              <div key={res.key}>
                                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                                  {res && (
                                    <p key={index}>
                                      <a href={api.api.API_URL + res.path.substring(res.path.lastIndexOf("public/") + 2)} target="_blank">
                                        {res.name}
                                      </a>
                                    </p>
                                  )}
                                  <a
                                    className="ri-close-circle-fill"
                                    onClick={() => removenotesattachment(res, index)}
                                  ></a>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p></p>
                        )}
                      </div>
                    )}

                    <div className="hstack gap-3 justify-content-end mt-3">
                      <i
                        className="bx bx-paperclip fs-3"
                        onClick={() => setShowModal(true)}
                      ></i>
                      <i
                        className="bx bx-x-circle fs-3"
                        onClick={() => col_note()}
                      ></i>
                      <button
                        type="submit"
                        className="btn btn-brown"
                        onClick={handleAddNotes}
                      >
                        {" "}
                        Done <i className="bx bx-check fs-5" style={{ verticalAlign: "middle" }}></i>
                      </button>
                      <div>
                        <Modal
                          id="showModal"
                          className="modal-dialog modal-lg"
                          isOpen={showModal}
                          toggle={() => setShowModal(false)}
                        >
                          <ModalBody className="">
                            <div className="mb-5">
                              <Label
                                htmlFor="readonlyInput"
                                className="form-label"
                              >
                                {" "}
                                Upload Your File
                              </Label>
                              <div>
                                <div
                                  className="dropzone dz-clickable"
                                  onClick={handleClick}
                                  onDrop={handleDrop}
                                  onDragOver={handleDragOver}
                                >
                                  <div className="dz-message needsclick">
                                    <div className="mb-3">
                                      <i className="display-4 text-muted ri-upload-cloud-2-fill" />
                                    </div>
                                    <h4>
                                      Choose File or Drag it here...
                                    </h4>
                                    {file ? (
                                      <p style={{ fontSize: "12px" }}>{file.name}</p>
                                    ) : (
                                      <p style={{ fontSize: "12px" }}>No file choosen</p>
                                    )}

                                  </div>
                                </div>
                                <input
                                  type="file"
                                  onChange={handleFileChange}
                                  ref={fileInputRef}
                                  style={{ display: "none" }}
                                />
                              </div>
                            </div>
                            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
                              <Button className="btn btn-success" onClick={fileuploadnotes} disabled={!isNote}>
                                Upload
                              </Button>
                              <div>
                                <Button className="btn btn-light" onClick={() => { setShowModal(false); selectedFile(null); }}>
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          </ModalBody>
                        </Modal>
                      </div>
                    </div>

                  </CardBody>
                </div>
)}
              </Collapse>
            </Col>
          </Row>
          <Row className={smsClassName} id="smsClass">
            <Col xs={12}>
              <Collapse
                isOpen={sms}
                id="collapseWithicon2"
              // className="timeline-date"
              >
                <div style={{ marginLeft: "0px", marginTop: "17px", backgroundColor: "#912a4e", display: "inline-flex", alignItems: "center", justifyContent: "center", width: "33px", height: "30px", borderRadius: "50%", lineHeight: "0", zIndex: "999", position: "absolute" }}>
                  <i className="bx bx-message-square-dots" style={{ color: "white", fontSize: "14px" }}></i>
                </div>
                <div className="card mb-0" style={{ marginLeft: "50px" }}>
                  <CardBody>
                    <Row>
                      <Col lg={6}>
                        <Label>SMS From</Label>
                        <Input
                          disabled
                          // placeholder="92394324"
                          value={smsfrom}
                          style={{ backgroundColor: "white" }}
                        ></Input>
                      </Col>
                      <Col lg={6}>
                        <Label>SMS To</Label>
                        <div className="col-md-6">
                          <select
                            id="act_sms_send_to"
                            name="sms_to"
                            className="form-control"
                            value={smsto}
                            onChange={(e) => {
                              SetSmsto(e.target.value)
                              localStorage.setItem("act_smsto", JSON.stringify(e.target.value))
                            }}
                          >
                            <option>SMS To</option>
                            {sms_contacts?.map((contact) => (
                              <option
                                key={contact.detail}
                                value={contact.detail}
                              >
                                {contact.name} - {contact.detail}
                              </option>
                            ))}
                          </select>
                        </div>
                      </Col>
                      <Col lg={6} style={{ marginTop: "10px" }}>
                        <select
                          className="form-control"
                          value={templateid}
                          onChange={(event) => chooseTemplate(event)}
                        >
                          <option>Choose a Template</option>
                          {smstemplates?.map((template) => (
                            <option key={template.id} value={template.id}>
                              {template.sms_template_name}
                            </option>
                          ))}
                        </select>
                      </Col>
                      <Col lg={12} style={{ marginTop: "10px" }}>
                        <div className="form-group">
                          <textarea
                            id="sms_message"
                            name="sms_message"
                            rows="3"
                            cols="3"
                            className="form-control"
                            value={smsMessage}
                            onChange={(event) => countChar(event)}
                          ></textarea>

                          <span className="pull-left">
                            Cost = <span id="sms_costspan">{smsCredits}</span>{" "}
                            credit
                          </span>
                          <span
                            className="pull-right"
                            style={{
                              float: "right"
                              // position: "absolute",
                              // top: 0,
                              // right: "0.7vw",
                              // marginTop: "76px"
                            }}
                          >
                            <i>(160 characters will cost 1 credit)</i>{" "}
                            <span id="sms_totalWords">{smsTotalWords}</span>{" "}
                            characters
                          </span>


                          <input
                            type="hidden"
                            name="sms_total_credits"
                            id="sms_total_credits"
                            value={smsCredits}
                          />
                        </div>
                      </Col>
                      <div className="hstack gap-3 justify-content-end mt-3">
                        {/* <i className="bx bx-paperclip fs-3"></i> */}
                        <i className="bx bx-x-circle fs-3" onClick={col_sms}
                        ></i>
                        <button
                          type="submit"
                          className="btn btn-brown"
                          onClick={() => sendsms()}
                        >
                          Send <i className="bx bxl-telegram"></i>
                        </button>
                      </div>
                    </Row>
                  </CardBody>
                </div>
              </Collapse>
            </Col>
          </Row>
          <Row className={emailClassName}>
            <Col xs={12}>
              <Collapse
                isOpen={email}
                id="collapseWithicon2"
              // className="timeline-date"
              >
                <div style={{ marginLeft: "0px", marginTop: "17px", backgroundColor: "#912a4e", display: "inline-flex", alignItems: "center", justifyContent: "center", width: "33px", height: "30px", borderRadius: "50%", lineHeight: "0", zIndex: "999", position: "absolute" }}>
                  <i className="bx bxs-envelope timelineicon" style={{ color: "white", fontSize: "14px" }}></i>
                </div>
                <div className="card mb-0" style={{ marginLeft: "50px" }}>
                  <CardBody>
                    <Row>
                      <Col lg={6}>
                        <div className="input-group">
                          <span
                            className="input-group-text"
                            id="inputGroup-sizing-default"
                          >
                            From
                          </span>
                          <select
                            id="act_email_from"
                            name="from_email"
                            className="form-control form-control-lg"
                            style={{ fontSize: "14px" }}
                            value={companyname}
                            onChange={(e) => {
                              setCompanyname(e.target.value)
                              localStorage.setItem("act_fromemail", JSON.stringify(e.target.value));
                            }
                            }
                          >
                            {removal?.map((company) => (
                              <option
                                key={company.id}
                                value={company.email}
                                data-name={company.contact_name}
                              >
                                {company.email}
                              </option>
                            ))}
                          </select>
                        </div>
                      </Col>
                      <Col lg={6}>
                        <div className="input-group">
                          <span
                            className="input-group-text"
                            id="inputGroup-sizing-default"
                          >
                            To
                          </span>
                          <Input
                            type="text"
                            className="form-control"
                            aria-label="Sizing example input"
                            aria-describedby="inputGroup-sizing-default"
                            value={toemail}
                            onChange={(e) => {
                              setToEmail(e.target.value)
                              localStorage.setItem("act_toemail", JSON.stringify(e.target.value));
                            }
                            }
                          />
                        </div>
                      </Col>
                    </Row>
                    <div className="d-flex gap-2 flex-wrap mb-0 mt-3">
                      <Button
                        onClick={t_coll3}
                        color="primary"
                        style={{ cursor: "pointer" }}
                      >
                        Add CC{" "}
                      </Button>
                      <Button
                        onClick={t_coll4}
                        color="primary"
                        style={{ cursor: "pointer" }}
                      >
                        {" "}
                        Add BCC{" "}
                      </Button>
                    </div>
                    <Row className="mb-3 mt-3">
                      <Col lg={6}>
                        <Collapse isOpen={coll3} id="multiCollapseExample1">
                          <div className="input-group">
                            <span
                              className="input-group-text"
                              id="inputGroup-sizing-default"
                            >
                              CC
                            </span>
                            <Input
                              type="text"
                              className="form-control"
                              aria-label="Sizing example input"
                              aria-describedby="inputGroup-sizing-default"
                              value={cc}
                              onChange={(e) => {
                                setcc(e.target.value)
                                localStorage.setItem("act_emailcc", JSON.stringify(e.target.value))
                              }
                              }
                            />
                          </div>
                        </Collapse>
                      </Col>
                      <Col lg={6}>
                        <Collapse isOpen={coll4} id="multiCollapseExample2">
                          <div className="input-group">
                            <span
                              className="input-group-text"
                              id="inputGroup-sizing-default"
                            >
                              BCC
                            </span>
                            <Input
                              type="text"
                              className="form-control"
                              aria-label="Sizing example input"
                              aria-describedby="inputGroup-sizing-default"
                              value={bcc}
                              onChange={(e) => {
                                setbcc(e.target.value)
                                localStorage.setItem("act_emailbcc", JSON.stringify(e.target.value))
                              }
                              }
                            />
                          </div>
                        </Collapse>
                      </Col>
                    </Row>
                    <Row className="mb-3">
                      <Col lg={6}>
                        {/* <Input value={subject} /> */}
                        <Input
                          type="text"
                          className="form-control"
                          placeholder="Subject"
                          value={subject}
                          onChange={(e) => {
                            setsubject(e.target.value)
                            localStorage.setItem("act_subject", JSON.stringify(e.target.value));
                          }
                          }
                        />
                      </Col>
                      <Col lg={6}>
                        <select
                          className="form-select"
                          aria-label="Default select example"
                          onChange={handleTemplateChange}
                          value={tempid}
                        >
                          <option defaultValue="1">Choose a Template</option>
                          {emailtemplates &&
                            emailtemplates.map((res) => (
                              <option key={res.id} value={res.id}>
                                {res.email_template_name}
                              </option>
                            ))}
                        </select>
                      </Col>
                    </Row>

                    <Form method="post" className="custom_ck">
                    {console.log(ppl_peoples,"ppl5")}
                    <div ref={setElement} />
                    </Form>
      {/* <button onClick={pasteContent}>Paste Content</button> */}
                    {attname.length > 0 ?
                      <div className="hstack gap-4 justify-content-start mt-0 " style={{ flexWrap: 'wrap' }}>
                        {attname.map((res, index) => (
                          <div key={res.key}>
                            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                              {res && (
                                <p key={index}>
                                  <a href={api.api.API_URL + res.path.substring(res.path.lastIndexOf("public/") + 2)} target="_blank">
                                    {res.name}
                                  </a>
                                </p>
                              )}
                              <a
                                className="ri-close-circle-fill"
                                onClick={() => removeemailattachment(res, index)}
                              ></a>
                              {/* <a className="ri-close-circle-fill" onClick={() => console.log('Clicked!')}></a> */}

                            </div>
                          </div>
                        ))}
                      </div>
                      : <p></p>}
                    <div className="hstack gap-3 justify-content-end mt-3">
                      <i
                        className="bx bx-paperclip fs-3"
                        onClick={() => setShowModalemail(true)}
                      ></i>
                      <i className="bx bx-x-circle fs-3" onClick={col_email}
                      ></i>
                      {/* Send Email */}
                      <button
                        type="submit"
                        className="btn btn-brown"
                        onClick={sendEmail}
                      >
                        Send <i className="bx bxl-telegram"></i>
                      </button>
                      <div>
                        <Modal
                          id="showModal"
                          className="modal-dialog modal-lg"
                          isOpen={showmodelemail}
                          toggle={() => setShowModalemail(false)}
                        >
                          <ModalBody className="">
                            <div className="mb-5">
                              <Label
                                htmlFor="readonlyInput"
                                className="form-label"
                              >
                                {" "}
                                Upload Your File
                              </Label>
                              <div>
                                <div
                                  className="dropzone dz-clickable"
                                  onClick={handleClicks}
                                  onDrop={handleDropemail}
                                  onDragOver={handleDragOveremail}
                                >
                                  <div className="dz-message needsclick">
                                    <div className="mb-3">
                                      <i className="display-4 text-muted ri-upload-cloud-2-fill" />
                                    </div>
                                    <h4>
                                      Choose File or Drag it here...
                                    </h4>
                                    {fileemail ? (
                                      <p style={{ fontSize: "12px" }}>{fileemail.name}</p>
                                    ) : (
                                      <p style={{ fontSize: "12px" }}>No file choosen</p>
                                    )}

                                  </div>
                                </div>
                                <input
                                  type="file"
                                  onChange={handleFileChangesemail}
                                  ref={fileInputRefemail}
                                  style={{ display: "none" }}
                                />
                              </div>
                            </div>
                            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
                              <Button className="btn btn-success" onClick={fileuploademail} disabled={!isEmail}>
                                Upload
                              </Button>
                              <div>
                                <Button className="btn btn-light" onClick={() => { setShowModalemail(false); }}>
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          </ModalBody>
                        </Modal>
                      </div>
                    </div>
                  </CardBody>
                </div>
              </Collapse>
            </Col>
          </Row>
          {notes &&
            notes.map((res) => {
              const htmlContent = res.log_message;
              const tempElement = document.createElement('div');
              tempElement.innerHTML = htmlContent;
              const anchorElements = tempElement.querySelectorAll('a');
              anchorElements.forEach(anchorElement => {
                anchorElement.style.padding = '5px';
                anchorElement.style.margin = '1px';
                anchorElement.style.borderRadius = '2px';
              });
              const modifiedHtmlContent = tempElement.innerHTML;
              //Moment time diff
              const australianTime = moment.tz(res.log_date, 'Australia/Sydney');
              const timeFromNow = moment().diff(australianTime, 'seconds');
              const formattedTimeFromNow = moment.duration(timeFromNow, 'seconds').humanize();

              return (
                <>
                  {res.log_type === 7 && (
                    <AccordionItem key={res.id}>
                      <div className="timeline-right mb-3">
                        <Row className="timeline-right mb-3">
                          <Col xs={12}>
                            <div className="timeline-row">
                              <div
                                style={{
                                  marginLeft: "0px",
                                  backgroundColor: "#912a4e",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  width: "33px",
                                  height: "30px",
                                  borderRadius: "50%",
                                  lineHeight: "0",
                                  zIndex: "999",
                                  position: "absolute",
                                }}
                              >
                                <i
                                  className="bx bxs-pencil timelineicon"
                                  style={{ color: "white", fontSize: "14px" }}
                                ></i>
                              </div>
                              <div className="card mb-0" style={{ marginLeft: "50px" }}>
                                <CardHeader className="align-items-center d-flex justify-content-between">
                                  <div>
                                    <h4 className="card-title mb-0">Notes</h4>
                                  </div>
                                  <div>
                                    {res.pinned === 0 ? (
                                      <i
                                        className="bx bx-pin cursor-pointer"
                                        style={{ fontSize: "20px" }}
                                        title="Pin to Top"
                                        onClick={() => {
                                          chngimg(res.id, res.job_id, res.lead_id);
                                        }}
                                      ></i>
                                    ) : (
                                      <i
                                        className="bx bxs-pin cursor-pointer"
                                        style={{ fontSize: "20px" }}
                                        title="Unpin"
                                        onClick={() => {
                                          chngimg(res.id, res.job_id, res.lead_id);
                                        }}
                                      ></i>
                                    )}
                                    <i
                                      className={`bx ${isCollapsed[res.id] ? "bx-chevron-up" : "bx-chevron-down"} cursor-pointer`}
                                      style={{ fontSize: "23px" }}
                                      onClick={() => toggleCollapse(res.id)}
                                    ></i>
                                  </div>
                                </CardHeader>
                                <Collapse isOpen={!isCollapsed[res.id]} className="accordion-collapse">
                                  <CardBody>
                                    {res.id !== edit_notes && (
                                      <div className="pb-3">
                                        <p dangerouslySetInnerHTML={{ __html: res.log_message }}></p>
                                        <br />
                                        {res?.attachments?.map((attachment, index) => (
                                          <p key={index}>
                                            <a href={api.api.API_URL + attachment.attachment_content.substring(attachment.attachment_content.lastIndexOf("public/") + 7)} target="_blank">
                                              {attachment.attachment_type}
                                            </a>
                                          </p>
                                        ))}
                                        <div><i className="mt-4 text-muted">
                                          Note Written {moment(res.log_date).fromNow()} ago by {res.user_firstname} {res.user_lastname} On {formatDate(res.log_date)} {res.notes_attachment}
                                        </i>
                                        </div>
                                        <Button className="btn btn-brown" onClick={() => t_editnotes(res.id)}>
                                          Edit &nbsp;
                                          <i className="bx bx-pencil fs-5" style={{ verticalAlign: "middle" }}></i>
                                        </Button>
                                      </div>
                                    )}
                                    {res.id === edit_notes && (
                                      <div>
                                        <Form method="post">
                                          {/* <Trumbowyg id='react-trumbowyg_notes_edit'
                                              buttons={
                                                [
                                                  ['viewHTML'],
                                                  ['formatting'],
                                                  'btnGrp-semantic',
                                                  ['link'],
                                                  ['insertImage'],
                                                  'btnGrp-justify',
                                                  'btnGrp-lists',
                                                  ['table'],
                                                  ['fullscreen']
                                                ]
                                              }
                                              data={res.log_message}
                                              placeholder='Type your text!'
                                              onBlur={(event) => {
                                                const updatedLogSubject = event.target.innerHTML
                                                localStorage.setItem("act_notes1", JSON.stringify(updatedLogSubject));
                                                setEditedLogSubject(updatedLogSubject)
                                              }}
                                          /> */}
                                          <div ref={setElementNotesEdit} />
                                        </Form>
                                        {attchedit.length > 0 ?
                                          <div className="hstack gap-4 justify-content-start mt-3 " style={{ flexWrap: 'wrap' }}>
                                            {attchedit.map((res, index) => (
                                              <div key={res.key}>
                                                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                                                  {res && (
                                                    <p key={index}>
                                                      {/* <a href={api.api.API_URL + res.path.substring(res.path.lastIndexOf("public/") + 2)} target="_blank">
                                                        {res.name}
                                                      </a> */}
                                                      <a href={api.api.API_URL + (res.attachment_content ? res.attachment_content.substring(res.attachment_content.lastIndexOf("public/") + 7) : res.path.substring(res.path.lastIndexOf("public/") + 2))} target="_blank">
                                                        {res.attachment_type || res.name}
                                                      </a>
                                                    </p>
                                                  )}
                                                  <a
                                                    className="ri-close-circle-fill"
                                                    onClick={() => removenoteseditattachment(res, index)}
                                                  ></a>
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                          : <p></p>}
                                        <div className="hstack gap-3 justify-content-end mt-3">
                                          <i
                                            className="bx bx-paperclip fs-3"
                                            onClick={() => setShowModalEdit(true)}
                                          ></i>
                                          <i
                                            className="bx bx-trash fs-3 cursor-pointer"
                                            onClick={() => destroynotes(res.id)}
                                          ></i>
                                          <button
                                            type="submit"
                                            className="btn btn-light"
                                            onClick={() => t_editnotes()}
                                          >
                                            Cancel
                                          </button>
                                          <button
                                            type="button"
                                            className="btn btn-brown"
                                            onClick={() => updateedit(editedLogSubject, res.id)}
                                          >
                                            Update{" "}
                                            <i className="bx bx-check fs-5" style={{ verticalAlign: "middle" }}></i>
                                          </button>
                                          <div>
                                            <Modal
                                              id="showModal"
                                              className="modal-dialog modal-lg"
                                              isOpen={showmodaledit}
                                              toggle={() => setShowModalEdit(false)}
                                            >
                                              <ModalBody className="">
                                                <div className="mb-5">
                                                  <Label
                                                    htmlFor="readonlyInput"
                                                    className="form-label"
                                                  >
                                                    {" "}
                                                    Upload Your File
                                                  </Label>
                                                  <div>
                                                    <div
                                                      className="dropzone dz-clickable"
                                                      onClick={handleClickEdit}
                                                      onDrop={handleDropEdit}
                                                      onDragOver={handleDragOverEdit}
                                                    >
                                                      <div className="dz-message needsclick">
                                                        <div className="mb-3">
                                                          <i className="display-4 text-muted ri-upload-cloud-2-fill" />
                                                        </div>
                                                        <h4>
                                                          Choose File or Drag it here...
                                                        </h4>
                                                        {fileEdit ? (
                                                          <p style={{ fontSize: "12px" }}>{fileEdit.name}</p>
                                                        ) : (
                                                          <p style={{ fontSize: "12px" }}>No file choosen</p>
                                                        )}

                                                      </div>
                                                    </div>
                                                    <input
                                                      type="file"
                                                      onChange={handleFileChangeEdit}
                                                      ref={fileInputRefEdit}
                                                      style={{ display: "none" }}
                                                    />
                                                  </div>
                                                </div>
                                                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
                                                  <Button className="btn btn-success" onClick={fileuploadeditnotes} disabled={!isNoteEdit}>
                                                    Upload
                                                  </Button>
                                                  <div>
                                                    <Button className="btn btn-light" onClick={() => { setShowModalEdit(false); selectedFileEdit(null); }}>
                                                      Cancel
                                                    </Button>
                                                  </div>
                                                </div>
                                              </ModalBody>
                                            </Modal>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </CardBody>
                                </Collapse>
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </AccordionItem>
                  )}


                  {res.log_type === 8 && (
                    <Row className={setSmsClassName} id="smsclass" key={res.id}>
                      <Col xs={12}>
                        <div className="timeline-row">
                          {/* <Collapse
                          isOpen={sms}
                          id="collapseWithicon2"
                          className="timeline-date"
                        > */}
                          <div style={{ marginLeft: "0px", backgroundColor: "#912a4e", display: "inline-flex", alignItems: "center", justifyContent: "center", width: "33px", height: "30px", borderRadius: "50%", lineHeight: "0", zIndex: "999", position: "absolute" }}>
                            <i className="bx bx-message-square-dots timelineicon" style={{ color: "white", fontSize: "17px" }}></i>
                          </div>
                          <div className="card mb-0" style={{ marginLeft: "50px" }}>
                            <CardBody>
                              <Row>
                                <Col lg={6}>
                                  <h4>SMS</h4>
                                </Col>
                              </Row>
                              <Row>
                                <Col className="pl-1">
                                  <p>From: {res.log_from}</p>
                                  <p>To: {res.log_to}</p>
                                  <p className="pt-3">{res.log_message}</p>
                                  <span className="pt-5 text-muted">
                                    {/* Email Sent {moment(res.log_date).fromNow()} by {res.user_firstname} {res.user_lastname} on {moment(res.log_date).format("YYYY-MM-DD hh:mm A")} */}
                                    SMS sent {moment(res.log_date).fromNow()} ago by {res.user_firstname} {res.user_lastname} on {formatDate(res.log_date)}
                                  </span>
                                </Col>
                              </Row>
                            </CardBody>
                          </div>
                        </div>
                        {/* </Collapse> */}
                      </Col>
                    </Row>
                  )}
                  {res.log_type == 3 && (
                    <AccordionItem key={res.id}>
                      <div className="timeline-right mb-3">
                        <Row className="timeline-right mb-3">
                          <Col xs={12}>
                            <div className="timeline-row">
                              {/* <Collapse
                                isOpen={email}
                                id="collapseWithicon2"
                                className="timeline-date"
                              > */}
                              <div style={{ marginLeft: "0px", backgroundColor: "#912a4e", display: "inline-flex", alignItems: "center", justifyContent: "center", width: "33px", height: "30px", borderRadius: "50%", lineHeight: "0", zIndex: "999", position: "absolute" }}>
                                <i className="bx bxs-envelope timelineicon" style={{ color: "white", fontSize: "14px" }}></i>
                              </div>
                              <div className="card mb-0" style={{ marginLeft: "50px" }}>
                                <CardHeader className="align-items-center d-flex justify-content-between">
                                  <div>
                                    <h5>{res.log_subject}</h5>
                                  </div>
                                  <div>
                                    <i
                                      className="ri-reply-fill"
                                      style={{ fontSize: "20px", marginRight: "10px" }}
                                      title="Reply"
                                      onClick={() => t_editemailreply(res.id)}
                                    ></i>
                                    <i
                                      className="ri-share-forward-fill"
                                      style={{ fontSize: "20px", marginRight: "10px" }}
                                      title="Forward"
                                      onClick={() => t_editemail(res.id)}
                                    ></i>
                                    {res.pinned === 0 ? (
                                      <i
                                        className="bx bx-pin cursor-pointer"
                                        style={{ fontSize: "20px" }}
                                        title="Pin to Top"
                                        onClick={() => {
                                          chngimgemail(res.id, res.job_id, res.lead_id);
                                        }}
                                      ></i>
                                    ) : (
                                      <i
                                        className="bx bxs-pin cursor-pointer"
                                        style={{ fontSize: "20px" }}
                                        title="Unpin"
                                        onClick={() => {
                                          chngimgemail(res.id, res.job_id, res.lead_id);
                                        }}
                                      ></i>
                                    )}
                                    <i
                                      className={`bx ${isCollapsedemail[res.id] ? "bx-chevron-up" : "bx-chevron-down"} cursor-pointer`}
                                      style={{ fontSize: "23px" }}
                                      title="Collapse"
                                      onClick={() => toggleCollapseemail(res.id)}
                                    ></i>


                                  </div>
                                </CardHeader>
                                <Collapse isOpen={!isCollapsedemail[res.id]} className="accordion-collapse">
                                  <CardBody>

                                    {res.id != edit_email && res.id != edit_emaill && (
                                      <div className="pb-3">

                                        <p>
                                          <b>From:</b> {res.log_from} <br />
                                          <b>To:</b> {res.log_to} <br />
                                          {res.log_cc && (
                                            <span>
                                              <b>CC:</b> {res.log_cc} <br />
                                            </span>
                                          )}
                                          {res.log_bcc && (
                                            <span>
                                              <b>BCC:</b> {res.log_bcc} <br />
                                            </span>
                                          )}
                                        </p>
                                        <br></br>
                                        <p dangerouslySetInnerHTML={{ __html: modifiedHtmlContent }}></p>
                                        <br />
                                        {res?.attachments?.map((attachment, index) => (
                                          <p key={index}>
                                            <a href={api.api.API_URL + attachment.attachment_content.substring(attachment.attachment_content.lastIndexOf("public/") + 7)} target="_blank">
                                              {attachment.attachment_type}
                                            </a>
                                          </p>
                                        ))}
                                        <p className="mt-4 text-muted"><i>
                                          {console.log(moment.duration(moment().diff(moment.tz(res.log_date, 'Australia/Sydney'), 'seconds'), 'seconds').humanize(),"timeChecking")}
                                          {/* Email Sent {moment(res.log_date).fromNow()} by {res.user_firstname} {res.user_lastname} on {moment(res.log_date).format("YYYY-MM-DD hh:mm A")} */}
                                          Email sent {formattedTimeFromNow} ago by {res.user_firstname} {res.user_lastname} on {formatDate(res.log_date)}
                                        </i></p>
                                        {/* <p className="mt-4 text-muted">
                                          Email Written{" "}
                                          {moment(
                                            ppl_people.email_signature
                                          ).fromNow()}{" "}
                                          from:{res.log_from} to:{res.log_to} on{" "}
                                          {moment(res.log_date).format(
                                            "YYYY-MM-DD hh:mm A"
                                          )}
                                          subject:{res.log_subject}cc:{res.log_cc}{" "}
                                          Bcc:{res.log_bcc}
                                        </p> */}
                                        {/* <Button
                                              className="btn btn-brown"
                                              onClick={() => t_editemail(res.id)}
                                            >
                                              <i className="ri-share-forward-fill"></i>
                                            </Button> */}
                                      </div>
                                    )}
                                    {res.id == edit_email && (
                                      <div>
                                        <Row>
                                          <Col lg={6}>
                                            <div className="input-group">
                                              <span
                                                className="input-group-text"
                                                id="inputGroup-sizing-default"
                                              >
                                                From
                                              </span>
                                              <select
                                                id="act_email_from"
                                                name="from_email"
                                                className="form-control form-control-lg"
                                                value={companyname}
                                                onChange={(e) => setCompanyname(e.target.value)}
                                              >
                                                {removal?.map((company) => (
                                                  <option
                                                    key={company.id}
                                                    value={company.email}
                                                    data-name={company.contact_name}
                                                  >
                                                    {company.email}
                                                  </option>
                                                ))}
                                              </select>
                                            </div>
                                          </Col>
                                          <Col lg={6}>
                                            <div className="input-group">
                                              <span
                                                className="input-group-text"
                                                id="inputGroup-sizing-default"
                                              >
                                                To
                                              </span>
                                              <Input
                                                type="text"
                                                className="form-control"
                                                aria-label="Sizing example input"
                                                value={toemailfw}
                                                aria-describedby="inputGroup-sizing-default"
                                                // placeholder="onexfort.teststar22@gmail.com"
                                                onChange={(e) =>
                                                  setToEmailfw(e.target.value)
                                                }
                                              />
                                            </div>
                                          </Col>
                                        </Row>
                                        <div className="d-flex gap-2 flex-wrap mb-0 mt-3">
                                          <Button
                                            onClick={t_coll3}
                                            color="primary"
                                            style={{ cursor: "pointer" }}
                                          >
                                            Add CC{" "}
                                          </Button>
                                          <Button
                                            onClick={t_coll4}
                                            color="primary"
                                            style={{ cursor: "pointer" }}
                                          >
                                            {" "}
                                            Add BCC{" "}
                                          </Button>
                                        </div>
                                        <Row className="mb-3 mt-3">
                                          <Col lg={6}>
                                            <Collapse
                                              isOpen={coll3}
                                              id="multiCollapseExample1"
                                            >
                                              <div className="input-group">
                                                <span
                                                  className="input-group-text"
                                                  id="inputGroup-sizing-default"
                                                >
                                                  CC
                                                </span>
                                                <Input
                                                  type="text"
                                                  className="form-control"
                                                  aria-label="Sizing example input"
                                                  value={cc}
                                                  aria-describedby="inputGroup-sizing-default"
                                                  onChange={(e) =>
                                                    setcc(e.target.value)
                                                  }
                                                />
                                              </div>
                                            </Collapse>
                                          </Col>
                                          <Col lg={6}>
                                            <Collapse
                                              isOpen={coll4}
                                              id="multiCollapseExample2"
                                            >
                                              <div className="input-group">
                                                <span
                                                  className="input-group-text"
                                                  id="inputGroup-sizing-default"
                                                >
                                                  BCC
                                                </span>
                                                <Input
                                                  type="text"
                                                  className="form-control"
                                                  aria-label="Sizing example input"
                                                  value={bcc}
                                                  aria-describedby="inputGroup-sizing-default"
                                                  onChange={(e) =>
                                                    setbcc(e.target.value)
                                                  }
                                                />
                                              </div>
                                            </Collapse>
                                          </Col>
                                        </Row>
                                        <Row className="mb-3">
                                          <Col lg={6}>
                                            <Input
                                              type="text"
                                              className="form-control"
                                              placeholder="Subject"
                                              value={sub}
                                              onChange={(e) =>
                                                setSub(e.target.value)}
                                            />
                                          </Col>
                                        </Row>
                                        <Form method="post">

                                          <div className="snow-editor" style={{ height: 315 }}>
                                            <ReactQuill value={quil2} theme="snow" onChange={setQuill2} />
                                          </div>
                                        </Form>
                                        {attnamefw.length > 0 ?
                                          <div className="hstack gap-3 justify-content-start mt-3">
                                            {attnamefw.map((res, index) => (
                                              <div key={res.key}>
                                                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                                                  {res && (
                                                    <p key={index}>
                                                      <a href={api.api.API_URL + res.path.substring(res.path.lastIndexOf("public/") + 2)} target="_blank">
                                                        {res.name}
                                                      </a>
                                                    </p>
                                                  )}
                                                  <a
                                                    className="ri-close-circle-fill"
                                                    onClick={() => removeemailattachmentfw(res, index)}
                                                  ></a>
                                                  {/* <a className="ri-close-circle-fill" onClick={() => console.log('Clicked!')}></a> */}

                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                          : <p></p>}
                                        <div className="hstack gap-3 justify-content-end mt-3">
                                          <i
                                            className="bx bx-paperclip fs-3"
                                            onClick={() => setShowModalemailFw(true)}
                                          ></i>
                                          <i className="bx bx-x-circle fs-3" onClick={() => t_editemail(false)} ></i>
                                          {/* Send Forward */}
                                          <button
                                            type="submit"
                                            className="btn btn-brown"
                                            onClick={() => forwardemail(res)}
                                          >
                                            Send <i className="bx bxl-telegram"></i>
                                          </button>
                                          <div>
                                            <Modal
                                              id="showModal"
                                              className="modal-dialog modal-lg"
                                              isOpen={showmodelemailfw}
                                              toggle={() => setShowModalemailFw(false)}
                                            >
                                              <ModalBody className="">
                                                <div className="mb-5">
                                                  <Label
                                                    htmlFor="readonlyInput"
                                                    className="form-label"
                                                  >
                                                    {" "}
                                                    Upload Your File
                                                  </Label>
                                                  <div>
                                                    <div
                                                      className="dropzone dz-clickable"
                                                      onClick={handleClicksfw}
                                                      onDrop={handleDropemailfw}
                                                      onDragOver={handleDragOveremailfw}
                                                    >
                                                      <div className="dz-message needsclick">
                                                        <div className="mb-3">
                                                          <i className="display-4 text-muted ri-upload-cloud-2-fill" />
                                                        </div>
                                                        <h4>
                                                          Choose File or Drag it here...
                                                        </h4>
                                                        {fileemailfw ? (
                                                          <p style={{ fontSize: "12px" }}>{fileemailfw.name}</p>
                                                        ) : (
                                                          <p style={{ fontSize: "12px" }}>No file choosen</p>
                                                        )}

                                                      </div>
                                                    </div>
                                                    <input
                                                      type="file"
                                                      onChange={handleFileChangesemailfw}
                                                      ref={fileInputRefemailfw}
                                                      style={{ display: "none" }}
                                                    />
                                                  </div>
                                                </div>
                                                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
                                                  <Button className="btn btn-success" onClick={fileuploademailfw} disabled={!isEmailfw}>
                                                    Upload
                                                  </Button>
                                                  <div>
                                                    <Button className="btn btn-light" onClick={() => { setShowModalemailFw(false); }}>
                                                      Cancel
                                                    </Button>
                                                  </div>
                                                </div>
                                              </ModalBody>
                                            </Modal>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {/* reply */}
                                    {res.id == edit_emaill && (
                                      <div>
                                        <Row>
                                          <Col lg={6}>
                                            <div className="input-group">
                                              <span
                                                className="input-group-text"
                                                id="inputGroup-sizing-default"
                                              >
                                                From
                                              </span>
                                              <select
                                                id="act_email_from"
                                                name="from_email"
                                                className="form-control form-control-lg"
                                                value={companyname}
                                                onChange={(e) => setCompanyname(e.target.value)}
                                              >
                                                {removal?.map((company) => (
                                                  <option
                                                    key={company.id}
                                                    value={company.email}
                                                    data-name={company.contact_name}
                                                  >
                                                    {company.email}
                                                  </option>
                                                ))}
                                              </select>
                                            </div>
                                          </Col>
                                          <Col lg={6}>
                                            <div className="input-group">
                                              <span
                                                className="input-group-text"
                                                id="inputGroup-sizing-default"
                                              >
                                                To
                                              </span>
                                              <Input
                                                type="text"
                                                className="form-control"
                                                aria-label="Sizing example input"
                                                value={toemailrpy}
                                                aria-describedby="inputGroup-sizing-default"
                                                placeholder="onexfort.teststar22@gmail.com"
                                                onChange={(e) =>
                                                  setToEmailrpy(e.target.value)
                                                }
                                              />
                                            </div>
                                          </Col>
                                        </Row>
                                        <div className="d-flex gap-2 flex-wrap mb-0 mt-3">
                                          <Button
                                            onClick={t_coll3}
                                            color="primary"
                                            style={{ cursor: "pointer" }}
                                          >
                                            Add CC{" "}
                                          </Button>
                                          <Button
                                            onClick={t_coll4}
                                            color="primary"
                                            style={{ cursor: "pointer" }}
                                          >
                                            {" "}
                                            Add BCC{" "}
                                          </Button>
                                        </div>
                                        <Row className="mb-3 mt-3">
                                          <Col lg={6}>
                                            <Collapse
                                              isOpen={coll3}
                                              id="multiCollapseExample1"
                                            >
                                              <div className="input-group">
                                                <span
                                                  className="input-group-text"
                                                  id="inputGroup-sizing-default"
                                                >
                                                  CC
                                                </span>
                                                <Input
                                                  type="text"
                                                  className="form-control"
                                                  aria-label="Sizing example input"
                                                  value={cc}
                                                  aria-describedby="inputGroup-sizing-default"
                                                  onChange={(e) =>
                                                    setcc(e.target.value)
                                                  }
                                                />
                                              </div>
                                            </Collapse>
                                          </Col>
                                          <Col lg={6}>
                                            <Collapse
                                              isOpen={coll4}
                                              id="multiCollapseExample2"
                                            >
                                              <div className="input-group">
                                                <span
                                                  className="input-group-text"
                                                  id="inputGroup-sizing-default"
                                                >
                                                  BCC
                                                </span>
                                                <Input
                                                  type="text"
                                                  className="form-control"
                                                  aria-label="Sizing example input"
                                                  value={bcc}
                                                  aria-describedby="inputGroup-sizing-default"
                                                  onChange={(e) =>
                                                    setbcc(e.target.value)
                                                  }
                                                />
                                              </div>
                                            </Collapse>
                                          </Col>
                                        </Row>
                                        <Row className="mb-3">
                                          <Col lg={6}>
                                            <Input
                                              type="text"
                                              className="form-control"
                                              placeholder="Subject"
                                              value={subrpy}
                                              onChange={(e) =>
                                                setSubrpy(e.target.value)}
                                            />
                                          </Col>
                                        </Row>
                                        <Form method="post">

                                          <div className="snow-editor" style={{ height: 315 }}>
                                            <ReactQuill value={quil3} theme="snow" onChange={setQuill3} />
                                          </div>
                                        </Form>
                                        {attnamerpy.length > 0 ?
                                          <div className="hstack gap-3 justify-content-start mt-3">
                                            {attnamerpy.map((res, index) => (
                                              <div key={res.key}>
                                                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                                                  {res && (
                                                    <p key={index}>
                                                      <a href={api.api.API_URL + res.path.substring(res.path.lastIndexOf("public/") + 2)} target="_blank">
                                                        {res.name}
                                                      </a>
                                                    </p>
                                                  )}
                                                  <a
                                                    className="ri-close-circle-fill"
                                                    onClick={() => removeemailattachmentrpy(res, index)}
                                                  ></a>
                                                  {/* <a className="ri-close-circle-fill" onClick={() => console.log('Clicked!')}></a> */}

                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                          : <p></p>}
                                        <div className="hstack gap-3 justify-content-end mt-3">
                                          <i
                                            className="bx bx-paperclip fs-3"
                                            onClick={() => setShowModalemailrpy(true)}
                                          ></i>
                                          <i className="bx bx-x-circle fs-3" onClick={() => t_editemailreply(false)} ></i>
                                          {/* Send Reply */}
                                          <button
                                            type="submit"
                                            className="btn btn-brown"
                                            onClick={() => replyemail(res)}
                                          >
                                            Send <i className="bx bxl-telegram"></i>
                                          </button>
                                          <div>
                                            <Modal
                                              id="showModal"
                                              className="modal-dialog modal-lg"
                                              isOpen={showmodelemailrpy}
                                              toggle={() => setShowModalemailrpy(false)}
                                            >
                                              <ModalBody className="">
                                                <div className="mb-5">
                                                  <Label
                                                    htmlFor="readonlyInput"
                                                    className="form-label"
                                                  >
                                                    {" "}
                                                    Upload Your File
                                                  </Label>
                                                  <div>
                                                    <div
                                                      className="dropzone dz-clickable"
                                                      onClick={handleClicksrpy}
                                                      onDrop={handleDropemailrpy}
                                                      onDragOver={handleDragOveremailrpy}
                                                    >
                                                      <div className="dz-message needsclick">
                                                        <div className="mb-3">
                                                          <i className="display-4 text-muted ri-upload-cloud-2-fill" />
                                                        </div>
                                                        <h4>
                                                          Choose File or Drag it here...
                                                        </h4>
                                                        {fileemailrpy ? (
                                                          <p style={{ fontSize: "12px" }}>{fileemailrpy.name}</p>
                                                        ) : (
                                                          <p style={{ fontSize: "12px" }}>No file choosen</p>
                                                        )}

                                                      </div>
                                                    </div>
                                                    <input
                                                      type="file"
                                                      onChange={handleFileChangesemailrpy}
                                                      ref={fileInputRefemailrpy}
                                                      style={{ display: "none" }}
                                                    />
                                                  </div>
                                                </div>
                                                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
                                                  <Button className="btn btn-success" onClick={fileuploademailrpy} disabled={!isEmailrpy}>
                                                    Upload
                                                  </Button>
                                                  <div>
                                                    <Button className="btn btn-light" onClick={() => { setShowModalemailrpy(false); }}>
                                                      Cancel
                                                    </Button>
                                                  </div>
                                                </div>
                                              </ModalBody>
                                            </Modal>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {/* reply */}
                                  </CardBody>
                                </Collapse>
                              </div>
                            </div>
                            {/* </Collapse> */}
                          </Col>
                        </Row>
                      </div>
                    </AccordionItem >
                  )}

                  {res.log_type === 11 && (
                    <AccordionItem key={res.id}>
                      <div className="timeline-right mb-3">
                        <Row className="timeline-right mb-3">
                          <Col xs={12}>
                            <div className="timeline-row">
                              <div
                                style={{
                                  marginLeft: "0px",
                                  backgroundColor: "#912a4e",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  width: "33px",
                                  height: "30px",
                                  borderRadius: "50%",
                                  lineHeight: "0",
                                  zIndex: "999",
                                  position: "absolute",
                                }}
                              >
                                <i
                                  className="bx bxs-bx bx-list-ul timelineicon"
                                  style={{ color: "white", fontSize: "18px" }}
                                ></i>
                              </div>
                              <div className="card mb-0" style={{ marginLeft: "50px" }}>
                                <CardHeader className="align-items-center d-flex justify-content-between">
                                  <div>
                                    <h4 className="card-title mb-0">Inventory List</h4>
                                  </div>
                                  <div>
                                    <i
                                      className={`bx ${isCollapsedinv[res.id] ? "bx-chevron-up" : "bx-chevron-down"} cursor-pointer`}
                                      style={{ fontSize: "23px" }}
                                      onClick={() => toggleCollapseinv(res.id)}
                                    ></i>
                                  </div>
                                </CardHeader>
                                <Collapse isOpen={!isCollapsedinv[res.id]} className="accordion-collapse">
                                  <CardBody>
                                    <Col className="pl-1">
                                      <p>{res.log_message}</p>
                                      <p className="mt-4 text-muted"><i>
                                        {moment(res.log_date).fromNow()} on {formatDate(res.log_date)}
                                      </i></p>
                                    </Col>
                                  </CardBody>
                                </Collapse>
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </AccordionItem>
                  )}

                  {res.log_type == 4 && (
                    <AccordionItem key={res.id}>
                      <div className="timeline-right mb-3">
                        <Row className="timeline-right mb-3">
                          <Col xs={12}>
                            <div className="timeline-row">
                              <div style={{ marginLeft: "0px", backgroundColor: "#912a4e", display: "inline-flex", alignItems: "center", justifyContent: "center", width: "33px", height: "30px", borderRadius: "50%", lineHeight: "0", zIndex: "999", position: "absolute" }}>
                                <i className="bx bxs-envelope timelineicon" style={{ color: "white", fontSize: "18px" }}></i>
                              </div>
                              <div className="card mb-0" style={{ marginLeft: "50px" }}>
                                <CardHeader className="align-items-center d-flex justify-content-between">
                                  <div>
                                    <h4 className="card-title mb-0">{res.log_subject}</h4>
                                  </div>
                                  <div>
                                    <i
                                      className={`bx ${isCollapsedinve[res.id] ? "bx-chevron-up" : "bx-chevron-down"} cursor-pointer`}
                                      style={{ fontSize: "23px" }}
                                      onClick={() => toggleCollapseinve(res.id)}
                                    ></i>
                                  </div>
                                </CardHeader>
                                <Collapse isOpen={!isCollapsedinve[res.id]} className="accordion-collapse">
                                  <CardBody>
                                    <Col className="pl-1">
                                      <p>{res.log_message}</p>
                                      <p className="mt-4 text-muted"><i>
                                        Email opened {moment(res.log_date).fromNow()} on {formatDate(res.log_date)}
                                      </i></p>
                                    </Col>
                                  </CardBody>
                                </Collapse>
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </AccordionItem>

                  )}
                  {res.log_type === 5 && (
                    <AccordionItem key={res.id}>
                      <div className="timeline-right mb-3">
                        <Row className="timeline-right mb-3" >
                          <Col xs={12}>
                            <div className="timeline-row">
                              <div style={{ marginLeft: "0px", backgroundColor: "#912a4e", display: "inline-flex", alignItems: "center", justifyContent: "center", width: "33px", height: "30px", borderRadius: "50%", lineHeight: "0", zIndex: "999", position: "absolute" }}>
                                <i className="bx bxs-envelope timelineicon" style={{ color: "white", fontSize: "18px" }}></i>
                              </div>
                              <div className="card mb-0" style={{ marginLeft: "50px" }}>
                                <CardHeader className="align-items-center d-flex justify-content-between">
                                  <div>
                                    <h5>{res.log_subject}</h5>
                                  </div>
                                  <div>
                                    <i
                                      className="ri-reply-fill"
                                      style={{ fontSize: "20px", marginRight: "10px" }}
                                      title="Reply"
                                      onClick={() => t_editemailreplyreciv(res.id)}
                                    ></i>

                                    {res.pinned === 0 ? (
                                      <i
                                        className="bx bx-pin cursor-pointer"
                                        style={{ fontSize: "20px" }}
                                        title="Pin to Top"
                                        onClick={() => {
                                          chngimgemailreciv(res.id, res.job_id, res.lead_id);
                                        }}
                                      ></i>
                                    ) : (
                                      <i
                                        className="bx bxs-pin cursor-pointer"
                                        style={{ fontSize: "20px" }}
                                        title="Unpin"
                                        onClick={() => {
                                          chngimgemailreciv(res.id, res.job_id, res.lead_id);
                                        }}
                                      ></i>
                                    )}
                                    <i
                                      className={`bx ${isCollapsedemailreciv[res.id] ? "bx-chevron-up" : "bx-chevron-down"} cursor-pointer`}
                                      style={{ fontSize: "23px" }}
                                      title="Collapse"
                                      onClick={() => toggleCollapseemailreciv(res.id)}
                                    ></i>
                                  </div>
                                </CardHeader>
                                <Collapse isOpen={!isCollapsedemailreciv[res.id]} className="accordion-collapse">
                                  <CardBody>
                                    {res.id != edit_emailreciv && (
                                      <div className="pb-3">
                                        <p>
                                          <b>From:</b> {res.log_from} <br />
                                          <b>To:</b> {res.log_to} <br />
                                          {res.log_cc && (
                                            <span>
                                              <b>CC:</b> {res.log_cc} <br />
                                            </span>
                                          )}
                                          {res.log_bcc && (
                                            <span>
                                              <b>BCC:</b> {res.log_bcc} <br />
                                            </span>
                                          )}
                                        </p>
                                        <br></br>
                                        <p
                                          dangerouslySetInnerHTML={{
                                            __html: res.log_message,
                                          }}
                                        ></p>
                                        <br />
                                        {res?.attachments?.map((attachment, index) => (
                                          <p key={index}>
                                            <a href={api.api.API_URL + attachment.attachment_content.substring(attachment.attachment_content.lastIndexOf("public/") + 7)} target="_blank">
                                              {attachment.attachment_type}
                                            </a>
                                          </p>
                                        ))}
                                        <p className="mt-4 text-muted"><i>
                                          Email received {moment(res.log_date).fromNow()} by {res.user_firstname} {res.user_lastname} on {formatDate(res.log_date)}
                                        </i></p>
                                      </div>

                                    )}
                                    {/* reply */}
                                    {res.id == edit_emailreciv && (
                                      <div>
                                        <Row>
                                          <Col lg={6}>
                                            <div className="input-group">
                                              <span
                                                className="input-group-text"
                                                id="inputGroup-sizing-default"
                                              >
                                                From
                                              </span>
                                              <select
                                                id="act_email_from"
                                                name="from_email"
                                                className="form-control form-control-lg"
                                                value={companyname}
                                                onChange={(e) => setCompanyname(e.target.value)}
                                              >
                                                {removal?.map((company) => (
                                                  <option
                                                    key={company.id}
                                                    value={company.email}
                                                    data-name={company.contact_name}
                                                  >
                                                    {company.email}
                                                  </option>
                                                ))}
                                              </select>
                                            </div>
                                          </Col>
                                          <Col lg={6}>
                                            <div className="input-group">
                                              <span
                                                className="input-group-text"
                                                id="inputGroup-sizing-default"
                                              >
                                                To
                                              </span>
                                              <Input
                                                type="text"
                                                className="form-control"
                                                aria-label="Sizing example input"
                                                value={toemailrpyrec}
                                                aria-describedby="inputGroup-sizing-default"
                                                placeholder="onexfort.teststar22@gmail.com"
                                                onChange={(e) =>
                                                  setToEmailrpyrec(e.target.value)
                                                }
                                              />
                                            </div>
                                          </Col>
                                        </Row>
                                        <div className="d-flex gap-2 flex-wrap mb-0 mt-3">
                                          <Button
                                            onClick={t_coll3}
                                            color="primary"
                                            style={{ cursor: "pointer" }}
                                          >
                                            Add CC{" "}
                                          </Button>
                                          <Button
                                            onClick={t_coll4}
                                            color="primary"
                                            style={{ cursor: "pointer" }}
                                          >
                                            {" "}
                                            Add BCC{" "}
                                          </Button>
                                        </div>
                                        <Row className="mb-3 mt-3">
                                          <Col lg={6}>
                                            <Collapse
                                              isOpen={coll3}
                                              id="multiCollapseExample1"
                                            >
                                              <div className="input-group">
                                                <span
                                                  className="input-group-text"
                                                  id="inputGroup-sizing-default"
                                                >
                                                  CC
                                                </span>
                                                <Input
                                                  type="text"
                                                  className="form-control"
                                                  aria-label="Sizing example input"
                                                  value={cc}
                                                  aria-describedby="inputGroup-sizing-default"
                                                  onChange={(e) =>
                                                    setcc(e.target.value)
                                                  }
                                                />
                                              </div>
                                            </Collapse>
                                          </Col>
                                          <Col lg={6}>
                                            <Collapse
                                              isOpen={coll4}
                                              id="multiCollapseExample2"
                                            >
                                              <div className="input-group">
                                                <span
                                                  className="input-group-text"
                                                  id="inputGroup-sizing-default"
                                                >
                                                  BCC
                                                </span>
                                                <Input
                                                  type="text"
                                                  className="form-control"
                                                  aria-label="Sizing example input"
                                                  value={bcc}
                                                  aria-describedby="inputGroup-sizing-default"
                                                  onChange={(e) =>
                                                    setbcc(e.target.value)
                                                  }
                                                />
                                              </div>
                                            </Collapse>
                                          </Col>
                                        </Row>
                                        <Row className="mb-3">
                                          <Col lg={6}>
                                            {/* <Input
                                              placeholder="Subject"
                                              value={res.log_subject}
                                            ></Input> */}
                                            <Input
                                              type="text"
                                              className="form-control"
                                              placeholder="Subject"
                                              value={subrpyrec}
                                              onChange={(e) =>
                                                setSubrpyrec(e.target.value)}
                                            />
                                          </Col>
                                        </Row>
                                        <Form method="post">
                                          <div className="snow-editor" style={{ height: 315 }}>
                                            <ReactQuill value={quil4} theme="snow" onChange={setQuill4} />
                                          </div>
                                        </Form>
                                        {attnamerpyrec.length > 0 ?
                                          <div className="hstack gap-3 justify-content-start mt-3">
                                            {attnamerpyrec.map((res, index) => (
                                              <div key={res.key}>
                                                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                                                  {res && (
                                                    <p key={index}>
                                                      <a href={api.api.API_URL + res.path.substring(res.path.lastIndexOf("public/") + 2)} target="_blank">
                                                        {res.name}
                                                      </a>
                                                    </p>
                                                  )}
                                                  <a
                                                    className="ri-close-circle-fill"
                                                    onClick={() => removeemailattachmentrpyrec(res, index)}
                                                  ></a>
                                                  {/* <a className="ri-close-circle-fill" onClick={() => console.log('Clicked!')}></a> */}

                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                          : <p></p>}
                                        <div className="hstack gap-3 justify-content-end mt-3">
                                          <i
                                            className="bx bx-paperclip fs-3"
                                            onClick={() => setShowModalemailrpyrec(true)}
                                          ></i>
                                          <i className="bx bx-x-circle fs-3" onClick={() => t_editemailreplyreciv(false)} ></i>
                                          {/* Send Recieved */}
                                          <button
                                            type="submit"
                                            className="btn btn-brown"
                                            onClick={() => replyemailrec(res)}
                                          >
                                            Send <i className="bx bxl-telegram"></i>
                                          </button>
                                          <div>
                                            <Modal
                                              id="showModal"
                                              className="modal-dialog modal-lg"
                                              isOpen={showmodelemailrpyrec}
                                              toggle={() => setShowModalemailrpyrec(false)}
                                            >
                                              <ModalBody className="">
                                                <div className="mb-5">
                                                  <Label
                                                    htmlFor="readonlyInput"
                                                    className="form-label"
                                                  >
                                                    {" "}
                                                    Upload Your File
                                                  </Label>
                                                  <div>
                                                    <div
                                                      className="dropzone dz-clickable"
                                                      onClick={handleClicksrpyrec}
                                                      onDrop={handleDropemailrpyrec}
                                                      onDragOver={handleDragOveremailrpyrec}
                                                    >
                                                      <div className="dz-message needsclick">
                                                        <div className="mb-3">
                                                          <i className="display-4 text-muted ri-upload-cloud-2-fill" />
                                                        </div>
                                                        <h4>
                                                          Choose File or Drag it here...
                                                        </h4>
                                                        {fileemailrpyrec ? (
                                                          <p style={{ fontSize: "12px" }}>{fileemailrpyrec.name}</p>
                                                        ) : (
                                                          <p style={{ fontSize: "12px" }}>No file choosen</p>
                                                        )}

                                                      </div>
                                                    </div>
                                                    <input
                                                      type="file"
                                                      onChange={handleFileChangesemailrpyrec}
                                                      ref={fileInputRefemailrpyrec}
                                                      style={{ display: "none" }}
                                                    />
                                                  </div>
                                                </div>
                                                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
                                                  <Button className="btn btn-success" onClick={fileuploademailrpyrec}>
                                                    Upload
                                                  </Button>
                                                  <div>
                                                    <Button className="btn btn-light" onClick={() => { setShowModalemailrpyrec(false); }}>
                                                      Cancel
                                                    </Button>
                                                  </div>
                                                </div>
                                              </ModalBody>
                                            </Modal>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {/* reply */}
                                  </CardBody>
                                </Collapse>
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </AccordionItem>
                  )}

                  {res.log_type == 14 && (
                    <AccordionItem key={res.id}>
                      <div className="timeline-right mb-3">
                        <Row className="timeline-right mb-3">
                          <Col xs={12}>
                            <div className="timeline-row">
                              <div
                                style={{
                                  marginLeft: "0px",
                                  backgroundColor: "#912a4e",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  width: "33px",
                                  height: "30px",
                                  borderRadius: "50%",
                                  lineHeight: "0",
                                  zIndex: "999",
                                  position: "absolute",
                                }}
                              >
                                <i
                                  className="bx bxs-bx bx-list-ul timelineicon"
                                  style={{ color: "white", fontSize: "18px" }}
                                ></i>
                              </div>
                              <div className="card mb-0" style={{ marginLeft: "50px" }}>
                                <CardHeader className="align-items-center d-flex justify-content-between">
                                  <div>
                                    <h4 className="card-title mb-0">Inventory List</h4>
                                  </div>
                                  <div>
                                    <i
                                      className={`bx ${isCollapsedinvm[res.id] ? "bx-chevron-up" : "bx-chevron-down"} cursor-pointer`}
                                      style={{ fontSize: "23px" }}
                                      onClick={() => toggleCollapseinvm(res.id)}
                                    ></i>
                                  </div>
                                </CardHeader>
                                <Collapse isOpen={!isCollapsedinvm[res.id]} className="accordion-collapse">
                                  <CardBody>
                                    <Col className="pl-1">
                                      <p>{res.log_message}</p>
                                      <p className="mt-4 text-muted"><i>
                                        {moment(res.log_date).fromNow()} on {formatDate(res.log_date)}
                                      </i></p>
                                    </Col>
                                  </CardBody>
                                </Collapse>
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </AccordionItem>
                  )}
                  {res.log_type == 15 && (
                    <AccordionItem key={res.id}>
                      <div className="timeline-right mb-3">
                        <Row className="timeline-right mb-3">
                          <Col xs={12}>
                            <div className="timeline-row">
                              <div style={{ marginLeft: "0px", backgroundColor: "#912a4e", display: "inline-flex", alignItems: "center", justifyContent: "center", width: "33px", height: "30px", borderRadius: "50%", lineHeight: "0", zIndex: "999", position: "absolute" }}>
                                <i className="bx bxs-pencil timelineicon" style={{ color: "white", fontSize: "14px" }}></i>
                              </div>
                              <div className="card mb-0" style={{ marginLeft: "50px" }}>
                                <CardHeader className="align-items-center d-flex justify-content-between">
                                  <div>
                                    <h4 className="card-title mb-0">Driver Notes</h4>
                                  </div>
                                  <div>
                                    <i
                                      className={`bx ${isCollapsedinvd[res.id] ? "bx-chevron-up" : "bx-chevron-down"} cursor-pointer`}
                                      style={{ fontSize: "23px" }}
                                      onClick={() => toggleCollapseinvd(res.id)}
                                    ></i>
                                  </div>
                                </CardHeader>
                                <Collapse isOpen={!isCollapsedinvd[res.id]} className="accordion-collapse">
                                  <CardBody>
                                    <Row>
                                      <Col className="pl-1">
                                        <p>{res.log_message}</p>
                                        <p className="mt-4 text-muted"><i>
                                          {moment(res.log_date).fromNow()} ago by {res.user_firstname} {res.user_lastname} on {formatDate(res.log_date)}
                                        </i></p>
                                      </Col>
                                    </Row>
                                  </CardBody>
                                </Collapse>
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </AccordionItem>
                  )}
                  {res.log_type == 16 && (
                    <Row className="timeline-right mb-3" key={res.id}>
                      <Col xs={12}>
                        <div className="timeline-row">
                          <div style={{ marginLeft: "0px", backgroundColor: "#912a4e", display: "inline-flex", alignItems: "center", justifyContent: "center", width: "33px", height: "30px", borderRadius: "50%", lineHeight: "0", zIndex: "999", position: "absolute" }}>
                            <i className="bx bx-bulb timelineicon" style={{ color: "white", fontSize: "18px" }}></i>
                          </div>
                          <div className="card mb-0" style={{ marginLeft: "50px" }}>
                            {/* <div className="card mb-0 mt-3"> */}
                            <CardBody>
                              <Row>
                                <Col className="pl-1">
                                  {/* <p className="pt-3">{res.log_message}</p> */}
                                  <p><i style={{ color: '#999' }}>
                                    Opportunity created on {formatDate(res.log_date)}
                                  </i></p>
                                </Col>
                              </Row>
                            </CardBody>
                          </div>
                        </div>
                      </Col>
                    </Row>
                    // Opportunity created on 
                  )}
                  {res.log_type == 17 && (
                    <Row className="timeline-right mb-3" >
                      <Col xs={12}>
                        <div className="timeline-row">
                          <div style={{ marginLeft: "0px", backgroundColor: "#912a4e", display: "inline-flex", alignItems: "center", justifyContent: "center", width: "33px", height: "30px", borderRadius: "50%", lineHeight: "0", zIndex: "999", position: "absolute" }}>
                            <i className="bx bxs-bell timelineicon" style={{ color: "white", fontSize: "18px" }}></i>
                          </div>
                          <div className="card mb-0" style={{ marginLeft: "50px" }}>
                            <CardBody>
                              <Row>
                                <Col className="pl-1">
                                  <span>
                                    <p><i style={{ color: '#999' }}>
                                      {res.log_message} on {formatDate(res.log_date)}
                                    </i></p>
                                  </span>
                                </Col>
                              </Row>
                            </CardBody>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  )}
                  {res.log_type === 18 && (
                    <Row className="timeline-right mb-3" >
                      <Col xs={12}>
                        <div className="timeline-row">
                          <div style={{ marginLeft: "0px", backgroundColor: "#912a4e", display: "inline-flex", alignItems: "center", justifyContent: "center", width: "33px", height: "30px", borderRadius: "50%", lineHeight: "0", zIndex: "999", position: "absolute" }}>
                            <i className="bx bxs-user-check timelineicon" style={{ color: "white", fontSize: "18px", marginLeft: "5px" }}></i>
                          </div>
                          <div className="card mb-0" style={{ marginLeft: "50px" }}>
                            <CardBody>
                              <Row>
                                <Col className="pl-1">
                                  <span>
                                    <p><i style={{ color: '#999' }}>
                                      {res.log_message} on {formatDate(res.log_date)}
                                    </i></p>
                                  </span>
                                </Col>
                              </Row>
                            </CardBody>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  )}

                  {res.log_type == 19 && (
                    <Row>
                      <Col xs={12}>
                        <div className="timeline-date">
                          <div className="card mb-0 mt-3">
                            <CardBody>
                              <Row>
                                <Col className="pl-1">
                                  <p><i style={{ color: '#999' }}>
                                    {res.log_message} on  {formatDate(res.log_date)}
                                  </i></p>
                                </Col>
                              </Row>
                            </CardBody>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  )}
                </>
              );
            })}
        </div>
      </div >
    </div >
    // </div>
  );
};
