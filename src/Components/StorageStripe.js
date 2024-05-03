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

const Stripe = ({balance, invoice, onChangeData, button_text, storage_id, email,storage_value}) => {
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

  const handlePayment = async (stripeEmail, amount) => {
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
      var stripe_one_off_customer_id = (invoice.stripe_one_off_customer_id != null) ? stripe_one_off_customer_id : "N";
      const paymentMethodId = result.paymentMethod.id;
      if(result.paymentMethod){
        var postData={
          "invoice_id": invoice.id,
          "amount": amount,
          "sys_job_type":"Moving_storage",
          "stripeCustomerId": stripe_one_off_customer_id,
          "stripeToken": token.token.id,
          "storage_id": storage_id,
          "stripeEmail": email
        }
        axios.post("/api/storage/ajaxChargeStripePayment", postData).then((res)=>{
          console.log(res);
          if(res.status == 1){
            toast.success(res.message);
            onChangeData();
          }
        })
      }
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
    console.log(storage_value,"invoice")
    console.log(invoice,"invoice")
    var amountField = document.createElement('input');         
    amountField.setAttribute("placeholder", "0.00");
    amountField.setAttribute("id", "amount");
    amountField.setAttribute("value", balance);
    swal({
      width: '35%',
      title: 'Process the payment using a New Card',
      buttons: {
        cancel: 'No Cancel Please!',
        ...((storage_value.stripe_one_off_customer_id != null && storage_value.stripe_one_off_customer_id !="") && {
          saved_card: {
            text: "Saved Card",
            value: "1",
          },
        }),
        new_card: {
          text: "New Card",
          value: "2",
      },
      },
      content: amountField,
    }).then(async (value) => {
      let amount = amountField.value;
        if (value !== null && value !== "") {
      switch (value) { 
        case "1":
          swal({
            title: "Are you sure?",
            text: "The payment will be processed using the customer's saved card!",
            icon: "warning",
            buttons: true,
        }).then((value)=>{
          if(value){
            var tkn = "{{ csrf_token() }}";
            var invoice_id = 12;
            var payamount =  amount;
            var stripe_one_off_customer_id = (invoice.stripe_one_off_customer_id != null || invoice.stripe_one_off_customer_id != "") ? invoice.stripe_one_off_customer_id : "N";
            var postData = {
              "invoice_id": invoice.id,
              "amount": amount,
              "sys_job_type":invoice.sys_job_type,
              "stripeCustomerId": stripe_one_off_customer_id,
            }
            axios.post("/api/storage/ajaxChargeStripePayment", postData).then((res)=>{
              if(res.status == 1){
                toast.success(res.message);
                onChangeData();
              }
            })
          }
        })
        break;
        case "2":
          Swal.fire({
            width: '30%',
            title: 'Enter Card Details',
            html: `<div><input className="form-control stripe_email" type="text" placeholder="Email" id="stripeEmail" value=${email} disabled style="margin-bottom:10px;width:100%;padding:5px;"/></div>
            <div id="swal-card-element"></div>`,
            preConfirm: () => {
              const stripeEmail = document.getElementById('stripeEmail').value;
              return handlePayment(stripeEmail, amount);
            },
            didOpen: () => {
              // Mount the CardElement inside the Swal modal
              //const cardElement = elements.create('card');
              cardElement.mount('#swal-card-element');
              cardElement.on('change', handleCardChange);
            },
            showCloseButton:true,
            showLoaderOnConfirm: true,
            confirmButtonText: 'Pay',
          }).then((result) => {
            console.log(result);
            if (result.isConfirmed) {
              // handlePayment();
            }
          });
        break;
        }
    }else {
      // User clicked the cancel button, handle the cancel scenario here
      // For example, you can display a message or perform any other actions needed
      console.log('Payment cancelled');
    }
    })

  };

  return (
    <div>
      <button size="sm" className='btn btn-secondary btn-sm' onClick={()=>handlePaymentWithNewCard()}>{button_text}</button>
      {/* <div>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter Amount"
        />
      </div> */}
      {/* Include the Stripe CardElement here if you need it for the New Card option */}
      <ToastContainer closeButton={false} limit={1} />
    </div>
    
  );
};

const StripePayment = ({balance, invoice, onChangeData, button_text, storage_id, email,storage_value}) =>{
  return (
    <Elements stripe={stripePromise}>
      <Stripe storage_value={storage_value} balance={balance} invoice={invoice} onChangeData={onChangeData} storage_id={storage_id} button_text={button_text} email={email}/>
    </Elements>
  );
}

export default StripePayment;
