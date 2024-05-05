import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { useParams } from "react-router-dom";
import { Accordion, AccordionItem, Button, Card, CardBody, CardHeader, Col, Collapse, Table, Form, Label, Input, Container, Row } from 'reactstrap';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DeleteModal from "../../../Components/Common/DeleteModal";
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import Loader from "../../../Components/Common/Loader";

export const Estimate = ({ data, onChangeData }) => {
  const location = useLocation();
  const url = location.pathname;
  const opp_id = url.substring(url.lastIndexOf('/') + 1);

  //LocalStorage setItem

  const hash = window.location.hash
  const currentPageUrl = window.location.href;
  const currentUrl = new URL(currentPageUrl);
  const pathname = currentUrl.pathname;
  localStorage.setItem("expiredSessionRedirectUrl", pathname + hash);

  useEffect(() => {
    setSelectedOppId(opp_id);
    setoppid(opp_id)
    console.log(data, "data234");
  }, [])


  const navigate = useNavigate();
  var total_payments = 0;
  var total_excl_tax = 0;
  var total_incl_tax = 0;
  var rate_percent = 0;
  var total_tax = 0;
  var total_after_discount = 0;

  const [rowsData, setRowsData] = useState([]);
  const [postData, setData] = useState([]);
  const [invoice, setInvoiceList] = useState([]);
  const [discounttype, setDiscountType] = useState('');
  const [quote, setQuote] = useState([]);
  const [quoteItem, setquoteItem] = useState([]);
  const [expandedinvoiceId, setExpandedInvoiceId] = useState('');
  const [selectedinvoice, setSelectedInvoiceData] = useState([]);
  const [modal, setOpenModal] = useState(false);
  const [Addnewinvoice, setAddInvoice] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [invoicename, setInvoiceName] = useState("");
  const [producttype, setProductType] = useState("");
  const [invoicepid, setProductId] = useState("");
  const [invoicedesc, setInvoiceDesc] = useState("");
  const [invoiceprice, setInvoicePrice] = useState("");
  const [invoicetax, setInvoiceTax] = useState("");
  const [invoiceamt, setInvoiceAmount] = useState("");
  const [invoiceqty, setInvoiceQuantity] = useState("");
  const [oppid, setoppid] = useState(data?.job?.crm_opportunity_id);
  const [quoteid, setquoteid] = useState(data?.quoteId);
  const [leadid, setleadid] = useState(data?.job?.customer_id);
  const [isdiscountopen, setDiscountOpen] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOppId, setSelectedOppId] = useState();
  const [opportunities, setOpportunities] = useState();
  const [isEdit, setIsEdit] = useState(false);
  const [deposit, setDeposit] = useState('');
  const [inputDescription, setInputDescription] = useState("");
  const [inclTax, setInclTax] = useState(0)
  const [afterDiscountVal, setAfterDiscountVal] = useState()
  const [depositRequired, setDepositRequired] = useState(0);
  const [discountVal, setDiscountVal] = useState();
  const [discountamt, setDiscountAmt] = useState(data?.quote?.discount);
  const [depositamt, setDepositAmt] = useState(data?.quote?.deposit_required);
  const [saveButtonDisabled, setSaveButtonDisabled] = useState(false);


  const parser = new DOMParser();
  const t_editinvoice = (val) => {
    onChangeData();
    setExpandedInvoiceId(val);
  }
  useEffect(() => {
    setQuote(data?.quote);
  }, [])
  // console.log(quote,"quote1234");
  const loadTables = () => {
    var deposit_required = 0;
    var booking_fee = 0;
    console.log(data, "dataaaaa");
    const dataQuote=data.quote
    if (dataQuote) {
      if (dataQuote.deposit_required > 0 && dataQuote.deposit == 'Y') {
        deposit_required = dataQuote.depositRequired;
      } else {
        if (dataQuote.deposit == 'N') {
          deposit_required = "0.00";
        } else {
          deposit_required = "0.00";
          if (data.job.price_structure == 'Fixed') {
            if (data.job_price_additional.is_deposit_for_fixed_pricing_fixed_amt == 'Y') {
              deposit_required = data.job_price_additional.deposit_amount_fixed_pricing;
            } else {
              deposit_required = data.job_price_additional.deposit_percent_fixed_pricing * data.quote_total;
            }
          } else {
            if (data.job_price_additional.hourly_pricing_has_booking_fee == 'Y') {
              console.log("jenny")
              booking_fee = data.job_price_additional.hourly_pricing_booking_fee;
            }
            else {
              console.log("jenn1")
              if (data.job_price_additional.is_deposit_for_hourly_pricing_fixed_amt == 'Y') {
                console.log("jenny2")
                deposit_required = data.job_price_additional.deposit_amount_hourly_pricing;
              } else {
                console.log("jenny3")
                deposit_required = data.job_price_additional.deposit_percent_hourly_pricing * data.quote_total;
                console.log(data.job_price_additional)
                console.log(data.quote_total)
              }
            }
          }
        }
      }
    }
    console.log(depositRequired,"depositRequired")
    setDepositRequired(deposit_required);
    setDepositAmt(deposit_required);
    setDiscountAmt(data?.quote?.discount);
  }
  useEffect(() => {
    loadTables();
  }, [quote, data])

  useEffect(() => {
    if (discounttype == "percent") {
      setAfterDiscountVal(parseFloat(total_excl_tax) - (parseInt(discountamt) / 100 * parseFloat(total_excl_tax)))
      setInclTax((parseFloat(total_excl_tax) - (parseInt(discountamt) / 100 * parseFloat(total_excl_tax))) + parseFloat(total_tax));
    }
    else if (discounttype == "fixed") {
      setAfterDiscountVal(total_excl_tax - (discountamt))
      setInclTax((parseFloat(total_excl_tax) - parseFloat(discountamt)) + parseFloat(total_tax))
    }
    setDiscountAmt(discountamt)
  }, [quote, quoteItem, total_tax, discountamt])

  const t_deleteInvoice = (val = "") => {
    if (val != "") {
      setSelectedInvoiceData(val);
      setOpenModal(true);
    } else {
      setOpenModal(false);
    }
  }

  const SelectDiscount = (val) => {
    if (val == "cancel") {
      // data.invoice.discount = 0;
      setDiscountOpen("");
    } else if (val == "save") {
      setDiscountType(val);
      setDiscountOpen("");
    }
    else {
      setDiscountType(val);
    }
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


  useEffect(() => {
    getData();  
    // if (data) {
    //   setTimeout(function () {
    //     setIsLoading(false);
    //   }, 2000);
    // }
  }, [data])

  function getData() {
    setData(data);
    setOpportunities(data?.opportunities);
    setDiscountType(data?.quote?.discount_type);
    setDiscountOpen("")
    setInputDescription(data?.re)
    setquoteItem(data?.quoteItem);
  }

  const deleteTableRows = (index) => {
    const rows = [...rowsData];
    rows.splice(index, 1);
    setRowsData(rows);
  }
  const handleChange = (index, evnt) => {
    const { name, value } = evnt.target;
    const rowsInput = [...rowsData];
    rowsInput[index][name] = value;
    setRowsData(rowsInput);
  }

  const EditInvoice = (data) => {
    var postData = {
      "id": data.id,
      "crm_opportunity_id": oppid,
      "quote_id": data?.quote?.id,
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
    })
  }


  const SaveInvoice = () => {
    // Disable the Save button to prevent multiple clicks
    setSaveButtonDisabled(true);
    var postData = {
      "lead_id": leadid,
      // "quote_id": data?.quoteId,
      "quote_id": data?.quote?.id,
      "product_id": invoicepid,
      "name": invoicename,
      "description": invoicedesc,
      "tax_id": invoicetax,
      "unit_price": invoiceprice,
      "quantity": invoiceqty,
      "type": producttype,
      "amount": invoiceamt,
      "crm_opportunity_id": data?.job?.crm_opportunity_id,
      "sys_job_type": 'Moving',
      type: 'Item'
    }
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
      }).catch((error) => {
        console.error(error);
    })
    .finally(() => {
        setSaveButtonDisabled(false);
    });
    }
  }
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const deleteInvoice = (id) => {
    setDeleteItemId(id);
    setDeleteModal(true);

  }
  const handleDeleteOrder = async () => {
    var postData = {

      "crm_opportunity_id": data?.job?.crm_opportunity_id,
      "lead_id": leadid,
      "id": deleteItemId,
      "sys_job_type": data.quote.sys_job_type,
      "quote_id": data?.quote?.id,

    }
    axios.post("api/ajaxDestroyQuoteItem", postData).then((res) => {
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

  const handleEstimate = () => {
    setIsLoading(true);
    var postData = {
      "opp_id": data?.job?.crm_opportunity_id
    }
    axios.post("api/generateEstimateQuote", postData)
      .then(res => {
        if (res.error == 0) {
          toast.success(res.message);
        }
        else {
          toast.error("Something went wrong!");
        }
        setIsLoading(false);
      })
      .catch(err => {
        toast.error("Something went wrong")
      })
  }
  const handleInsurance = () => {
    setIsLoading(true);
    axios.get(`api/generate-insurance-quote/${data?.job?.crm_opportunity_id}`)
      .then(res => {
        if (res.status == 1) {
          toast.success(res.message);
        }
        else {
          toast.error("Something went wrong!");
        }
        setIsLoading(false);
      })
      .catch(err => {
        toast.error("Something went wrong");
        setIsLoading(false);
      })
  }
  const downloadQuote = () => {
    let opportunity_id = data?.job?.crm_opportunity_id;
    axios.get(`api/downloadQuote/${opportunity_id}`)
      .then(res => {
        if (res.error === 0) {
          window.open(res.url, "_blank");
        }
        else {
          toast.error("Pdf not generated")
        }

      })
      .catch(err => {
        console.log(err);
      })
  }
  const downloadInsurance = () => {
    let opportunity_id = data?.job?.crm_opportunity_id;
    axios.get(`api/download-insurance-quote/${opportunity_id}`)
      .then(res => {
        if (res.error === 0) {
          window.open(res.url, "_blank");
        }
        else {
          toast.error("Pdf not generated")
        }

      })
      .catch(err => {
        console.log(err);
      })
  }
  let selectedOpportunity = () => {
    opportunities?.map(opportunity => {
      if (opportunity.id == selectedOppId) {
        setleadid(opportunity.lead_id);
      }
    });
  }

  const submitDiscount = () => {
    const form = {
      quote_id: data?.quote?.id,
      discount: discountamt,
      discount_type: discounttype,
      crm_opportunity_id: data?.job?.crm_opportunity_id,
      sys_job_type: 'Moving'
    }
    axios.post("api/crm-leads/ajaxSaveEstimateDiscount", form).then((res) => {
      if (res.error == 0) {
        toast.success(res.message);
        onChangeData();
        console.log(discounttype);
        if (discounttype == "percent") {
          console.log((parseFloat(total_excl_tax) - (parseFloat(discountamt) / 100 * parseFloat(total_excl_tax))) + parseFloat(total_tax))
          setAfterDiscountVal(parseFloat(total_excl_tax) - (parseFloat(discountamt) / 100 * parseFloat(total_excl_tax)))
          setInclTax((parseFloat(total_excl_tax) - (parseFloat(discountamt) / 100 * parseFloat(total_excl_tax))) + parseFloat(total_tax));
        }
        else if (discounttype == "fixed") {
          setAfterDiscountVal(total_excl_tax - parseFloat(discountamt))
          setDiscountType("")
          setInclTax((parseFloat(total_excl_tax) - parseFloat(discountamt)) + parseFloat(total_tax))
        }
        // setDiscountType('');
        //setDiscountAmt(data?.quote?.discount);
      }
      else {
        toast.error("Something went wrong");
      }
    })
  }
  const Deposit = (val) => {
    setIsLoading(true);
    var type = val;
    if (type == "N") {
      var depositamount = "0.00";
    } else {
      var depositamount = depositamt;
    }
    const formdata = {
      quote_id: data?.quote?.id,
      deposit: type,
      crm_opportunity_id: data.quote.crm_opportunity_id,
      deposit_required: depositamount,
      sys_job_type: 'Moving'
    }
    axios.post(`api/crm-leads/ajaxSaveDepositRequired`, formdata)
      .then(res => {
        setDeposit('');
        toast.success(res.message, { theme: "light" });
        setQuote(res.quote);
        onChangeData();
        // loadTables();
        // setDepositAmt(data?.quote?.deposit_required);
        // toast.success("Deposit Saved Successfully", { theme: "light" });

      })
      .catch(err => {
        console.log(err);
      }).finally(() => {
        setIsLoading(false);
      })
  }

  const HandleCancel = () => {
    setDeposit('');
  };

  console.log(quoteItem,"quoteItem")
  console.log(invoiceamt,"invoiceAmt1")
  // console.log(depositamt,"depositamtttt");
  return (
    <div >
      <DeleteModal
        show={deleteModal}
        orderId={selectedOrderId}
        onDeleteClick={handleDeleteOrder}
        onCloseClick={() => setDeleteModal(false)}
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
      <Card>
        <Row className='m-3'>
          <Col lg={2} >
            <h5 className='pt-2'> Opportunity # </h5>
          </Col>
          <Col lg={2}>
            <select
              value={selectedOppId}
              onChange={event => {
                selectedOpportunity();
                setSelectedOppId(event.target.value)
                const queryString = `/opportunitydetails/${leadid}/${event.target.value}`;
                navigate(queryString);
                window.location.reload();
              }}

              className="form-select "
              aria-label="Default select example"
              style={{ padding: '0.5rem 1.7rem 0.5rem 0.9rem' }}
            >
              {opportunities?.map((res) => {
                return <option key={res.id} value={res.id}>
                  {res.op_type} {res.job_number}
                </option>
              })}
            </select>
          </Col>
          <Col lg={4} className='hstack gap-2 p-0 justify-content-end'>
            <Button className='btn btn-soft-dark' onClick={handleEstimate}><i className='bx bxs-file-pdf fs-15' /> Generate Estimate PDF</Button>
            <Link
              to="#"
              className=" btn btn-sm btn-success fs-13 pt-1" onClick={downloadQuote} >
              <i className="bx bxs-download fs-20 p-1"></i>
            </Link>
          </Col>
          <Col lg={4} className='hstack gap-2 justify-content-end p-0'>
            <Button className='btn btn-soft-dark' onClick={handleInsurance}><i className='bx bxs-file-pdf fs-15' /> Generate Insurance Quote</Button>
            <Link
              to="#"
              className=" btn btn-sm btn-success fs-13 pt-1" onClick={downloadInsurance} >
              <i className="bx bxs-download fs-20 p-1"></i>
            </Link>
          </Col>
        </Row>

        <div className='m-3'>
          <Table className='table-bordered mt-3 inventory'>
            <thead className='bg-soft-purple'>
              <tr>
                <th>Item Name & Description</th>
                <th>Tax</th>
                <th>Unit Price</th>
                <th>QTY</th>
                <th>Total Inc Tax</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {quoteItem?.map((res) => {
                { total_excl_tax = parseFloat(total_excl_tax) + (parseFloat(res.unit_price) * parseFloat(res.quantity)) }
                { total_tax = parseFloat(total_tax) + parseFloat(res.amount) - (parseFloat(res.unit_price) * parseFloat(res.quantity)) }

                return (<>{(expandedinvoiceId != res.id) && <tr key={res.id}>
                  <td>
                    <span>{res.name}</span><br />
                    <span dangerouslySetInnerHTML={{ __html: res.description?.replace(/\n/g, '<br>') }}></span>
                  </td>
                  <td>{postData.taxs.map((val) => (
                    (res.tax_id == val.id) ? val.tax_name : ""))}</td>
                  <td className='text-end'> {postData.global.currency_symbol} {parseFloat(res.unit_price).toFixed(2)}</td>
                  <td className='text-end'>{parseFloat(res.quantity).toFixed(2)}</td>
                  <td className='text-end'>{postData.global.currency_symbol} {parseFloat(res.amount).toFixed(2)}</td>
                  <td>
                    <div className='hstack gap-2'>
                      <button className="btn btn-sm btn-soft-info edit-list" onClick={() => t_editinvoice(res.id)}>
                        <i className="bx bxs-pencil fs-12 pt-1"></i>
                      </button>
                      <button className="btn btn-sm btn-soft-danger edit-list" onClick={() => deleteInvoice(res.id)}>
                        <i className="bx bxs-trash fs-12 pt-1"></i>
                      </button>
                    </div>
                  </td>
                </tr>}
                  {(expandedinvoiceId == res.id) && <tr key={res.id}>
                    <td>
                      <span>
                        <Input
                          type="text"
                          list="data"
                          value={res.name}
                          onChange={(e) => {
                            const updateddata = [...quoteItem];
                            const taskIndex = updateddata.findIndex((task) => task.id === res.id);
                            const dataList = document.getElementById("data");
                            const selectedValue = e.target.value;
                            const selectedItem = [...dataList.querySelectorAll('option')].find(option => option.value === selectedValue);
                            const enteredValue = selectedItem ? selectedItem.value : "";
                            const itemId = selectedItem ? selectedItem.dataset.id : "";
                            if (itemId) {
                              const invoiceData = data?.products?.find((val) => val.id === parseInt(itemId));
                              setIsLoading(true);
                              let formData = {
                                lead_id: postData.job.customer_id,
                                job_type: postData.job.job_type,
                                job_id: postData.job.job_id,
                                description: invoiceData.description,
                              };

                              axios.post('/api/ajaxSetProductDescParameter', formData).then((res) => {
                                var tsk_desc = res.desc;
                                if (invoiceData) {
                                  updateddata[taskIndex].name = invoiceData.name;
                                  updateddata[taskIndex].item_summary = tsk_desc;
                                  updateddata[taskIndex].tax_id = invoiceData.tax_id;
                                  updateddata[taskIndex].unit_price = parseFloat(invoiceData.price).toFixed(2);
                                  updateddata[taskIndex].quantity = 1;
                                  updateddata[taskIndex].amount = parseFloat(invoiceData.total_amount).toFixed(2);
                                }
                              })
                                .finally(() => {
                                  setIsLoading(false);
                                })
                            } else {
                              updateddata[taskIndex].name = selectedValue;
                            }
                            setquoteItem(updateddata);
                          }}
                        />
                      </span>
                      <datalist id="data">
                        {postData?.products.map((item, key) => (
                          <option key={key} value={item.name} data-id={item.id}>
                            {item.name}
                          </option>
                        ))}
                      </datalist>
                      <br />
                      <textarea value={res.description} type="text" placeholder="Description"
                        style={{
                          fontSize: '14px',
                          width: '100%',
                          padding: '10px',
                          border: '1px solid #ccc',
                        }}
                        onChange={(e) => {
                          const updateddata = [...quoteItem];
                          const taskIndex = updateddata.findIndex((task) => task.id === res.id);
                          updateddata[taskIndex].description = e.target.value;
                          setquoteItem(updateddata);
                        }}
                      />
                    </td>
                    <td>
                      <select className="form-select" value={res.tax_id} onChange={(e) => {
                        const updateddata = [...quoteItem];
                        const taskIndex = updateddata.findIndex((task) => task.id === res.id);
                        updateddata[taskIndex].tax_id = e.target.value;
                        setquoteItem(updateddata);
                        var tax_amount = postData.taxs.map((val) => (
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
                      }}>
                        <option value={0}></option>
                        {postData?.taxs.map((res) => {
                          return (<option key={res.id} value={res.id}>{res.tax_name}</option>)
                        })}
                      </select></td>
                    <td><Input type="number" value={res.unit_price} step={0.00} onChange={(e) => {
                      const updateddata = [...quoteItem];
                      const taskIndex = updateddata.findIndex((task) => task.id === res.id);
                      updateddata[taskIndex].unit_price = e.target.value;
                      var tax_amount = postData.taxs.map((val) => (
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
                          var tax_amount = postData.taxs.map((val) => (
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
                      var tax_amount = postData.taxs.map((val) => (
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
                  <span>
                    <Input
                      type="text"
                      list="data"
                      value={invoicename}
                      onChange={(e) => {
                        const { value } = e.target;
                        const dataList = document.getElementById("data");
                        const selectedValue = e.target.value;
                        const selectedItem = [...dataList.querySelectorAll('option')].find(option => option.value === selectedValue);
                        const enteredValue = selectedItem ? selectedItem.value : "";
                        const itemId = selectedItem ? selectedItem.dataset.id : "";
                        if (itemId) {
                          const invoiceData = postData?.products?.find((val) => val.id === parseInt(itemId));
                          setIsLoading(true);
                          let formData = {
                            lead_id: postData.job.customer_id,
                            job_type: postData.job.job_type,
                            job_id: postData.job.job_id,
                            description: invoiceData.description,
                          };

                          axios.post('/api/ajaxSetProductDescParameter', formData).then((res) => {
                            var tsk_desc = res.desc;
                            console.log(invoiceData,"InvoiceAmtData")
                            console.log(postData,"PostDataAmt")
                            if (invoiceData) {
                              setProductId(invoiceData.id);
                              setProductType(invoiceData.product_type);
                              setInvoiceName(invoiceData.name);
                              setInvoiceDesc(tsk_desc);
                              
                              setInvoicePrice(parseFloat(invoiceData.price).toFixed(2));
                              setInvoiceQuantity(1);
                              // setInvoiceAmount(parseFloat(invoiceData.total_amount).toFixed(2));

                              var tax_amount = postData.taxs.map((val) => (
                                (invoiceData.tax_id == val.id) ? val : ""));
                              if (tax_amount.length > 0) {
                                tax_amount = tax_amount[0];
                              }
                              if(tax_amount!=""){
                                setInvoiceTax(invoiceData.tax_id);
                              }
                              else if(tax_amount==""){
                                setInvoiceTax(parseInt("0"))
                              }
                              console.log(tax_amount,"taxamt")
                              var totalAmount = tax_amount!=""?(parseFloat(parseFloat(invoiceData.price).toFixed(2)).toFixed(2) * parseFloat(1).toFixed(2)) * (1 + parseFloat(tax_amount.rate_percent).toFixed(2) / 100):(parseFloat(parseFloat(invoiceData.price).toFixed(2)).toFixed(2) * parseFloat(1).toFixed(2))*1 ;
                              setInvoiceAmount(parseFloat(totalAmount).toFixed(2));
                              
                              console.log(tax_amount, "in")
                            }
                          })
                            .finally(() => {
                              setIsLoading(false);
                            })
                        } else {
                          setInvoiceName(selectedValue);
                        }

                      }}
                    />
                  </span>
                  <datalist id="data">
                    {postData?.products.map((item, key) => (
                      <option key={key} value={item.name} data-id={item.id}>
                      {item.name}
                    </option>
                    ))}
                  </datalist>
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
                  setInvoiceTax(e.target.value);
                  var tax_amount = postData.taxs.map((val) => (
                    (e.target.value == val.id) ? val : ""));
                  if (tax_amount.length > 0 && tax_amount != "") {
                    tax_amount = tax_amount[0];
                  }
                  else {
                    tax_amount.rate_percent = 0;
                  }
                  console.log(parseFloat(totalAmount).toFixed(2),"invoiceAmt")
                  var totalAmount = (parseFloat(invoiceprice).toFixed(2) * parseFloat(invoiceqty).toFixed(2)) * (1 + parseFloat(tax_amount.rate_percent).toFixed(2) / 100);
                  setInvoiceAmount(parseFloat(totalAmount).toFixed(2));
                }}>
                  <option value={0}></option>
                  {postData?.taxs.map((res) => {
                    return (<option key={res.id} value={res.id}>{res.tax_name}</option>)
                  })}
                </select></td>
                <td><Input type="number" value={invoiceprice} onChange={(e) => {
                  setInvoicePrice(e.target.value);
                  var tax_amount = postData.taxs.map((val) => (
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
                  var tax_amount = postData.taxs.map((val) => (
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
                  console.log(invoiceamt,"invoiceAmt")
                  var tax_amount = postData.taxs.map((val) => (
                    (invoicetax == val.id) ? val : ""));
                  if (tax_amount.length > 0 && tax_amount != "") {
                    tax_amount = tax_amount[0];
                  }
                  else {
                    tax_amount.rate_percent = 0;
                  }
                  var unitPrice = ((parseFloat(e.target.value) / parseFloat(invoiceqty))) / (1 + parseFloat(tax_amount.rate_percent)/ 100);
                  setInvoicePrice(parseFloat(unitPrice));
                }} /></td>
                <td>
                  <div className='hstack gap-2'>
                    <button className="btn btn-sm btn-light edit-list" onClick={addTableRows}>
                      Cancel
                    </button>
                    <button className="btn btn-sm btn-success edit-list" onClick={() => SaveInvoice()} disabled={saveButtonDisabled}>
                    Save
                    </button>
                  </div>
                </td>
              </tr>}
            </tbody>
          </Table>
          <button className="btn btn-primary" onClick={addTableRows} >+</button>

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
                        {data?.global?.currency_symbol}
                        {total_excl_tax.toFixed(2)}
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
                              setDiscountType("fixed");
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
                          <span id="grand_total_incl_tax" >
                            {data?.quote && data?.quote?.discount_type === 'fixed' ? (
                              <span>$ {data?.quote?.discount}</span>
                            ) : (
                              <span>{data?.quote?.discount}%</span>
                            )}

                          </span>
                        )}
                        {isdiscountopen && (
                          <span>
                            <div className="input-group input-group-sm">
                              <input
                                type="number"
                                id="s_discount_value_field"
                                value={discountamt}
                                className="form-control mb-2"
                                onChange={(e) => {
                                  setDiscountAmt(e.target.value)
                                  // console.log(e.target.value);
                                  // data.quote.discount = e.target.value;
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
                                onClick={() => submitDiscount()}
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
                        <span id="grand_total_incl_tax">
                          {isNaN(afterDiscountVal) ? "$ 0.00" : (
                            <span id="subm">
                              {data?.global?.currency_symbol}{afterDiscountVal.toFixed(2)}
                            </span>)}
                        </span>
                      </td>
                    </tr>
                  )}
                  <tr>
                    <th className="bg-soft-purple">
                      <span>Tax</span>
                    </th>
                    <td className='text-end'>
                      <span id="grand_total_incl_tax">
                        {data?.global?.currency_symbol}
                        {total_tax.toFixed(2)}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <th className="bg-soft-purple">
                      <span>Total (incl tax)</span>
                    </th>
                    <td className='text-end'>
                      <span id="grand_total_incl_tax">
                        {data?.global?.currency_symbol}

                        {isNaN(inclTax) ? " 0.00" : (
                          <span id="grand_total_incl_tax">
                            {(inclTax).toFixed(2)}
                          </span>)}
                      </span>
                    </td>
                  </tr>
                  {data?.quoteItem?.length > 0 && (
                    <tr>
                      <th className="bg-soft-purple">
                        <span>Deposit Required {(deposit) ? deposit : ""}</span>
                        <UncontrolledDropdown className="dropdown d-inline-block">
                          <DropdownToggle className="btn fs-18" tag="button">
                            <i className="ri-more-fill"></i>
                          </DropdownToggle>
                          <DropdownMenu className="dropdown-menu-end">
                            <DropdownItem className="edit-item-btn" onClick={() => setDeposit("Fixed")}>
                              <i className="ri-pencil-fill"></i> Edit
                            </DropdownItem>
                            <DropdownItem className="remove-item-btn" onClick={() => Deposit('N')}>
                              <i className="bx bxs-circle"></i> No Deposit
                            </DropdownItem>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </th>
                      <td className='text-end'>
                        {(deposit === "" && !isEdit) && (
                          <span id="grand_total_incl_tax">
                            $ {parseFloat(depositamt)?.toFixed(2)}
                          </span>
                        )}

                        {deposit && (
                          <span>
                            <div className="input-group input-group-sm">
                              <input
                                type="number"
                                value={depositamt}
                                id="s_discount_value_field"
                                className="form-control mb-2"
                                onChange={(e) => {
                                  setDepositAmt(e.target.value);

                                }}
                              />
                            </div>
                            <div className="d-flex justify-content-start align-items-center m-t-10">
                              <button
                                id="s_cancel_discount_btn"
                                type="button"
                                className="btn btn-light"
                                onClick={() => HandleCancel()}
                              >
                                Cancel
                              </button>
                              <button
                                id="s_save_discount_btn"
                                type="button"
                                className="btn btn-success mx-2"
                                onClick={() => Deposit('Y')}
                              >
                                Save
                              </button>
                            </div>
                          </span>
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>

            </Col>
          </Row>
        </div>
      </Card>
      <ToastContainer closeButton={false} limit={1} theme="light" />
    </div>
  )
}