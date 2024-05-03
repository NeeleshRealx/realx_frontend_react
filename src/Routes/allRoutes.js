import React,{useState} from "react";
import { Navigate } from "react-router-dom";

//inbox
import MailInbox from "../pages/EmailInbox";

//Opportunities
import Opportunities from "../pages/Opportunities/Index";
import OpportunityDetails from "../pages/Opportunities/OpportunityDetails";


//CRMSettings
import CRMSettings from "../pages/CRMSettings/Index";
import CustomerDetails from "../pages/Customer/CustomerResidential/CustomerDetails";

//Customer
import CustResidential from "../pages/Customer/CustomerResidential/Index";
import CustCommercial from "../pages/Customer/CustomerCommercial/Index";

//Customer Names
// import NameDetails from "../pages/Customer/NameDetails"
// import NameDetailsUnitList  from "../pages/Customer/NameDetailsUnitList"


//Jobs
import Backloadingschedule from "../pages/Jobs/Backloadingschedule";
import Jobschedule from "../pages/Jobs/Jobschedule";
import ListJobs from "../pages/Jobs/Listjobs";
import ListJobsDetail from "../pages/Jobs/ListJobsDetail";

//Backloading
import Backloading from "../pages/Backloading/Index";
import BackloadingDetailsPage from "../pages/Backloading/BackloadingDetailsPage";

//Vehicle Unavailability
import VehicleUnavailability from "../pages/VehicleUnavailability/VehicleUnavailability";

//Removal settings
import Removalsettings from "../pages/RemovalSettings/Index";


//Storage settings
import Storagesettings from "../pages/StorageSettings/Index";
import Unitslist from "../pages/UnitsList/Index";
import StorageJobsDetail from "../pages/UnitsList/StorageJobsDetail";
import NameDetailsUnitList from "../pages/UnitsList/NameDetailsUnitList";

//storage calendar
import Calendar from "../pages/StorageCalendar/Index";

//Storage Invoices
import StorageInvoices from "../pages/StorageInvoices/Index";
import Invoice from "../pages/StorageInvoices/Invoices";

//Invoices
import Invoices from "../pages/Invoices/Index";
import AppsEcommerce from "../pages/Invoices/AppsEcommerce";

//Cleaning
import CleaningOpportunitites from "../pages/Cleaning/CleaningOpportunitites";


//Cleaning settings
import Cleaningsettings from "../pages/Cleaning/Cleaningsettings/Index";

//finance settings
import FInanceSettings from "../pages/FinanceSettings/Index";

//Employees
import Employees from "../pages/Employees/Index";

//People Settings
import PeopleSettings from "../pages/PeopleSettings/Index";
import PermissionSettings from "../pages/PeopleSettings/PermissionSettings";


//dashboard
import Dashboard from "../pages/Dashboard/Index";

//Reporting
import LeadReport from "../pages/Reporting/LeadReport";
import OperationsReport from "../pages/Reporting/OperationsReport";
import VehicleCheck from "../pages/Reporting/VehicleCheck";
import SalesPipeline from "../pages/Reporting/SalesPipeline";

//Settings
import Settings from "../pages/Settings/Settings";
// import Support from "../pages/Support/Support";
import Subscription from "../pages/ManageSubscription/Subscription";
import PersonalisationDetail from "../pages/Settings/TabPages/PersonalisationDetail";

import { PagePersonalisation } from '../pages/Settings/TabPages/PagePersonalisation';
import SettingsTabControl from "../pages/Settings/TabComponents/SettingsTabControl";

// Email box
import BasicAction from "../pages/Email/EmailTemplates/BasicAction";
import EcommerceAction from "../pages/Email/EmailTemplates/EcommerceAction";

//AuthenticationInner pages
import BasicSignIn from "../pages/AuthenticationInner/Login/BasicSignIn";
import CoverSignIn from "../pages/AuthenticationInner/Login/CoverSignIn";
import BasicSignUp from "../pages/AuthenticationInner/Register/BasicSignUp";
import CoverSignUp from "../pages/AuthenticationInner/Register/CoverSignUp";
import BasicPasswReset from "../pages/AuthenticationInner/PasswordReset/BasicPasswReset";

import CoverPasswReset from "../pages/AuthenticationInner/PasswordReset/CoverPasswReset";
import BasicLockScreen from "../pages/AuthenticationInner/LockScreen/BasicLockScr";
import CoverLockScreen from "../pages/AuthenticationInner/LockScreen/CoverLockScr";
import BasicLogout from "../pages/AuthenticationInner/Logout/BasicLogout";
import CoverLogout from "../pages/AuthenticationInner/Logout/CoverLogout";
import BasicSuccessMsg from "../pages/AuthenticationInner/SuccessMessage/BasicSuccessMsg";
import CoverSuccessMsg from "../pages/AuthenticationInner/SuccessMessage/CoverSuccessMsg";
import BasicTwosVerify from "../pages/AuthenticationInner/TwoStepVerification/BasicTwosVerify";
import CoverTwosVerify from "../pages/AuthenticationInner/TwoStepVerification/CoverTwosVerify";
import Basic404 from "../pages/AuthenticationInner/Errors/Basic404";
import Cover404 from "../pages/AuthenticationInner/Errors/Cover404";
import Alt404 from "../pages/AuthenticationInner/Errors/Alt404";
import Error500 from "../pages/AuthenticationInner/Errors/Error500";

import BasicPasswCreate from "../pages/AuthenticationInner/PasswordCreate/BasicPasswCreate";
import CoverPasswCreate from "../pages/AuthenticationInner/PasswordCreate/CoverPasswCreate";
import Offlinepage from "../pages/AuthenticationInner/Errors/Offlinepage";

//login
import Login from "../pages/Authentication/Login";
import ForgetPasswordPage from "../pages/Authentication/ForgetPassword";
import Logout from "../pages/Authentication/Logout";
import Register from "../pages/Authentication/Register";

// User Profile
import UserProfile from "../pages/Authentication/user-profile";
import { get_cookie } from "../helpers/get_cookie";


// Checkout 

import Checkout from "../pages/Checkout/checkout";


// import Others from "../pages/Others/Index";

// SupplyChain

import StockLevels from "../pages/StockLevels";
import PurchaseOrder from "../pages/PurchaseOrder/index";
import SupplyChainSettings from "../pages/SupplyChain/Index";
import PurchaseOrderDetails from "../pages/PurchaseOrder/PurchaseOrderDetails";
// import PODetails from "../pages/PurchaseOrder/PODetails";
// import PODetails from "../pages/PurchaseOrder/PODetails";
import ErrorPage from "../pages/ErrorPage";
import GoodsReceipt from "../pages/GoodsReceipt";
import GoodsReceiptDetails from "../pages/GoodsReceipt/GoodsReceiptDetails";
import VendorDetails from "../pages/vendor/Vendordetailpage";
// import StockWarehouses from "../pages/SupplyChain/StockWarehouses";
// import UOMConversions from "../pages/SupplyChain/UOMConversions";
// import StockLocations from "../pages/SupplyChain/StockLocations";
// import UnitsOfMeasure from "../pages/SupplyChain/UnitsOfMeasure";



const authProtectedRoutes = [
  //inbox
  { path: "/inbox", component: <MailInbox /> },

  //Opportunities
  { path: "/opportunities/", component: <Opportunities /> },

  //CRMSettings
  { path: "/crmsettings", component: <CRMSettings /> },

  //Jobs detail
  { path: "/listjobs/listjobsdetail/:id", component: <ListJobsDetail /> },

  //opportunities detail
  { path: "/opportunitydetails/:id/:job_id", component: <OpportunityDetails /> },
  { path: "/Opportunities/index/:id", component: <Opportunities /> },

  //Customer
  { path: "/customer-residential", component: <CustResidential /> },
  { path: "/customer-commercial", component: <CustCommercial /> },
  { path: "/customerdetails/:id", component: <CustomerDetails /> },

  //Customer link names
  // {path:"/customer-name/:cell",component:<NameDetails/>},
  //Customer UnitList Link names
  //{path:"/storageList/list-name/:cell/:row",component:<NameDetailsUnitList/>},

  //Removals
  { path: "/listjobs", component: <ListJobs /> },
  { path: "/jobschedule", component: <Jobschedule /> },
  { path: "/backloadingschedule", component: <Backloadingschedule /> },
  { path: "/backloading", component: <Backloading /> },
  { path: "/vehicleunavail", component: <VehicleUnavailability /> },
  { path: "/removalsettings", component: <Removalsettings /> },
  { path: "/storage/view-storage-job/:id", component: <NameDetailsUnitList /> },

  //Backloading
  { path: "/backloadingdetails/:id", component: <BackloadingDetailsPage /> },


  //Invoice
  { path: "/finance/all-invoices/:job_id", component: <AppsEcommerce /> },

  //storageInvoice
  { path: "/storageinvoices/invoices/:storage_id/:invoice_id", component: <Invoice /> },
  { path: "/storageinvoices", component: <StorageInvoices/> },
  //Storage
  { path: "/storagesettings", component: <Storagesettings /> },
  { path: "/unitslist", component: <Unitslist /> },
  { path: "/storagejobsdetail", component: <StorageJobsDetail /> },

  //storage Calendar

  { path: "/storage-calendar", component: <Calendar /> },


  //cleaning
  { path: "/cleaning-opportunities", component: <CleaningOpportunitites /> },

  { path: "/CleaningSettings", component: <Cleaningsettings /> },


  // Supply Chain
  {path:"/purchaseorder", component:<PurchaseOrder/>},
  { path: "/purchaseorderdetails/:id", component: <PurchaseOrderDetails /> },
  {path:"/supplychainsettings", component:<SupplyChainSettings/>},


  //vendor
  {path:"/vendordetail/:id", component:<VendorDetails/>},

  {path:"/goodsreceipt", component:<GoodsReceipt/>},
  { path: "/goodsreceiptdetails/:id", component: <GoodsReceiptDetails /> },

  {path:"/stocklevels", component:<StockLevels/>},
  // {path:"/podetails/:id", component:<PODetails/>},
  // { path: "/purchaseorderdetails/:id/:job_id", component: <PurchaseOrderDetails /> },
  

  // {path:"/stocklocations", component:<StockLocations/>},
  // {path:"/stockwarehouses", component:<StockWarehouses/>},
  // {path:"/unitsofmeasure", component:<UnitsOfMeasure/>},
  // {path:"/uomconversions", component:<UOMConversions/>},

  //Finance
  { path: "/invoices", component: <Invoices /> },
  { path: "/financesettings", component: <FInanceSettings /> },


  //People Operations
  { path: "/employees", component: <Employees /> },
  { path: "/peoplesettings", component: <PeopleSettings /> },
  { path: "/permission/:id", component: <PermissionSettings/>},


  //Dashboard
  { path: "/dashboard", component: <Dashboard /> },

  //reporting
  { path: "/salespipeline", component: <SalesPipeline /> },
  { path: "/operationsreport", component: <OperationsReport /> },
  { path: "/leadreport", component: <LeadReport /> },
  { path: "/dailyvehiclecheck", component: <VehicleCheck /> },


  //Settings
  { path: "/settings/:activeTab", component: <Settings /> },
  { path: "/personalisationdetail/:id", component: <PersonalisationDetail /> },
  // { path: "/support", component: <Support /> },
  { path: "/subscription", component: <Subscription /> },
  { path: "/pagepersonalisation", component: <PagePersonalisation /> },
  { path: "/settingstabcontent", component: <SettingsTabControl /> },

  //User Profile
  { path: "/profile", component: <UserProfile /> },


  // Other dummy test
  // {path:"/others", component: <Others />},


  // this route should be at the end of all other routes
  // eslint-disable-next-line react/display-name
  {
    path: "/",
    exact: true,
    component: (get_cookie('authUser')) ? <Navigate to="/dashboard" /> : <Navigate to="/login" />,
  },
  //  { path: "*", component: <Navigate to="/dashboard" /> },
];

const publicRoutes = [
  // Authentication Page
  { path: "/logout", component: <Logout /> },
  { path: "/login", component: <Login /> },
  { path: "/forgot-password", component: <ForgetPasswordPage /> },
  { path: "/register", component: <Register /> },

  //AuthenticationInner pages
  { path: "/auth-signin-basic", component: <BasicSignIn /> },
  { path: "/auth-signin-cover", component: <CoverSignIn /> },
  { path: "/auth-signup-basic", component: <BasicSignUp /> },
  { path: "/auth-signup-cover", component: <CoverSignUp /> },
  { path: "/auth-pass-reset-basic", component: <BasicPasswReset /> },
  { path: "/auth-pass-reset-cover", component: <CoverPasswReset /> },
  { path: "/auth-lockscreen-basic", component: <BasicLockScreen /> },
  { path: "/auth-lockscreen-cover", component: <CoverLockScreen /> },
  { path: "/auth-logout-basic", component: <BasicLogout /> },
  { path: "/auth-logout-cover", component: <CoverLogout /> },
  { path: "/auth-success-msg-basic", component: <BasicSuccessMsg /> },
  { path: "/auth-success-msg-cover", component: <CoverSuccessMsg /> },
  { path: "/auth-twostep-basic", component: <BasicTwosVerify /> },
  { path: "/auth-twostep-cover", component: <CoverTwosVerify /> },
  { path: "/auth-404-basic", component: <Basic404 /> },
  { path: "/auth-404-cover", component: <Cover404 /> },
  { path: "/auth-404-alt", component: <Alt404 /> },
  { path: "/auth-500", component: <Error500 /> },

  { path: "/auth-pass-change-basic", component: <BasicPasswCreate /> },
  { path: "/auth-pass-change-cover", component: <CoverPasswCreate /> },
  { path: "/auth-offline", component: <Offlinepage /> },
    
  //Checkout
  { path: "/pay-now-inv/:encrypt", component: <Checkout />},
  { path: "/pay-now-inv/:status/:encrypt", component: <Checkout />},

  // //Error page
  // {path: "/errorpage",component:<ErrorPage/>},
  
];

export { authProtectedRoutes, publicRoutes };
