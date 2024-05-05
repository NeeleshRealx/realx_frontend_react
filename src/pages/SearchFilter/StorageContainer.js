import React from "react";
import "../../assets/scss/pages/_opportunities.scss";
import { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import {
  Card,
  CardBody,
} from "reactstrap";
// import Components
import { get_cookie } from "../../helpers/get_cookie";
import { Link } from "react-router-dom";
import TableContainerSF from "./TableContainerSF";

//redux


import Loader from "../../Components/Common/Loader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { resetProperties } from "lord-icon-element/utils/lottie";



const StorageContainer = ({value,dataToSend,handleLinkClick,resetCounter}) => {
  const searchFilterValue=value
  let [data, setData] = useState([]);
  const [modal, setModal] = useState(false);
  const [tableData, setTableData] = useState([])
  const [isOpportunityLoading, setIsOpportunityLoading] = useState(false);
  const [isJobPageLoading, setIsJobPageLoading] = useState(false);
  const [statusToSelect, setstatusToSelect] = useState('');
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

  const handleAnotherFunction=()=>{
    setTimeout(()=>{
      window.location.reload()
    },2)
  }

  const OppColumns = useMemo(
    () => [
        {
          Header: "Storage job#",
          accessor: "storage",
          filterable: false,
          Cell: (cell) => {
            console.log(cell.value.name,"cellV")
            console.log("/storage/view-storage-job/" + cell.value.id,"cellV")
            return <Link 
            to={"/storage/view-storage-job/" + cell.value.id}
            className="fw-medium link-primary"
            onClick={() => {
              handleLinkClick();
              handleAnotherFunction();
          }}
            >{cell.value.name}</Link>;
          },
        },
      {
        Header: "Serial Number#",
        accessor: "serial_number",
        filterable: false,
      },
      {
        Header: "Name",
        accessor: "name",
        filterable: false,
      },
      {
        Header: "Manufacturer serial number",
        accessor: "manufacturer_serial_number",
        filterable: false,
      },
      {
        Header: "Pickup Suburb",
        accessor: "pickup_suburb",
        filterable: false,
        Cell: (row) => <div dangerouslySetInnerHTML={{ __html: row.value }} />,
      },
      {
        Header: "Drop Off Suburb",
        accessor: "delivery_suburb",
        filterable: false,
        Cell: (row) => <div dangerouslySetInnerHTML={{ __html: row.value }} />,
      },
      {
        Header: "From Date",
        accessor: "from_date",
        filterable: false,
        Cell: (row) => <div dangerouslySetInnerHTML={{ __html: row.value === "0000-00-00" ? "Not Closed" : row.value }} />
      },
      {
        Header: "To Date",
        accessor: "to_date",
        filterable: false,
        Cell: (row) => (
          <div dangerouslySetInnerHTML={{ __html: row.value === "0000-00-00" ? "Not Closed" : row.value }} />
        ),
      },
      
    ],
    [handleOrderClick, checkedAll]
  );

  const JobColumns = useMemo(
    () => [
      {
        Header: "Storage job#",
        accessor: "storage",
        filterable: false,
        Cell: (cell) => {
          return <Link 
          to={"/storage/view-storage-job/" + cell.value.id}
          className="fw-medium link-primary"
          onClick={handleLinkClick}
          >{cell.value.name}</Link>;
        },
      },
      {
        Header: "Serial Number#",
        accessor: "serial_number",
        filterable: false,
      },
      {
        Header: "Name",
        accessor: "name",
        filterable: false,
      },
      {
        Header: "Manufacturer serial number",
        accessor: "manufacturer_serial_number",
        filterable: false,
      },
      {
        Header: "Pickup Suburb",
        accessor: "pickup_suburb",
        filterable: false,
        Cell: (row) => <div dangerouslySetInnerHTML={{ __html: row.value }} />,
      },
      {
        Header: "Drop Off Suburb",
        accessor: "delivery_suburb",
        filterable: false,
        Cell: (row) => <div dangerouslySetInnerHTML={{ __html: row.value }} />,
      },
      {
        Header: "From Date",
        accessor: "from_date",
        filterable: false,
        Cell: (row) => <div dangerouslySetInnerHTML={{ __html: row.value === "0000-00-00" ? "Not Closed" : row.value }} />
      },
      {
        Header: "To Date",
        accessor: "to_date",
        filterable: false,
        Cell: (row) => (
          <div dangerouslySetInnerHTML={{ __html: row.value === "0000-00-00" ? "Not Closed" : row.value }} />
        ),
      },
      
    ],
    [handleOrderClick, checkedAll]
  );

  const [org_date, setOrg_Date] = useState([]);
  const [orderList, setOrderList] = useState([]);
  const [order, setOrder] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [date, setDate] = useState(defaultdate());
  const [selectedCheckBoxDelete, setSelectedCheckBoxDelete] = useState([]);
  const [isMultiDeleteButton, setIsMultiDeleteButton] = useState(false);
  const deleteCheckbox = () => {
    const ele = document.querySelectorAll(".orderCheckBox:checked");
    if(ele.length>0){
      return true
    }
    else{
      setIsMultiDeleteButton(false);
    }
    setSelectedCheckBoxDelete(ele);
  };

  //List jobs data
  const [jobTableData,setJobTableData]=useState([])
  const [statusFilter,setStatusfilter]=useState([])

  const getData = () => {
    
    const user = JSON.parse(get_cookie("authUser"));
    var tenant_id = user.tenant_id;
    var datavalue = {
      tenant_id: tenant_id,
    };
    setIsOpportunityLoading(true);
    const apiUrl2 = "";
    axios.get("api/listdata")
      .then((response) => {
        setOrg_Date(response?.organisation_settings);
        setstatusToSelect(response.statusToSelect.join(','));
        let statusItems =response.status.map((item)=>
          item.pipeline_status
        )
        setStatusfilter(statusItems.join(','));
        let formData = {
          opportunity_status: statusItems.join(','),
          sort_descending: 1,
          sorting_order: 'created_at'
        }
        const apiUrl = "api/opportunity/data";
        axios.get(apiUrl, { params: formData })
          .then((res) => {
            console.log(data);
            //setData(res.data.original.data);
            if (data.length < res.total) {
              setOrderList(res.data.original.data);
            }
          })
          .catch((error) => {
            console.error(error);
          })
          .finally(() => {
            setIsOpportunityLoading(false);
          })
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
  const [pageIndex, setPageIndex] = useState(0);

  const [storageUnits,setStorageUnits]=useState([])
  const [jobsFilteredArray,setJobsFilteredArray]=useState([])
  const [opportunityFilteredArray,setOpportunityFilteredArray]=useState([])


  useEffect(() => {
    axios.get("/api/storage-units")
        .then((res) => {
            console.log(res,"resStr")
            setStorageUnits(res)
            const filteredArrayN = res.filter(item => item.opportunity === "N");
            const filteredArrayY = res.filter(item => item.opportunity !== "N");
            setJobsFilteredArray(filteredArrayN)
            setOpportunityFilteredArray(filteredArrayY)
            console.log(filteredArrayN);
            setIsOpportunityLoading(false)
        })
        .catch((error) => {
            console.error(error);
        })
  }, [resetCounter]);

  useEffect(() => {
    if (dataToSend.applyBtn===true){
        console.log('s')
    }
  }, [dataToSend]);

    const propertiesToSearchJob = ["storage_job_number","manufacturer_serial_number","serial_number","name"];

    function filterData(data, searchFilterValue) {
    if(searchFilterValue != ""){
    return data.filter((item) => {
    // Define the properties you want to search for matches

    // Check if any property contains the searchFilter
    return propertiesToSearchJob.some((property) => {
        const propertyValue = item[property] || ''; // Handle cases where the property is null or undefined
        return propertyValue.toString().toLowerCase().includes(searchFilterValue.toLowerCase());
    });
    });
    }else{
        return data;
    }
    }


const renderComponent = () => {
  if (searchFilterValue === "") {
    return <h1 className="mt-5 mb-5 text-center">Search Opportunities and Job Listings</h1>;
  } else {
    return (
      <Card>
        <CardBody className="pt-0"  style={{ height: '310px', overflowY: 'auto' }}>
          <div className="mt-3">
            <h4 className="mb-sm-0">OPPORTUNITIES</h4>
            {isOpportunityLoading ? (
              <Loader />
            ) : (
              <div className="mt-3">
                <TableContainerSF
                  columns={OppColumns}
                  data={filterData(opportunityFilteredArray, searchFilterValue)}
                  isGlobalFilter={true}
                  isAddUserList={false}
                  customPageSize={3}
                  divClass="table-responsive table-card mb-1"
                  tableClass="align-middle table-nowrap"
                  theadClass="table-light text-muted text-uppercase"
                  handleOrderClick={handleOrderClicks}
                  isOrderFilter={true}
                  SearchPlaceholder="Search for order ID, customer, order status or something..."
                  searchValue={searchFilterValue}
                  toPreviousPage={() => setPageIndex(pageIndex - 1)}
                  toNextPage={() => setPageIndex(pageIndex + 1)}
                />
              </div>
            )}
          </div>
          <div className="mt-3">
            <h4 className="mb-sm-0">Jobs</h4>
            {isOpportunityLoading ? (
              <Loader />
            ) : (
              <div className="mt-3">
                <TableContainerSF
                  columns={JobColumns}
                  data={filterData(jobsFilteredArray, searchFilterValue)}
                  isGlobalFilter={true}
                  isAddUserList={false}
                  customPageSize={3}
                  divClass="table-responsive table-card mb-1"
                  tableClass="align-middle table-nowrap"
                  theadClass="table-light text-muted text-uppercase"
                  handleOrderClick={handleOrderClicks}
                  isOrderFilter={true}
                  SearchPlaceholder="Search for order ID, customer, order status or something..."
                  searchValue={searchFilterValue}
                  toPreviousPage={() => setPageIndex(pageIndex - 1)}
                  toNextPage={() => setPageIndex(pageIndex + 1)}
                />
              </div>
            )}
          </div>

          <ToastContainer closeButton={false} limit={1} />
        </CardBody>
      </Card>
    );
  }
};

  return (
    <div>
      {renderComponent()}
    </div>
  )
}

export default StorageContainer