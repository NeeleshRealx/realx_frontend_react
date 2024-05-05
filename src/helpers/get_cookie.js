import axios from "axios";
// import { api } from "../config";

const get_cookie = (name) => {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) {
      return match[2];
    }
    else{
         return false;
    }
  };

  var delete_cookie = function(name) {
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};

const add_cookie = (data, remember = false) =>{
  var date = new Date();
  if(remember){
  date.setTime(date.getTime()+(30*24*60*60*1000));
  }else{
    date.setTime(date.getTime()+(2*60*60*1000));
  }
  var expires = "; expires="+date.toGMTString();
  document.cookie = "authUser="+JSON.stringify(data)+expires+"; path=/";
}

  export { get_cookie, delete_cookie, add_cookie }