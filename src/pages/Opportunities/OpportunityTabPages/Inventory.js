import React, { useEffect, useState } from 'react'
import { Accordion, AccordionItem, Button, Card, CardBody, CardHeader, Col, Collapse, Table, Form, Label, Input,Modal,ModalBody, Container, Row } from 'reactstrap';
import classnames from "classnames";
import TableRows from "./TableRow";
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import DeleteModal from "../../../Components/Common/DeleteModal";
import { Link } from 'react-router-dom';
import Loader from "../../../Components/Common/Loader";

export const Inventory = ({ data, onChangeData }) => {
  const [inventoryGroups, setInventoryGroups] = useState(data?.inventory_groups || []);
  const [getinventoryGroups, setgetInventoryGroups] = useState(data?.getInventoryItems || []);
  const [directvalue, setDirectValue] = useState();
  const [jobid, setJobid] = useState(data?.job?.job_id);
  const [miscItems, setMiscItems] = useState(data?.miscllanceous_items || []);
  const [deleteModal, setDeleteModal] = useState(false);
  const [clearAllModal, setClearAllModal] = useState(false);
  const [insuranceexcess, setInsuranceExcess] = useState();
  const [isInventoryEdit, setInventoryEdit] = useState();
  const [postData, setData] = useState();
  const [cbm, setCBM] = useState();
  const [insurancepremium, setInsurancePremium] = useState();
  const [inventoryItems, setInventoryItems] = useState(data?.getInventoryItems);
  const [trucksize, setTruckSize] = useState();
  const [colDisplay, setColDisplay] = useState(false)
  const [col1, setcol1] = useState(true);
  const [col2, setcol2] = useState(false);
  const [col3, setcol3] = useState(false);
  const [addRow, setShowAddRow] = useState();
  const [isLoader, setLoader] = useState(true);

  const [colDisplayAll, setColDisplayAll] = useState(false);
  const t_colDisplayAll = () => {
    setColDisplayAll(prevState => !prevState);
  };



  const StoreMiscItems = () => {
    var name = [];
    var cbm = [];
    var quantity = [];
    console.log(miscItems);
    miscItems.map((res) => {
      console.log(res);
      name.push(res.misc_item_name);
      cbm.push(res.misc_item_cbm);
      quantity.push(res.quantity);
    })
    var postData = {
      "name": name,
      "cbm": cbm,
      "quantity": quantity
    }
    console.log(postData.name);
    if (postData.name === "" || postData.name === undefined) {
      toast.error("Enter the Contact Name", { theme: "light" });
    }
    else if (postData.cbm === "" || postData.cbm === undefined) {
      toast.error("Enter the Mobile Number", { theme: "light" });
    }
    else if (postData.quantity === "" || postData.quantity === undefined) {
      toast.error("Enter the Mobile Number", { theme: "light" });
    }
    else {
      axios.post("api/save-inventory-miscellanceous-data/" + jobid, postData).then((res) => {
        if (res.error == 0) {
          toast.success(res.messgae);
          onChangeData();
        }
      })
    }
  }


  const SaveInventory1 = () => {
    var postData = inventoryItems.map((res) => {
      if (res.quantity >= 0) {
        return res;
      }
    }).filter((element) => {
      return element !== undefined;
    });
    var value = "";
    postData.map((res) => {
      value += res.id + "=" + res.quantity + "&";
    })
    if (value.endsWith("&")) {
      value = value.slice(0, -1);
    }
    postData = {
      "calc_data": value,
    }
    axios.post("api/save-inventory-data/"+ jobid, postData).then((res) => {
      if (res) {
        toast.success("Inventory Items saved successfully");
        onChangeData()
      }
    })
  }

  function getData() {
    console.log(data);
    setJobid(data?.job?.job_id)
    setData(data);
    setInventoryItems();
    setMiscItems(data.miscllanceous_items);

    // setInvoiceList(data?.invoice_items);
  }

  //LocalStorage setItem

  const hash=window.location.hash
  const currentPageUrl = window.location.href;
    const currentUrl = new URL(currentPageUrl);
  const pathname = currentUrl.pathname;
  localStorage.setItem("expiredSessionRedirectUrl", pathname+hash);

  useEffect(() => {
    setJobid(data?.job?.job_id)
    if (data) {
      setTimeout(function () {
        setLoader(false);
      }, 2000);
    }
  }, [data]);

  const SaveInventory = () => {
    var postData = inventoryItems.map((res) => {
      if (res.quantity >= 0) {
        return res;
      }
    }).filter((element) => {
      return element !== undefined;
    });
    var value = "";
    postData.map((res) => {
      value += res.id + "=" + res.quantity + "&";
    })
    if (value.endsWith("&")) {
      value = value.slice(0, -1);
    }
    postData = {
      "calc_data": value,
    }
    axios.post("api/save-inventory-data/"+jobid, postData).then((res) => {
      if (res) {
        toast.success("Inventory Items saved successfully");
        onChangeData()
      }
    })
  }

  const clearInventory = () => {
    axios.post("api/clear-inventory-data/"+jobid).then((res) => {
      if (res) {
        toast.success(res.data);
        setClearAllModal(false)
        inventoryItems.forEach((item) => {
          if ('quantity' in item) {
            item.quantity = 0;
          }
        });
        console.log(inventoryItems)
        setInventoryItems(inventoryItems)
        onChangeData()
      }
    })
  }

  const [contactToDelete, setContactToDelete] = useState(null);
  const handleContactDelete = (data) => {
    // Find the index of the item to be deleted
    const itemIndex = inventoryItems.findIndex((item) => item.id === data.id);

    if (itemIndex !== -1) {
      // Reset the quantity of the item to zero before deleting
      const updatedLegs = [...inventoryItems];
      updatedLegs[itemIndex].quantity = 0;
      setInventoryItems(updatedLegs);
    }

    // Proceed with the deletion
    setContactToDelete(data);
    // setDeleteModal(true);
  };

  const generatepdf = () =>{
    const type ='Moving';
    const Job_id  = jobid;
    const url = `api/generateInventoryPdf/${jobid}/${type}`;
      setLoader(true);
      axios.get(url).then((res)=>{
        if(res.error == 0){
          setLoader(false);
          toast.success(res.messgae);
        
        }
      })
    }


  const invoiceEdit = () => {
    var postData = {
      "job_id": jobid,
      "total_cbm": cbm,
      "goods_value": directvalue,
      "insurance_excess": insuranceexcess,
      "insurance_premium": insurancepremium
    }
    axios.post("/api/ajaxUpdateCbmManually", postData).then((res) => {
      if (res.error == 0) {
        toast.success(res.message);
        t_inventoryEdit();
        onChangeData();
      }
    })
  }


  console.log(getinventoryGroups, "dhhdbhdhbdhb");

  const t_col1 = () => {
    setcol1(!col1);

  };

  const t_col2 = () => {
    setcol2(!col2);

  };

  const t_col3 = () => {
    setcol3(!col3);

  };
  // const [blueCounter, setblueCounter] = useState(5);
  function countUP(id, prev_data_attr) {
    id(prev_data_attr + 1);
  }

  function countDown(id, prev_data_attr) {
    id(prev_data_attr - 1);
  }
  const [rowsData, setRowsData] = useState([]);


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

  const [blueCounter, setblueCounter] = useState("");

  function countUP(id, prev_data_attr) {
    id(prev_data_attr + 1);
  }




  const t_colDisplay = (data) => {
    if (colDisplay == data) {
      setColDisplay();
    } else {
      setColDisplay(data);
    }
    setcol1(!col1);
    setcol2(false);
    setcol3(false);
  };
  const downloadInventoryPdf = () =>{
  const url = `api/downloadInventoryPdf/${jobid}`;
    axios.get(url).then((res)=>{
        window.open(res.url, "_blank");
        toast.success(res.message);
    })
  }

  const addTableRows = () => {

    const rowsInput = {}
    setShowAddRow(true);
    setMiscItems([...miscItems, rowsInput])
  }

  

  const [deleteItemId, setDeleteItemId] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const deleteInvoice = (id) =>{
    setDeleteItemId(id);
  setDeleteModal(true);
   
  }

  const DeleteMiscItem = (id) =>{
    var postData = {
      "inv_id": id,
      "job_id": jobid
    }
    axios.post("/api/delete-inventory-miscllanceous-data", postData).then((res)=>{
      if(res.error == 0){
        toast.success(res.messgae);
        onChangeData();
       
      }
    })
  }

  //inventory pdf

  const t_inventoryEdit = () => {
    if (isInventoryEdit) {
      setInventoryEdit(false);
    } else {
      setInventoryEdit(true)
    }
  }
  const handleTruckSizeChange = (e) => {
    const selectedTruckSize = e.target.value;
    setTruckSize(selectedTruckSize);

    // Find the corresponding truck object from data.truck_list based on the selected value
    const selectedTruck = data.truck_list.find((res) => res.max_cbm === selectedTruckSize);
    console.log(selectedTruck)
    // If a matching truck object is found, update the CBM input field with the max_cbm value
    if (selectedTruck) {
      setCBM(selectedTruck.max_cbm);
    }
  };
  console.log(inventoryItems)
  return (
    <div>
      <DeleteModal
      show={deleteModal}
      orderId={selectedOrderId}
      onDeleteClick={DeleteMiscItem}
      onCloseClick={() => setDeleteModal(false)}
      />
      <Modal isOpen={clearAllModal} toggle={() => setClearAllModal(false)} centered={true}>
      <ModalBody className="py-3 px-5">
        <div className="mt-2 text-center">
        <lord-icon
          src="https://cdn.lordicon.com/wdqztrtx.json"
          trigger="loop"
          colors="primary:#912a4e,secondary:#f06548"
          style={{ width: "100px", height: "100px" }}
        ></lord-icon>
          <div className="mt-4 pt-2 fs-15 mx-4 mx-sm-5">
            <h4>Are you sure ?</h4>
            <p className="text-muted mx-4 mb-0">
              Are you sure you want to clear all the inventory data?
            </p>
          </div>
        </div>
        <div className="d-flex gap-2 justify-content-center mt-4 mb-2">
          <button
            type="button"
            className="btn w-sm btn-light"
            data-bs-dismiss="modal"
            onClick={() => setClearAllModal(false)}
          >
            Close
          </button>
          <button
            type="button"
            className="btn w-sm btn-danger "
            id="delete-record"
            onClick={clearInventory}
          >
            Yes, Clear It!
          </button>
        </div>
      </ModalBody>
    </Modal>
    <Card>
      <CardHeader>


        <Row>
          {!isInventoryEdit && <Col lg={8} className='hstack gap-3'>
            <div className='hstack gap-4 mt-1'>
              <span><b>Cubic Volume: </b> {(data?.job?.total_cbm > 0) ? data?.job.total_cbm : 0} <b>m3</b></span>
              <span><b>Goods Value: </b> {data?.global?.currency_symbol} {parseFloat(data?.job.goods_value).toFixed(2)} </span>
              <span><b>Insurance Based on: </b> {data?.job?.insurance_based_on} </span>
              {/* <span><b><i className='bx bx-pencil'  /></b></span> */}
            </div>
            <div>
              <button type="button" className="btn btn-soft-success" onClick={t_inventoryEdit} style={{ cursor: "pointer" }}><b>
                <i className="bx bx-pencil"></i> </b></button>
            </div>
          </Col>}
          {isInventoryEdit && <Col>


          <Row>
          <Col md={4}>
        <Label>Choose a truck</Label>
        </Col>
        <Col md={4}>
        <Label>Or enter CBM to default value</Label>
        </Col>
        <Col md={4}>
        <Label>Or directly enter a value</Label>
        </Col>
      


          </Row>
            <Row className='mt-2'>
            <Col md={4}>
       
        <select className='form-select' value={trucksize || data.job.total_cbm} onChange={handleTruckSizeChange}>
          <option disabled selected={data.job.total_cbm === ''}>
            Choose a truck
          </option>
          {data.truck_list.map((res) => (
            <option key={res.id} value={res.max_cbm}>
              {res.truck_size_in_ton} T
            </option>
          ))}
        </select>
      </Col>
      <Col md={4}>
  
        <Input
          id="cbmInput" // Add an ID attribute to the Input element
          type="number"
          value={cbm || data.job.total_cbm}
          step={0.01} // Use the appropriate step value
          onChange={(e) => {
            setCBM(e.target.value);
          }}
        />
      </Col>
              <Col md={3}>
       
                <Input type="number" value={directvalue || data.job.goods_value} step={0.00} onChange={(e) => {
                  setDirectValue(e.target.value)
                }} />
              </Col>
            </Row>
            <Row className='mt-2' >
              <Col md={4}>
                <Label> Insurance Excess</Label>
                
              </Col>

              <Col md={4}>
                <Label>Insurance Premium </Label>
            
              </Col>
              </Row>
<Row>

<Col  md={4}>
<div className='mt-2 hstack gap-2'>
  <span>$</span>
<Input type="number" value={insuranceexcess || data.job.insurance_excess} step={0.00} onChange={(e) => {
    setInsuranceExcess(e.target.value)
  }} />
  </div>
</Col>
<Col md={4}>
<div className='mt-2 hstack gap-2'>
  <span>$</span>
<Input type="number" value={insurancepremium || data.job.insurance_premium} step={0.00} onChange={(e) => {
    setInsurancePremium(e.target.value)
  }} />
  </div>
</Col>

<Col md={4}>
<div className='mt-2 hstack gap-2'>
              <Button className='btn btn-light' onClick={t_inventoryEdit}>
                Cancel
              </Button>
              <Button className='btn btn-success mx-1' onClick={() => invoiceEdit()}>
                Update
              </Button>
            </div>
</Col>
             
            </Row>
          

          </Col>}
          <Col lg={4} style={{ paddingLeft: "0px" }}>
            <div className='hstack gap-2'>
            <Button className='btn btn-light'  onClick={()=> generatepdf()} > Generate Inventory PDF</Button>
              <Link
                to="#"
                className=" btn btn-sm btn-success fs-13 pt-1" onClick={()=> downloadInventoryPdf()}>
                <i className="bx bxs-download fs-20 p-1"></i>
              </Link>
              <Button className='btn btn-teal' onClick={() => SaveInventory()}>Calculate</Button>
            </div>
          </Col>
        </Row>

      </CardHeader>
      <CardBody>
        <div className='d-flex justify-content-between mt-2'>
          <div>
          <div>
            <Input className='form-control' placeholder='Search for inventory' />
          </div>
          </div>
          <div>
          <Button className='btn btn-primary mx-3' onClick={t_colDisplayAll}>
            {colDisplayAll ? 'Collapse all' : 'Expand all'}
          </Button>
            <Button className='btn btn-danger' onClick={()=>setClearAllModal(true)}>Clear all</Button>
          </div>

        </div>
        <Accordion id="default-accordion-example" className='mt-3'>
          {data?.inventory_groups?.map((res) => {
            console.log(data)
            return (<AccordionItem key={res.id}>
              <h2 className="accordion-header" id="headingOne">
                <button
                  className={classnames("accordion-button fw-semibold", { collapsed: !(colDisplay == res.id) })} type="button" onClick={() => t_colDisplay(res.id)} style={{ cursor: "pointer", display: "unset" }} >
                  <div className="d-flex justify-content-between align-items-center">
                    <div>{res.group_name}</div>
                    <div className="float-right text-right">
                        {inventoryItems
                          .filter((item) => item.group_id === res.group_id)
                          .reduce(
                            (acc, item) => acc + (item.quantity > 0 ? 1 : 0),
                            0
                          ) || null}
                      <span className="text-muted"> Items selected {!(colDisplay == res.id) && <i className="ri-arrow-down-s-line"></i>} {(colDisplay == res.id) && <i className="ri-arrow-up-s-line"></i>} </span>
                    </div>
                  </div>
                </button>
              </h2>
              <Collapse isOpen={colDisplayAll || colDisplay == res.id} className="accordion-collapse" id="collapseOne" >
                {inventoryItems.map((value) => {
                  return (res.group_id == value.group_id) && (
                    <div className="accordion-body justify-content-center" key={value.id}>
                      <Row className='d-flex align-items-center'>
                        <Col lg={5} className='text-end'>
                          <b>{value.item_name}</b>
                        </Col>
                        <Col lg={3} style={{ width: "16%  " }}>
                          <div className="input-step step-primary">
                            <button
                              type="button"
                              className="minus"
                              onClick={() => {
                                const updatedLegs = [...inventoryItems];
                                const taskIndex = updatedLegs.findIndex((task) => task.id === value.id);
                                if (updatedLegs[taskIndex].quantity > 0) {
                                  updatedLegs[taskIndex].quantity =
                                    updatedLegs[taskIndex].quantity - 1;
                                  setInventoryItems(updatedLegs);
                                  countDown(setblueCounter, blueCounter);
                                }
                              }}
                            >
                              -
                            </button>
                            <Input
                              type="number"
                              className="product-quantity"
                              value={
                                value.quantity === null ||
                                value.quantity === undefined
                                  ? 0
                                  : value.quantity
                                }
                              min="0"
                              max="100"
                              readOnly
                            />
                            <button
                              type="button"
                              className="plus"
                              onClick={() => {
                                const updatedLegs = [...inventoryItems];
                                const taskIndex = updatedLegs.findIndex((task) => task.id === value.id);
                                updatedLegs[taskIndex].quantity = isNaN(updatedLegs[taskIndex].quantity) ? 0 : updatedLegs[taskIndex].quantity;
                                updatedLegs[taskIndex].quantity = updatedLegs[taskIndex].quantity + 1;
                                setInventoryItems(updatedLegs);
                                countUP(setblueCounter, blueCounter);
                              }}
                            >
                              +
                            </button>
                          </div>
                        </Col>
                        <Col lg={3} classname="text-start">
                          <Link
                            to="#"
                          >
                            <Button onClick={() => handleContactDelete(value)} className="brown-button">
                            <i className="bx bxs-trash fs-15 p-1"></i>
                          </Button>
                          </Link>
                        </Col>
                      </Row>
                    </div>)
                })}
              </Collapse>
            </AccordionItem>)
          })}
        </Accordion>

        <Button className='btn btn-teal float-righ mt-3' onClick={() => SaveInventory()}>Calculate</Button>
        <div className='mt-3'>
          <span className="badge badge-soft-success badge-border fs-14 mt-2">Miscellaneous Items</span>
        </div>
        <Table className='table-bordered mt-3'>
          <thead className='bg-soft-purple'>
            <tr>
              <th>Item Name</th>
              <th>CBM</th>
              <th>Quantity</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {miscItems?.map((res, index) => {
              var value = index + 1
              return (<tr key={res.id}>
                <td><Input placeholder={'item #' + parseInt(value)} value={res.misc_item_name} onChange={(e) => {
                  const updatedLegs = [...miscItems];
                  //const taskIndex = updatedLegs.findIndex((task) => task.id === res.id);
                  updatedLegs[index].misc_item_name = e.target.value;
                  setMiscItems(updatedLegs);
                }} /></td>
                <td><Input placeholder='CBM' value={res.misc_item_cbm} onChange={(e) => {
                  const updatedLegs = [...miscItems];
                  //const taskIndex = updatedLegs.findIndex((task) => task.id === res.id);
                  updatedLegs[index].misc_item_cbm = e.target.value;
                  setMiscItems(updatedLegs);
                }} /></td>
                <td><Input placeholder='quantity' value={res.quantity} onChange={(e) => {
                  const updatedLegs = [...miscItems];
                  //const taskIndex = updatedLegs.findIndex((task) => task.id === res.id);
                  updatedLegs[index].quantity = e.target.value;
                  setMiscItems(updatedLegs);
                }} /></td>
                <td><Button className='btn btn-sm btn-soft-danger' onClick={() => DeleteMiscItem(res.id)}><i className="bx bxs-trash fs-12"></i></Button></td>
              </tr>)
            })}
          </tbody>
        </Table>
        <Button className="btn btn-brown" onClick={addTableRows} >+</Button>
        <div>
          <Button className='btn btn-teal mt-4' onClick={() => StoreMiscItems()}>Calculate</Button>
        </div>

      </CardBody>
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
      <ToastContainer closeButton={false} limit={1} theme="light" />
    </Card>
    </div>
  )
}
