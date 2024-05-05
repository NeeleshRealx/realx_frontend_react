import React from "react";
import "../../assets/scss/pages/_opportunities.scss";
import { useEffect, useState, useMemo, useCallback } from "react";
import saveAs from "file-saver";
import api from "../../../src/config";
import OpportunityModal from "./OpportunityModal";
import axios from "axios";
import {
  Card,
  CardBody,
  Col,
  Container,
  CardHeader,
  Nav,
  Button,
  NavItem,
  NavLink,
  Row,
  Modal,
  ModalHeader,
  Form,
  TabContent,
  TabPane,
  ModalBody,
  ModalFooter,
  Label,
  Input,
  FormFeedback, Accordion,
  AccordionItem,
  Collapse
} from "reactstrap";
// import Components
import BreadCrumb from "../../Components/Common/BreadCrumb";

import { get_cookie } from "../../helpers/get_cookie";

import * as moment from "moment";
import { Link } from "react-router-dom";
import Select from "react-select";
import classnames from "classnames";
import Flatpickr from "react-flatpickr";
import TableContainer from "../../Components/Common/TableContainer";
import CustomTableContainer from "../../Components/Common/CustomTableContainer";
import DeleteModal from "../../Components/Common/DeleteModal";
import { isEmpty } from "lodash";
// Formik
import * as Yup from "yup";
import { useFormik } from "formik";

import GoogleAutocomplete from "react-google-autocomplete";

//redux
import { useSelector, useDispatch } from "react-redux";

//Import actions
import {
  getOrders as onGetOrders,
  addNewOrder as onAddNewOrder,
  updateOrder as onUpdateOrder,
  deleteOrder as onDeleteOrder,
} from "../../store/ecommerce/action";

import Loader from "../../Components/Common/Loader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



const Opportunities = () => {
  const [data, setData] = useState([]);
  const [pickcommercial, setpickcommercial] = useState();
  let [dataa, setDataa] = useState([]);
  const [addTask, setAddTask] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modal, setModal] = useState(false);
  const [leadTypes, setLeadTypes] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [opportunitytype, setOpportunityType] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [companieslist, setCompaniesList] = useState([]);
  const [activeTab, setActiveTab] = useState("1");
  const [orgName, setOrgName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [residentialsuburb, setResidentialSuburb] = useState("");
  const [dropresplace, setdropresplace] = useState();
  const [dropoffaddress, setDropoffAddress] = useState("");
  const [place, setplace] = useState();
  const [dropplace, setdropplace] = useState();
  const [estjobdate, setEstJobdate] = useState(null);
  const [leadinfo, setLeadInfo] = useState("none");
  const [companyname, setCompanyName] = useState("none");
  const [optype, setOpType] = useState("");
  const [type, setType] = useState("");
  const [pickupcontactname, setPickupContactName] = useState("");
  const [pickupemail, setpickupemail] = useState("");
  const [pickupmobile, setPickupMobile] = useState("");
  const [customerid, setCustomerid] = useState("none");
  const [opp, setOpp] = useState("");
  const [countrycode, setCountrycode] = useState("");
  const [tableData, setTableData] = useState([])
  const [isLoading, setisLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState([]);

  const [pageIndex, setPageIndex] = useState(0);
  const [searchVal, setSearchVal] = useState("");
  const [pageSize, setPageSize] = useState(100);

  const dispatch = useDispatch();
  const [statusfilter, setstatusfilter] = useState([]);
  const [selectedStatus, setselectedStatus] = useState(null);
  function handleStatusMulti(selectedOptions) {
    setselectedStatus(selectedOptions);
  }
  const [multistatusfilter, setmultistatusfilter] = useState();
  const [usermultiselect, setusermultiselect] = useState();
  const [userfilter, setuserfilter] = useState();
  const [statusToSelect, setstatusToSelect] = useState('');
  const [createdDateStart, setCreatedDateStart] = useState(null);
  const [createdDateEnd, setCreatedDateEnd] = useState(null);

  const [removalDateStart, setRemovalDateStart] = useState(null);
  const [removalDateEnd, setRemovalDateEnd] = useState(null);
  const [org_date, setOrg_Date] = useState([]);
  const [listData, setListData] = useState([]);
  const tabChange = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };
  const [crmleadstatuses, setcrmleadstatus] = useState();
  const [selectedValue, setSelectedValue] = useState(null);
  const [valueStatus, setValueStatus] = useState([]);

const exportToexcel=async()=>{
    // {created_start_date?}/{created_date_end?}/{removal_date_start?}/{removal_date_end?}/{job_status?}/{payment_status?}/{hide_deleted_archived?}
    let formData = {
      "created_date_start": createdDateStart,
      "created_date_end": createdDateEnd,
      "removal_date_start": removalDateStart,
      "removal_date_end": removalDateEnd,
      "opportunity_status": statusToSelect,
      "hide_deleted_archived": 1,
      "user_id": formattedUserIds,
    }
    try {
        const response = await axios.post("/api/opportunity/excel", formData, {
            responseType: "json",
          });
        const excelData = response.excelData
        console.log(excelData)
  
        const blob = new Blob([Uint8Array.from(atob(excelData), c => c.charCodeAt(0))], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
  
        saveAs(blob, "Opportunities.xlsx");
      } catch (error) {
        console.error("Error downloading Excel:", error);
      }
}

  const getData = () => {
    // console.log(val,"vval");
    // if (val == "clear") {
    //   setData([]);
    //   setOrderList([])
    //   //setPageIndex(0);
    // }
    
    const user = JSON.parse(get_cookie("authUser"));
    var tenant_id = user.tenant_id;
    var datavalue = {
      tenant_id: tenant_id,
    };
    setisLoading(true);
    let statustoselect = ""

    console.log(statusToSelect)

    const apiUrl2 = "";
    axios.get("api/listdata")
      .then((response) => {
        console.log("list123455", response)
        let formData = {
          opportunity_status: response.statusToSelect.join(','),
          sort_descending: 1,
          sorting_order: 'created_at',
        }
        console.log(formData,"formData");
        const apiUrl = "api/opportunity/data?page=" + pageIndex + "&size=" + pageSize ;
        axios.get(apiUrl, { params: formData })
          .then((res) => {
            console.log(data,"res22222");
            if (data.length < res.total) {
            const newRecords = filterAndEnsureUniqueness([...orderList, ...res.data.original.data]);
            const newData = filterAndEnsureUniqueness([...data, ...res.data.original.data]);
            setData(newData);
            setOrderList(newRecords);
            } 
            setTotalRecords(res.total);
            setOpp(res.opportunity_number);
          })
          .catch((error) => {
            console.error(error);
          })
          .finally(() => {
            setisLoading(false);
          })
        setcrmleadstatus(response.lead_status)
        setSelectedValue(response.lead_status.lead_status)
        setListData(response);
        setOrg_Date(response?.organisation_settings);
        setstatusfilter(response?.status);
        setuserfilter(response?.usersfilter);
        setLeadTypes(response.lead_type);
        setstatusToSelect(response.statusToSelect.join(','));
        console.log(response.statusToSelect.join(','))
        console.log(response?.organisation_settings.date_format_js, "(response?.organisation_settings.date_format_js");
        if (response?.lead_type.length > 0) {
          setLeadInfo(response?.lead_type[0].id)
        }

        setOpportunityType(response.opportunity_type);
        if (response?.opportunity_type.length > 0) {
          setOpType(response?.opportunity_type[0].id)
        }
        setCompaniesList(response.companies_list);
        if (response?.companies_list.length > 0) {
          setCompanyName(response?.companies_list[0].id);
        }
        setCustomers(response.customers);
        if (response?.customers.length > 0) {
          setCustomerid(response?.customers[0].id);
        }
        setValueStatus(response.statusToSelect);
      })
      .catch((error) => {
        console.error("Error fetching lead types:", error);
      });

      let formData = {
        opportunity_status: valueStatus.join(','),
        sort_descending: 1,
        sorting_order: 'created_at',
      }
      console.log(formData,"formData");

      const apiUrl = "api/opportunity/data?page=" + pageIndex + "&size=" + pageSize ;
      axios.get(apiUrl, { params: formData })
        .then((res) => {
          console.log(data,"res22222");
          if (data.length < res.total) {
            const newRecords = filterAndEnsureUniqueness([...orderList, ...res.data.original.data]);
            const newData = filterAndEnsureUniqueness([...data, ...res.data.original.data]);
            setData(newData);
            setOrderList(newRecords);
          } 
          setTotalRecords(res.total);
          setOpp(res.opportunity_number);
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setisLoading(false);
        })
    axios
      .get("/api/crm-leads/countryCode")
      .then((response) => {
        console.log(response);

        setCountrycode(response.country_code);
      })
      .catch((error) => {
        console.error("Error fetching lead types:", error);
      });


    axios
      .get("/api/get-display-field-opp-data")
      .then((response) => {
        console.log(response);
        setTableData(response.displayColoumn)
      })
      .catch((error) => {
        console.error("Error fetching lead types:", error);
      });
  }

  useEffect(() => {
    getData();
  }, [pageIndex, searchVal]);

  // const orders = data;

  const [orderList, setOrderList] = useState([]);
  const [order, setOrder] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteModalMulti, setDeleteModalMulti] = useState(false);

  const isOrderSuccess = true;

  const handleDeleteOrder = () => {
    if (order) {
      dispatch(onDeleteOrder(order._id));
      setDeleteModal(false);
    }
  };

  const testfunc = (data) => {
    console.log(data);
  };

  // validation
  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      orderId: (order && order.orderId) || "",
      customer: (order && order.customer) || "",
      product: (order && order.product) || "",
      orderDate: (order && order.orderDate) || "",
      // ordertime: (order && order.ordertime) || '',
      amount: (order && order.amount) || "",
      payment: (order && order.payment) || "",
      status: (order && order.status) || "",
    },
    validationSchema: Yup.object({
      orderId: Yup.string().required("Please Enter order Id"),
      customer: Yup.string().required("Please Enter Customer Name"),
      product: Yup.string().required("Please Enter Product Name"),
      amount: Yup.string().required("Please Enter Total Amount"),
      payment: Yup.string().required("Please Enter Payment Method"),
      status: Yup.string().required("Please Enter Delivery Status"),
    }),
    onSubmit: (values) => {
      if (isEdit) {
        const updateOrder = {
          _id: order ? order._id : 0,
          orderId: values.orderId,
          customer: values.customer,
          product: values.product,
          orderDate: date,
          // ordertime: values.ordertime,
          amount: values.amount,
          payment: values.payment,
          status: values.status,
        };
        // update order
        dispatch(onUpdateOrder(updateOrder));
        validation.resetForm();
      } else {
        const newOrder = {
          _id: Math.floor(Math.random() * (30 - 20)) + 20,
          orderId: values["orderId"],
          customer: values["customer"],
          product: values["product"],
          orderDate: date,
          // ordertime: values["ordertime"],
          amount: values["amount"],
          payment: values["payment"],
          status: values["status"],
        };
        // save new order
        dispatch(onAddNewOrder(newOrder));
        validation.resetForm();
      }
      toggle();
    },
  });

  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      setOrder(null);
    } else {
      setModal(true);
      setDate(defaultdate());
    }
  }, [modal]);

  const handleOrderClicks = () => {
    setOrder("");
    setIsEdit(false);
    toggle();
  };

  const handleOrderClick = useCallback(
    (arg) => {
      const order = arg;
      setOrder({
        _id: order._id,
        orderId: order.orderId,
        customer: order.customer,
        product: order.product,
        orderDate: order.orderDate,
        ordertime: order.ordertime,
        amount: order.amount,
        payment: order.payment,
        status: order.status,
      });

      setIsEdit(true);
      toggle();
    },
    [toggle]
  );

  // Checked All
  const checkedAll = useCallback(() => {
    const checkall = document.getElementById("checkBoxAll");
    const ele = document.querySelectorAll(".orderCheckBox");
    if (checkall.checked) {
      ele.forEach((ele) => {
        ele.checked = true;
      });
    } else {
      ele.forEach((ele) => {
        ele.checked = false;
      });
    }
    deleteCheckbox();
  }, []);

  // Delete Multiple
  const [selectedCheckBoxDelete, setSelectedCheckBoxDelete] = useState([]);
  const [isMultiDeleteButton, setIsMultiDeleteButton] = useState(false);

  const deleteMultiple = () => {
    const checkall = document.getElementById("checkBoxAll");
    selectedCheckBoxDelete.forEach((element) => {
      dispatch(onDeleteOrder(element.value));
      setTimeout(() => {
        toast.clearWaitingQueue();
      }, 3000);
    });
    setIsMultiDeleteButton(false);
    checkall.checked = false;
  };
  const [selectedLeadIds, setSelectedLeadIds] = useState([]);

  const deleteCheckbox = (leadId) => {
    const ele = document.querySelectorAll(".orderCheckBox:checked");
    ele.length > 0
      ? setIsMultiDeleteButton(true)
      : setIsMultiDeleteButton(false);

    setSelectedCheckBoxDelete(ele);

    setSelectedLeadIds((prevSelectedLeadIds) => [...prevSelectedLeadIds, leadId]);
  };

  console.log(selectedLeadIds, "selectedLeadIds")

  const [selectedCity, setSelectedcity] = useState();
  const [selectedSuburb, setselectedSuburb] = useState();
  const [selectedPostcode, setselectedPostcode] = useState();
  const [commercialselectedCity, setcommercialselectedCity] = useState();
  const [commercialselectedSuburb, setcommercialselectedSuburb] = useState();
  const [commercialselectedPostcode, setcommercialselectedPostcode] =
    useState();

  //dropoff

  const [dropselectedCity, setdropselectedCity] = useState();
  const [dropselectedSuburb, setdropselectedSuburb] = useState();
  const [dropselectedPostcode, setdropselectedPostcode] = useState();
  const [resdropselectedCity, setresdropselectedCity] = useState();
  const [resdropselectedSuburb, setresdropselectedSuburb] = useState();
  const [resdropselectedPostcode, setresdropselectedPostcode] = useState();


  const handlePlaceSelect = (place) => {
    var checked = document.getElementById("is_suburb").checked;

    if (!checked) {
      var commerselectedCity =
        place &&
        place.address_components.find((component) =>
          component.types.includes("locality")
        )?.long_name;
      setcommercialselectedCity(commerselectedCity);

      var commerselectedSuburb =
        place &&
        place.address_components.find((component) =>
          component.types.includes("administrative_area_level_2")
        )?.long_name;
      setcommercialselectedSuburb(commerselectedSuburb);

      var commerselectedPostcode =
        place &&
        place.address_components.find((component) =>
          component.types.includes("postal_code")
        )?.long_name;
      setcommercialselectedPostcode(commerselectedPostcode);

      setpickcommercial(place.formatted_address);
    } else {
      var commerselectedSuburb =
        place &&
        place.address_components.find((component) =>
          component.types.includes("administrative_area_level_2")
        )?.long_name;

      const suburb = place.formatted_address.split(",")[0].trim();

      setcommercialselectedSuburb(suburb);
      setpickcommercial(suburb);
    }

    // console.log(commerselectedCity);
    // console.log(commerselectedSuburb);
    // console.log(commerselectedPostcode);
  };

  const residentialplace = (place) => {
    var checked = document.getElementById("is_commercial").checked;
    if (!checked) {
      console.log("IF");
      const respickSuburb =
        place &&
        place.address_components &&
        place.address_components.find((component) =>
          component.types.includes("administrative_area_level_2")
        )?.long_name;
      setselectedSuburb(respickSuburb);

      const respickCity =
        place &&
        place.address_components &&
        place.address_components.find((component) =>
          component.types.includes("locality")
        )?.long_name;
      const respickPostcode =
        place &&
        place.address_components &&
        place.address_components.find((component) =>
          component.types.includes("postal_code")
        )?.long_name;
      setSelectedcity(respickCity);
      setselectedPostcode(respickPostcode);
      setplace(place.formatted_address);
    } else {
      console.log("ELSE");
      const respickSuburb =
        place &&
        place.address_components &&
        place.address_components.find((component) =>
          component.types.includes("administrative_area_level_2")
        )?.long_name;

      const suburb = place.formatted_address.split(",")[0].trim();

      setselectedSuburb(suburb);
      setplace(suburb);
    }
  };

  const dropoffselect = (place) => {
    var checked = document.getElementById("is_suburb").checked;

    if (!checked) {
      var comerdropselectedCity =
        place &&
        place.address_components.find((component) =>
          component.types.includes("locality")
        )?.long_name;
      setdropselectedCity(comerdropselectedCity);

      var comdropselectedSuburb =
        place &&
        place.address_components.find((component) =>
          component.types.includes("administrative_area_level_1")
        )?.long_name;
      setdropselectedSuburb(comdropselectedSuburb);

      var comdropselectedPostcode =
        place &&
        place.address_components.find((component) =>
          component.types.includes("postal_code")
        )?.long_name;
      setdropselectedPostcode(comdropselectedPostcode);

      setdropplace(place.formatted_address);
    } else {
      var comdropselectedSuburb =
        place &&
        place.address_components.find((component) =>
          component.types.includes("administrative_area_level_1")
        )?.long_name;

      const suburb = place.formatted_address.split(",")[0].trim();

      setdropselectedSuburb(suburb);
      setdropplace(suburb);
    }
  };

  const residentialdropoffselect = (place) => {
    var checked = document.getElementById("is_commercial").checked;

    if (!checked) {
      var resdropCity =
        place &&
        place.address_components.find((component) =>
          component.types.includes("locality")
        )?.long_name;
      setresdropselectedCity(resdropCity);

      var resdropSuburb =
        place &&
        place.address_components.find((component) =>
          component.types.includes("administrative_area_level_2")
        )?.long_name;
      setresdropselectedSuburb(resdropSuburb);

      var resdropPostcode =
        place &&
        place.address_components.find((component) =>
          component.types.includes("postal_code")
        )?.long_name;
      setresdropselectedPostcode(resdropPostcode);

      setdropresplace(place.formatted_address);
    } else {
      var resdropSuburb =
        place &&
        place.address_components.find((component) =>
          component.types.includes("administrative_area_level_2")
        )?.long_name;

      const suburb = place.formatted_address.split(",")[0].trim();

      setresdropselectedSuburb(suburb);
      setdropresplace(suburb);
    }
  };


  // Customber Column
  console.log("orderList", orderList);
  const columns = useMemo(
    () => [
      {
        tableId: "checkBox",
        Cell: (cellProps) => {
          return <input type="checkbox" className="orderCheckBox form-check-input" value={cellProps.row.original.lead_id} onChange={() => deleteCheckbox(cellProps.row.original.lead_id)} />;
        },
        id: '#',
      },
      {
        Header: "Opp#",
        tableId: "opp",
        accessor: "job_number",
        filterable: false,
      },
      {
        Header: "Lead",
        tableId: "Lead",
        accessor: "name",
        filterable: false,
        Cell: (cell) => {
          // console.log("cell", cell.cell.row.original.job);
          // console.log("cell.cell.row",cell.cell.row);
          // return <Link to="/opportunitydetails" className="fw-medium link-primary">{cell.value}</Link>;
          const lead_id = cell.cell.row.original.job.lead_id;
          const job_id = cell.cell.row.original.job.opp_id;
          const opp = setOpp;
          return (
            <Link
              to={`/opportunitydetails/${lead_id}/${job_id}`}
              className="fw-medium link-primary"
            >
              <span dangerouslySetInnerHTML={{ __html: cell.cell.row.original.name }} />

            </Link>
          );
        },
      },
      // {
      //   Header: "Lead",
      //   accessor: "lead_id",
      //   tableId:2,
      //   filterable: false,
      // },
      {
        Header: "Mobile",
        tableId: "Mobile",
        accessor: "mobile",
        filterable: false,
      },

      {
        Header: "Pickup Suburb",
        tableId: "Pickup Suburb",
        accessor: "pickup_suburb",
        filterable: false,
        Cell: (row) => <div dangerouslySetInnerHTML={{ __html: row.value }} />
      },
      {
        Header: "Drop Off Suburb",
        tableId: "Drop off Suburb",
        accessor: "delivery_suburb",
        filterable: false,
        Cell: (row) => <div dangerouslySetInnerHTML={{ __html: row.value }} />,
      },
      {
        Header: "Lead Info",
        tableId: "Lead Info",
        accessor: "lead_info",
        filterable: false,
      },
      {
        Header: "Company",
        tableId: "Company",
        accessor: "company",
        filterable: false,
        Cell: (row) => <div dangerouslySetInnerHTML={{ __html: row.value }} />,
      },
      {
        Header: "Type",
        tableId: "Type",
        accessor: "type",
        filterable: false,
      },
      {
        Header: "Job Date",
        tableId: "Job Date",
        accessor: "job_date",
      },

      {
        Header: "Created Date",
        tableId: "Created Date",
        accessor: "created_date",
      },
      {
        Header: "Status",
        tableId: "Status",
        accessor: "status",
        filterable: false,
        Cell: (cell) => {
          const { value } = cell;
          const { status_colour } = cell.row.original;

          let badgeClassName = "badge text-uppercase ";

          switch (value) {
            case "Lost":
              badgeClassName += `badge-soft-warning`;
              break;
            case "Cancelled":
              badgeClassName += `badge-soft-danger`;
              break;
            case "Inprogress":
              badgeClassName += `badge-soft-secondary`;
              break;
            case "Pickups":
              badgeClassName += `badge-soft-info`;
              break;
            case "Returns":
              badgeClassName += `badge-soft-primary`;
              break;
            case "Delivered":
              badgeClassName += `badge-soft-success`;
              break;
            default:
              badgeClassName += `badge-soft-warning`;
          }

          if (status_colour) {
            badgeClassName += ` ${status_colour}`;
          }

          return <span className={`badge ${badgeClassName}`}>{value}</span>;
        },
      },

      {
        Header: "User",
        tableId: "User",
        accessor: "user_name",
        filterable: false,
        Cell: (row) => <div dangerouslySetInnerHTML={{ __html: row.value }} />,
      },
      {
        Header: "tags",
        tableId: "Tags",
        accessor: "tags",
        filterable: false,
      },
      {
        Header: "Lead Status",
        accessor: "lead_status",
        tableId: "Lead Status",
        Cell: (row) => <div dangerouslySetInnerHTML={{ __html: row.value }} />,

      },
    ],
    [handleOrderClick, checkedAll]
  );

  console.log(tableData)

  const filteredColumns = columns.filter((column) => {
    if (column.tableId === "opp") {
      return true
    }
    if (column.tableId === "checkBox") {
      return true
    }
    const matchingDisplay = tableData && tableData.find(
      (displayObj) => displayObj && displayObj.name === column.tableId

    );
    return matchingDisplay && matchingDisplay.display === 1;
  });

  console.log(filteredColumns, "filteredColumns")

  const defaultdate = () => {
    let d = new Date(),
      months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
    let h = d.getHours() % 12 || 12;
    let ampm = d.getHours() < 12 ? "AM" : "PM";
    return (
      d.getDate() +
      " " +
      months[d.getMonth()] +
      ", " +
      d.getFullYear() +
      ", " +
      h +
      ":" +
      d.getMinutes() +
      " " +
      ampm
    ).toString();
  };

  const [date, setDate] = useState(defaultdate());

  const handleValidDate = (date) => {
    const date1 = moment(new Date(date)).format("DD MMM Y");
    return date1;
  };

  const handleValidTime = (time) => {
    const time1 = new Date(time);
    const getHour = time1.getUTCHours();
    const getMin = time1.getUTCMinutes();
    const getTime = `${getHour}:${getMin}`;
    var meridiem = "";
    if (getHour >= 12) {
      meridiem = "PM";
    } else {
      meridiem = "AM";
    }
    const updateTime =
      moment(getTime, "hh:mm").format("hh:mm") + " " + meridiem;
    return updateTime;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(estjobdate);
    console.log(optype);
    console.log(selectedCity, "selectedcity");

    let formData = {
      est_job_date: estjobdate,
      company_id: companyname,
      op_type: "Moving",
    };

    if (activeTab === "1") {
      if (leadinfo === "none") {
        toast.error("Please select a leadinfo", { theme: "light" });
        return; // Exit the function early if leadinfo is not selected
      }
      if (estjobdate === null) {
        //         // If estjobdate is not selected, set it to today's date
        setEstJobdate(moment().format("DD/MM/YYYY"));
        return;
      }
      if (companyname === "none") {
        toast.error("Please select a companyname", { theme: "light" });
        return; // Exit the function early if companyname is not selected
      }

      if (email !== "") {
        const emailPattern = /^[A-Za-z0-9._+-]+@[A-Za-z._-]+\.[A-Za-z]{2,}$/;
        const isValid = emailPattern.test(email);
        if (!isValid) {
          toast.error("Invalid email", { theme: "light" });
          return;
        }
      }

      formData = {
        ...formData,
        lead_name: orgName,
        mobile: mobile,
        email: email,
        lead_info: leadinfo,
        type: "Residential",
      };
      if (isChecked === "Y") {
        formData.pickup_suburb = selectedSuburb;
        formData.delivery_suburb = resdropselectedSuburb;
      } else {
        formData.pickup_address = selectedCity;
        formData.pickup_suburb = selectedSuburb;
        formData.pickup_post_code = selectedPostcode;
        formData.drop_off_address = resdropselectedCity;
        formData.delivery_suburb = resdropselectedSuburb;
        formData.drop_off_post_code = resdropselectedPostcode;
      }

    } else if (activeTab === "2") {
      if (companyname === "none") {
        toast.error("Please select company name", { theme: "light" });
        return; // Exit the function early if companyname is not selected
      }

      if (customerid === "none") {
        toast.error("Please select customer name", { theme: "light" });
        return; // Exit the function early if customerid is not selected
      }

      if (estjobdate === null) {
        //         // If estjobdate is not selected, set it to today's date
        setEstJobdate(moment().format("DD/MM/YYYY"));
        return;
      }
      if (pickupemail !== "") {
        const emailPattern = /^[A-Za-z0-9._+-]+@[A-Za-z._-]+\.[A-Za-z]{2,}$/;
        const isValid = emailPattern.test(pickupemail);
        if (!isValid) {
          toast.error("Invalid email", { theme: "light" });
          return;
        }
      }
      formData = {
        ...formData,
        customer_id: customerid,
        pickup_contact_name: pickupcontactname,
        pickup_email: pickupemail,
        pickup_mobile: pickupmobile,
        type: "Commercial",
      };
      if (isChecked === "Y") {
        formData.pickup_suburb = commercialselectedSuburb;
        formData.delivery_suburb = dropselectedSuburb;
      } else {
        formData.pickup_address = commercialselectedCity;
        formData.pickup_suburb = commercialselectedSuburb;
        formData.pickup_post_code = commercialselectedPostcode;
        formData.delivery_suburb = dropselectedSuburb;
        formData.drop_off_post_code = dropselectedPostcode;
        formData.drop_off_address = dropselectedCity;
      }
    }

    axios
      .post("/api/crm-leads/ajaxStoreLead", formData)
      .then((res) => {
        console.log("hai");
        console.log(res);
        setModal(false);
        if (res.error == 0) {
          toast.success(res.message);
          window.location.href = `/opportunitydetails/${res.id}/${res.opportunity_id}`;
        } else {
          toast.error(res.message);
        }
      })
      .catch((error) => {
        console.error(error);
        // Handle the error appropriately, display error messages, or take necessary actions
      });
  };
  //Filter
  const [col1, setcol1] = useState(false);

  const t_col1 = () => {
    setcol1(!col1);
  };
  const handleMulti = (selectedOptions) => {
    setmultistatusfilter(selectedOptions);
  };

  const userhandleMulti = (selectedOptions) => {
    setusermultiselect(selectedOptions);
  };
  const selectedStatusValues = multistatusfilter?.map(
    (option) => option.label
  ); // Use .label to get the pipeline_status
  const formattedStatusValues = selectedStatusValues?.join(",");

  const selectedUserIds = usermultiselect?.map((option) => option.value);
  const formattedUserIds = selectedUserIds?.join(",");
  const sortingOrderArray = {
    created_at: "Created Date",
    op_status: "Status",
    name: "Lead",
    value: "Value",
  };
  const [selectedSortingOrder, setSelectedSortingOrder] = useState(
    Object.keys(sortingOrderArray)[0]
  );
  const handleSortingOrderChange = (event) => {
    setSelectedSortingOrder(event.target.value);
  };

  const [hideDeletedArchived, setHideDeletedArchived] = useState(1);
  const handleCheckboxChange = (event) => {
    const newValue = hideDeletedArchived === 0 ? 1 : 0;
    setHideDeletedArchived(newValue);
  };

  const handleDateChange = (selectedDates) => {
    if (selectedDates.length === 2) {
      setCreatedDateStart(moment(selectedDates[0]).format(org_date?.date_format_js));
      setCreatedDateEnd(moment(selectedDates[1]).format(org_date?.date_format_js));
    } else {
      setCreatedDateStart(null);
      setCreatedDateEnd(null);
    }
  };
  const handleRemovalDateChange = (selectedRemovalDates) => {
    if (selectedRemovalDates.length === 2) {
      setRemovalDateStart(moment(selectedRemovalDates[0]).format(org_date?.date_format_js));
      setRemovalDateEnd(moment(selectedRemovalDates[1]).format(org_date?.date_format_js));
    } else {
      setRemovalDateStart(null);
      setRemovalDateEnd(null);
    }
  };
  const propertiesToSearch = filteredColumns.map((column) => column.accessor);

  function filterData(data, searchFilter) {
    console.log(searchFilter)
    if (searchFilter != "") {
      return data.filter((item) => {
        // Define the properties you want to search for matches

        // Check if any property contains the searchFilter
        return propertiesToSearch.some((property) => {
          const propertyValue = item[property] || ''; // Handle cases where the property is null or undefined
          return propertyValue.toString().toLowerCase().includes(searchFilter.toLowerCase());
        });
      });
    } else {
      return data;
    }
  }

  function filterAndEnsureUniqueness(dataArray) {
    const uniqueRecords = {};
    
    // Use reduce to filter and ensure uniqueness
    const filteredArray = dataArray.reduce((accumulator, record) => {
      if (!uniqueRecords[record.job_id]) {
        uniqueRecords[record.job_id] = true;
        accumulator.push(record);
      }
      return accumulator;
    }, []);
  
     return filteredArray;
  }

  const pageOptions = React.useMemo(() => {
    const pageCount = Math.ceil(totalRecords / pageSize);
    return [...Array(pageCount).keys()];
  }, [totalRecords, pageSize]);
  const filter = (val) => {

    if (val == "clear") {
      setData([]);
      setOrderList([]);
      setPageIndex(0);
    }

    const selectedDateFormat = org_date?.date_format;
    setisLoading(true);
    const formattedStatusValues = selectedStatusValues?.join(",");
    const selectedUserIds = usermultiselect?.map((option) => option.value);
    const formattedUserIds = selectedUserIds?.join(",");
    const formData = {
      job_date_start: removalDateStart,
      job_date_end: removalDateEnd,
      created_date_start: createdDateStart,
      created_date_end: createdDateEnd,
      opportunity_status: statusToSelect,
      user_id: formattedUserIds,
      sorting_order: selectedSortingOrder,
      sort_descending: hideDeletedArchived,
      selected_date_format: selectedDateFormat
    };

    const apiUrl = "api/opportunity/data?page=" + pageIndex + "&size=" + pageSize;
    axios
      .get(apiUrl, { params: formData })
      .then((res) => {
        console.log(data.length,"dataTotal")
        console.log(res.total,"dataTotal")
        
        // if (data.length >= res.total) {
          if (val == 'clear') {
            setOrderList(res.data.original.data);
            setData(res.data.original.data);
          }else {
            console.log(res.data.original.data,"ftData")
            const newRecords = filterAndEnsureUniqueness([...orderList, ...res.data.original.data]);
            const newData = filterAndEnsureUniqueness([...data, ...res.data.original.data]);
            setData(newData);
            setOrderList(newRecords);
            // setData((prevData) => [...prevData, ...res.data.original.data]);
            // setOrderList((prevData) => [...prevData, ...res.data.original.data]);
          }
          setTotalRecords(res.total);
        // }
      })
      .catch((error) => {
        console.error(error);
        toast.error("An error occurred while fetching data.", {
          theme: "light",
        });
      })
      .finally(() => {
        setcol1(false)
        setisLoading(false);
      });
  };

  console.log(data,"dataTotal")
  console.log(statusToSelect,"statusSelect")

  const resetTable = () => {
    setCreatedDateStart(null);
    setCreatedDateEnd(null);
    setRemovalDateStart(null);
    setRemovalDateEnd(null);
    setstatusToSelect(listData?.statusToSelect.join(','));
    setmultistatusfilter([]);
    setusermultiselect([]);
    setSelectedSortingOrder('created_at');
    setHideDeletedArchived(1);
    setcol1(false)
    getData()
  }

  if (selectedSortingOrder == "") {
    orderList?.sort((a, b) => a.job.job_number - b.job.job_number);
  }
  const col_addTask = () => {
    // setAddTask(!addTask);
    setModalLead(true);
  };
  const handlesClick = (item) => {
    const value = item.pipeline_status;
    setSelectedValue(value);
    console.log(value, item.id, "val")
  };
  const handleFormSubmit = (event) => {
    // setisLoading(true);
    event.preventDefault();
    if(selectedLeadIds == '')
    {
      toast.error("Select atleast one OPP# to change its status.", { theme: "light" });
      setisLoading(false);
      return;
    }
    else if (selectedValue == null) {
      toast.error("Status selection is required.", { theme: "light" });
      setisLoading(false);
      return; 
    } 
    let formData = {
      ids: selectedLeadIds,
      cstatus: selectedValue,
    };
    console.log(formData, "selec")
    axios.post("/api/opportunity/ajaxChangeStatus", formData).then((res) => {
      toast.success(res.message, { theme: "light" });
      // setAddTask(!addTask);
      setModalLead(false);
      setSelectedLeadIds([]);
      setSelectedValue();
      // getData("clear");
      // getData();
      window.location.reload();
    }
    ).catch((error) => {
      console.error(error);
    })
    // .finally(() => {
    //   setisLoading(false);
    // })
  };
  const [modallead, setModalLead] = useState(false);

  const togglelead = useCallback(() => {
    if (modal) {
      console.log("id")
    } else {
      setModalLead(true);
    }
  }, [modal]);
  //Filter end
  document.title = "Opporunities | Onexfort";
  return (
    <React.Fragment>
      <div className="page-content">
        <DeleteModal
          show={deleteModal}
          onDeleteClick={handleDeleteOrder}
          onCloseClick={() => setDeleteModal(false)}
        />

        <DeleteModal
          show={deleteModalMulti}
          onDeleteClick={() => {
            deleteMultiple();
            setDeleteModalMulti(false);
          }}
          onCloseClick={() => setDeleteModalMulti(false)}
        />
        <Container fluid>
          <BreadCrumb title="Opportunities" pageTitle="Onexfort" />
          <Accordion id="default-accordion-example">
            <AccordionItem>
              <h2 className="accordion-header" id="headingOne">
                <button
                  className={classnames("accordion-button fw-semibold", {
                    collapsed: !col1,
                  })}
                  type="button"
                  onClick={t_col1}
                  style={{ cursor: "pointer" }}
                >
                  Search Filters
                </button>
              </h2>
              <Collapse
                isOpen={col1}
                className="accordion-collapse"
                id="collapseOne"
              >
                <div className="accordion-body">
                  <Row>
                    <Col lg={4} md={6}>
                      <div className="mb-3">
                        <label
                          htmlFor="multiselect"
                          className="form-label text-muted"
                        >
                          Opportunity Status
                        </label>
                        <Select
                          id="multiselect"
                          value={statusfilter
                            .filter(item => statusToSelect.includes(item.pipeline_status))
                            .map(item => ({
                              value: item.id,
                              label: item.pipeline_status,
                            }))
                          }
                          isMulti
                          onChange={(selectedOption) => {
                            const selectedStatusNames = selectedOption.map(option => option.label);
                            const selectedStatusString = selectedStatusNames.join(',');
                            setstatusToSelect(selectedStatusString);
                          }}
                          options={statusfilter.map(item => {
                            console.log(item);
                            return {
                              value: item.id,
                              label: item.pipeline_status,
                            };
                          })}
                          maxMenuHeight={200}
                        />

                      </div>
                    </Col>
                    <Col lg={4} md={6}>
                      <div className="mb-3">
                        <Label
                          htmlFor="choices-multiple-default"
                          className="form-label text-muted"
                        >
                          Users
                        </Label>
                        <Select
                          id="multiselect"
                          value={usermultiselect}
                          isMulti
                          onChange={(selectedOption) => {
                            userhandleMulti(selectedOption);
                          }}
                          options={userfilter?.map((item) => ({
                            value: item.id,
                            label: item.name,
                          }))}
                          maxMenuHeight={200}
                        />
                      </div>
                    </Col>
                    <Col lg={2}>
                    <div className="form-check form-radio-pad form-check-right mb-2">
                        <Input className="form-check-input"
                            type="checkbox"
                            name="formCheckboxRight"
                            id="formCheckboxRight1"
                            checked={hideDeletedArchived}
                            onChange={handleCheckboxChange} />
                        <Label className="form-check-label" for="formCheckboxRight1">
                            Hide Deleted & Archived
                        </Label>
                    </div>
                </Col>
                <Col lg={2} className="d-flex justify-content-end">
                    <div className="form-check form-radio-pad form-check-right mb-2">
                    <button onClick={()=>exportToexcel()} className='border-0 text-end'>
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
                    <path fill="#4CAF50" d="M41,10H25v28h16c0.553,0,1-0.447,1-1V11C42,10.447,41.553,10,41,10z"></path><path fill="#FFF" d="M32 15H39V18H32zM32 25H39V28H32zM32 30H39V33H32zM32 20H39V23H32zM25 15H30V18H25zM25 25H30V28H25zM25 30H30V33H25zM25 20H30V23H25z"></path><path fill="#2E7D32" d="M27 42L6 38 6 10 27 6z"></path><path fill="#FFF" d="M19.129,31l-2.411-4.561c-0.092-0.171-0.186-0.483-0.284-0.938h-0.037c-0.046,0.215-0.154,0.541-0.324,0.979L13.652,31H9.895l4.462-7.001L10.274,17h3.837l2.001,4.196c0.156,0.331,0.296,0.725,0.42,1.179h0.04c0.078-0.271,0.224-0.68,0.439-1.22L19.237,17h3.515l-4.199,6.939l4.316,7.059h-3.74V31z"></path>
                    </svg>
                    </button>
                    </div>
                </Col>
                  </Row>
                  <Row>
                    <Col lg={2}>
                      <div className="mb-3">
                        <Label for="dateRangeInput" className="form-label">
                          Created Date
                        </Label>

                        <Flatpickr
                          className="form-control" placeholder='Start Date'
                          options={{
                            dateFormat: org_date?.date_format,
                          }}
                          value={createdDateStart}
                          onChange={(selectedDates) => {
                            if (selectedDates.length === 1) {
                              setCreatedDateStart(moment(selectedDates[0]).format(org_date?.date_format_js));
                            } else {
                              setCreatedDateStart(null);
                            }
                          }}
                        />

                      </div>
                    </Col>
                    <Col lg={2}>
                      <div className="mb-3">
                        <Label for="createdDateinput" className="form-label">End Date</Label>
                        <Flatpickr
                          className="form-control" placeholder='End Date'
                          options={{
                            dateFormat: org_date?.date_format,
                          }}
                          value={createdDateEnd}
                          onChange={(selectedDates) => {
                            if (selectedDates.length === 1) {
                              console.log(org_date)
                              setCreatedDateEnd(moment(selectedDates[0]).format(org_date?.date_format_js));
                            } else {
                              setCreatedDateEnd(null);
                            }
                          }}

                        />
                      </div>
                    </Col>
                    <Col lg={2}>
                      <div className="mb-3">
                        <Label for="createdDateinput" className="form-label">Job Start Date</Label>
                        <Flatpickr
                          className="form-control" placeholder='Start Date'
                          options={{
                            dateFormat: org_date?.date_format,
                          }}
                          value={removalDateStart}
                          onChange={(selectedDates) => {
                            if (selectedDates.length === 1) {
                              setRemovalDateStart(moment(selectedDates[0]).format(org_date?.date_format_js));
                            } else {
                              setRemovalDateStart(null);
                            }
                          }}
                        />
                      </div>
                    </Col>

                    <Col lg={2}>
                      <div className="mb-3">
                        <Label for="dateRangeInput" className="form-label">
                          Job End Date
                        </Label>

                        <Flatpickr
                          className="form-control" placeholder='End Date'
                          options={{
                            dateFormat: org_date?.date_format,
                          }}
                          value={removalDateEnd}
                          onChange={(selectedDates) => {
                            if (selectedDates.length === 1) {
                              setRemovalDateEnd(moment(selectedDates[0]).format(org_date?.date_format_js));
                            } else {
                              setRemovalDateEnd(null);
                            }
                          }}

                        />


                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={2}>
                      <div className="mb-3">
                        <Label
                          htmlFor="choices-multiple-default"
                          className="form-label text-muted"
                        >
                          sorting Order
                        </Label>
                        <select
                          className="form-control"
                          name="sorting_order"
                          id="sorting_order"
                          value={selectedSortingOrder}
                          onChange={handleSortingOrderChange}
                        >
                          {Object.keys(sortingOrderArray).map((key) => (
                            <option key={key} value={key}>
                              {sortingOrderArray[key]}
                            </option>
                          ))}
                        </select>
                      </div>
                    </Col>
                    <Col md={2}>
                      <div className="form-check form-radio-pad form-check-right mb-2">
                        <Input
                          className="form-check-input"
                          type="checkbox"
                          name="formCheckboxRight"
                          id="formCheckboxRight1"
                          checked={hideDeletedArchived}
                          onChange={handleCheckboxChange}
                        />
                        <Label
                          className="form-check-label"
                          for="formCheckboxRight1"
                        >
                          Descending
                        </Label>
                      </div>
                    </Col>

                    <Col md={4}>
                      <div className="text-start">
                        <button
                          type="submit"
                          onClick={() => filter("clear")}
                          className="btn form-btn-marg btn-primary"
                        >
                          Apply
                        </button>
                        <button
                          type="submit"
                          onClick={() => resetTable()}
                          className="btn form-btn-marg btn-primary"
                        >
                          Reset
                        </button>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Collapse>
            </AccordionItem>
          </Accordion>
          <Row>
            <Col lg={12}>
              <Card id="orderList">
                <CardHeader className="card-header border-0">
                  <Row className="align-items-center gy-3">
                    <div className="col-sm">
                      <Button
                        className="btn btn-brown add-btn"
                        onClick={col_addTask}
                      >
                        Change Opp Status
                      </Button>

                    </div>
                    <div className="col-sm-auto">
                      <div className="d-flex gap-1 flex-wrap">
                        <button
                          type="button"
                          className="btn btn-brown add-btn"
                          id="create-btn"
                          onClick={() => {
                            setIsEdit(false);
                            setModalOpen(true);
                          }}
                        >
                          <i className="ri-add-line align-bottom me-1"></i>{" "}
                          Create Opportunity
                        </button>{modalOpen && <OpportunityModal setModalOpen={setModalOpen} modalOpen={modalOpen} />}{" "}
                        {isMultiDeleteButton && (
                          <button
                            className="btn btn-soft-danger"
                            onClick={() => setDeleteModalMulti(true)}
                          >
                            <i className="ri-delete-bin-2-line"></i>
                          </button>
                        )}
                      </div>
                    </div>
                  </Row>

                  {/* <Collapse isOpen={addTask} id="collapseWithicon">
                  
                  <div className=" mt-2 contact-sec-bottom">
                    <Col >
                      <div className="mt-2">
                        <label htmlFor="userSelect" className="form-label">
                          Change Customer Status
                        </label>
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
                          width:"50%"
                        }}
                      >
                        {crmleadstatuses?.map((item) => (
                          <div
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
                    </Col>
                    <div className="hstack gap-2 mt-2 mb-2">
                      <Button className="btn btn-light" onClick={col_addTask}>
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="btn btn-brown"
                        onClick={handleFormSubmit}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                </Collapse>  */}

                </CardHeader>
                <Modal id="showModal" isOpen={modallead} toggle={togglelead} centered size="lg">
                  <ModalHeader className="bg-soft-info p-3" toggle={togglelead} onClick={() => { setModalLead(false); }} >
                    Change Opp Status
                  </ModalHeader>
                  <ModalBody>
                    {/* <div className=" mt-2 contact-sec-bottom"> */}
                    <p>Select Status</p>
                      <Col >
                        <div className="mt-2 contact-sec-bottom" >

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
                              width: "100%"
                            }}
                          >
                            {crmleadstatuses?.map((item) => (
                              <div
                                style={{
                                  color: "#000",
                                  backgroundColor: item.status_colour,
                                  cursor: "pointer",
                                  border: item.pipeline_status === selectedValue ? "1px solid black" : "none",
                                  padding: "5px", // Add padding for spacing
                                  marginBottom: "5px", // Add margin bottom for spacing between items
                                }}
                                key={item.pipeline_status}
                                onClick={() => handlesClick(item)}
                              >
                                {item.pipeline_status}
                              </div>
                            ))}
                          </div>
                        </div>
                      </Col>
                    {/* </div> */}
                  </ModalBody>
                  <ModalFooter>
                    <div className="hstack gap-2 justify-content-end">
                      <button type="button" className="btn btn-light" onClick={() => { setModalLead(false); }} > Close </button>
                      <button type="submit" className="btn btn-success" id="add-btn" onClick={handleFormSubmit}>Save</button>
                    </div>
                  </ModalFooter>

                </Modal>
                <CardBody className="pt-0">
                  <div>
                  {console.log(filterData(orderList, searchVal),"filt")}
                  {console.log(orderList,"filt1")}
                    <CustomTableContainer
                      columns={filteredColumns}
                      totalRecords={totalRecords}
                      data={filterData(orderList, searchVal)}
                      isGlobalFilter={true}
                      isAddUserList={false}
                      searchVal={searchVal}
                      customPageSize={100}
                      customPageOptions={pageOptions}
                      divClass="table-responsive table-card mb-1"
                      tableClass="align-middle table-nowrap"
                      theadClass="table-light text-muted text-uppercase"
                      handleOrderClick={handleOrderClicks}
                      isOrderFilter={true}
                      SearchPlaceholder="Search for order ID, customer, order status or something..."
                      pageIndex={pageIndex}
                      setSearchVal={setSearchVal}
                      setPageSize={setPageSize}
                      setPageIndex={setPageIndex}
                      toPreviousPage={() => setPageIndex(pageIndex - 1)}
                      toNextPage={() => setPageIndex(pageIndex + 1)}
                    />
                    {isLoading && (
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
                    )}
                  </div>

                  <ToastContainer closeButton={false} limit={1} />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Opportunities;