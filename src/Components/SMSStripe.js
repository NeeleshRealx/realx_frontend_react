import React, {useState, useEffect, useContext} from 'react';
import { Elements, useStripe, useElements } from '@stripe/react-stripe-js';
import swal from 'sweetalert';
import Swal from 'sweetalert2';
import { Input, Button } from 'reactstrap';
import {loadStripe} from '@stripe/stripe-js';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const stripePromise = loadStripe('pk_test_E0qVMK2JSQXGItx8GHNrlqX9');

const Stripe = ({balance, stripecusid, loadSms, button_text, smsBalance, smsBalanceTop, smsTopup, email, smsCredit}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [cardElement, setCardElement] = useState(null);


  useEffect(() => {
    if (stripe && !cardElement) {
      const cardElementInstance = elements.create('card',{
        hidePostalCode: true,
      });
      setCardElement(cardElementInstance);
    }
  }, [stripe, elements, cardElement]);

  const handlePayment = async (stripeEmail, amount) =>{
    try {
      if(stripeEmail){
      var email = stripeEmail.trim();
      }else{
      var email = ""
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(email) && email != "") {
      const result = await stripe.createPaymentMethod({
        type: 'card',
        card:elements.getElement('card'),
      });
      const token = await stripe.createToken(cardElement);
      const paymentMethodId = result?.paymentMethod?.id;
      if(result.paymentMethod){
        var postData={
          "auto_topup": smsTopup,
          "amount": parseFloat(amount),
          "sms_balance_lower_limit":smsBalance,
          "sms_balance_top_up_qty":smsBalanceTop,
          "stripe_customer_id": stripecusid,
          "stripeToken": token.token.id,
          "stripeEmail": email,
          "sms_credit": smsCredit
        }
        console.log(postData);
        axios.post("/api/buy-sms-credits", postData).then((res)=>{
          console.log(res);
          if(res.status == 1){
            toast.success(res.message);
            loadSms();
          }
        })
      }
      console.log(result);
      if(result.error){
        if(result.error.code == "incomplete_expiry"){
          toast.error(result.error.message);
          return false;
        }
        else if(result.error.code == "incomplete_number"){
          toast.error(result.error.message);
          return false;
        }
        else if(result.error.code == "incomplete_cvc"){
          toast.error(result.error.message);
          return false;
        }
        else if(result.error.code == "incomplete_zip"){
          toast.error(result.error.message);
          return false;
        }
      }
    } else {
      toast.error('Invalid email address!');
      return false
    }
      // Process the payment method result here
      // (e.g., send the payment method ID to your server for further processing)
    } catch (error) {
      console.error(error);
    }
  }

  const handleCardChange = (event) => {
    // You can access the card details from event.element
    console.log(event);
    const cardDetails = event.element;
    // You can access the card number, expiry, and cvc using cardDetails
    // For example: cardDetails.brand, cardDetails.last4, cardDetails.exp_month, cardDetails.exp_year
    console.log(cardDetails);
  };


  const handlePaymentWithNewCard = async () => {
    if (smsCredit >= 10) {
      // Add logic to handle the payment

    console.log("tyeset")
    var amountField = document.createElement('input');         
    amountField.setAttribute("placeholder", "0.00");
    amountField.setAttribute("id", "amount");
    amountField.setAttribute("value", balance);
      Swal.fire({
        width: '30%',
        html: `<div><div>
        <div 
        style = "width: 76px;
        height: 75px;
        position: absolute;
        left: 45%;
        margin-left: -38px;
        top: -30px;">
            <img className="rounded-circle header-profile-user " 
            style="height:70px ;position:absolute;background:white;border: 6px solid #f2f2f4;border-radius: 50%; " 
            src="https://dev.onexfort.com/stripe-onex-logo.jpg" alt="logo"/>
        </div>
        <h3 style="margin-top:30px">Enter Card Details</h3>
    </div><input className="form-control stripe_email" type="text" placeholder="Email" id="stripeEmail" value=${email} disabled style="margin-bottom:10px;width:100%;padding:5px;font-size: 16px;margin-top:30px;"/></div>
        <div id="swal-card-element"></div>`,
        preConfirm: () => {
          const stripeEmail = document.getElementById('stripeEmail').value;
          return handlePayment(stripeEmail, balance);
        },
        didOpen: () => {
          // Mount the CardElement inside the Swal modal
          //const cardElement = elements.create('card');
          cardElement.mount('#swal-card-element');
          cardElement.on('change', handleCardChange);
        },
        showCloseButton:true,
        showLoaderOnConfirm: true,
        confirmButtonText: 'Pay AUD $'+balance/100,
      }).then((result) => {
        console.log(result);
        if (result.isConfirmed) {
          // handlePayment();
        }
      });
    } else {
      // Display a toast message
      toast.error('Please enter a minimum of 10 credits to proceed with the payment.');
    }
    };

  return (
    <div>
      <button size="lg" className='btn btn-success btn-md mt-2' onClick={()=>handlePaymentWithNewCard()}>{button_text}</button>
      <ToastContainer closeButton={false} limit={1} />
    </div>
    
  );
};

const StripePayment = ({balance, stripecusid, loadSms, button_text, smsBalanceTop, smsBalance, smsTopup, email, smsCredit}) =>{
  const [showPayment, setShowPayment] = useState(true);

  // const handleBuyClick = () => {
  //   if (smsCredit >= 10) {
  //     // Add logic to handle the payment
  //     setShowPayment(true);
  //   } else {
  //     // Display a toast message
  //     toast.error('Please enter a minimum of 10 credits to proceed with the payment.');
  //   }
  // };


    return (
      <div>
      {/* <button onClick={handleBuyClick}>{button_text}</button> */}

{/* Conditionally render the payment section */}
{showPayment && (
  <Elements stripe={stripePromise}>
    <Stripe
      balance={balance}
      loadSms={loadSms}
      stripecusid={stripecusid}
      smsTopup={smsTopup}
      smsBalance={smsBalance}
      smsCredit={smsCredit}
      smsBalanceTop={smsBalanceTop}
      button_text={button_text}
      email={email}
    />
  </Elements>
)}

{/* Display a toast container at the root level of your app */}
<ToastContainer />
</div>
);
};

export default StripePayment;
