import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Card,
  CardBody,
  Col,
  Container,
  CardHeader,
  Nav,
  NavItem,
  NavLink,
  Row,
  Modal,
  ModalHeader,
  Form,
  TabContent,
  TabPane,
  ModalBody,
  Label,
  Input,
  FormFeedback,
} from "reactstrap";
import axios from "axios";
import { get_cookie } from "../../helpers/get_cookie";


import GoogleAutocomplete from "react-google-autocomplete";

import { toast, ToastContainer } from "react-toastify";
import * as moment from "moment";
import { Link } from "react-router-dom";
import Select from "react-select";
import classnames from "classnames";
import Flatpickr from "react-flatpickr";


const OpportunityModal = ({ setModalOpen, modalOpen }) => {

  let [data, setData] = useState([]);
  const [pickcommercial, setpickcommercial] = useState();
  let [dataa, setDataa] = useState([]);
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
  const [loading, setLoading] = useState(false);


  const tabChange = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };


  // console.log(isChecked,"helooowww reply");

  useEffect(() => {
    const user = JSON.parse(get_cookie("authUser"));
    var tenant_id = user.tenant_id;
    var datavalue = {
      tenant_id: tenant_id,
    };
    setEstJobdate(moment().format("DD/MM/YYYY"))
    axios.get("/api/opportunity/data", tenant_id).then((res) => {
      console.log(data);
      setData(res.data);
      setOrderList(res.data);
      console.log(res.data);
      setOpp(res.opportunity_number);
    });

    axios
      .get("/api/listdata")
      .then((response) => {
        console.log(response);
        setLeadTypes(response.lead_type);
        if (response?.lead_type.length > 0) {
          setLeadInfo(response?.lead_type[0].options)
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
      })
      .catch((error) => {
        console.error("Error fetching lead types:", error);
      });

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
        setTableData(response.displayColoumn)
      })
      .catch((error) => {
        console.error("Error fetching lead types:", error);
      });


  }, []);

  const orders = data;

  const [orderList, setOrderList] = useState([]);
  const [order, setOrder] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteModalMulti, setDeleteModalMulti] = useState(false);


  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      setOrder(null);
    } else {
      setModal(true);
      setDate(defaultdate());
    }
  }, [modal]);


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

  const deleteCheckbox = () => {
    const ele = document.querySelectorAll(".orderCheckBox:checked");
    ele.length > 0
      ? setIsMultiDeleteButton(true)
      : setIsMultiDeleteButton(false);
    setSelectedCheckBoxDelete(ele);
  };

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

    const suburbComponent = place?.address_components.find((component) =>
      component.types.includes("locality")
    );
    const stateComponent = place?.address_components.find((component) =>
      component.types.includes("administrative_area_level_1")
    );
    const postalCodeComponent = place?.address_components.find((component) =>
      component.types.includes("postal_code")
    );
    const streetComponent = place?.address_components.find((component) =>
      component.types.includes("route"));

    const streetNumberComponent = place?.address_components.find((component) =>
      component.types.includes("street_number")
    );

    const unitComponent = place?.addressComponents?.find((component) =>
      component.types.includes("subpremise")
    );
    let selectedStreetNumber = "";
    if (streetNumberComponent) {
      selectedStreetNumber = streetNumberComponent.long_name;
    }

    let selectedUnitNumber = "";
    if (unitComponent) {
      selectedUnitNumber = unitComponent.long_name;
    }

    let selectedStreet = "";
    if (streetComponent) {
      selectedStreet = streetComponent.long_name;
    }
    let selectedSuburb = "";
    if (suburbComponent) {
      selectedSuburb = suburbComponent.long_name;
    }

    let selectedState = "";
    if (stateComponent) {
      selectedState = stateComponent.short_name;
    }



    let selectedPostalCode = "";
    if (postalCodeComponent) {
      selectedPostalCode = postalCodeComponent.long_name;
    }


    setcommercialselectedSuburb(`${selectedSuburb} ${selectedState}`);
    setcommercialselectedCity(` ${selectedUnitNumber} ${selectedStreetNumber} ${selectedStreet}`);
    setcommercialselectedPostcode(selectedPostalCode);

    // Update selected location based on the presence of country component
    if (checked) {
      setpickcommercial(`${selectedSuburb}, ${selectedState}`);
    } else {
      const streetNumberComponent = place?.address_components.find((component) =>
        component.types.includes("street_number")
      );
      const streetRouteComponent = place?.address_components.find((component) =>
        component.types.includes("route")
      );

      let selectedStreetNumber = "";
      if (streetNumberComponent) {
        selectedStreetNumber = streetNumberComponent.long_name;
      }

      let selectedStreetRoute = "";
      if (streetRouteComponent) {
        selectedStreetRoute = streetRouteComponent.long_name;
      }

      setpickcommercial(`${selectedStreetNumber} ${selectedStreetRoute}, ${selectedSuburb}, ${selectedState} ${selectedPostalCode}`);
    }
  };




  const residentialplace = (place) => {
    const checked = document.getElementById("is_commercial").checked;

    const suburbComponent = place?.address_components.find((component) =>
      component.types.includes("locality")
    );
    const stateComponent = place?.address_components.find((component) =>
      component.types.includes("administrative_area_level_1")
    );
    const postalCodeComponent = place?.address_components.find((component) =>
      component.types.includes("postal_code")
    );
    const streetComponent = place?.address_components?.find((component) =>
      component.types.includes("route")
    );
    const streetNumberComponent = place?.address_components.find((component) =>
      component.types.includes("street_number")
    );
    const unitComponent = place?.addressComponents?.find((component) =>
      component.types.includes("subpremise")
    );
    let selectedStreetNumber = "";
    if (streetNumberComponent) {
      selectedStreetNumber = streetNumberComponent.long_name;
    }
    let selectedSuburb = "";
    if (suburbComponent) {
      selectedSuburb = `${suburbComponent.long_name}`;
      if (stateComponent) {
        selectedSuburb += `, ${stateComponent.short_name}`;
      }
    }

    let selectedUnitNumber = "";
    if (unitComponent) {
      selectedUnitNumber = unitComponent.long_name;
    }

    let selectedState = "";
    if (stateComponent) {
      selectedState = stateComponent.short_name;
    }

    let selectedPostalCode = "";
    if (postalCodeComponent) {
      selectedPostalCode = postalCodeComponent.long_name;
    }
    let selectedStreet = "";
    if (streetComponent) {
      selectedStreet = streetComponent.long_name;
    }


    setselectedSuburb(`${selectedSuburb}`);
    setSelectedcity(` ${selectedUnitNumber} ${selectedStreetNumber} ${selectedStreet}`);
    setselectedPostcode(selectedPostalCode);

    // Update selected location based on the "is_commercial" checkbox
    if (checked) {

     console.log ("if")
      setplace(`${selectedSuburb}`);
    } else {

      console.log ("else")
      const streetNumberComponent = place?.address_components.find((component) =>
        component.types.includes("street_number")
      );
      const streetRouteComponent = place?.address_components.find((component) =>
        component.types.includes("route")
      );

      let selectedStreetNumber = "";
      if (streetNumberComponent) {
        selectedStreetNumber = streetNumberComponent.long_name;
      }

      let selectedStreetRoute = "";
      if (streetRouteComponent) {
        selectedStreetRoute = streetRouteComponent.long_name;
      }

      setplace(`${selectedStreetNumber} ${selectedStreetRoute}, ${selectedSuburb},  ${selectedPostalCode}`);
    }
  };

  const dropoffselect = (place) => {
    const checked = document.getElementById("is_suburb").checked;

    const suburbComponent = place?.address_components.find((component) =>
      component.types.includes("locality")
    );
    const stateComponent = place?.address_components.find((component) =>
      component.types.includes("administrative_area_level_1")
    );
    const postalCodeComponent = place?.address_components.find((component) =>
      component.types.includes("postal_code")
    );
    const streetComponent = place?.address_components?.find((component) =>
      component.types.includes("route")
    );
    const streetNumberComponent = place?.address_components.find((component) =>
      component.types.includes("street_number")
    );


    const unitComponent = place?.addressComponents?.find((component) =>
      component.types.includes("subpremise")
    );

    let selectedStreetNumber = "";
    if (streetNumberComponent) {
      selectedStreetNumber = streetNumberComponent.long_name;
    }

    let selectedSuburb = "";
    if (suburbComponent) {
      selectedSuburb = suburbComponent.long_name;
    }

    let selectedUnitNumber = "";
    if (unitComponent) {
      selectedUnitNumber = unitComponent.long_name;
    }


    let selectedState = "";
    if (stateComponent) {
      selectedState = stateComponent.short_name;
    }

    let selectedPostalCode = "";
    if (postalCodeComponent) {
      selectedPostalCode = postalCodeComponent.long_name;
    }
    let selectedStreet = "";
    if (streetComponent) {
      selectedStreet = streetComponent.long_name;
    }

    setdropselectedCity(`  ${selectedUnitNumber} ${selectedStreetNumber} ${selectedStreet}`);
    setdropselectedSuburb(`${selectedSuburb} ${selectedState}`);
    setdropselectedPostcode(selectedPostalCode);

    // Update selected location based on the "is_suburb" checkbox
    if (!checked) {
      const streetNumberComponent = place?.address_components.find((component) =>
        component.types.includes("street_number")
      );
      const streetRouteComponent = place?.address_components.find((component) =>
        component.types.includes("route")
      );

      let selectedStreetNumber = "";
      if (streetNumberComponent) {
        selectedStreetNumber = streetNumberComponent.long_name;
      }

      let selectedStreetRoute = "";
      if (streetRouteComponent) {
        selectedStreetRoute = streetRouteComponent.long_name;
      }

      // setdropselectedCity(`${selectedStreetNumber} ${selectedStreetRoute}, ${selectedSuburb}, ${selectedState} ${selectedPostalCode}`);
      setdropplace(`${selectedStreetNumber} ${selectedStreetRoute}, ${selectedSuburb}, ${selectedState} ${selectedPostalCode}`);
    } else {
      setdropplace(`${selectedSuburb}, ${selectedState}`);
    }
  };

  const residentialdropoffselect = (place) => {
    const checked = document.getElementById("is_commercial").checked;
    const suburbComponent = place?.address_components?.find((component) =>
      component.types.includes("locality")
    );
    const stateComponent = place?.address_components?.find((component) =>
      component.types.includes("administrative_area_level_1")
    );
    const postalCodeComponent = place?.address_components?.find((component) =>
      component.types.includes("postal_code")
    );

    const streetComponent = place?.address_components.find((component) =>
      component.types.includes("route")
    );

    const streetNumberComponent = place?.address_components.find((component) =>
      component.types.includes("street_number")
    );
    const unitComponent = place?.addressComponents?.find((component) =>
      component.types.includes("subpremise")
    );

    let selectedStreet = "";
    if (streetComponent) {
      selectedStreet = streetComponent.long_name;
    }

    let selectedStreetNumber = "";
    if (streetNumberComponent) {
      selectedStreetNumber = streetNumberComponent.long_name;
    }

    let selectedSuburb = "";
    if (suburbComponent) {
      selectedSuburb = suburbComponent.long_name;
    }


    let selectedUnitNumber = "";
    if (unitComponent) {
      selectedUnitNumber = unitComponent.long_name;
    }

    let selectedState = "";
    if (stateComponent) {
      selectedState = stateComponent.short_name;
    }

    let selectedPostalCode = "";
    if (postalCodeComponent) {
      selectedPostalCode = postalCodeComponent.long_name;
    }


    setresdropselectedSuburb(`${selectedSuburb} ${selectedState}`);
    setresdropselectedCity(`  ${selectedUnitNumber} ${selectedStreetNumber} ${selectedStreet}`);
    setresdropselectedPostcode(selectedPostalCode);

    // Update selected location based on the "is_commercial" checkbox
    if (checked) {
      setdropresplace(`${selectedSuburb}, ${selectedState}`);
    } else {
      const streetNumberComponent = place?.address_components.find((component) =>
        component.types.includes("street_number")
      );
      const streetRouteComponent = place?.address_components.find((component) =>
        component.types.includes("route")
      );

      let selectedStreetNumber = "";
      if (streetNumberComponent) {
        selectedStreetNumber = streetNumberComponent.long_name;
      }

      let selectedStreetRoute = "";
      if (streetRouteComponent) {
        selectedStreetRoute = streetRouteComponent.long_name;
      }

      setdropresplace(`${selectedStreetNumber} ${selectedStreetRoute}, ${selectedSuburb}, ${selectedState} ${selectedPostalCode}`);
    }
  };

  // Customber Column
  console.log("orderList", orderList);
  const columns = useMemo(
    () => [
      {
        Header: "Opp#",
        tableId: "opp",
        accessor: "job_number",
        filterable: false,
      },
      {
        Header: "Lead",
        tableId: 2,
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
              {cell.cell.row.original.name}
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
        tableId: 5,
        accessor: "mobile",
        filterable: false,
      },

      {
        Header: "Pickup Suburb",
        tableId: 27,
        accessor: "pickup_suburb",
        filterable: false,
      },
      {
        Header: "Drop Off Suburb",
        tableId: 28,
        accessor: "delivery_suburb",
        filterable: false,
      },
      {
        Header: "Lead Info",
        tableId: 6,
        accessor: "lead_info",
        filterable: false,
      },
      {
        Header: "Company",
        tableId: 7,
        accessor: "company",
        filterable: false,
      },
      {
        Header: "Type",
        tableId: 8,
        accessor: "type",
        filterable: false,
      },
      {
        Header: "Job Date",
        tableId: 9,
        accessor: "job_date",
      },

      {
        Header: "Created Date",
        tableId: 10,
        accessor: "created_date",
      },
      {
        Header: "Status",
        tableId: 11,
        accessor: "_status",
        filterable: false,
      },

      {
        Header: "User",
        tableId: 12,
        accessor: "user_name",
        filterable: false,
      },
      {
        Header: "tags",
        tableId: 13,
        accessor: "tags",
        filterable: false,
      },
      {
        Header: "Lead Status",
        accessor: "status",
        tableId: 14,
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
    ],
    [handleOrderClick, checkedAll]
  );

  console.log(tableData)

  const filteredColumns = columns.filter((column) => {
    if (column.tableId === "opp") {
      return true
    }
    const matchingDisplay = tableData.find(
      (displayObj) => displayObj.id === column.tableId
    );
    return matchingDisplay && matchingDisplay.display === 1;
  });

  console.log(filteredColumns)

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

  const handleSubmit = (event) => {
    event.preventDefault();
     // Check if already loading, return early to prevent multiple submissions
      if (loading) {
        return;
      }

      setLoading(true);

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
          setLoading(false);
          return;
        }
      }
      // Check if required fields are entered
      if (!orgName) {
        toast.error("Please enter Name", { theme: "light" });
        setLoading(false);
        return;
      }
      if (!mobile) {
        toast.error("Please enter Mobile", { theme: "light" });
        setLoading(false);
        return;
      }
      if (!email) {
        toast.error("Please enter Email", { theme: "light" });
        setLoading(false);
        return;
      }
      // if (!selectedCity) {
      //   toast.error("Please enter Pickup Address", { theme: "light" });
      //   setLoading(false);
      //   return;
      // }
      // if (!resdropselectedCity) {
      //   toast.error("Please enter Drop-off Address", { theme: "light" });
      //   setLoading(false);
      //   return;
      // }

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
        setLoading(false);
        return; // Exit the function early if companyname is not selected
      }

      if (customerid === "none") {
        toast.error("Please select customer name", { theme: "light" });
        setLoading(false);
        return; // Exit the function early if customerid is not selected
      }

      if (estjobdate === null) {
        // If estjobdate is not selected, set it to today's date
        setEstJobdate(moment().format("DD/MM/YYYY"));
        setLoading(false);
        return;
      }

      if (pickupcontactname.trim() === "") {
        toast.error("Please enter Job Contact Name", { theme: "light" });
        setLoading(false);
        return;
      }

      if (pickupemail.trim() === "") {
        toast.error("Please enter Job Contact Email", { theme: "light" });
        setLoading(false);
        return;
      }

      if (pickupemail !== "") {
        const emailPattern = /^[A-Za-z0-9._+-]+@[A-Za-z._-]+\.[A-Za-z]{2,}$/;
        const isValid = emailPattern.test(pickupemail);
        if (!isValid) {
          toast.error("Invalid email", { theme: "light" });
          setLoading(false);
          return;
        }
      }

      if (pickupmobile.trim() === "") {
        toast.error("Please enter Job Contact mobile", { theme: "light" });
        setLoading(false);
        return;
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
  
  if (Array.isArray(orderList)) {
    orderList.sort((a, b) => a.job.job_number - b.job.job_number);
  } else {
    // Handle the case where orderList is not an array
    console.error("orderList is not an array.");
  }


  return (
    <Modal
      id="showModal"
      className="modal-dialog-edit"
      isOpen={modalOpen}
      size="xl"
      centered
    >
      <ModalHeader
        className="bg-soft-primary p-3"

      >
        New Opportunity
      </ModalHeader>
      <Form
        className="tablelist-form"
        onSubmit={(e) => {
          e.preventDefault();

          // Call the modified handleSubmit function here
          handleSubmit(e);
          return false;
        }}
      >
        <CardHeader>
          <Nav
            className="nav-tabs-custom rounded card-header-tabs justify-content-around border-bottom-0 mt-2"
            role="tablist"
          >
            <NavItem>
              <NavLink
                className={classnames(
                  { active: activeTab === "1" },
                  "text-body"
                )}
                onClick={() => {
                  tabChange("1");
                }}
              >
                <i className="fas fa-home"></i>
                Residential
                {/* <Input type="text" value={type} onChange={(e) => setType(e.target.value)} /> */}
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                to="#"
                className={classnames(
                  { active: activeTab === "2" },
                  "text-body"
                )}
                onClick={() => {
                  tabChange("2");
                }}
                type="button"
              >
                <i className="far fa-user"></i>
                Commercial
                {/* <Input type="text" value={type} onChange={(e) => setType(e.target.value)} /> */}
              </NavLink>
            </NavItem>
          </Nav>
        </CardHeader>
        <CardBody className="p-4">
          <TabContent activeTab={activeTab}>
            <TabPane tabId="1">
              <Form>
                <Row>
                  <Col lg={4}>
                    <div className="mb-3">
                      <Label
                        htmlFor="nameInput"
                        className="form-label"
                      >
                        Name
                      </Label>
                      <Input
                        type="text"
                        value={orgName}
                        onChange={(e) =>
                          setOrgName(e.target.value)
                        }
                        className="form-control"
                        id="nameInput"
                        placeholder="Enter your name"
                        defaultValue=""
                      />
                    </div>
                  </Col>
                  <Col lg={4}>
                    <div className="mb-3">
                      <Label
                        htmlFor="mobile"
                        className="form-label"
                      >
                        Mobile
                      </Label>
                      <Input
                        type="text"
                        value={mobile}
                        onChange={(e) =>
                          setMobile(e.target.value)
                        }
                        className="form-control"
                        id="mobile"
                        placeholder="Enter your mobile number"
                        defaultValue=""
                      />
                    </div>
                  </Col>

                  <Col lg={4}>
                    <div className="mb-3">
                      <Label
                        htmlFor="emailInput"
                        className="form-label"
                      >
                        Email
                      </Label>
                      
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-control"
                        id="emailInput"
                        placeholder="Enter your email"
                        defaultValue=""
                      />
                    </div>
                  </Col>
                </Row>
                <div>
                  <label className="hstack gap-2">
                    <input
                      type="checkbox"
                      id="is_commercial"
                      value={isChecked}
                      // checked={isChecked === "Y"}
                      onChange={(e) => {
                        e.target.checked
                          ? setIsChecked("Y")
                          : setIsChecked("N");
                      }}
                    />
                    <t>Suburb</t>

                  </label>
                </div>
                <Row className="mt-3">
                  <Col lg={6}>
                    <div className="mb-3">
                      <Label for="address" className="form-label">
                        Pickup Address
                      </Label>
                      {isChecked=== "Y" ? (

                      
  <div>
   <label></label>
    <GoogleAutocomplete
      apiKey="AIzaSyB2SMtaVBlqC5v72gqS716BX8R5oXklaFc"
      value={place}
      onChange={(e) => setplace(e.target.value)}
      onPlaceSelected={(place) => residentialplace(place)}
      options={{
        types: ["(regions)"],
        componentRestrictions: {
          country: "au",
        },
      }}
      style={{
        width: "100%",
        height: "40px",
        border: "1px solid #ccc",
        padding: "10px",
        borderRadius: "5px",
        position: "relative",
        zIndex: 9999,
      }}
    />
  </div>
) : (
  <div>
    <GoogleAutocomplete
      apiKey="AIzaSyB2SMtaVBlqC5v72gqS716BX8R5oXklaFc"
      value={place}
      onChange={(e) => setplace(e.target.value)}
      onPlaceSelected={(place) => residentialplace(place)}
      options={{
        types: ["address"],
        componentRestrictions: {
          country: "au",
        },
      }}
      style={{
        width: "100%",
        height: "40px",
        border: "1px solid #ccc",
        padding: "10px",
        borderRadius: "5px",
        position: "relative",
        zIndex: 9999,
      }}
    />
  </div>
)}

 
                     
                    
                    </div>
                  </Col>
                  <Col lg={6}>
                    <div className="mb-3 ">
                      <Label
                        htmlFor="dropoffAddress"
                        className="form-label"
                      >
                        Drop off Address
                      </Label>
                      {isChecked=== "Y" ? (

                      
                    <div>
                    <label></label>
                      <GoogleAutocomplete
                        apiKey="AIzaSyB2SMtaVBlqC5v72gqS716BX8R5oXklaFc"
                        value={dropresplace}
                        onChange={(e) =>
                          setdropresplace(e.target.value)
                        }
                        onPlaceSelected={(place) =>
                          residentialdropoffselect(place)
                        }
                        options={{
                          types: ["(regions)"],
                          componentRestrictions: {
                            country: "au",
                          },
                        }}
                        style={{
                          width: "100%",
                          height: "40px",
                          border: "1px solid #ccc",
                          padding: "10px",
                          borderRadius: "5px",
                          position: "relative",
                          zIndex: 9999,
                        }}
                      />
                    </div>
                     ) : (
                      <div>
                      <GoogleAutocomplete
                        apiKey="AIzaSyB2SMtaVBlqC5v72gqS716BX8R5oXklaFc"
                        value={dropresplace}
                        onChange={(e) =>
                          setdropresplace(e.target.value)
                        }
                        onPlaceSelected={(place) =>
                          residentialdropoffselect(place)
                        }
                        options={{
                          types: ["address"],
                          componentRestrictions: {
                            country: "au",
                          },
                        }}
                        style={{
                          width: "100%",
                          height: "40px",
                          border: "1px solid #ccc",
                          padding: "10px",
                          borderRadius: "5px",
                          position: "relative",
                          zIndex: 9999,
                        }}
                      />
                      </div>
                      )}
                    </div>
                    
                  </Col>
                  <Col lg={6}>
                    <div>
                      <label
                        htmlFor="dateInput"
                        className="form-label"
                      >
                        Date
                      </label>
                      <Flatpickr
                        id="dateInput"
                        className="form-control"
                        value={estjobdate}
                        onChange={(date) =>
                          setEstJobdate(
                            moment(date[0]).format("DD/MM/YYYY")
                          )
                        }
                        options={{
                          dateFormat: "d/m/Y",
                          enableTime: false,
                        }}
                      />
                    </div>
                  </Col>
                  <input
                    id="r_pickup_suburb"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    type="hidden"
                  />
                  <input
                    id="r_pickup_post_code"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    type="hidden"
                  />
                  <input
                    id="r_delivery_suburb"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    type="hidden"
                  />
                  <input
                    id="r_drop_off_post_code"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    type="hidden"
                  />

                  <Col lg={6}>
                    <div className="mb-3">
                      <Label
                        htmlFor="leadInfo"
                        className="form-label"
                      >
                        Lead Info
                      </Label>
                      <select
                        value={leadinfo}
                        onChange={(e) =>
                          setLeadInfo(e.target.value)
                        }
                        className="form-select mb-3"
                      >
                        {leadTypes.length > 0 ? (
                          leadTypes.map((leadType, index) => (
                            <option
                              key={index}
                              value={leadType.options}
                            >
                              {leadType.options}
                            </option>
                          ))
                        ) : (
                          <option value="" disabled>
                            No lead types found
                          </option>
                        )}
                      </select>
                    </div>
                  </Col>

                  <Col lg={6}>
                    <div className="mb-3">
                      <Label
                        htmlFor="company"
                        className="form-label"
                      >
                        Company
                      </Label>
                      <select
                        value={companyname}
                        onChange={(e) =>
                          setCompanyName(e.target.value)
                        }
                        className="form-select mb-3"
                      >

                        {companieslist &&
                          companieslist.length > 0 ? (
                          companieslist.map((company) => (
                            <option
                              key={company.id}
                              value={company.id}
                            >
                              {company.company_name}
                            </option>
                          ))
                        ) : (
                          <option value="" disabled>
                            No companies found
                          </option>
                        )}
                      </select>
                    </div>
                  </Col>

                  <Col lg={6}>
                    <div className="mb-3">
                      <Label
                        htmlFor="opportunityType"
                        className="form-label"
                      >
                        Opportunity Type
                      </Label>
                      <select
                        value={optype}
                        onChange={(e) => setOpType(e.target.value)}
                        //onChange={(e) => testfunc("test")}
                        className="form-select mb-3"
                      >
                        {opportunitytype &&
                          opportunitytype.length > 0 ? (
                          opportunitytype.map(
                            (opportunity, index) => (
                              <option
                                key={index}
                                value={opportunity.id}
                              >
                                {opportunity.options}
                              </option>
                            )
                          )
                        ) : (
                          <option value="">
                            No opportunity types found
                          </option>
                        )}
                      </select>
                    </div>
                  </Col>
                </Row>
              </Form>
            </TabPane>
            <TabPane tabId="2">
              <Form>
                <Row>
                  <Col lg={6}>
                    <div className="mb-3">
                      <Label
                        htmlFor="customer"
                        className="form-label"
                      >
                        Customer
                      </Label>
                      <select
                        value={customerid}
                        onChange={(e) =>
                          setCustomerid(e.target.value)
                        }
                        className="form-select mb-3"
                      >

                        {customers && customers.length > 0 ? (
                          customers.map((customer, index) => (
                            <option
                              key={index}
                              value={customer.id}
                            >
                              {customer.name}
                            </option>
                          ))
                        ) : (
                          <option value="">
                            No customers found
                          </option>
                        )}
                      </select>
                    </div>
                  </Col>

                  <Col lg={6}>
                    <div className="mb-3">
                      <Label
                        htmlFor="jobContactName"
                        className="form-label"
                      >
                        Job Contact Name
                      </Label>
                      <Input
                        type="text"
                        value={pickupcontactname}
                        onChange={(e) =>
                          setPickupContactName(e.target.value)
                        }
                        className="form-control"
                        id="jobContactName"
                        placeholder="Enter Contact Name"
                        defaultValue=""
                      />
                    </div>
                  </Col>

                  <Col lg={6}>
                    <div className="mb-3">
                      <Label
                        htmlFor="emailInputJob"
                        className="form-label"
                      >
                        Email (Job Contact)
                      </Label>
                      <Input
                        value={pickupemail}
                        onChange={(e) =>
                          setpickupemail(e.target.value)
                        }
                        type="email"
                        className="form-control"
                        id="emailInputJob"
                        placeholder="Email"
                        defaultValue=""
                      />
                    </div>
                  </Col>
                  <Col lg={6}>
                    <div className="mb-3">
                      <Label
                        htmlFor="mobileJobContact"
                        className="form-label"
                      >
                        Mobile (Job Contact)
                      </Label>
                      <Input
                        value={pickupmobile}
                        onChange={(e) =>
                          setPickupMobile(e.target.value)
                        }
                        type="text"
                        className="form-control"
                        id="mobileJobContact"
                        placeholder="Mobile"
                        defaultValue=""
                      />
                    </div>
                  </Col>
                  {/* <Input type="hidden" value={customerid}
                                                            onChange={(e) => setCustomerid(e.target.value)} className="form-control" id="dropoffAddress"
                                                            placeholder="Enter a customerid" /> */}
                  <div>
                    <label className="hstack gap-2">
                      <input
                        type="checkbox"
                        id="is_suburb"
                        value={isChecked}
                        // checked={isChecked === "Y"}
                        onChange={(e) => {
                          e.target.checked
                            ? setIsChecked("Y")
                            : setIsChecked("N");
                        }}
                      />
                      <t>Suburb</t>

                    </label>
                  </div>
                </Row>
                <Row className="mt-3">
                <Col md={6}>
  <div className="mb-3">
    <Label for="address" className="form-label">
      Pickup Address
    </Label>

    {isChecked === "Y" ? (
      <div>
        <label></label>
        <GoogleAutocomplete
          value={pickcommercial}
          onChange={(e) => setpickcommercial(e.target.value)}
          apiKey="AIzaSyB2SMtaVBlqC5v72gqS716BX8R5oXklaFc"
          onPlaceSelected={(place) => handlePlaceSelect(place)}
          options={{
            types: ["(regions)"],
            componentRestrictions: {
              country: "au",
            },
          }}
          style={{
            width: "100%",
            height: "40px",
            border: "1px solid #ccc",
            padding: "10px",
            borderRadius: "5px",
            position: "relative",
            zIndex: 9999,
          }}
        />
      </div>
    ) : (
      <div>
        <GoogleAutocomplete
          value={pickcommercial}
          onChange={(e) => setpickcommercial(e.target.value)}
          apiKey="AIzaSyB2SMtaVBlqC5v72gqS716BX8R5oXklaFc"
          onPlaceSelected={(place) => handlePlaceSelect(place)}
          options={{
            types: ["address"],
            componentRestrictions: {
              country: "au",
            },
          }}
          style={{
            width: "100%",
            height: "40px",
            border: "1px solid #ccc",
            padding: "10px",
            borderRadius: "5px",
            position: "relative",
            zIndex: 9999,
          }}
        />
      </div>
    )}
  </div>
</Col>
<Col lg={6}>
  <div className="mb-3">
    <Label htmlFor="dropoffAddress" className="form-label">
      Drop off Address
    </Label>
    
    {isChecked === "Y" ? (
      <div>
        <label></label>
        <GoogleAutocomplete
          apiKey="AIzaSyB2SMtaVBlqC5v72gqS716BX8R5oXklaFc"
          value={dropplace}
          onChange={(e) => setdropplace(e.target.value)}
          onPlaceSelected={(place) => dropoffselect(place)}
          options={{
            types: ["(regions)"],
            componentRestrictions: {
              country: "au",
            },
          }}
          style={{
            width: "100%",
            height: "40px",
            border: "1px solid #ccc",
            padding: "10px",
            borderRadius: "5px",
            position: "relative",
            zIndex: 9999,
          }}
        />
      </div>
    ) : (
      <div>
        <GoogleAutocomplete
          apiKey="AIzaSyB2SMtaVBlqC5v72gqS716BX8R5oXklaFc"
          value={dropplace}
          onChange={(e) => setdropplace(e.target.value)}
          onPlaceSelected={(place) => dropoffselect(place)}
          options={{
            types: ["address"],
            componentRestrictions: {
              country: "au",
            },
          }}
          style={{
            width: "100%",
            height: "40px",
            border: "1px solid #ccc",
            padding: "10px",
            borderRadius: "5px",
            position: "relative",
            zIndex: 9999,
          }}
        />
      </div>
    )}
  </div>
</Col>


                  <Col lg={6}>
                    <div>
                      <label
                        htmlFor="dateInput"
                        className="form-label"
                      >
                        Date
                      </label>
                      <Flatpickr
                        id="dateInput"
                        className="form-control"
                        value={estjobdate}
                        onChange={(date) =>
                          setEstJobdate(
                            moment(date[0]).format("DD/MM/YYYY")
                          )
                        }
                        options={{
                          dateFormat: "d/m/Y",
                          enableTime: false,
                        }}
                      />
                    </div>
                  </Col>

                  <Col lg={6}>
                    <div className="mb-3">
                      <Label
                        htmlFor="company"
                        className="form-label"
                      >
                        Company
                      </Label>
                      <select
                        value={companyname}
                        onChange={(e) =>
                          setCompanyName(e.target.value)
                        }
                        className="form-select mb-3"
                      >
                        <option value="none">none</option>
                        {companieslist &&
                          companieslist.length > 0 ? (
                          companieslist.map((company) => (
                            <option
                              key={company.id}
                              value={company.id}
                            >
                              {company.company_name}
                            </option>
                          ))
                        ) : (
                          <option value="" disabled>
                            No companies found
                          </option>
                        )}
                      </select>
                    </div>
                  </Col>

                  <Col lg={6}>
                    <div className="mb-3">
                      <Label
                        htmlFor="opportunityType"
                        className="form-label"
                      >
                        Opportunity Type
                      </Label>
                      <select className="form-select mb-3">
                        <option>Moving</option>
                      </select>
                    </div>
                  </Col>
                </Row>

              </Form>
            </TabPane>
          </TabContent>
        </CardBody>

        <div className="modal-footer">
          <div className="hstack gap-2 justify-content-end">
            <button
              type="button"
              className="btn btn-light"
              onClick={() => {
                setModalOpen(false);
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn btn-brown"
              onClick={handleSubmit}
              disabled={loading}
            >
              Create Opportunity
            </button>
          </div>
        </div>
      </Form>
    </Modal>
  )
}

export default OpportunityModal
