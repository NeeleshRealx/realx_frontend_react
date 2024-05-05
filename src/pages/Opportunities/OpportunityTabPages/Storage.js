import React, { useState, useEffect } from 'react'
import { Accordion, AccordionItem, Button, Card, CardBody, CardHeader, Col, Collapse, Table, Form, Label, Input, Container, Row, Modal, ModalBody } from 'reactstrap';
import { Link } from 'react-router-dom';
import Flatpickr from "react-flatpickr";
import TableRows from "./TableRow";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { addNewInvoice, deleteInvoice } from '../../../store/actions';
import 'react-toastify/dist/ReactToastify.css';
import DeleteModal from "../../../Components/Common/DeleteModal";
import moment from 'moment';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import Loader from "../../../Components/Common/Loader";
import { previousTuesday } from 'date-fns';


export const Storage = ({ postdatas, onChangeData }) => {
  const [rowsData, setRowsData] = useState([]);
  const [data, setData] = useState([]);
  const [storage_types, setStorageTypes] = useState([]);
  const [storage_warehouses, setStorageWareHouses] = useState([]);
  const [quoteItem, setquoteItem] = useState([]);
  const [storage_reservation, setStorageReservation] = useState([]);
  const [storage_jobunits, setStorageJobUnits] = useState([]);
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [taxs, setTaxes] = useState([]);
  const [showEndDate, setShowEndDate] = useState();
  const [discounttype, setDiscountType] = useState('');
  const [editstorageid, setEditStorageId] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [storagetype, setStorageType] = useState();
  const [storagelocation, setStorageLocation] = useState();
  const [org_date, setOrg_Date] = useState([]);
  const [from_date, setFromDate] = useState(null);
  const [to_date, setToDate] = useState(null);
  const [showreserves, setShowReserveStorage] = useState(false);
  const [storagereserves, setStorageReserveData] = useState(false);
  const [storageunit, setStorageUnit] = useState(false);
  const [disableEndDate, setDisableEndDate] = useState(true);
  const [AddinvoiceItem, setInvoiceAddNew] = useState(false);
  const [invoicepid, setProductId] = useState("");
  const [invoicedesc, setInvoiceDesc] = useState("");
  const [invoiceprice, setInvoicePrice] = useState("");
  const [Addnewpayment, setAddPayment] = useState(false);
  const [invoicename, setInvoiceName] = useState("");
  const [producttype, setProductType] = useState("");
  const [invoicetax, setInvoiceTax] = useState("");
  const [invoiceamt, setInvoiceAmount] = useState("");
  const [invoiceqty, setInvoiceQuantity] = useState("");
  const [selectedinvoice, setSelectedInvoiceData] = useState([]);
  const [selectedpayment, setSelectedPaymentData] = useState([]);
  const [modal, setOpenModal] = useState(false);
  const [paymentmodal, setPaymentModal] = useState(false);
  const [expandedinvoiceId, setExpandedInvoiceId] = useState('');
  const [expandedpaymentId, setExpandedPaymentId] = useState('');
  const [paymentmode, setPaymentMode] = useState('');
  const [paymentdate, setPaymentDate] = useState('');
  const [paymentdesc, setPaymentDesc] = useState('');
  const [paymentamount, setPaymentAmount] = useState('');
  const [paymentItems, setPaymentItems] = useState('');
  const [job_id, setjobid] = useState(postdatas?.postdatas?.job_id);
  const [oppid, setoppid] = useState(postdatas?.job?.crm_opportunity_id);
  const [Addnewinvoice, setAddInvoice] = useState(false);
  const [quoteid, setquoteid] = useState();
  const [leadid, setleadid] = useState(postdatas?.job?.customer_id);
  const [isLoader, setLoader] = useState(true);

  const [inclTax, setInclTax] = useState(0)
  const [discountamt, setDiscountAmt] = useState(0)

  const [discountVal, setDiscountVal] = useState(0)
  const [discountAmtString, setdiscountAmtString] = useState()
  const [showdiscount, SetDiscountDisplay] = useState(false);
  const [isdiscountopen, setDiscountOpen] = useState('');

  const [afterDiscountVal, setAfterDiscountVal] = useState()
  const [totalAmount, setTotalAmount] = useState()

  const [deleteItemId, setDeleteItemId] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteModalStorage, setDeleteModalStorage] = useState(false);

  const [selectedOrderId, setSelectedOrderId] = useState(null);

  console.log(job_id)
  // const params = useParams();
  // const job_id = params.id;
  var total_payments = 0;
  var total_excl_tax = 0;
  var total_incl_tax = 0;
  var rate_percent = 0;
  var total_tax = 0;
  var total_after_discount = 0;

  useEffect(() => {
    getData();
    getDatas();
    console.log(postdatas)
    console.log(postdatas?.quote?.discount === undefined ? 0 : postdatas.quote.discount)
    setDiscountAmt(postdatas?.quote?.discount === undefined ? 0 : postdatas.quote.discount)
    setAfterDiscountVal((parseFloat(total_excl_tax) - parseFloat(postdatas?.quote?.discount === undefined ? 0 : postdatas.quote.discount)).toFixed(2))
    setInclTax((parseFloat(total_excl_tax) - parseFloat(postdatas?.quote?.discount === undefined ? 0 : postdatas.quote.discount)).toFixed(2) == 0 ? total_excl_tax : parseFloat((parseFloat(total_excl_tax) - parseFloat(postdatas?.quote?.discount === undefined ? 0 : postdatas.quote.discount)).toFixed(2)) + parseFloat(total_tax))
    setoppid(postdatas?.job?.crm_opportunity_id)
    if (postdatas) {
      setTimeout(function () {
        setLoader(false);
      }, 2000);
    }

  }, [postdatas])

  //LocalStorage setItem

  const hash = window.location.hash
  const currentPageUrl = window.location.href;
  const currentUrl = new URL(currentPageUrl);
  const pathname = currentUrl.pathname;
  localStorage.setItem("expiredSessionRedirectUrl", pathname + hash);

  useEffect(() => {
    // setAfterDiscountVal((parseFloat(total_excl_tax) - parseFloat(postdatas?.quote?.discount === undefined ? 0 : postdatas.quote.discount)).toFixed(2))
    // setAfterDiscountVal((parseFloat(tExclTax) - parseFloat(postdatas?.quote?.discount === undefined ? 0 : postdatas.quote.discount)).toFixed(2))
    // console.log(tExclTax,"hie")
    setInclTax((parseFloat(total_excl_tax) - parseFloat(postdatas?.quote?.discount === undefined ? 0 : postdatas.quote.discount)).toFixed(2) == 0 ? total_excl_tax : parseFloat((parseFloat(total_excl_tax) - parseFloat(postdatas?.quote?.discount === undefined ? 0 : postdatas.quote.discount)).toFixed(2)) + parseFloat(total_tax))
    console.log("taxxxxxxx", total_tax, total_excl_tax)
    axios.get("/api/all-invoices/date")
      .then((res) => {
        console.log(res?.organisation_settings, "test1233");
        setOrg_Date(res?.organisation_settings);
        setFromDate(moment().format(res?.organisation_settings?.date_format_js));
        setToDate(moment().format(res?.organisation_settings?.date_format_js));
      })
      .catch((err) => {
        console.log(err);
      })
  }, [quoteItem, total_tax])


  console.log(postdatas?.quote?.discount, "storagejobidd")

  // console.log(onChangeData,"storageleadid");
  // console.log(quoteid,"storagequoteid");
  // console.log(oppid,"storageoppid");

  const [tExclTax,setTexclTax]=useState()

  function getData() {
    var postData = {
      "crm_opportunity_id": oppid,
    }
    axios.post('api/crm-leads/storagetabcontent', postData).then((res) => {
      console.log(res, "hie")
      setData(res);
      setDiscountVal(res?.quote?.discount)
      let totalExclTax=0
      // const v=res.quoteItem.map((res)=>{totalExclTax+=res.unit_price * res.quantity})
      console.log(totalExclTax-(res?.quote?.discount),"hie")
      setTexclTax(totalExclTax)
      setAfterDiscountVal(totalExclTax-(res?.quote?.discount))
      setStorageTypes(res?.storage_type_list);
      setStorageWareHouses(res?.storage_warehouses);
      setStorageReservation(res?.storage_reservation);
      setStorageJobUnits(res?.storage_job_units);
      setInvoiceItems(res?.invoice_items);
      setPaymentItems(res?.payment_items);
      setDiscountOpen("")
      setTaxes(res?.taxs);
      setStorageType(res.storage_type_list[0].id);
      setStorageLocation(res.storage_warehouses[0].id)
      if (res.storage_reservation.length > 0 && res.storage_reservation[0]?.to_date == "0000-00-00" && res.storage_reservation[0]?.to_date == new Date()) {
        setDisableEndDate(false);
        setShowEndDate(false);
      }
      if (res.storage_reservation.length > 0 && res.storage_reservation[0]?.to_date != "0000-00-00") {
        setDisableEndDate(true);
        setShowEndDate(true);
        // console.log("apple")
      }
      setquoteItem(res?.quoteItem)
      if (res.quote == null) {
        setquoteid(0)
      }
      else {
        setquoteid(res.quote.id)
      }

      console.log(res.quote?.id)
    })
  }


  function getDatas() {
    setData(postdatas);
  }

  const addTableRows = () => {
    if (Addnewinvoice) {
      setInvoiceName();
      setInvoiceDesc();
      setInvoicePrice();
      setInvoiceAmount();
      setInvoiceQuantity();
      setAddInvoice(false);
    } else {
      setAddInvoice(true);
    }
    const rowsInput = {
      fullName: '',
      emailAddress: '',
      salary: ''
    }
    setRowsData([...rowsData, rowsInput])
  }

  const deleteInvoice = (id) => {
    setDeleteItemId(id);
    setDeleteModal(true);

  }

  const handleDeleteOrder = async () => {
    console.log(deleteItemId, "seleteid");
    var postData = {

      "crm_opportunity_id": oppid,
      "lead_id": leadid,
      "id": deleteItemId,
      "quote_id": quoteid,

    }
    axios.post("api/crm-leads/ajaxDestroyQuoteItem", postData).then((res) => {
      if (res.error == 0) {
        toast.success(res.message);
        onChangeData();
        t_deleteInvoice();
        setDeleteModal(false);
      }
      else {
        toast.error("Something went wrong");
      }
    })
  };

  // const AddTableRows = () => {
  //   if(Addnewinvoice){
  //     setInvoiceName();
  //     setInvoiceDesc();
  //     setInvoicePrice();
  //     setInvoiceAmount();
  //     setInvoiceQuantity();
  //     setAddInvoice(false);
  //   }else{
  //     setAddInvoice(true);
  //   }
  //   const rowsInput = {
  //     fullName: '',
  //     emailAddress: '',
  //     salary: ''
  //   }
  //   setRowsData([...rowsData, rowsInput])
  // }

  // const addInvoiceRow = () => {
  //   if(AddinvoiceItem == true){
  //     setInvoiceName();
  //     setInvoiceDesc();
  //     setInvoicePrice();
  //     setInvoiceAmount();
  //     setInvoiceQuantity();
  //     setInvoiceAddNew(false);
  //   }else{
  //     setInvoiceAddNew(true);
  //   }
  // }

  const deleteTableRows = (index) => {
    const rows = [...rowsData];
    rows.splice(index, 1);
    setRowsData(rows);
  }

  const SelectDiscount = (val) => {
    if (val == "cancel") {
      setDiscountOpen("");
    } else if (val == "save") {
      setDiscountOpen("");
    }
    else {
      setDiscountType(val);
    }
  }

  const handleToggle = (e) => {
    setShowPicker(e.target.checked);
  };

  const handleChange = (index, evnt) => {
    const { name, value } = evnt.target;
    const rowsInput = [...rowsData];
    rowsInput[index][name] = value;
    setRowsData(rowsInput);
  }

  const EditStorage = (val) => {
    setEditStorageId(val);
  }
  const [storageId,setStorageId]=useState();
  const deleteStorageId = (val) => {
    setStorageId(val);
    setDeleteModalStorage(true);

  }
  const DeleteStorage = async () => {
    axios.get("api/delete-storage-job/" + storageId).then((res) => {
      if (res.status == "success") {
        toast.success(res.message);
        storage_reservation.map((res) => {
          setToDate(moment(res.to_date).format(org_date?.date_format_js));
        })
        setDeleteModalStorage(false);
        setDisableEndDate(true);
        setShowEndDate(false);
        getData();
      }
    })
  }

  const DeleteUnits = (data) => {
    var postData = {
      "id": data
    }
    axios.post("/api/ajaxDestroyStorageReservation", postData).then((res) => {
      if (res.error == 0) {
        toast.success(res.message);
        getData();
      } else {
        toast.error("Something went wrong");
      }
    })
  }
  useEffect(() => {
    setDate();
  }, [org_date]);

  const setDate = () => {
    storage_reservation.map((res) => {
      console.log(res.from_date, "from_date123");
      setFromDate(moment(res.from_date).format(org_date?.date_format_js));
      setToDate(moment(res.to_date).format(org_date?.date_format_js));
    })
  }
  const UpdateStorage = (val) => {
    setLoader(true);
    const selectedDateFormat = org_date?.date_format;
    val.if_end_date = showEndDate?.toString();
    if (showPicker) {
      val.if_end_date = "true";
    }
    const isYYYYMMDDFormat = (dateString) => /^\d{4}-\d{2}-\d{2}$/.test(dateString);
    val.from_date = isYYYYMMDDFormat(val.from_date) ? moment(val.from_date).format(org_date.date_format_js) : val.from_date;
    val.to_date = isYYYYMMDDFormat(val.to_date) ? moment(val.to_date).format(org_date.date_format_js) : val.to_date;
    var postData = {
      "id": val.id,
      "datepicker_to": val.to_date,
      "datepicker_from": val.from_date,
      "volume_update": val.storage_volume,
      "update_allocation": val.allocation_status,
      "if_end_date": val.if_end_date,
      "unit_id": val.unit_id,
      "selected_date_format": selectedDateFormat
    }
    axios.post("/api/updateReserves", postData).then((res) => {
      if (res.error == 0) {
        toast.success(res.message);
        getData();
        setDate();
        //onChangeData();
        EditStorage();
      }
      else {
        toast.error(res.message);

      }
    }).catch((error) => {
      console.error(error);
      toast.error("An error occurred while fetching data.", {
        theme: "error",
      });
    })
      .finally(() => {
        setLoader(false);
      });
  }

  const findStorage = () => {
    const selectedDateFormat = org_date?.date_format;
    console.log(storagelocation);
    console.log(storagetype);
    var postData = {
      "storage_unit_id": storagetype,
      "storage_location": storagelocation,
      "from_date": from_date,
      "to_date": to_date,
      "selected_date_format": selectedDateFormat
    }
    console.log(postData);
    axios.post("api/find-available-storage-units", postData).then((res) => {
      if (res.data.length > 0) {
        toast.success(res.message);
        setShowReserveStorage(true)
        setStorageReserveData(res.data);
      } else {
        toast.warning(res.message);
        setShowReserveStorage(false)
        setStorageReserveData([]);
      }
    })
  }
  const SaveReservation = () => {
    const selectedDateFormat = org_date?.date_format;
    var postData = {
      "lead_id": leadid,
      "job_id": job_id,
      "unit_id": storageunit || storagereserves[0].id,
      "from_date": from_date,
      "to_date": to_date,
      "crm_opportunity_id": oppid,
      "allocation_status": "Reserved",
      "enable_date": showEndDate,
      "selected_date_format": selectedDateFormat
    }
    console.log(postData);
    axios.post("/api/ajaxSaveStorageReservation", postData).then((res) => {
      if (res.error == 0) {
        toast.success(res.message);
        getData();
        setShowReserveStorage(false)
        setStorageReserveData();
        setDisableEndDate(false);
      }
      else {
        toast.error(res.message);
      }
    })
  }

  const SaveInvoice = () => {
    console.log(quoteid)
    setLoader(true);
    var postData = {
      "lead_id": leadid,
      "quote_id": quoteid,
      "product_id": invoicepid,
      "name": invoicename,
      "description": invoicedesc,
      "tax_id": invoicetax,
      "unit_price": invoiceprice,
      "quantity": invoiceqty,
      "type": producttype,
      "amount": invoiceamt,
      "crm_opportunity_id": oppid,
      "sys_job_type": 'Moving_Storage',
      type: 'Item'
    }
    console.log(postData.name)
    if (postData.name === "" || postData.name === undefined) {
      toast.error("Enter the Item Name", { theme: "light" });
    }
    else if (postData.unit_price === "" || postData.unit_price === undefined) {
      toast.error("Enter the Unit Price", { theme: "light" });
    }
    else if (postData.quantity === "" || postData.quantity === undefined) {
      toast.error("Enter the Quantity", { theme: "light" });
    }
    else {
      axios.post("api/crm-leads/ajaxSaveEstimate", postData).then((res) => {
        if (res.error == 0) {
          toast.success(res.message);
          onChangeData();
          addTableRows();
        }
        else {
          toast.error("Something went wrong");
        }
      }).finally(() => {
        setLoader(false);
      })
    }
  }


  // const deleteInvoice = () =>{
  //   console.log(selectedinvoice);
  //   var postData = {
  //     "job_id": job_id,
  //     "invoice_id": selectedinvoice.invoice_id,
  //     "id":selectedinvoice.id
  //   }
  //   axios.post("api/ajaxDestroyInvoiceItem", postData).then((res)=>{
  //     if(res.error == 0){
  //       toast.success(res.message);
  //       getData();
  //       t_deleteInvoice();
  //     }
  //     else{
  //       toast.error("Something went wrong");
  //     }
  //   })
  // }

  const t_deleteInvoice = (val = "") => {
    if (val != "") {
      setSelectedInvoiceData(val);
      setOpenModal(true);
    } else {
      setOpenModal(false);
    }
  }

  const t_editinvoice = (val) => {
    onChangeData();
    setExpandedInvoiceId(val);
  }

  const EditInvoice = (data) => {
    console.log(data);
    setLoader(true);
    var postData = {
      "id": data.id,
      "crm_opportunity_id": oppid,
      "quote_id": quoteid,
      "name": data.name,
      "description": data.description,
      "tax_id": data.tax_id,
      "unit_price": data.unit_price,
      "quantity": data.quantity,
      "type": data.type,
      "amount": data.amount,
      "sys_job_type": 'Moving'
    }
    axios.post("api/crm-leads/ajaxUpdateEstimate", postData).then((res) => {
      if (res.error == 0) {
        toast.success(res.message);
        onChangeData();
        t_editinvoice();
      }
      else {
        toast.error("Something went wrong");
      }
    }).finally(() => {
      setLoader(false);
    })
  }

  useEffect(() => {
    console.log(parseFloat(total_excl_tax) - (parseFloat(discountamt) / 100 * parseFloat(total_excl_tax)), discounttype);
    if (discounttype === "percent") {
      setAfterDiscountVal(parseFloat(total_excl_tax) - ((parseFloat(discountamt) / 100) * parseFloat(total_excl_tax)))
      setInclTax((parseFloat(total_excl_tax) - (parseFloat(discountamt) / 100 * parseFloat(total_excl_tax))) + parseFloat(total_tax));
    }
    else if (discounttype === "fixed") {
      setAfterDiscountVal(total_excl_tax - parseFloat(discountamt))
      setInclTax((parseFloat(total_excl_tax) - parseFloat(discountamt)) + parseFloat(total_tax))
    }
    setDiscountAmt(discountamt)
  }, [quoteItem, total_tax, discountamt])
  // const [discount,setDiscount]=useState("")
  // const [depositamt, setDepositAmt] = useState(data?.quote?.deposit_required);

  console.log(discountamt)
  const submitDiscount = () => {
    if (total_excl_tax === 0) {
      toast.error("Total must be greater than 0", { theme: "light" });
    }
    else {
      SetDiscountDisplay(true)
      if (discounttype === "Percent") {
        console.log((parseFloat(total_excl_tax) - (parseInt(discountVal) / 100 * parseFloat(total_excl_tax))).toFixed(2))
        setAfterDiscountVal((parseFloat(total_excl_tax) - (parseInt(discountVal) / 100 * parseFloat(total_excl_tax))).toFixed(2))
        setInclTax((parseFloat(total_excl_tax) - (parseInt(discountVal) / 100 * parseFloat(total_excl_tax))).toFixed(2) == 0 ? total_excl_tax : parseFloat((parseFloat(total_excl_tax) - (parseInt(discountVal) / 100 * parseFloat(total_excl_tax))).toFixed(2)) + parseFloat(total_tax))
      }
      else if (discounttype === "Fixed") {
        console.log((parseFloat(total_excl_tax) - parseFloat(discountVal)).toFixed(2))
        setAfterDiscountVal((parseFloat(total_excl_tax) - parseFloat(discountVal)).toFixed(2))
        setInclTax((parseFloat(total_excl_tax) - parseFloat(discountVal)).toFixed(2) == 0 ? total_excl_tax : parseFloat((parseFloat(total_excl_tax) - parseFloat(discountVal)).toFixed(2)) + parseFloat(total_tax))
      }
      console.log(discountVal)
      console.log(total_excl_tax)
      console.log(discounttype)
      console.log(afterDiscountVal)
      console.log(total_tax)
      console.log(afterDiscountVal == 0 ? total_excl_tax : parseFloat(afterDiscountVal) + parseFloat(total_tax))
      setDiscountAmt(discountVal)
      setdiscountAmtString(discounttype === "Percent" ? discountVal + "%" : "$" + discountVal)
      // setDiscountType('')
      console.log(discountamt)
      const form = {
        quote_id: quoteid,
        discount: parseInt(discountamt === null || undefined ? 0 : discountVal),
        discount_type: discounttype,
        crm_opportunity_id: oppid,
        sys_job_type: 'Moving'
      }
      console.log(form, "type")
      axios.post("api/crm-leads/ajaxSaveEstimateDiscount", form).then((res) => {
        if (res.error == 0) {
          toast.success(res.message);
          console.log(res)
          //setDiscountType('');

        }
        else {
          toast.error("Something went wrong");
        }
      })
    }
  }

  console.log(data, "data123")

  return (
    <div>
      <DeleteModal
        show={deleteModal}
        orderId={selectedOrderId}
        onDeleteClick={handleDeleteOrder}
        onCloseClick={() => setDeleteModal(false)}
      />
      <DeleteModal
        show={deleteModalStorage}
        onDeleteClick={DeleteStorage}
        onCloseClick={() => setDeleteModalStorage(false)}
      />
      {isLoader && <><div
        style={{
          position: 'absolute',
          // top: 0,
          left: 0,
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

      <Card>
        <CardHeader>
          <h5>Reservation</h5>
        </CardHeader>
        <CardBody>
          {disableEndDate && <div className="form-check mb-2">
            <Input className="form-check-input" type="checkbox" id="formCheck1" checked={showEndDate} onClick={() => {
              if (showEndDate) {
                setShowEndDate(false);
              } else {
                setShowEndDate(true);
              }
            }} />
            <Label className="form-check-label" for="formCheck1">
              <b>Enable End Date</b>
            </Label>
          </div>}
          <Row className='hstack gap-1 mt-3'>
            <Col lg={3} className='mt-3'>
              <Label><h6>Storage Type</h6></Label>
              <select className="form-select mb-3" aria-label="Default select example" onChange={(e) => {
                setStorageType(e.target.value);
              }} value={storagetype}>
                {storage_types?.map((res) => {
                  return (<option key={res.id} value={res.id}>{res.name}</option>)
                })}
              </select>
            </Col>
            <Col lg={3} className='mt-3'>
              <Label><h6>Location</h6></Label>
              <select className="form-select mb-3" aria-label="Default select example" onChange={(e) => {
                setStorageLocation(e.target.value);
              }} value={storagelocation}>
                {storage_warehouses?.map((res) => {
                  return (<option key={res.id} value={res.id}>{res.warehouse_name}</option>)
                })}
              </select>
            </Col>
            <Col lg={2}>
              <Label><h6>Start Date</h6></Label>
              {storage_reservation.length > 0 ? (
                <Flatpickr
                  className="form-control" disabled
                  options={{
                    dateFormat: org_date.date_format,
                    //defaultDate: [moment(new Date()).format("DD/MM/YYYY")]
                  }}
                  onChange={(selectedDates) => {
                    setFromDate(moment(selectedDates[0]).format(org_date.date_format_js));
                  }}
                  value={from_date}
                />
              ) : (
                <Flatpickr
                  className="form-control"
                  options={{
                    dateFormat: org_date.date_format,
                    //defaultDate: [moment(new Date()).format("DD/MM/YYYY")]
                  }}
                  onChange={(selectedDates) => {
                    setFromDate(moment(selectedDates[0]).format(org_date.date_format_js));
                  }}
                  value={from_date}
                />
              )}
              {/*<Flatpickr
                className="form-control"
                options={{
                  dateFormat: org_date.date_format,
                  //defaultDate: [moment(new Date()).format("DD/MM/YYYY")]
                }}
                onChange={(selectedDates) => {
                  setFromDate(moment(selectedDates[0]).format(org_date.date_format_js));
                }}
                value={from_date}
              />*/}
            </Col>
            {showEndDate && <Col lg={2}>
              <Label><h6>End Date</h6></Label>
              {storage_reservation.length > 0 ? (
                <Flatpickr
                  className="form-control" disabled
                  options={{
                    dateFormat: org_date.date_format,
                    //defaultDate: [moment(new Date()).format("DD/MM/YYYY")]
                  }}
                  onChange={(selectedDates) => {
                    //setToDate(moment(selectedDates[0]).format('DD/MM/YYYY'));
                    setToDate(moment(selectedDates[0]).format(org_date.date_format_js));
                  }}
                  value={to_date}
                />
              ) : (
                <Flatpickr
                  className="form-control"
                  options={{
                    dateFormat: org_date.date_format,
                    //defaultDate: [moment(new Date()).format("DD/MM/YYYY")]
                  }}
                  onChange={(selectedDates) => {
                    //setToDate(moment(selectedDates[0]).format('DD/MM/YYYY'));
                    setToDate(moment(selectedDates[0]).format(org_date.date_format_js));
                  }}
                  value={to_date}
                />
              )}
              {/*<Flatpickr
                className="form-control"
                options={{
                  dateFormat: org_date.date_format,
                  //defaultDate: [moment(new Date()).format("DD/MM/YYYY")]
                }}
                onChange={(selectedDates) => {
                  //setToDate(moment(selectedDates[0]).format('DD/MM/YYYY'));
                  setToDate(moment(selectedDates[0]).format(org_date.date_format_js));
                }}
                value={to_date}
              />*/}
            </Col>}
          </Row>
          <Row className='mt-2'>
            <Col lg={9} className='text-muted'>
              <p > *Use the search when you want to add a new reservation <br />Enter the parameters for the search and click on the Search</p>
            </Col>
            <Col lg={3} className='hstack gap-3'>
              <Button className='btn btn-success' onClick={() => { findStorage() }}>Search</Button>
              <Button className='btn btn-dark'>Reset</Button>

            </Col>
          </Row>
          <Table className='mt-5 table-bordered' >
            <thead className='bg-soft-purple'>
              <tr>
                <th width="20%">Storage Job Number</th>
                <th width="18%">Move In</th>
                <th width="18%">Move Out</th>
                <th>Status</th>
                <th>Volume</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {storage_reservation?.length > 0 && storage_reservation?.map((res) => {
                return (
                  <>
                    {editstorageid != res.id && <tr key={res.id}>
                      <td><Link to={"/storage/view-storage-job/" + res.id} className="fw-medium link-primary"><span className="badge badge-soft-info fs-12">{res.storage_job_number}</span></Link></td>
                      {/*<td><span className="badge badge-soft-info fs-12">{res.storage_job_number}</span></td>*/}
                      {/*<td>{res.from_date}</td>
                      <td>{res.to_date}</td>*/}
                      <td>{moment(res.from_date).format(org_date?.date_format_js)}</td>
                      <td>{res.to_date == "0000-00-00" ? "0000-00-00" : moment(res.to_date).format(org_date.date_format_js)}</td>
                      <td>{res.allocation_status}</td>
                      <td>{res.storage_volume} cbm</td>
                      <td className='hstack gap-2'>
                        <button className="btn btn-sm btn-soft-info edit-list" onClick={() => EditStorage(res.id)}>
                          <i className="bx bxs-pencil fs-12 pt-1"></i>
                        </button>
                        <button className="btn btn-sm btn-soft-danger edit-list" onClick={() => deleteStorageId(res.storage_job_number)}>
                          <i className="bx bxs-trash fs-12 pt-1"></i>
                        </button>
                      </td>
                    </tr>}
                    {editstorageid == res.id && <tr key={res.id} className='edit_row'>
                      <td><Input className='form-control' disabled value={res.storage_job_number} onChange={(e) => {
                        const updatedLegs = [...storage_reservation];
                        const index = updatedLegs.findIndex((task) => task.id === res.id);
                        updatedLegs[index].storage_job_number = e.target.value;
                        setStorageReservation(updatedLegs);
                      }} /></td>
                      <td><Flatpickr
                        className="form-control"
                        options={{
                          dateFormat: org_date.date_format,
                          //defaultDate: [moment(res.from_date).format('DD/MM/YYYY')]
                          defaultDate: [moment(res.from_date).format(org_date.date_format_js)]
                        }}
                        onChange={(e) => {
                          const updatedLegs = [...storage_reservation];
                          const index = updatedLegs.findIndex((task) => task.id === res.id);
                          //updatedLegs[index].from_date = moment(e[0]).format("DD/MM/YYYY");
                          updatedLegs[index].from_date = moment(e[0]).format(org_date.date_format_js);
                          setStorageReservation(updatedLegs);
                        }}
                      /></td>
                      <td>{res.to_date != "0000-00-00" &&
                        <Flatpickr
                          className="form-control"
                          options={{
                            dateFormat: org_date?.date_format,
                            defaultDate: [moment(res.to_date).format(org_date.date_format_js)]
                          }}
                          onChange={(e) => {
                            const updatedLegs = [...storage_reservation];
                            const index = updatedLegs.findIndex((task) => task.id === res.id);
                            updatedLegs[index].to_date = moment(e[0]).format(org_date.date_format_js);
                            //updatedLegs[index].to_date = moment(e[0]).format("DD/MM/YYYY");
                            setStorageReservation(updatedLegs);
                          }}
                        />}
                        {res.to_date == "0000-00-00" && <>
                          <Input type='checkbox' onChange={handleToggle} />
                          <b>Add End Date</b>
                          {showPicker && (<Flatpickr
                            className="form-control mt-2"
                            options={{
                              dateFormat: org_date.date_format,
                              //defaultDate: res.to_date == "0000-00-00" ? moment(new Date()).format("DD/MM/YYYY") : moment(res.to_date).format('DD/MM/YYYY')
                              defaultDate: res.to_date == "0000-00-00" ? moment(new Date()).format(org_date.date_format_js) : moment(res.to_date).format(org_date.date_format_js)
                            }}
                            onChange={(e) => {
                              const updatedLegs = [...storage_reservation];
                              const index = updatedLegs.findIndex((task) => task.id === res.id);
                              console.log(e[0])
                              //updatedLegs[index].to_date = moment(e[0]).format("DD/MM/YYYY");
                              updatedLegs[index].to_date = moment(e[0]).format(org_date.date_format_js);
                              setStorageReservation(updatedLegs);
                            }}
                          />)}</>}
                      </td>
                      <td>
                        <select className='form-control' value={res.allocation_status} onChange={(e) => {
                          const updatedLegs = [...storage_reservation];
                          const index = updatedLegs.findIndex((task) => task.id === res.id);
                          updatedLegs[index].allocation_status = e.target.value;
                          setStorageReservation(updatedLegs);
                        }}>
                          <option value="Reserved">Reserved</option>
                          <option value="Active">Active</option>
                          <option value="Hold">Hold</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </td>
                      <td><Input type='number' step="0.00" value={res.storage_volume} onChange={(e) => {
                        const updatedLegs = [...storage_reservation];
                        const index = updatedLegs.findIndex((task) => task.id === res.id);
                        updatedLegs[index].storage_volume = e.target.value;
                        setStorageReservation(updatedLegs);
                      }} /></td>
                      <td className='hstack gap-2'>
                        <button className="btn btn-sm btn-light edit-list" onClick={() => EditStorage()}>
                          Cancel
                        </button>
                        <button className="btn btn-sm btn-success edit-list" onClick={() => UpdateStorage(res)}>
                          Save
                        </button>
                      </td>
                    </tr>}
                  </>
                )
              })}
              {storage_reservation && storage_reservation.length == 0 &&
                <tr>
                  <td colSpan={6} className='text-center'> No Reservations found!</td>
                </tr>}
            </tbody>
          </Table>
          <Table className='mt-5 table-bordered' >
            <thead className='bg-soft-purple'>
              <tr>
                <th>Storage Unit</th>
                <th>Location</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {console.log(storage_jobunits, "storagee")}
              {storage_jobunits && storage_jobunits.length > 0 &&
                storage_jobunits?.map((res) => {
                  return (<tr key={res.id}>
                    <td>{res.serial_number} - {res.storage_type_name}</td>
                    <td>{res.warehouse_name}</td>
                    <td><Button className='btn btn-sm btn-soft-danger' onClick={() => DeleteUnits(res.id)}><i className="bx bxs-trash fs-12"></i></Button></td>
                  </tr>)
                })}
              {showreserves && <tr>
                <td width="45%">
                  <select className='form-control' onChange={(e) => {
                    setStorageUnit(e.target.value);
                  }}>
                    {storagereserves?.map((res) => {
                      return (<option key={res.id} value={res.id}>{res.serial_number} - {res.name}</option>)
                    })}
                  </select>
                </td>
                <td width="30%">
                  <select disabled className='form-control'>
                    {storagereserves?.map((res) => {
                      return (<option key={res.warehouse_id}>{res.warehouse_name}</option>)
                    })}
                  </select>
                </td>
                <td width="25%">
                  <button id="s_cancel_discount_btn" type="button" className="btn btn-light" onClick={() =>
                    SelectDiscount("cancel")}> Cancel</button>
                  <button id="s_save_discount_btn" type="button" className="btn btn-success mx-2" onClick={() => SaveReservation()}> Reserve</button>
                </td>
              </tr>
              }
            </tbody>
          </Table>
        </CardBody>
      </Card>
      <Card>
        <CardHeader>
          <h5>Estimate</h5>
        </CardHeader>
        <CardBody>
          <div className='text-muted'>
           <p>Generate an estimate in this section only if you want the Storage Invoice separate from the Removals job invoice</p>
          </div>
          <Table className='table-bordered mt-4'>
            <thead className='bg-soft-purple'>
              <tr>
                <th>Item Name & Description</th>
                <th>Tax</th>
                <th>Unit Price</th>
                <th>QTY</th>
                <th>Total Inc Tax</th>
                <th></th>

              </tr>
            </thead>
            <tbody>
              {quoteItem?.map((res) => {
                total_excl_tax += (res.unit_price * res.quantity);
                total_tax += res.amount - (res.unit_price * res.quantity);
                return (<>{(expandedinvoiceId != res.id) && <tr key={res.id}>
                  <td>
                    <span>{res.name}</span><br />
                    <span dangerouslySetInnerHTML={{ __html: res.description?.replace(/\n/g, '<br>') }}></span>
                  </td>
                  <td>{data?.taxs?.map((val) => (
                    (res.tax_id == val.id) ? val.tax_name : ""))}</td>
                  <td style={{ textAlign: 'right' }}> {postdatas?.global.currency_symbol} {parseFloat(res.unit_price).toFixed(2)}</td>
                  <td style={{ textAlign: 'right' }}>{parseFloat(res.quantity).toFixed(2)}</td>
                  <td style={{ textAlign: 'right' }}>{postdatas?.global.currency_symbol} {parseFloat(res.amount).toFixed(2)}</td>
                  <td>
                    <div className='hstack gap-2'>
                      <button className="btn btn-sm btn-soft-info edit-list" onClick={() => t_editinvoice(res.id)}
                      >
                        <i className="bx bxs-pencil fs-12 pt-1"></i>
                      </button>
                      <button className="btn btn-sm btn-soft-danger edit-list" onClick={() => deleteInvoice(res.id)}
                      >
                        <i className="bx bxs-trash fs-12 pt-1"></i>
                      </button>
                    </div>
                  </td>
                </tr>}
                  {(expandedinvoiceId == res.id) && <tr key={res.id}>
                    <td>
                      <select className='form-control' value={res.name} onChange={(e) => {
                        const selectedValue = e.target.value;
                        const updateddata = [...quoteItem];
                        const taskIndex = updateddata.findIndex((task) => task.id === res.id);
                        // console.log(selectedValue,"selectedValue");
                        if (selectedValue === '0') {
                          // Handle the case when the user selects the default option or set to null
                          updateddata[taskIndex].name = ""; // Clear the selected name
                          updateddata[taskIndex].unit_price = "";
                          updateddata[taskIndex].amount = "0.00";
                          updateddata[taskIndex].description = "";
                          setquoteItem(updateddata);
                          return;
                        }
                        else {
                          const invoiceData = data?.products?.find((val) => val.name === selectedValue);
                          console.log(invoiceData, "name123");
                          setLoader(true);
                          let formData = {
                            lead_id: postdatas.job.customer_id,
                            job_type: postdatas.job.job_type,
                            job_id: postdatas.job.job_id,
                            description: invoiceData.description,
                          };
                          axios.post('/api/ajaxSetProductDescParameter', formData).then((res) => {
                            var tsk_desc = res.desc;
                            if (invoiceData) {
                              updateddata[taskIndex].name = invoiceData.name;
                              updateddata[taskIndex].description = tsk_desc;
                              if (invoiceData.tax_id == null) {
                                updateddata[taskIndex].tax_id = "0";
                              } else {
                                updateddata[taskIndex].tax_id = invoiceData.tax_id;
                              }
                              updateddata[taskIndex].unit_price = parseFloat(invoiceData.price).toFixed(2);
                              updateddata[taskIndex].quantity = 1;
                              if (invoiceData.tax == null) {
                                updateddata[taskIndex].amount = parseFloat(invoiceData.price).toFixed(2);
                              } else {
                                updateddata[taskIndex].amount = parseFloat(invoiceData.total_amount).toFixed(2);
                              }
                            }
                          })
                            .finally(() => {
                              setLoader(false);
                            })
                          setquoteItem(updateddata);
                        }
                      }}>
                        <option value="0"></option>
                        {data.products.map((product) => (
                          <option key={product.id} value={product.name}>
                            {product.name}
                          </option>
                        ))}
                      </select>
                      <br />
                      <span><textarea value={res.description} rows="3" placeholder="Description"
                        onChange={(e) => {
                          const updateddata = [...quoteItem];
                          const taskIndex = updateddata.findIndex((task) => task.id === res.id);
                          updateddata[taskIndex].description = e.target.value;
                          setquoteItem(updateddata);
                        }} /></span>
                    </td>
                    <td>
                      <select className="form-select" value={res.tax_id} onChange={(e) => {
                        const updateddata = [...quoteItem];
                        const taskIndex = updateddata.findIndex((task) => task.id === res.id);
                        updateddata[taskIndex].tax_id = e.target.value;
                        setquoteItem(updateddata);
                        var tax_amount = data.taxs.map((val) => (
                          (res.tax_id == val.id) ? val : ""));
                        const taxrate = tax_amount ? tax_amount.rate_percent : 0;
                        const unitPrice = parseFloat(updateddata[taskIndex].unit_price);
                        const quantity = parseFloat(updateddata[taskIndex].quantity);
                        if (tax_amount.length > 0 && tax_amount != "") {
                          tax_amount = tax_amount[0];
                        }
                        else {
                          tax_amount.rate_percent = 0;
                        }
                        var totalAmount = (parseFloat(updateddata[taskIndex].unit_price).toFixed(2) * parseFloat(updateddata[taskIndex].quantity)).toFixed(2) * (1 + parseFloat(tax_amount.rate_percent).toFixed(2) / 100);
                        // var totalAmount = (parseFloat(unitPrice).toFixed(2) * parseFloat(quantity).toFixed(2)) * (1 + parseFloat(tax_amount.rate_percent).toFixed(2) / 100);
                        updateddata[taskIndex].amount = parseFloat(totalAmount).toFixed(2);
                        setquoteItem(updateddata);
                      }}>
                        <option value={0}></option>
                        {data?.taxs.map((res) => {
                          return (<option key={res.id} value={res.id}>{res.tax_name}</option>)
                        })}
                      </select></td>
                    <td><Input type="number" value={res.unit_price} step={0.00} onChange={(e) => {
                      const updateddata = [...quoteItem];
                      const taskIndex = updateddata.findIndex((task) => task.id === res.id);
                      updateddata[taskIndex].unit_price = e.target.value;
                      var tax_amount = data.taxs.map((val) => (
                        (res.tax_id == val.id) ? val : ""));
                      if (tax_amount.length > 0 && tax_amount != "") {
                        tax_amount = tax_amount[0];
                      }
                      else {
                        tax_amount.rate_percent = 0;
                      }
                      var totalAmount = (parseFloat(updateddata[taskIndex].unit_price).toFixed(2) * parseFloat(updateddata[taskIndex].quantity)).toFixed(2) * (1 + parseFloat(tax_amount.rate_percent).toFixed(2) / 100);
                      updateddata[taskIndex].amount = parseFloat(totalAmount).toFixed(2);
                      setquoteItem(updateddata);
                    }} /></td>
                    <td>
                      <Input
                        type="number"
                        value={res.quantity}
                        step={0.00}
                        onChange={(e) => {
                          const updateddata = [...quoteItem];
                          const taskIndex = updateddata.findIndex((task) => task.id === res.id);
                          updateddata[taskIndex].quantity = e.target.value;
                          var tax_amount = data.taxs.map((val) => (
                            (res.tax_id == val.id) ? val : ""));
                          if (tax_amount.length > 0 && tax_amount != "") {
                            tax_amount = tax_amount[0];
                          }
                          else {
                            tax_amount.rate_percent = 0;
                          }

                          // Recalculate the amount based on the quantity and unit price
                          var totalAmount = (parseFloat(updateddata[taskIndex].unit_price).toFixed(2) * parseFloat(updateddata[taskIndex].quantity)).toFixed(2) * (1 + parseFloat(tax_amount.rate_percent).toFixed(2) / 100);
                          updateddata[taskIndex].amount = parseFloat(totalAmount).toFixed(2);

                          setquoteItem(updateddata);
                        }}
                      />
                    </td>
                    <td><Input type="number" value={res.amount} step={0.00} onChange={(e) => {
                      const updateddata = [...quoteItem];
                      const taskIndex = updateddata.findIndex((task) => task.id === res.id);
                      updateddata[taskIndex].amount = e.target.value;
                      var tax_amount = data.taxs.map((val) => (
                        (res.tax_id == val.id) ? val : ""));
                      if (tax_amount.length > 0) {
                        tax_amount = tax_amount[0];
                      }
                      var unitPrice = ((parseFloat(updateddata[taskIndex].amount).toFixed(2) / parseFloat(updateddata[taskIndex].quantity)).toFixed(2)) / (1 + parseFloat(tax_amount.rate_percent).toFixed(2) / 100);
                      updateddata[taskIndex].unit_price = parseFloat(unitPrice).toFixed(2);
                      setquoteItem(updateddata);
                    }}
                    /></td>
                    <td>
                      <div className='hstack gap-2'>
                        <button className="btn btn-sm btn-light edit-list" onClick={() => t_editinvoice()}>
                          Cancel
                        </button>
                        <button className="btn btn-sm btn-success edit-list" onClick={() => EditInvoice(res)}>
                          Update
                        </button>
                      </div>
                    </td>
                  </tr>}</>)
              })}
              {(Addnewinvoice) && <tr>
                <td>
                  <select className='form-control' onChange={(e) => {
                    const selectedValue = e.target.value;
                    if (selectedValue === "0") {
                      // Handle the case when the user selects the default option
                      setInvoiceName(""); // Clear the selected invoice name
                      setInvoicePrice("");
                      setInvoiceAmount("0.00")
                      setInvoiceDesc("");
                      return;
                    }
                    const invoiceData = data?.products.find((val) => val.name === selectedValue);
                    if (invoiceData) {
                      setLoader(true);
                      let formData = {
                        lead_id: postdatas.job.customer_id,
                        job_type: postdatas.job.job_type,
                        job_id: postdatas.job.job_id,
                        description: invoiceData.description,
                      };

                      axios.post('/api/ajaxSetProductDescParameter', formData).then((res) => {
                        var tsk_desc = res.desc;
                        setProductId(invoiceData.id);
                        setProductType(invoiceData.product_type);
                        setInvoiceName(invoiceData.name);
                        setInvoiceDesc(tsk_desc);
                        if (invoiceData.tax_id == null) {
                          setInvoiceTax("0");
                        } else {
                          setInvoiceTax(invoiceData.tax_id);
                        }
                        setInvoicePrice(parseFloat(invoiceData.price).toFixed(2));
                        setInvoiceQuantity(1);
                        if (invoiceData.tax == null) {
                          setInvoiceAmount(parseFloat(invoiceData.price).toFixed(2));
                        } else {
                          setInvoiceAmount(parseFloat(invoiceData.total_amount).toFixed(2));
                        }
                      }).finally(() => {
                        setLoader(false);
                      });
                    }
                  }}>
                    <option value="0"></option>
                    {data.products.map((res) => (
                      <option key={res.id} value={res.name}>
                        {res.name}
                      </option>
                    ))}
                  </select>
                  <br />
                  <span><textarea
                    rows={2}
                    value={invoicedesc}
                    placeholder="Description"
                    onChange={(e) => {
                      setInvoiceDesc(e.target.value);
                    }}
                    style={{
                      fontSize: '14px',
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ccc',
                    }}
                  /></span>
                </td>

                <td><select className="form-select" value={invoicetax} onChange={(e) => {
                  // setInvoiceTax(e.target.value);
                  var tax_amount = data.taxs.map((val) => (
                    (e.target.value == val.id) ? val : ""));
                  var taxrate = (tax_amount.length > 0 && tax_amount[0] != "") ? tax_amount[0].rate_percent : 0;
                  var totalAmount = (parseFloat(invoiceprice).toFixed(2) * parseFloat(invoiceqty)).toFixed(2) * (1 + parseFloat(taxrate).toFixed(2) / 100);
                  setInvoiceAmount(parseFloat(totalAmount).toFixed(2));
                  setInvoiceTax(e.target.value);
                }}>
                  <option value={0}></option>
                  {data?.taxs.map((res) => {
                    return (<option key={res.id} value={res.id}>{res.tax_name}</option>)
                  })}
                </select></td>
                <td><Input type="number" value={invoiceprice} onChange={(e) => {
                  setInvoicePrice(e.target.value);
                  var tax_amount = data.taxs.map((val) => (
                    (invoicetax == val.id) ? val : ""));
                  if (tax_amount.length > 0 && tax_amount != "") {
                    tax_amount = tax_amount[0];
                  }
                  else {
                    tax_amount.rate_percent = 0;
                  }

                  var totalAmount = (parseFloat(e.target.value).toFixed(2) * parseFloat(invoiceqty).toFixed(2)) * (1 + parseFloat(tax_amount.rate_percent).toFixed(2) / 100);
                  setInvoiceAmount(parseFloat(totalAmount).toFixed(2));
                }} step={0.00} /></td>
                <td><Input type="number" value={invoiceqty} step={0.00} onChange={(e) => {
                  setInvoiceQuantity(e.target.value);
                  var tax_amount = data.taxs.map((val) => (
                    (invoicetax == val.id) ? val : ""));
                  if (tax_amount.length > 0 && tax_amount != "") {
                    tax_amount = tax_amount[0];
                  }
                  else {
                    tax_amount.rate_percent = 0;
                  }
                  var totalAmount = (parseFloat(invoiceprice).toFixed(2) * parseFloat(e.target.value)).toFixed(2) * (1 + parseFloat(tax_amount.rate_percent).toFixed(2) / 100);
                  setInvoiceAmount(parseFloat(totalAmount).toFixed(2));
                }} /></td>
                <td><Input type="number" value={invoiceamt} step={0.00} onChange={(e) => {
                  setInvoiceAmount(e.target.value);
                  var tax_amount = data.taxs.map((val) => (
                    (invoicetax == val.id) ? val : ""));
                  if (tax_amount.length > 0 && tax_amount != "") {
                    tax_amount = tax_amount[0];
                  }
                  else {
                    tax_amount.rate_percent = 0;
                  }

                  var unitPrice = ((parseFloat(e.target.value).toFixed(2) / parseFloat(invoiceqty)).toFixed(2)) / (1 + parseFloat(tax_amount.rate_percent).toFixed(2) / 100);
                  setInvoicePrice(parseFloat(unitPrice).toFixed(2));
                }} /></td>
                <td>
                  <div className='hstack gap-2'>
                    <button className="btn btn-sm btn-light edit-list" onClick={addTableRows}>
                      Cancel
                    </button>
                    <button className="btn btn-sm btn-success edit-list" onClick={() => SaveInvoice()}>
                      Save
                    </button>
                  </div>
                </td>
              </tr>}
            </tbody>
          </Table>
          <Button className="btn btn-brown" onClick={addTableRows} >+</Button>
          <Row>
            <Col lg={6}></Col>
            <Col lg={6}>
              <Table className="table-bordered">
                <tbody>
                  <tr>
                    <th className="bg-soft-purple">
                      <span>Total (excl tax)</span>
                    </th>
                    <td className='text-end'>
                      <span id="grand_total_tax">
                        {postdatas?.global?.currency_symbol}  {total_excl_tax.toFixed(2)}
                      </span>
                    </td>
                  </tr>
                  {data?.quoteItem?.length > 0 && (
                  <tr>
                    <th className="bg-soft-purple">
                      <span>Discount {(discounttype) ? "- " + discounttype : ""}</span>
                      <UncontrolledDropdown className="dropdown d-inline-block">
                        <DropdownToggle className="btn fs-18" tag="button">
                          <i className="ri-more-fill"></i>
                        </DropdownToggle>
                        <DropdownMenu className="dropdown-menu-end">
                          <DropdownItem className="edit-item-btn" onClick={() => {
                            setDiscountType("fixed")
                            setDiscountOpen("fixed");
                          }}>
                            <i className="ri-money-dollar-circle-line align-bottom me-2 text-muted"></i>Fixed
                          </DropdownItem>
                          <DropdownItem className="remove-item-btn" onClick={() => {
                            setDiscountType("percent");
                            setDiscountOpen("percent");
                          }}>
                            <i className="ri-percent-fill align-bottom me-2"></i>Percent
                          </DropdownItem>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </th>
                    <td className='text-end'>
                      {isdiscountopen === "" && (
                        <span id="grand_total_incl_tax">{showdiscount ? discountAmtString : (` ${parseFloat(discountVal)?.toFixed(2)}`)}</span>
                      )}
                      {isdiscountopen && (
                        <span>
                          <div className="input-group input-group-sm">
                            <input
                              type="number"
                              id="s_discount_value_field"
                              className="form-control mb-2"
                              value={discountVal}
                              onChange={(e) => {
                                console.log(e.target.value);
                                setDiscountVal(e.target.value)
                              }}
                            />
                          </div>
                          <div className="d-flex justify-content-start align-items-center m-t-10">
                            <button
                              id="s_cancel_discount_btn"
                              type="button"
                              className="btn btn-light"
                              onClick={() => SelectDiscount("cancel")}
                            >
                              Cancel
                            </button>
                            <button
                              id="s_save_discount_btn"
                              type="button"
                              className="btn btn-success mx-2"
                              onClick={() => {
                                SelectDiscount("save")
                                submitDiscount()
                              }}
                            >
                              Save
                            </button>
                          </div>
                        </span>
                      )}
                    </td>
                  </tr>
                  )}
                    {data?.quoteItem?.length > 0 && (
                  <tr>
                    <th className="bg-soft-purple">
                      <span>Total (excl tax) after discount</span>
                    </th>
                    <td className='text-end'>

                      {isNaN(afterDiscountVal) ? "$ 0.00" : (
                        <span id="subm">
                          {postdatas?.global?.currency_symbol} {afterDiscountVal == 0 ? total_excl_tax.toFixed(2) : afterDiscountVal}
                        </span>)}
                    </td>
                  </tr>
                   )}
                  <tr> 
                    <th className="bg-soft-purple">
                      <span>Tax</span>
                    </th>
                    <td className='text-end'>
                      <span id="grand_total_incl_tax">
                        {postdatas?.global?.currency_symbol}  {total_tax.toFixed(2)}

                      </span>
                    </td>
                  </tr>
                  <tr>
                    <th className="bg-soft-purple">
                      <span>Total (incl tax)</span>
                    </th>
                    <td className='text-end'>
                      {console.log(inclTax)}
                      {isNaN(inclTax) ? "$ 0.00" : (
                        <span id="grand_total_incl_tax">
                          $ {(inclTax.toFixed(2))}
                        </span>)}
                    </td>
                  </tr>
                </tbody>
              </Table>

            </Col>
          </Row>
        </CardBody>
      </Card>

      <Modal
        id="showModal"
        className="modal-dialog-edit"
        isOpen={modal}
        toggle={() => t_deleteInvoice}
        centered>
        <ModalBody className="py-2 px-3">
          <div className="mt-2 text-center">
            <lord-icon
              src="https://cdn.lordicon.com/wdqztrtx.json"
              trigger="loop"
              colors="primary:#912a4e,secondary:#f06548"
              style={{ width: "100px", height: "100px" }}
            ></lord-icon>
            <div className="mt-4 pt-2 fs-15 mx-4 mx-sm-5" >
              <h4>Are you sure ?</h4>
              <p className="text-muted mx-4 mb-0">
                You will not be able to recover the deleted invoice item!
              </p>
            </div>
          </div>
          <div className="d-flex gap-2 justify-content-center mt-4 mb-2">
            <button
              type="button"
              className="btn w-sm btn-light"
              data-bs-dismiss="modal"
              onClick={() => t_deleteInvoice()}>
              Cancel
            </button>
            <button
              type="button"
              className="btn w-sm btn-danger "
              id="delete-record"
              onClick={() => deleteInvoice()}
            >
              Ok
            </button>
          </div>
        </ModalBody>
      </Modal>

      <ToastContainer closeButton={false} limit={1} theme="light" />
    </div >
  )
}