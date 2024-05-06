import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { get_cookie } from "../helpers/get_cookie";

const Navdata = () => {
  const history = useNavigate();
  //state data
  const [isCustomer, setIsCustomer] = useState(false);
  const [isJobs, setIsJobs] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const [isSupplyChain, setIsSupplyChain] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [jobCount, setJobCount] = useState(0);
  const [oppCount, setOppCount] = useState(0);
  const [logCount, setLogCount] = useState(0);

  const [iscurrentState, setIscurrentState] = useState("Dashboard");
  console.log("s")
 
  useEffect(() => {
    var api_token = JSON.parse(get_cookie('authUser'));
    console.log(api_token)
    if (api_token.token){
      console.log('ssd')
      // axios.get("/api/SidebarCount").then((res) => {
      //   setLogCount(res.new_log_count);
      //   setOppCount(res.new_opportunity_count);
      //   setJobCount(res.new_job_moving_count);
      // })
    }
  }, [])

  function updateIconSidebar(e) {
    if (e && e.target && e.target.getAttribute("subitems")) {
      const ul = document.getElementById("two-column-menu");
      const iconItems = ul.querySelectorAll(".nav-icon.active");
      let activeIconItems = [...iconItems];
      activeIconItems.forEach((item) => {
        item.classList.remove("active");
        var id = item.getAttribute("subitems");
        if (document.getElementById(id))
          document.getElementById(id).classList.remove("show");
      });
    }
  }

  // const loadData=()=>{
  //   document.body.classList.remove("twocolumn-panel");
  //   if (iscurrentState === "Inbox") {
  //     history("/inbox");
  //     document.body.classList.add("twocolumn-panel");
  //   }
  //   if (iscurrentState === "Opportunities") {
  //     history("/opportunities");
  //     document.body.classList.add("twocolumn-panel");
  //   }
  //   if (iscurrentState === "CRMSettings") {
  //     history("/crmsettings");
  //     document.body.classList.add("twocolumn-panel");
  //   }
  //   if (iscurrentState === "Backloading") {
  //     history("/backloading");
  //     document.body.classList.add("twocolumn-panel");
  //   }
  //   if (iscurrentState === "Vehicle") {
  //     history("/vehicleunavail");
  //     document.body.classList.add("twocolumn-panel");
  //   }
  //   if (iscurrentState === "RemovalSettings") {
  //     history("/removalsettings");
  //     document.body.classList.add("twocolumn-panel");
  //   }
    
  //   if (iscurrentState === "CleaningSettings") {
  //     history("/CleaningSettings");
  //     document.body.classList.add("twocolumn-panel");
  //   }
    
  //   if (iscurrentState === "StorageSettings") {
  //     history("/storagesettings");
  //     document.body.classList.add("twocolumn-panel");
  //   }
  //   if (iscurrentState === "UnitsList") {
  //     history("/unitslist");
  //     document.body.classList.add("twocolumn-panel");
  //   }
  //   if (iscurrentState === "Invoices") {
  //     history("/invoices");
  //     document.body.classList.add("twocolumn-panel");
  //   }
  //   if (iscurrentState === "FinanceSettings") {
  //     history("/financesettings");
  //     document.body.classList.add("twocolumn-panel");
  //   }
  //   if (iscurrentState === "Employees") {
  //     history("/employees");
  //     document.body.classList.add("twocolumn-panel");
  //   }
  //   if (iscurrentState === "PeopleSettings") {
  //     history("/peoplesettings");
  //     document.body.classList.add("twocolumn-panel");
  //   }
  //   if (iscurrentState === "DashBoard") {
  //     history("/dashboard");
  //     document.body.classList.add("twocolumn-panel");
  //   }
  //   if (iscurrentState === "Settings") {
  //     history("/settings");
  //     document.body.classList.add("twocolumn-panel");
  //   }
  //   if (iscurrentState === "Documentation") {
  //     history("/documentation");
  //     document.body.classList.add("twocolumn-panel");
  //   }
  //   // if (iscurrentState === "Support") {
  //   //   history("/support");
  //   //   document.body.classList.add("twocolumn-panel");
  //   // }
  //   if (iscurrentState === "ManageSubscription") {
  //     history("/subscription");
  //     document.body.classList.add("twocolumn-panel");
  //   }

  //   if (iscurrentState === "Others") {
  //     history("/others");
  //     document.body.classList.add("twocolumn-panel");
  //   }
  //   //
  //   if (iscurrentState !== "Jobs") {
  //     setIsJobs(false);
  //   }
  //   if (iscurrentState !== "Reporting") {
  //     setIsReporting(false);
  //   }
  //   if (iscurrentState !== "Reporting") {
  //     setIsReporting(false);
  //   }
  // }

  useEffect(() => {
    const api_token = JSON.parse(get_cookie('authUser'));
    console.log(api_token.success)
    if(api_token.success){
      const headers = {
        Authorization: `Bearer ${api_token.token}` // Assuming the token is stored in the 'token' property
    };
    //   axios.get("/api/SidebarCount", { headers }).then((res) => {
    //     console.log("res")
    //     setLogCount(res.new_log_count);
    //     setOppCount(res.new_opportunity_count);
    //     setJobCount(res.new_job_moving_count);
    // })
  }
    
    
  }, [
    history,
    iscurrentState,
    isCustomer,
    isJobs,
    isReporting,
    isSupplyChain,
    isAuth,
  ]);
  const menuItems = [
    //CRM
    {
      label: "Location",
      isHeader: true,
    },
    {
      id: "location",
      label: "Location",
      icon: "bx bx-mail-send",
      link: "/inbox",
      Numbervalue: logCount,
      click: function (e) {
        e.preventDefault();
        setIscurrentState("Inbox");
      },
    },
    //inbox
    {
      id: "inbox",
      label: "Property Type",
      icon: "bx bx-mail-send",
      link: "/inbox",
      Numbervalue: logCount,
      click: function (e) {
        e.preventDefault();
        setIscurrentState("Inbox");
      },
    },

    //crm settings
    {
      id: "crmsettings",
      label: "Price Range",
      icon: "bx bx-wrench",
      link: "/crmsettings",
      click: function (e) {
        e.preventDefault();
        setIscurrentState("CRMSettings");
      },
    },
    //customer
    // {
    //   id: "customer",
    //   label: "Bedrooms",
    //   icon: "bx bxs-user-detail",
    //   link: "/#",
    //   stateVariables: isCustomer,
    //   click: function (e) {
    //     e.preventDefault();
    //     setIsCustomer(!isCustomer);
    //     setIscurrentState("Customer");
    //     updateIconSidebar(e);
    //   },
    //   subItems: [
    //     {
    //       id: "residential",
    //       label: "Residential",
    //       link: "/customer-residential",
    //       parentId: "customer",
    //     },
    //     {
    //       id: "commercial",
    //       label: "Commercial",
    //       link: "/customer-commercial",
    //       parentId: "customer",
    //     },],
    // },
    //removals

    // {
    //   label: "Bathrooms",
    //   isHeader: true,
    // },

    //opportunities
    {
      id: "opportunities",
      label: "Square footage",
      icon: "bx bx-bulb",
      link: "/opportunities",
      Numbervalue: oppCount,
      right_icon: true,
      click: function (e) {
        e.preventDefault();
        setIscurrentState("Opportunities");
      },
    },
    {
      id: "backloading",
      label: "Bathrooms",
      icon: "bx bxs-truck",
      link: "/backloading",
      click: function (e) {
        e.preventDefault();
        setIscurrentState("Backloading");
      },
    },
    // {
    //   id: "jobs",
    //   label: "Jobs",
    //   icon: "bx bx-briefcase",
    //   link: "/#",
    //   stateVariables: isJobs,
    //   Numbervalue: jobCount,
    //   click: function (e) {
    //     e.preventDefault();
    //     setIsJobs(!isJobs);
    //     setIscurrentState("Jobs");
    //     updateIconSidebar(e);
    //   },
    //   subItems: [
    //     {
    //       id: "listjobs",
    //       label: "List Jobs",
    //       link: "/listjobs",
    //       parentId: "jobs",
    //     },
    //     {
    //       id: "jobschedule",
    //       label: "Job Schedule",
    //       link: "/jobschedule",
    //       parentId: "jobs",
    //     },
    //     {
    //       id: "backloadingschedule",
    //       label: "Backloading Schedule",
    //       link: "/backloadingschedule",
    //       parentId: "jobs",
    //     },],
    // },
    // //Backloading
    
    // //Vehicle
    // {
    //   id: "vehicleunavail",
    //   label: "Vehicle Unavailability",
    //   icon: "bx bxs-truck",
    //   link: "/vehicleunavail",
    //   click: function (e) {
    //     e.preventDefault();
    //     setIscurrentState("VehicleUnavailability");
    //   },
    // },

    // //Removalsettings
    // {
    //   id: "removalsettings",
    //   label: "Removal Settings",
    //   icon: "bx bx-wrench",
    //   link: "/removalsettings",
    //   click: function (e) {
    //     e.preventDefault();
    //     setIscurrentState("RemovalSettings");
    //   },
    // },
    // //invoices
    // {
    //   id: "invoices",
    //   label: "Removals Invoices",
    //   icon: "bx bx-receipt",
    //   link: "/invoices",
    //   click: function (e) {
    //     e.preventDefault();
    //     setIscurrentState("Invoices");
    //   },
    // },

    // //Storage
    // {
    //   label: "Storage",
    //   isHeader: true,
    // },
    // //Unitslist
    // {
    //   id: "unitslist",
    //   label: "Storage Jobs",
    //   icon: "bx bxs-inbox",
    //   link: "/unitslist",
    //   click: function (e) {
    //     e.preventDefault();
    //     setIscurrentState("UnitsList");
    //   },
    // },

    // //Storage Calendar
    // {
    //   id: "Storagecalendar",
    //   label: "Storage Calendar",
    //   icon: "bx bxs-inbox",
    //   link: "/storage-calendar",
    //   click: function (e) {
    //     e.preventDefault();
    //     setIscurrentState("StorageCalendar");
    //   },
    // },

    // //Storage Settings
    // {
    //   id: "storagesettings",
    //   label: "Storage Settings",
    //   icon: "bx bx-wrench",
    //   link: "/storagesettings",
    //   click: function (e) {
    //     e.preventDefault();
    //     setIscurrentState("StorageSettings");
    //   },
    // },


    // //Storage Invoices
    // {
    //   id: "storageinvoices",
    //   label: "Storage Invoices",
    //   icon: "bx bx-receipt",
    //   link: "/storageinvoices",
    //   click: function (e) {
    //     e.preventDefault();
    //     setIscurrentState("Storageinvoices");
    //   },
    // },


    //   //Cleaning
    //   {
    //     label: "Cleaning",
    //     isHeader: true,
    //   },
    //   //Cleaning-Opportunitites
    //   //Unitslist
    //   {
    //     id: "cleaningopportunities",
    //     label: "Opportunities",
    //     icon: "bx bx-bulb",
    //     link: "/cleaning-opportunities",
    //     left_icon:true,
    //     click: function (e) {
    //       e.preventDefault();
    //       setIscurrentState("CleaningOpportunities");
    //     },


        
    //   },

    //   {
    //     id: "CleaningSettings",
    //     label: "Cleaning Settings",
    //     icon: "bx bx-wrench",
    //     link: "/CleaningSettings",
    //     click: function (e) {
    //       e.preventDefault();
    //       setIscurrentState("CleaningSettings");
    //     },
    //   },

    //   // Supply Chain

    //   {
    //     label: "Supply Chain",
    //     isHeader: true,
    //   },
    //   {
    //     id: "stocklevels",
    //     label: "Stock Levels",
    //     icon: "bx bx-briefcase",
    //     link: "/stocklevels",
    //     click: function (e) {
    //       e.preventDefault();
    //       setIscurrentState("StockLevels");
    //     },
    //   },
    //   {
    //     id: "purchaseorder",
    //     label: "Purchase Order",
    //     icon: "bx bxs-truck",
    //     link: "/purchaseorder",
    //     click: function (e) {
    //       e.preventDefault();
    //       setIscurrentState("PurchaseOrder");
    //     },
    //   },
    //   {
    //     id: "goodsreceipt",
    //     label: "Goods Receipt",
    //     icon: "bx bxs-truck",
    //     link: "/goodsreceipt",
    //     click: function (e) {
    //       e.preventDefault();
    //       setIscurrentState("GoodsReceipt");
    //     },
    //   },
    //   // {
    //   //   id: "vendormanagement",
    //   //   label: "Vendor Management",
    //   //   icon: "bx bxs-inbox",
    //   //   link: "/vendormanagement",
    //   //   click: function (e) {
    //   //     e.preventDefault();
    //   //     setIscurrentState("VendorManagement");
    //   //   },
    //   // },
    //   {
    //     id: "supplychainsettings",
    //     label: "Supply Chain Settings",
    //     icon: "bx bx-wrench",
    //     link: "/supplychainsettings",
    //     // stateVariables: isSupplyChain,
    //     click: function (e) {
    //       e.preventDefault();
    //       // setIsSupplyChain(!isSupplyChain);
    //       setIscurrentState("SupplyChainSettings");
    //       // updateIconSidebar(e);
    //     },
        
    //   },

      


    // //Finance
    // {
    //   label: "Finance",
    //   isHeader: true,
    // },
    // {
    //   id: "financesettings",
    //   label: "Finance Settings",
    //   icon: "bx bx-wrench",
    //   link: "/financesettings",
    //   click: function (e) {
    //     e.preventDefault();
    //     setIscurrentState("FinanceSetitings");
    //   },
    // },
    // //People Operations
    // {
    //   label: "People Operations",
    //   isHeader: true,
    // },
    // {
    //   id: "employees",
    //   label: "Employees",
    //   icon: "bx bxs-user-detail",
    //   link: "/employees",
    //   click: function (e) {
    //     e.preventDefault();
    //     setIscurrentState("Employees");
    //   },
    // },
    // {
    //   id: "peoplesettings",
    //   label: "People Settings",
    //   icon: "bx bx-wrench",
    //   link: "/peoplesettings",
    //   click: function (e) {
    //     e.preventDefault();
    //     setIscurrentState("PeopleSettings");
    //   },
    // },
    // //Dashboard
    // {
    //   label: "Dashboard",
    //   isHeader: true,
    // },
    // {
    //   id: "dashboard",
    //   label: "Dashboard",
    //   icon: "bx bx-home",
    //   link: "/dashboard",
    //   click: function (e) {
    //     e.preventDefault();
    //     setIscurrentState("Dashboard");
    //   },
    // },
    // //reporting
    // {
    //   id: "reporting",
    //   label: "Reporting",
    //   icon: "bx bx-briefcase",
    //   link: "/#",
    //   stateVariables: isReporting,
    //   click: function (e) {
    //     e.preventDefault();
    //     setIsReporting(!isReporting);
    //     setIscurrentState("Reporting");
    //     updateIconSidebar(e);
    //   },
    //   subItems: [
    //     {
    //       id: "salespipeline",
    //       label: "Sales Pipeline",
    //       link: "/salespipeline",
    //       parentId: "reporting",
    //     },
    //     {
    //       id: "operationsreport",
    //       label: "Field Worker Pay Sheet",
    //       link: "/operationsreport",
    //       parentId: "reporting",
    //     },
    //     {
    //       id: "leadreport",
    //       label: "Lead Report",
    //       link: "/leadreport",
    //       parentId: "reporting",
    //     },
    //     {
    //       id: "dailyvehiclecheck",
    //       label: "Daily Vehicle Check",
    //       link: "/dailyvehiclecheck",
    //       parentId: "reporting",
    //     },],
    // },

    // //settings
    // {
    //   label: "Settings",
    //   isHeader: true,
    // },

    // //Settings
    // {
    //   id: "settings",
    //   label: "Settings",
    //   icon: "bx bx-wrench",
    //   link: "/settings/organisation-settings",
    //   click: function (e) {
    //     e.preventDefault();
    //     setIscurrentState("Settings");
    //   },
    // },
    // //Documentation
    // {
    //   id: "documentation",
    //   label: "Documentation",
    //   icon: "bx bx-file",
    //   link: "https://docs.onexfort.com/docs",
    //   click: function (e) {
    //     e.preventDefault();
    //     setIscurrentState("Documentation");
    //   },
    // },
    // // //Support
    // // {
    // //   id: "support",
    // //   label: "Support",
    // //   icon: "bx bx-support",
    // //   link: "https://onexfort.freshdesk.com/support/login",
    // //   click: function (e) {
    // //     e.preventDefault();
    // //     setIscurrentState("Support");
    // //   },
    // // },
    // //Subscription
    // // {
    // //   id: "subscription",
    // //   label: "Manage Subscription",
    // //   icon: "bx bx-credit-card",
    // //   link: "/subscription",
    // //   click: function (e) {
    // //     e.preventDefault();
    // //     setIscurrentState("Subscription");
    // //   },
    // // },

   


  ];
  return <React.Fragment >{menuItems}</React.Fragment>;
};
export default Navdata;
