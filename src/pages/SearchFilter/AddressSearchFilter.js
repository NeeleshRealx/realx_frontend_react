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

const AddressSearchFilter = ({value,dataToSend,handleLinkClick,resetCounter}) => {
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
        tableId: "Lead",
        accessor: "name",
        filterable: false,
        Cell: (cell) => {
          // console.log("cell", cell.cell.row.original.job);
          // console.log("cell.cell.row",cell.cell.row);
          // return <Link to="/opportunitydetails" className="fw-medium link-primary">{cell.value}</Link>;
          const lead_id = cell.cell.row.original.job.lead_id;
          const job_id = cell.cell.row.original.job.opp_id;
          return (
            <Link
              to={`/opportunitydetails/${lead_id}/${job_id}`}
              className="fw-medium link-primary"
              onClick={handleLinkClick}
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

  const filteredColumns = columns.filter((column) => {
    if (column.tableId === "opp") {
      return true
    }
    const matchingDisplay = tableData.find(
      (displayObj) =>{console.log(column.tableId,"fc"); return(displayObj.name === column.tableId)}
    );
    return matchingDisplay && matchingDisplay.display === 1;
  });
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
        let formData = {
          opportunity_status: response.statusToSelect.join(','),
          sort_descending: 1,
          sorting_order: 'created_at'
        }
        const apiUrl = "api/opportunity/data";
        axios.get(apiUrl, { params: formData })
          .then((res) => {

            //setData(res.data.original.data);
            if (data.length < res.total) {
              console.log("test")
              setData((prevData) => [...prevData, ...res.data.original.data]);
              setOrderList((prevData) => [...prevData, ...res.data.original.data]);
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
        setTableData(response.displayColoumn)
      })
      .catch((error) => {
        console.error("Error fetching lead types:", error);
      });
  }

  

  const [jobOrderList,setJobOrderList]=useState([])
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(100);
  const getJobData=()=>{
    const user = JSON.parse(get_cookie("authUser"));
    var tenant_id = user.tenant_id;
    const emptyRecordCount = (pageIndex) * pageSize;
    const emptyRecords = Array(emptyRecordCount).fill({});

    setIsJobPageLoading(true);
    axios.get("/api/list-jobs/data?page="+pageIndex+"&size="+pageSize, tenant_id)
        .then((res) => {
            console.log(res.data.original.data)
            setJobOrderList((prevData) => [...prevData, ...res.data.original.data]);
            // setData(newData);
            // const newData = emptyRecords.concat(res.data.original.data);
            // setData(newData);
            //console.log(newData);
        })
        .catch((error) => {
            console.error(error);
        })
        .finally(() => {
          setIsJobPageLoading(false);
        });

    axios
        .get("/api/get-display-field-job-data")
        .then((response) => {
            setJobTableData(response.displayColoumn)
            console.log(response)
        })
        .catch((error) => {
            console.error("Error fetching lead types:", error);
        });
  }


  useEffect(() => {
    getData();
    getJobData();
  }, [resetCounter]);

  useEffect(() => {
    if (dataToSend.applyBtn===true){
      const selectedDateFormat = org_date?.date_format;
      setIsOpportunityLoading(true);
      setIsJobPageLoading(true)
      console.log(dataToSend.createdDateEnd)
      const formData = {
        created_date_start: dataToSend.createdDateStart,
        created_date_end: dataToSend.createdDateEnd,
        selected_date_format: selectedDateFormat
      };
      console.log(formData, "qsqsim")
      const apiUrl = "api/opportunity/data";
      axios
        .get(apiUrl, { params: formData })
        .then((res) => {
          setOrderList(res.data.original.data);
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setIsOpportunityLoading(false);
        });

      //listJobs
      let apiEndpoint = "/api/list-jobs/data?page=" + pageIndex + "&size=" + pageSize;

      apiEndpoint += `&created_date_start=${dataToSend.createdDateStart}&created_date_end=${dataToSend.createdDateEnd}&selected_date_format=${selectedDateFormat}`;
      axios
          .get(apiEndpoint)
          .then((res) => {
            setJobOrderList(res.data.original.data)
          })
          .catch((error) => {
              console.error(error);
          })
          .finally(() => {
             setIsJobPageLoading(false) 
          })
    }
  }, [dataToSend]);
  
  //listJobs
  const checkedJobAll = useCallback(() => {
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

const handleJobOrderClick = useCallback((arg) => {
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
        status: order.status
    });

    setIsEdit(true);
    toggle();
}, [toggle]);

  const jobColumns = useMemo(
    () => [
        {
            Header: <input type="checkbox" id="checkBoxAll" className="form-check-input" onClick={() => checkedAll()} />,
            Cell: (cellProps) => {
                return <input type="checkbox" className="orderCheckBox form-check-input" value={cellProps.row.original._id} onChange={() => deleteCheckbox()} />;
            },
            id: '#',
        },
        {
            Header: "Job#",
            accessor: "job_number",
            tableId: "Job #",
            filterable: false,
            Cell: (cell) => {
                // return <Link to={"/listjobs/listjobsdetail/"+cell.value} className="fw-medium link-primary">{cell.value}</Link>;
                return <Link onClick={handleLinkClick} to={"/listjobs/listjobsdetail/" + cell.row.original.job_id} className="fw-medium link-primary">
                    {cell.value}
                </Link>
            },
        },
        {
            Header: "Customer Name",
            accessor: "customer_name",
            tableId: "Customer Name",
            filterable: false,
            Cell: (row) => <div dangerouslySetInnerHTML={{ __html: row.value }} />
        },
        {
            Header: "Job Date",
            accessor: "job_date",
            tableId: "Job Date",
            filterable: false,
        },
        {
            Header: "Email",
            accessor: "email",
            tableId: "Email",
            filterable: false,
        },
        {
            Header: "Mobile",
            tableId: "Mobile",
            accessor: "mobile",
            filterable: false,
        },
        {
          Header: "Pickup Address",
          tableId: "Pickup Address",
          accessor: "pickup_address",
          filterable: false,
          Cell: (row) => (
            <div dangerouslySetInnerHTML={{ __html: row.value === null ? "No Pick Up Address" : row.value }} />
          ),
        },
        {
            Header: "Pickup Suburb",
            tableId: "Pickup Suburb",
            accessor: "pickup_suburb",
            filterable: false,
            Cell: (row) => <div dangerouslySetInnerHTML={{ __html: row.value }} />
        },
        {
          Header: "Dropoff Address",
          tableId: "Dropoff Address",
          accessor: "delivery_address",
          filterable: false,
          Cell: (row) => (
            <div dangerouslySetInnerHTML={{ __html: row.value === (null || "" )? "No Drop Off Address" : row.value }} />
          ),
        },
        {
          Header: "Drop off Suburb",
          tableId: "Drop off Suburb",
          accessor: "delivery_suburb",
          filterable: false,
          Cell: (row) => <div dangerouslySetInnerHTML={{ __html: row.value }} />
        },
        {
            Header: "Lead Info",
            tableId: "Lead Info",
            accessor: "lead_info",
            filterable: false,
        },

        {
            Header: "Job Status",
            accessor: "job_status",
            tableId: "Job Status",
            filterable: false,
        },

        {
            Header: "Payment Status",
            accessor: "payment_status",
            tableId: "Payment Status",
            filterable: false,
        },
        {
            Header: 'Balance',
            accessor: 'balance_payment',
            tableId: "Balance",
            filterable: false,
        },
        {
            Header: 'Tags',
            accessor: 'tags',
            tableId: "Tags",
            filterable: false,
        },
    ],
    [handleJobOrderClick, checkedJobAll]
);

const filteredJobColumns = jobColumns.filter((column) => {
  if (column.tableId === "Pickup Address") {
    return true
  }
  if (column.tableId === "Dropoff Address") {
    return true
  }
    const matchingDisplay = jobTableData.find(
        (displayObj) => displayObj.name === column.tableId
    );
    return matchingDisplay && matchingDisplay.display === 1;
});


const propertiesToSearch = ["delivery_suburb","pickup_suburb"];

function filterData(data, searchFilterValue) {
  if(searchFilterValue != ""){
  return data.filter((item) => {
    // Define the properties you want to search for matches

    // Check if any property contains the searchFilter
    return propertiesToSearch.some((property) => {
      const propertyValue = item[property] || ''; // Handle cases where the property is null or undefined
      return propertyValue.toString().toLowerCase().includes(searchFilterValue.toLowerCase());
    });
  });
  }else{
      return data;
  }
}

const propertiesToSearchJob = ["delivery_address","pickup_address"];

function filterData1(data, searchFilterValue) {
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
                  columns={filteredColumns}
                  data={filterData(orderList, searchFilterValue)}
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
            <div>
              <h4 className="mb-sm-0">Job</h4>
              {isJobPageLoading ? (
                <Loader />
              ) : (
                <div className="mt-3">
                  <TableContainerSF
                    columns={filteredJobColumns}
                    data={filterData1(jobOrderList, searchFilterValue)}
                    isGlobalFilter={true}
                    isAddUserList={false}
                    customPageSize={3}
                    divClass="table-responsive table-card mb-1"
                    tableClass="align-middle table-nowrap"
                    theadClass="table-light text-muted text-uppercase"
                    isOrderFilter={true}
                    SearchPlaceholder="Search for order ID, customer, order status or something..."
                    searchValue={searchFilterValue}
                    toPreviousPage={() => setPageIndex(pageIndex - 1)}
                    toNextPage={() => setPageIndex(pageIndex + 1)}
                  />
                </div>
              )}
            </div>
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

export default AddressSearchFilter