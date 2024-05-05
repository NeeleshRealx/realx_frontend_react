import React, { useState, useEffect } from 'react'
import { Accordion, AccordionItem, Button, Card, CardBody, CardHeader, Col, Collapse, Table, Form, Label, Input, Container, Row } from 'reactstrap';
import "../../../assets/scss/pages/_opportunities.scss"
import classnames from "classnames";
import Flatpickr from "react-flatpickr";
// import 'flatpickr/dist/themes/material_blue.css'
import CustomBookingModal from "../../../Components/Common/CustomBookingModal";
import * as moment from "moment";
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import GoogleAutocomplete from "react-google-autocomplete";
import 'react-toastify/dist/ReactToastify.css';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Loader from "../../../Components/Common/Loader";

export const Removals = ({ data, onChangeData }) => {
  const location = useLocation();
  const url = location.pathname;
  const opp_id = url.substring(url.lastIndexOf('/') + 1);
  const lead_id = url.substring(url.lastIndexOf('/') + 2);
  console.log(lead_id)
  const [colFrom, setColFrom] = useState(false);
  const t_colFrom = () => {
    setColFrom(!colFrom);
  };
  const [colTo, setColTo] = useState(false);
  const t_colTo = () => {
    setColTo(!colTo);
  };
  const [bookingDetails, setBookingdetails] = useState(false);
  const t_bookingDetails = () => {
    setBookingdetails(!bookingDetails);
  };
  const [propertyDetails, setPropertyDetails] = useState(false);
  const t_propertyDetails = () => {
    setPropertyDetails(!propertyDetails);
  };
  const [Access, setAccessRestriction] = useState([]);
  const [bedroom, setBedroom] = useState();
  const [pickupres, setpickUpRes] = useState();
  const [postcode, setPostcode] = useState();
  const [suburb, setSuburb] = useState();
  const [address, setAddress] = useState();
  const [leadid, setleadid] = useState();
  const [jobid, setjobid] = useState();
  const [oppid, setoppid] = useState();
  const [cust_type, setCustomerType] = useState();
  const [dropoffpostcode, setdropoffpostcode] = useState();
  const [countrycode, setCountrycode] = useState([]);
  const [companieslist, setCompaniesList] = useState([]);
  const [dropoffsuburb, setdropoffSuburb] = useState();
  const [statuses, setStatuses] = useState("");
  const [deliveryaddress, setdeliveryaddress] = useState();
  const [accessrestriction, setAccessRestric] = useState();
  const [movingtobedroom, setmovingtobedroom] = useState();
  const [estjobdate, setestjobdate] = useState(null);
  const [contactname, setcontactname] = useState("");
  const [mobile, setMobile] = useState();
  const [email, setEmail] = useState();
  const [companyname, setCompanyName] = useState("");
  const [dropoffmobile, setdropoffmobile] = useState();
  const [dropoffcontactname, setdropoffcontactname] = useState();
  const [dropoffemail, setdropoffemail] = useState();
  const [status, setStatus] = useState();
  const [jobnumber, setjobnumber] = useState();
  const [opportunity, setopportunity] = useState();
  const [propertydetail, setPropertydetail] = useState();
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [propertytypes, setpropertyTypes] = useState();
  const [properties, setproperties] = useState('Flat');
  const [furnishing, setfurnishing] = useState();
  const [furnish, setfurnish] = useState('Lightly Furnished');
  const [propertybedroom, setpropertybedroom] = useState();
  const [propertybed, setpropertybed] = useState('None');
  const [living, setliving] = useState('None');
  const [livingarea, setlivingarea] = useState();
  const [instruction, setinstruction] = useState();
  const [specialitem, setspecialitems] = useState();
  const [selectitem, setselectitem] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [selectedOppId, setSelectedOppId] = useState();
  const [bookingUrl, setBookingUrl] = useState();
  const [deleteModal, setDeleteModal] = useState(false);
  const [companynames, setcompanynames] = useState();
  const [displayotherroom, setdisplayotherroom] = useState();
  const [speciality, setspeciality] = useState();
  const [propertytypesdisplay, setpropertytypesdisplay] = useState();
  const [livingareadisplay, setlivingareadisplay] = useState();
  const [bedroomsdisplay, setbedroomsdisplay] = useState();
  const [furnishingdisplay, setfurnishingdisplay] = useState();
  const [isLoader, setLoader] = useState(true);
  const [org_date, setOrg_Date] = useState([]);


  const [dropselectedCity, setdropselectedCity] = useState();
  const [dropselectedSuburb, setdropselectedSuburb] = useState();
  const [dropselectedPostcode, setdropselectedPostcode] = useState();

  // const formattedDate = moment(estjobdate, 'DD MMM, YYYY').format('DD/MM/YYYY');
  const formattedDate = moment(estjobdate, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY');
  const navigate = useNavigate();


  const loadData = () => {
    setOrg_Date(data?.global);
    setoppid(data?.opportunities);
    setCustomerType(data?.crmlead?.lead_type);
    setOpportunities(data?.opportunities)
    setpickUpRes(data?.job?.pickup_access_restrictions)
    setBedroom(data?.job?.pickup_bedrooms);
    setPostcode(data?.job?.pickup_post_code);
    setSuburb(data?.job?.pickup_suburb);
    setAddress(data?.job?.pickup_address);
    setleadid(data?.job?.customer_id);
    setjobid(data?.job?.job_id);
    setoppid(data?.job?.crm_opportunity_id);
    setdropoffpostcode(data?.job?.drop_off_post_code);
    setdropoffSuburb(data?.job?.delivery_suburb);
    setdeliveryaddress(data?.job?.drop_off_address);
    setAccessRestric(data?.job?.drop_off_access_restrictions);
    setmovingtobedroom(data?.job?.drop_off_bedrooms);
    setcontactname(data?.job?.pickup_contact_name);
    setMobile(data?.job?.pickup_mobile);
    setEmail(data?.job?.pickup_email);
    setestjobdate(data?.job?.job_date);
    setCompaniesList(data?.companies_list);
    setdropoffmobile(data?.job?.drop_off_mobile);
    setdropoffcontactname(data?.job?.drop_off_contact_name);
    setdropoffemail(data?.job?.drop_off_email);
    setStatus(data?.op_status);
    setjobnumber(data?.job?.job_number);
    setopportunity(data?.job?.opportunity);
    const options = data?.other_room.map((item) => item.options);
    setPropertydetail(options);
    setpropertyTypes(data?.property_types);
    setfurnishing(data?.furnishing);
    setpropertybedroom(data?.bedroom);
    setlivingarea(data?.living_room);
    setinstruction(data?.job?.other_instructions);
    setspecialitems(data?.special_item);
    setSelectedOppId(opp_id);
    setSelectedcity(data?.job?.pickup_address);
    setselectedSuburb(data?.job?.pickup_suburb);
    setselectedPostcode(data?.job?.pickup_post_code);
    setdropselectedCity(data?.job?.drop_off_address);
    setdropselectedSuburb(data?.job?.delivery_suburb);
    setdropselectedPostcode(data?.job?.drop_off_post_code);
    setcompanynames(data?.company[0]?.company_name);
    setdisplayotherroom(data?.job?.pickup_other_rooms);
    setspeciality(data?.job?.pickup_speciality_items);
    setpropertytypesdisplay(data?.job?.pickup_property_type);
    setfurnishingdisplay(data?.job?.pickup_furnishing);
    setlivingareadisplay(data?.job?.pickup_living_areas);
    setbedroomsdisplay(data?.job?.pickup_bedrooms);
    setCompanyName(data?.company[0]?.id);
    setStatuses(data?.opportunities[0]?.op_status);
    if (data) {
        setTimeout(function () {
          setLoader(false);
        }, 2000);
      }
  }

  //LocalStorage setItem

  const hash=window.location.hash
  const currentPageUrl = window.location.href;
    const currentUrl = new URL(currentPageUrl);
  const pathname = currentUrl.pathname;
  localStorage.setItem("expiredSessionRedirectUrl", pathname+hash);

  useEffect(() => {
    loadData();
    // if (data) {
    //   setTimeout(function () {
    //     setLoader(false);
    //   }, 2000);
    // }
    
  }, [data])

  const handleSubmit = (data) => {
    setLoader(true);
    let formData = {
      lead_id: leadid,
      job_id: jobid,
      opp_id: oppid,
      pickup_address: selectedCity,
      pickup_suburb: selectedSuburb,
      pickup_post_code: selectedPostcode,
      pickup_access_restrictions: pickupres,
      pickup_bedrooms: bedroom,
      pickup_contact_name: contactname,
      pickup_mobile: mobile,
      pickup_email: email,
    };

    if (cust_type === "commercial") {

      if (formData.pickup_contact_name === '' || formData.pickup_contact_name === undefined) {
        toast.error('Enter the Contact Name', { theme: 'light' });
        setLoader(false);
        return;
      } if (formData.pickup_mobile === '' || formData.pickup_mobile === undefined) {
        toast.error('Enter the Mobile Number', { theme: 'light' });
        setLoader(false);
        return;
      } if (formData.pickup_email === '' || formData.pickup_email === undefined) {
        toast.error('Enter the Email address', { theme: 'light' });
        setLoader(false);
        return;
      }
    }

    axios
      .post('/api/crm-leads/ajaxUpdateRemovalMovingFrom', formData)
      .then((res) => {
        console.log('hai');
        console.log(res.data);
        toast.success('Updated Successfully', { theme: 'light' });
        t_colFrom();
        onChangeData();
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoader(false);
      })
  };


  const handleSubmit2 = (data) => {
    setLoader(true);
    let formData = {
      job_id: jobid,
      lead_id: leadid,
      opp_id: oppid,
      drop_off_address: dropselectedCity,
      delivery_suburb: dropselectedSuburb,
      drop_off_post_code: dropselectedPostcode,
      drop_off_access_restrictions: accessrestriction,
      drop_off_bedrooms: movingtobedroom,
      drop_off_mobile: dropoffmobile,
      drop_off_contact_name: dropoffcontactname,
      drop_off_email: dropoffemail,
    };

    if (cust_type === 'commercial') {
      if (formData.drop_off_contact_name === '' || formData.drop_off_contact_name === undefined) {
        toast.error('Enter the Contact Name', { theme: 'light' });
        setLoader(false);
        return;
      }
      if (formData.drop_off_mobile === '' || formData.drop_off_mobile === undefined) {
        toast.error('Enter the Mobile Number', { theme: 'light' });
        setLoader(false);
        return;
      }
      if (formData.drop_off_email === '' || formData.drop_off_email === undefined) {
        toast.error('Enter the Email address', { theme: 'light' });
        setLoader(false);
        return;
      }

    }

    axios
      .post('/api/crm-leads/ajaxUpdateRemovalMovingTo', formData)
      .then((res) => {
        console.log('hai');
        console.log(res.data);
        toast.success('Updated Successfully', { theme: 'light' });
        t_colTo();
        onChangeData();
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoader(false);
      })
  };



  const handleSubmit3 = (data) => {
    setLoader(true);
    let formData = {
      "lead_id": leadid,
      "job_date": formattedDate,
      "company_id": companyname,
      "op_status": statuses,
      "opp_id": oppid
    };

    if (formData.lead_id === "" || formData.lead_id === undefined) {
      toast.error("Enter the Item Name", { theme: "light" });
      setLoader(false);
      return;
    }
    else if (formData.job_date === "" || formData.job_date === undefined) {
      toast.error("Enter the CBM Value", { theme: "light" });
      setLoader(false);
      return;
    }
    else {
      axios.post("/api/crm-leads/ajaxUpdateRemovalBookingDetail", formData)
        .then((res) => {
          console.log("hai123");
          console.log(res.data, "hhhhhhhhh");
          toast.success("Updated Successfully", { theme: "light" });
          t_bookingDetails();
          onChangeData();
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setLoader(false);
        });
    }
  }

  useEffect(() => {
    axios
      .get("/api/crm-leads/countryCode")
      .then((response) => {
        // console.log(response);
        setCountrycode(response.country_code);
      })
      .catch((error) => {
        console.error("Error fetching lead types:", error);
      });
  }, []);



  const propertydetails = () => {
    let formData = {
      lead_id: leadid,
      opp_id: oppid,
      pickup_property_type: properties,
      pickup_furnishing: furnish,
      pickup_bedrooms: propertybed,
      pickup_living_areas: living,
      other_room: selectedProperties,
      other_instructions: instruction,
      special_item: selectitem,

    };

    axios.post("/api/crm-leads/ajaxUpdateRemovalPropertyDetail", formData)
      .then((res) => {
        console.log("hai");
        console.log(res.data);
        toast.success("Updated Successfully", { theme: "light" });
        onChangeData();
        t_propertyDetails();
      })
      .catch((error) => {
        console.error(error);

      });
  }
  const handleCheckboxChange = (e, option) => {
    const { checked } = e.target;
    if (checked) {
      setSelectedProperties((prevProperties) => [...prevProperties, option]);
    } else {
      setSelectedProperties((prevProperties) => prevProperties.filter((item) => item !== option));
    }
  };


  const handlespecialitemsChange = (e, option) => {
    console.log(option);
    const { checked } = e.target;
    if (checked) {

      setselectitem((prevspecialitem) => [...prevspecialitem, option]);
    } else {
      setselectitem((prevspecialitem) => prevspecialitem.filter((item) => item !== option));
    }
  };
  // Load selected properties from localStorage on component mount
  useEffect(() => {
    const savedSelectedProperties = localStorage.getItem('selectedProperties');
    if (savedSelectedProperties) {
      setSelectedProperties(JSON.parse(savedSelectedProperties));
    }
  }, []);

  // Load selected special items from localStorage on component mount
  useEffect(() => {
    const savedSelectItem = localStorage.getItem('selectitem');
    if (savedSelectItem) {
      setselectitem(JSON.parse(savedSelectItem));
    }
  }, []);

  // Update selected properties and save to localStorage on checkbox change
  useEffect(() => {
    localStorage.setItem('selectedProperties', JSON.stringify(selectedProperties));
  }, [selectedProperties]);

  // Update selected special items and save to localStorage on checkbox change
  useEffect(() => {
    localStorage.setItem('selectitem', JSON.stringify(selectitem));
  }, [selectitem]);



  const [selectedCity, setSelectedcity] = useState();
  const [selectedSuburb, setselectedSuburb] = useState();
  const [selectedPostcode, setselectedPostcode] = useState();

  const residentialplace = (place) => {
    const addressComponents = place?.address_components;

    const streetNumberComponent = addressComponents?.find((component) =>
      component.types.includes("street_number")
    );
    const streetRouteComponent = addressComponents?.find((component) =>
      component.types.includes("route")
    );
    const unitComponent = place?.addressComponents?.find((component) =>
      component.types.includes("subpremise")
    );
    const suburbComponent = addressComponents?.find((component) =>
      component.types.includes("locality")
    );
    const stateComponent = addressComponents?.find((component) =>
      component.types.includes("administrative_area_level_1")
    );
    const postcodeComponent = addressComponents?.find((component) =>
      component.types.includes("postal_code")
    );

    let selectedStreetNumber = "";
    if (streetNumberComponent) {
      selectedStreetNumber = streetNumberComponent.long_name;
    }
    let selectedUnitNumber = "";
    if (unitComponent) {
      selectedUnitNumber = unitComponent.long_name;
    }
    let selectedStreetRoute = "";
    if (streetRouteComponent) {
      selectedStreetRoute = streetRouteComponent.long_name;
    }
    let selectedSuburb = "";
    if (suburbComponent) {
      selectedSuburb = suburbComponent.long_name;
    }
    let selectedState = "";
    if (stateComponent) {
      selectedState = stateComponent.short_name;
    }
    let selectedPostcode = "";
    if (postcodeComponent) {
      selectedPostcode = postcodeComponent.long_name;
    }

    setSelectedcity(`${selectedUnitNumber} ${selectedStreetNumber} ${selectedStreetRoute} `);
    setselectedSuburb(selectedSuburb + ", " + selectedState);
    setselectedPostcode(selectedPostcode);

  };

  const dropoffselect = (place) => {
    const addressComponents = place?.address_components;

    const streetNumberComponent = addressComponents?.find((component) =>
      component.types.includes("street_number")
    );
    const routeComponent = addressComponents?.find((component) =>
      component.types.includes("route")
    );
    const suburbComponent = addressComponents?.find((component) =>
      component.types.includes("locality")
    );
    const stateComponent = addressComponents?.find((component) =>
      component.types.includes("administrative_area_level_1")
    );
    const postcodeComponent = addressComponents?.find((component) =>
      component.types.includes("postal_code")
    );
    const unitComponent = place?.addressComponents?.find((component) =>
      component.types.includes("subpremise")
    );

    let selectedStreetNumber = "";
    if (streetNumberComponent) {
      selectedStreetNumber = streetNumberComponent.long_name;
    }
    let selectedRoute = "";
    if (routeComponent) {
      selectedRoute = routeComponent.long_name;
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
      selectedState = stateComponent.short_name; // Use short_name for state abbreviation
    }
    let selectedPostcode = "";
    if (postcodeComponent) {
      selectedPostcode = postcodeComponent.long_name;
    }

    setdropselectedCity(`${selectedStreetNumber} ${selectedRoute} ${selectedUnitNumber}`);
    setdropselectedSuburb(`${selectedSuburb} ${selectedState}`);
    setdropselectedPostcode(selectedPostcode);
  };




  var _leadid;
  let selectedOpportunity = () => {
    opportunities?.map(opportunity => {
      if (opportunity.id == selectedOppId) {
        _leadid = opportunity.lead_id
      }
    });
  }
  var value = address || "";
  var removaladdress = value.replace(/\//g, "");
  var value2 = deliveryaddress || "";
  var removal = value2.replace(/\//g, "");

  const confirmBooking = () => {
    selectedOpportunity();

    let bookingData = {
      "opp_id": selectedOppId,
      "lead_id": _leadid
    }
    axios.post("api/crm-leads/ajaxRemovalsConfirmBooking", bookingData)
      .then(res => {
        console.log(res);
        setDeleteModal(false);
        window.location.href = "/" + res.url;

      })
      .catch(err => {
        console.log(err);
      })
      .finally(
    )
  }
  const handleBooking = () => {
    setDeleteModal(true);
  }


  const selectSuburbOption = (place) => {
    const addressComponents = place?.address_components;

    const suburbComponent = addressComponents?.find((component) =>
      component.types.includes("locality")
    );
    const stateComponent = addressComponents?.find((component) =>
      component.types.includes("administrative_area_level_1")
    );
    const postcodeComponent = addressComponents?.find((component) =>
      component.types.includes("postal_code")
    );

    let selectedSuburb = "";
    if (suburbComponent) {
      selectedSuburb = `${suburbComponent.long_name}`;
      if (stateComponent) {
        selectedSuburb += `, ${stateComponent.short_name}`;
      }
    }
    let selectedPostcode = "";
    if (postcodeComponent) {
      selectedPostcode = postcodeComponent.long_name;
    }

    // Remove the postal code from the selected suburb string
    const postalCodeRegex = /\d{4}$/;
    selectedSuburb = selectedSuburb.replace(postalCodeRegex, "").trim();

    setselectedSuburb(selectedSuburb);
    setselectedPostcode(selectedPostcode);
  };

  const setmovingtosuburb = (place) => {
    const addressComponents = place?.address_components;

    const suburbComponent = addressComponents?.find((component) =>
      component.types.includes("locality")
    );
    const stateComponent = addressComponents?.find((component) =>
      component.types.includes("administrative_area_level_1")
    );
    const postcodeComponent = addressComponents?.find((component) =>
      component.types.includes("postal_code")
    );

    let selectedSuburb = "";
    if (suburbComponent) {
      selectedSuburb = `${suburbComponent.long_name}`;
      if (stateComponent) {
        selectedSuburb += `, ${stateComponent.short_name}`;
      }
    }
    let selectedPostcode = "";
    if (postcodeComponent) {
      selectedPostcode = postcodeComponent.long_name;
    }

    // Remove the postal code from the selected suburb string
    const postalCodeRegex = /\d{4}$/;
    selectedSuburb = selectedSuburb.replace(postalCodeRegex, "").trim();

    setdropselectedSuburb(selectedSuburb);
    setdropselectedPostcode(selectedPostcode);
  };


  const addressParts = [];
  if (selectedCity) addressParts.push(selectedCity);
  if (selectedSuburb) addressParts.push(selectedSuburb);
  if (selectedPostcode) addressParts.push(selectedPostcode);

  // Encode each part of the address
  const encodedAddressParts = addressParts.map(part => encodeURIComponent(part));

  const googleMapLink = encodedAddressParts.length > 0
    ? `https://www.google.com/maps/place/${encodedAddressParts.join(', ')}`
    : null;


  const dropAddressParts = [];

  if (dropselectedCity) dropAddressParts.push(dropselectedCity);
  if (dropselectedSuburb) dropAddressParts.push(dropselectedSuburb);
  if (dropselectedPostcode) dropAddressParts.push(dropselectedPostcode);

  const encodedDropAddressParts = dropAddressParts.map(part => encodeURIComponent(part));

  const dropGoogleMapLink = encodedDropAddressParts.length > 0
    ? `https://www.google.com/maps/place/${encodedDropAddressParts.join(',')}`
    : null;
  console.log(data, "selectedCity");
  console.log(estjobdate, "status123");
  return (
    <div>
      <CustomBookingModal
        show={deleteModal}
        onDeleteClick={confirmBooking}
        onCloseClick={() => setDeleteModal(false)}
      />

      <ToastContainer closeButton={false} limit={1} theme="light" />
      <Row>
        <Col lg={3}>
          <h5 className='pt-2'> Opportunity # </h5>
        </Col>
        <Col lg={3}>
          <select
            value={selectedOppId}
            onChange={event => {
              selectedOpportunity();
              setSelectedOppId(event.target.value)
              const queryString = `/opportunitydetails/${_leadid}/${event.target.value}`;
              navigate(queryString);
              window.location.reload();
            }}
            className="form-select "
            aria-label="Default select example"
          >
            {opportunities?.map((res) => (
              <option key={res.id} value={res.id}>
                {res.op_type} {res.job_number}
              </option>
            ))}
          </select>
          {/* <select className="form-select mb-3" aria-label="Default select example">
            <option >Moving 335</option>
          </select> */}
        </Col>
        <Col lg={6} className='hstack justify-content-end mb-3'>
          <Button className='btn btn-success' onClick={handleBooking}>Confirm Booking</Button>
        </Col>
      </Row>
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
      <Row>
        <Col lg={6}>
          <Card>
            <CardHeader>
              <div className='d-flex justify-content-between align-items-center'>
                <h5>MOVING FROM</h5>
                <a href={googleMapLink} target="_blank">
                  <i className="ri-map-pin-2-fill fs-24 text-danger float-right"></i>
                </a>
              </div>
            </CardHeader>

            <CardBody className='b-left-3-o'>
              {colFrom ? (
                <Collapse isOpen={colFrom} id="collapseWithicon">
                  <div className="card mb-0">
                    {cust_type == "Commercial" &&
                      <>
                        <Col lg={12} className='mt-2'>
                          <Label>Contact Name</Label>
                          <Input className='form-control' placeholder='Enter a name' value={contactname} onChange={(e) => setcontactname(e.target.value)} ></Input>
                        </Col>
                        <Col lg={12} className='mt-2'>
                          <Label>Mobile</Label>
                          <Input className='form-control' placeholder='Enter a  mobile number' value={mobile} onChange={(e) => setMobile(e.target.value)} ></Input>
                        </Col>
                        <Col lg={12} className='mt-2'>
                          <Label>Email</Label>
                          <Input className='form-control' type="email" placeholder='Enter a email' value={email} onChange={(e) => setEmail(e.target.value)} ></Input>
                        </Col>
                      </>
                    }
                    <Col lg={12} className='d-flex flex-column mt-2'>
                      <Label>Address</Label>
                      <GoogleAutocomplete
                        apiKey="AIzaSyB2SMtaVBlqC5v72gqS716BX8R5oXklaFc"
                        value={selectedCity}
                        onChange={(e) => setSelectedcity(e.target.value)}
                        onPlaceSelected={(place) => residentialplace(place)}
                        options={{
                          types: ["geocode"],
                          componentRestrictions: {
                            country: countrycode,
                          },
                        }}
                        style={{
                          border: "1px solid #ccc",
                          padding: "10px",
                          borderRadius: "5px",
                          position: "relative",
                          zIndex: 9999,
                        }}
                      />
                    </Col>
                    <Col lg={12} className='d-flex flex-column mt-2'>
                      <Label>Suburb</Label>
                      <GoogleAutocomplete
                        apiKey="YOUR_API_KEY"
                        value={selectedSuburb}
                        id="suburbmovingfrom"
                        onChange={(e) => setselectedSuburb(e.target.value)}
                        onPlaceSelected={selectSuburbOption}
                        options={{
                          types: ["(regions)"],
                          componentRestrictions: {
                            country: countrycode,
                          },
                        }}
                        style={{
                          border: "1px solid #ccc",
                          padding: "10px",
                          borderRadius: "5px",
                          position: "relative",
                          zIndex: 9999,
                        }}
                      />
                    </Col>
                    <Col lg={12} className="mt-2">
                      <Label>Post Code</Label>
                      <Input
                        className="form-control"
                        value={selectedPostcode} onChange={(e) => setselectedPostcode(e.target.value)}
                      ></Input>
                    </Col>
                    <Col lg={12} className='mt-2'>
                      <Label>Access Instructions</Label>
                      <textarea rows={2} className='form-control' value={pickupres} onChange={(e) => setpickUpRes(e.target.value)}></textarea>
                    </Col>
                    <Col lg={12} className='mt-2'>
                      <Label>Bedroom</Label>
                      <Input className='form-control' placeholder='' value={bedroom} onChange={(e) => setBedroom(e.target.value)}></Input>
                    </Col>
                    <div className='hstack gap-3 mt-3'>
                      <Button className='btn btn-light' onClick={() => { setColFrom() }}>Cancel</Button>
                      <Button className="btn btn-info" onClick={handleSubmit}>Update</Button>
                    </div>
                  </div>
                </Collapse>
              ) : (
                <Row>
                  <Col lg={8} className="pt-2">
                    <h6>
                      <span>
                        <Label>
                          {selectedCity !== null ? `${selectedCity}, ` : ''}
                          {selectedSuburb !== null ? `${selectedSuburb} ` : ''}
                          {selectedPostcode !== null ? selectedPostcode : ''}
                        </Label>
                      </span>
                    </h6>
                  </Col>
                  <Col lg={4} className='hstack justify-content-end'>
                    <Button color="soft-success" onClick={t_colFrom} style={{ cursor: "pointer" }}>
                      <b><i className="bx bx-pencil"></i> </b>
                    </Button>
                  </Col>
                </Row>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <div className='d-flex justify-content-between align-items-center'>
                <h5>BOOKING DETAILS</h5>
                <a
                  href={`https://www.google.com/maps/dir/${addressParts.join(' ')}/${dropAddressParts.join(' ')}`}
                  target="_blank"
                >
                  <i className="ri-pin-distance-fill fs-24 float-right text-danger"></i>
                </a>
              </div>
            </CardHeader>
            <CardBody className='b-left-3-o'>
              {bookingDetails ? (
                <Collapse isOpen={bookingDetails} id="collapseWithicon">
                  <div className="card mb-0">
                    <Col lg={12} className='mt-2'>
                      <Label>Opportunity</Label>
                      <div><strong>{jobnumber}</strong></div>
                    </Col>
                    <Col lg={12} className='mt-2'>
                      <Label>Estimated Job Date</Label>
                      <Flatpickr
                        id="dateInput"
                        className="form-control"
                        value={moment(estjobdate, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY')}
                        onChange={(date) =>
                          setestjobdate(moment(date[0]).format('YYYY-MM-DD HH:mm:ss'))
                        }
                        options={{
                          dateFormat: 'd/m/Y',
                          enableTime: false,
                        }}
                      />
                    </Col>
                    <Col lg={12} className='mt-2'>
                      <div className="mb-0">
                        <Label htmlFor="company" className="form-label">Company</Label>
                        <select className="form-select" value={companyname}
                          onChange={(e) => setCompanyName(e.target.value)}>
                          {companieslist && companieslist.length > 0 ? (
                            companieslist.map((company, index) => (
                              <option key={index} value={company.id}>{company.company_name}</option>
                            ))
                          ) : (
                            <option value="">No companies found</option>
                          )}
                        </select>
                      </div>
                    </Col>
                    <Col lg={12} className='mt-2'>
                      <Label htmlFor="status" className="form-label">Status</Label>
                      <select className="form-select" value={statuses} onChange={(e) => setStatuses(e.target.value)}>
                        {status && status.length > 0 ? (
                          status.map((status, index) => (
                            <option key={index} value={status.pipeline_status}>{status.pipeline_status}</option>
                          ))
                        ) : (
                          <option value="">No status found</option>
                        )}
                      </select>
                    </Col>

                    <div className='hstack gap-3 mt-3'>
                      <Button className='btn btn-light' onClick={() => { setBookingdetails() }}>Cancel</Button>
                      <Button className="btn btn-info" onClick={handleSubmit3}>Update</Button>
                    </div>
                  </div>
                </Collapse>
              ) : (
                <Row>
                  <Col lg={8} className="pt-2">
                    <table className="left_panel_table" style={{ width: 'auto!important' }}>
                      <tbody>
                        <tr>
                          <td><strong>Opportunity:</strong></td>
                          <td className="textalign-left" style={{ paddingLeft: "5px" }}>
                            <span>{jobnumber}</span>
                          </td>
                        </tr>
                        <tr>
                          <td><strong>Estimated Job Date:</strong></td>
                          <td className="textalign-left" style={{ paddingLeft: "5px" }}>
                            {/* <span>{new Date(estjobdate).toLocaleDateString('en-GB')}</span> */}
                            <span>{moment(estjobdate).format(org_date.date_format_js)}</span>
                          </td>
                        </tr>
                        <tr>
                          <td><strong>Company:</strong></td>
                          <td className="textalign-left" style={{ paddingLeft: "5px" }}>
                            <span>{companynames || ''}</span>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <p className="job-label-txt job-status orange-status" style={{
                              display: 'inline',
                              padding: '2px 12px',
                              borderRadius: '4px',
                              backgroundColor: '#fcbd2e'
                            }}><strong>{statuses}</strong></p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </Col>
                  <Col lg={4} className='hstack justify-content-end' style={{ marginBottom: "60px" }}>
                    {opportunity === 'Y' && (
                      <Button color="soft-success" onClick={t_bookingDetails} style={{ cursor: "pointer" }}>
                        <b><i className="bx bx-pencil"></i> </b>
                      </Button>
                    )}
                  </Col>
                </Row>
              )}
            </CardBody>
          </Card>
        </Col>
        <Col lg={6}>
          <Card>
            <CardHeader >
              <div className='d-flex justify-content-between align-items-center'>
                <h5>MOVING TO </h5>
                <a href={dropGoogleMapLink} target="_blank">
                  <i className="ri-map-pin-2-fill fs-24 text-danger float-right"></i>
                </a>
              </div>
            </CardHeader>
            <CardBody className='b-left-3-g'>
              {colTo ? (
                <Collapse isOpen={colTo} id="collapseWithicon">
                  <div className="card mb-0">
                    {cust_type == "Commercial" &&
                      <>
                        <Col lg={12} className='mt-2'>
                          <Label>Contact Name</Label>
                          <Input className='form-control' placeholder='Enter a location' value={dropoffcontactname} onChange={(e) => setdropoffcontactname(e.target.value)}></Input>
                        </Col>
                        <Col lg={12} className='mt-2'>
                          <Label>Mobile</Label>
                          <Input className='form-control' placeholder='Enter a location' value={dropoffmobile} onChange={(e) => setdropoffmobile(e.target.value)}></Input>
                        </Col>
                        <Col lg={12} className='mt-2'>
                          <Label>Email</Label>
                          <Input className='form-control' placeholder='Enter a location' value={dropoffemail} onChange={(e) => setdropoffemail(e.target.value)}></Input>
                        </Col>
                      </>
                    }
                    <Col lg={12} className='d-flex flex-column mt-2'>
                      <Label>Address</Label>
                      <GoogleAutocomplete
                        apiKey="AIzaSyB2SMtaVBlqC5v72gqS716BX8R5oXklaFc"
                        value={dropselectedCity}
                        onChange={(e) => setdropselectedCity(e.target.value)}
                        onPlaceSelected={(place) => dropoffselect(place)}
                        options={{
                          types: ["geocode"],
                          componentRestrictions: {
                            country: countrycode,
                          },
                        }}
                        style={{
                          border: "1px solid #ccc",
                          padding: "10px",
                          borderRadius: "5px",
                          position: "relative",
                          zIndex: 9999,
                        }}
                      />
                    </Col>


                    <Col lg={12} className='d-flex flex-column mt-2'>
                      <Label>Suburb</Label>
                      <GoogleAutocomplete
                        apiKey="YOUR_API_KEY"
                        value={dropselectedSuburb}
                        id="suburbmovingfrom"
                        onChange={(e) => setdropselectedSuburb(e.target.value)}
                        onPlaceSelected={setmovingtosuburb}
                        options={{
                          types: ["geocode"],
                          componentRestrictions: {
                            country: countrycode,
                          },
                        }}
                        style={{
                          border: "1px solid #ccc",
                          padding: "10px",
                          borderRadius: "5px",
                          position: "relative",
                          zIndex: 9999,
                        }}
                      />
                    </Col>
                    <Col lg={12} className="mt-2">
                      <Label>Post Code</Label>
                      <Input
                        className="form-control"
                        value={dropselectedPostcode}
                        onChange={(e) => setdropselectedPostcode(e.target.value)}
                      ></Input>
                    </Col>
                    <Col lg={12} className="mt-2">
                      <Label>Access Instructions</Label>
                      <textarea
                        rows={2}
                        className="form-control"
                        value={accessrestriction}
                        onChange={(e) => setAccessRestric(e.target.value)}
                      ></textarea>
                    </Col>
                    <Col lg={12} className="mt-2">
                      <Label>Bedroom</Label>
                      <Input
                        className="form-control"
                        placeholder="Enter a location"
                        value={movingtobedroom}
                        onChange={(e) => setmovingtobedroom(e.target.value)}
                      ></Input>
                    </Col>
                    <div className="hstack gap-3 mt-3">
                      <Button
                        className="btn btn-light"
                        onClick={() => {
                          setColTo();
                        }}
                      >
                        Cancel
                      </Button>
                      <Button className="btn btn-info" onClick={handleSubmit2}>
                        Update
                      </Button>
                    </div>
                  </div>
                </Collapse>
              ) : (
                <Row>
                  <Col lg={8} className="pt-2">
                    <h6>
                      <span>
                        <Label>
                          {dropselectedCity !== null ? `${dropselectedCity}, ` : ''}
                          {dropselectedSuburb !== null ? `${dropselectedSuburb} ` : ''}
                          {dropselectedPostcode !== null ? `${dropselectedPostcode} ` : ''}
                        </Label>
                      </span>
                    </h6>
                  </Col>
                  <Col lg={4} className='hstack justify-content-end'>
                    <Button color="soft-success" onClick={t_colTo} style={{ cursor: "pointer" }} >
                      <b><i className="bx bx-pencil"></i> </b>
                    </Button>
                  </Col>
                </Row>
              )}
            </CardBody>
          </Card>
          <Card>
            <CardHeader>
              <div className='d-flex justify-content-between align-items-center pt-2 pb-2'>
                <h5> PROPERTY DETAILS</h5>
              </div>
            </CardHeader>
            <CardBody className='b-left-3-g'>
              {propertyDetails ? (
                <Collapse isOpen={propertyDetails} id="collapseWithicon">
                  <div className="card mb-0">
                    <Col lg={12} className='mt-2'>
                      <Label>Property Type</Label>
                      <select className="form-select" value={properties} onChange={(e) => setproperties(e.target.value)}>
                        {propertytypes && propertytypes.length > 0 ? (
                          propertytypes.map((propertytypes, index) => (
                            <option key={index} value={propertytypes.id}>{propertytypes.options}</option>
                          ))
                        ) : (
                          <option value="">No status found</option>
                        )}
                      </select>
                    </Col>
                    <Col lg={12} className='mt-2'>
                      <Label>Furnishing</Label>


                      <Label htmlFor="status" className="form-label">Status</Label>
                      <select className="form-select" value={furnish} onChange={(e) => setfurnish(e.target.value)}>
                        {furnishing && furnishing.length > 0 ? (
                          furnishing.map((furnishing, index) => (
                            <option key={index} value={furnishing.id}>{furnishing.options}</option>
                          ))
                        ) : (
                          <option value="">No status found</option>
                        )}
                      </select>
                    </Col>
                    <Col lg={12} className='mt-2'>
                      <Label>Bedrooms</Label>
                      <select className="form-select" value={propertybed} onChange={(e) => setpropertybed(e.target.value)}>
                        {propertybedroom && propertybedroom.length > 0 ? (
                          propertybedroom.map((propertybedroom, index) => (
                            <option key={index} value={propertybedroom.id}>{propertybedroom.options}</option>
                          ))
                        ) : (
                          <option value="">No status found</option>
                        )}
                      </select>
                    </Col>
                    <Col lg={12} className='mt-2'>
                      <Label>Living Areas</Label>
                      <select className="form-select" value={living} onChange={(e) => setliving(e.target.value)}>
                        {livingarea && livingarea.length > 0 ? (
                          livingarea.map((livingarea, index) => (
                            <option key={index} value={livingarea.id}>{livingarea.options}</option>
                          ))
                        ) : (
                          <option value="">No status found</option>
                        )}
                      </select>
                    </Col>
                    <hr></hr>
                    <h6>Other Rooms:</h6>
                    <Row className='mt-2 mb-2'>
                      <Col lg={4}>
                        <div>
                          <label>Other Rooms</label>
                          <br />
                          <Row>
                            {propertydetail && propertydetail.length > 0 ? (
                              propertydetail.map((option, index) => (
                                <Col xs="auto" key={index}>
                                  <div className="form-check">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      name="other_room[]"
                                      checked={selectedProperties.includes(option)}
                                      value={option}
                                      onChange={(e) => handleCheckboxChange(e, option)}
                                    />
                                    <label className="form-check-label">{option}</label>
                                  </div>
                                </Col>
                              ))
                            ) : (
                              <Col>
                                <p>No options found</p>
                              </Col>
                            )}
                          </Row>
                        </div>
                      </Col>

                      <Col lg={4}>
                        <div className="form-check mb-2">
                          <div className="form-group">
                            <Label>Special Items</Label>
                            <br />
                            <Row>
                              {specialitem && specialitem.length > 0 ? (
                                specialitem.map((option, index) => (
                                  <Col xs="auto" key={index}>
                                    <div className="form-check">
                                      <input
                                        className="form-check-input"
                                        type="checkbox"
                                        name="other_room[]"
                                        checked={selectitem.includes(option.options)}
                                        value={option.options}
                                        onChange={(e) => handlespecialitemsChange(e, option.options)}
                                      />
                                      <label className="form-check-label">{option.options}</label>
                                    </div>
                                  </Col>
                                ))
                              ) : (
                                <Col>
                                  <p>No special items found</p>
                                </Col>
                              )}
                            </Row>
                          </div>
                        </div>
                      </Col>

                      <h6 className='mt-2'>Instructions:</h6>
                      <Col lg={12}>
                        <textarea rows={2} className='form-control mt-2' value={instruction} onChange={(e) => setinstruction(e.target.value)} />
                      </Col>
                    </Row>

                    <div className='hstack gap-3 mt-3'>
                      <Button className='btn btn-light' onClick={() => { setPropertyDetails() }}>Cancel</Button>
                      <Button className="btn btn-info" onClick={propertydetails}>Update</Button>
                    </div>
                  </div>
                </Collapse>
              ) : (
                <>
                  <Row className='mb-0'>
                    <Col lg={8} className="pt-1">
                      <table className="left_panel_table" style={{ width: 'auto!important' }}>
                        <tbody>
                          <tr>
                            <td>
                              <strong>Property Type:</strong>
                            </td>
                            <td className="textalign-left" style={{ paddingLeft: "5px" }}>
                              <span>{propertytypesdisplay}</span>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <strong>Furnishing:</strong>
                            </td>
                            <td className="textalign-left" style={{ paddingLeft: "5px" }}>
                              <span>{data?.job?.pickup_furnishing}</span>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <strong>Bedrooms:</strong>
                            </td>
                            <td className="textalign-left" style={{ paddingLeft: "5px" }}>
                              <span>{bedroomsdisplay}</span>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <strong>Living Areas:</strong>
                            </td>
                            <td className="textalign-left" style={{ paddingLeft: "5px" }}>
                              <span>{livingareadisplay}</span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </Col>
                    <Col lg={4} className='hstack justify-content-end' style={{ marginBottom: "60px" }}>
                      <Button color="soft-success" onClick={t_propertyDetails} style={{ cursor: "pointer" }} >
                        <b><i className="bx bx-pencil"></i> </b>
                      </Button>
                    </Col>
                    <hr></hr>

                  </Row>
                  {
                    !propertyDetails ? (
                      <>
                        <Row className='mt-0 mb-2'>
                          <Col lg={4}>
                            <div>
                              <Label><b>Other Rooms:</b></Label>
                              <br />
                              <Row>
                                {propertydetail && propertydetail.length > 0 ? (
                                  propertydetail.map((option, index) => (
                                    <Col xs="auto" key={index}>
                                      <div className="form-check">
                                        <input
                                          className="form-check-input"
                                          type="checkbox"
                                          name="other_room[]"
                                          checked={selectedProperties.includes(option)}
                                          value={option}
                                          onChange={(e) => handleCheckboxChange(e, option)}
                                        />
                                        <label className="form-check-label">{option}</label>
                                      </div>
                                    </Col>
                                  ))
                                ) : (
                                  <Col>
                                    <p>No options found</p>
                                  </Col>
                                )}
                              </Row>
                            </div>
                          </Col>

                          <Col lg={4}>
                            <div>
                              <Label><b>Special Items:</b></Label>
                              <br />
                              <Row>
                                {specialitem && specialitem.length > 0 ? (
                                  specialitem.map((option, index) => (
                                    <Col xs="auto" key={index}>
                                      <div className="form-check">
                                        <input
                                          className="form-check-input"
                                          type="checkbox"
                                          name="other_room[]"
                                          checked={selectitem.includes(option.options)}
                                          value={option.options}
                                          onChange={(e) => handlespecialitemsChange(e, option.options)}
                                        />
                                        <label className="form-check-label">{option.options}</label>
                                      </div>
                                    </Col>
                                  ))
                                ) : (
                                  <Col>
                                    <p>No special items found</p>
                                  </Col>
                                )}
                              </Row>
                            </div>
                          </Col>
                          <Col lg={4}>
                            <div>
                              <Label><b>Instructions:</b></Label>
                              <p>{data?.job?.other_instructions}</p>
                            </div>
                          </Col>
                        </Row>
                      </>
                    ) : (
                      null
                    )
                  }
                </>
              )}
            </CardBody>
          </Card>
        </Col>

      </Row>

    </div>
  )
}
