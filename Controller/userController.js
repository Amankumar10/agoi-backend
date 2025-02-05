const Referral = require("../Model/referralModel");
const User = require("../Model/userModel");
const crypto = require("crypto");
const Order = require("../Model/orderModel");
const Notification = require("../Model/notificationModel");
exports.createUserByContact = async (req, res, next) => {
  try {
    console.log(req.body);
    let data = req.body;
    if (data.mobile_number === undefined) {
      res.send({
        message: "please enter your phone",
      });
    }
    let isExist = await User.findOne({ mobile_number: data.mobile_number });
    console.log(isExist);
    if (isExist) {
      return res.send({
        message: "user already exists",
      });
    }
    let referral_code = crypto.randomBytes(3).toString("hex");
    console.log(referral_code);
    let userData = {
      mobile_number: data.mobile_number,
      referral_code: referral_code,
    };
    if (data.referred_code) {
      let isValidReferred = await User.findOne({
        referral_code: data.referred_code,
      });
      if (isValidReferred) {
        userData["referred_code"] = data.referred_code;
        userData["isReferred"] = true;
      }
    }
    const result = await User.create(userData);
    const checkRefer = await Referral.findOne({
      receiver_contact_no: data.mobile_number,
    });
    // if (checkRefer.is_active == true) {
    //   result.wallet_balance = checkRefer.refer_amount;
    // }
    checkRefer.is_active = false;
    await checkRefer.save();
    await result.save();
    res.send({
      message: "record saved successfully",
      result,
    });
  } catch (err) {
    console.log(err);
    res.send({
      message: err.message,
    });
  }
};

//get all users
exports.getAll = async (req, res, next) => {
  try {
    let result = await User.find();
    res.send({
      message: "List of All User",
      data: result,
    });
  } catch (err) {
    console.log(err);
    res.send({
      message: err.message,
    });
  }
};
//get all Order
exports.getAllOrder = async (req, res, next) => {
  try {
    let result = await Order.find();
    res.send({
      message: "List of All Order",
      data: result,
    });
  } catch (err) {
    console.log(err);
    res.send({
      message: err.message,
    });
  }
};

//get order by order_Id
exports.getOrderById = async (req, res, next) => {
  try {
    let result = await Order.findById(req.params.id);
    res.send({
      message: "List of All Order",
      data: result,
    });
  } catch (err) {
    console.log(err);
    res.send({
      message: err.message,
    });
  }
};

// change order status
exports.orderStatus = async (req, res, next) => {
  try {
    let id = req.params.id;
    let data = req.body;
    console.log("req body" , data);

    const orderData = await Order.findById(id);
    if (!orderData) {
      return res.send({ error: true, message: "order not found" });
    }
    
    orderData.is_order_approved = data.is_order_approved ? data.is_order_approved : orderData.is_order_approved;
    orderData.order_feedback = data.order_feedback ? data.order_feedback : orderData.order_feedback;
    
    await orderData.save()
    
    return res.send({
      message: "order status updated successfully",
      data: orderData
  });
  }catch (err) {
    res.send({
      message: err.message,
    })
  }
}

//get users byId
exports.findById = async (req, res, next) => {
  try {
    let result = await User.findById(req.params.id)//.populate('stock');  //cash out, notification
    res.send({
      message: "User succefully fetched",
      data: result,
    });
  } catch (err) {
    console.log(err);
    res.send({
      message: err.message,
    });
  }
};

//Edit Wallet Amount 
exports.EditWalletAmount = async (req, res, next) => {
  try {
    let data = req.body;
    let id = req.params.id;

    const result = await User.findById(id);

    if (!result) {
      return res.send({ error: true, message: "user not found" });
    }

    result.wallet_balance = data.wallet_balance ? data.wallet_balance : result.wallet_balance;

    await result.save();
    res.send({
      message: "walllet balance",
      data: result,
    });
  } catch (err) {
    res.send({
      message: err.message,
    })
  }
}

exports.findUserByContact = async (req, res, next) => {
  try {
    console.log(req.body);
    let data = req.body;
    if (data.mobile_number === undefined) {
      res.send({
        message: "please enter your phone",
      });
    }

    const result = await User.findOne({
      mobile_number: data.mobile_number,
    });
    console.log(result);
    res.send({
      message: "user found",
      data: result,
    });
  } catch (err) {
    res.send({
      message: err.message,
    });
  }
};

exports.addKYCDetails = async (req, res, next) => {
  try {
    console.log(req.body);
    let data = req.body;

    const result = await User.findOne({
      mobile_number: data.mobile_number,
    });

    if (!result) {
      return res.send({ error: true, message: "user not found" });
    }
    result.email_id = data.email_id ? data.email_id : result.email_id;
    result.demat_acc_no = data.demat_acc_no
      ? data.demat_acc_no
      : result.demat_acc_no;
    result.pan_card_number = data.pan_card_number
      ? data.pan_card_number
      : result.pan_card_link;
    result.pan_card_link = data.pan_card_link
      ? data.pan_card_link
      : result.pan_card_link;
    result.account_number = data.account_number
      ? data.account_number
      : result.account_number;
    result.account_number_link = data.account_number_link
      ? data.account_number_link
      : result.account_number_link;
    result.aadhar_number = data.aadhar_number
      ? data.aadhar_number
      : result.aadhar_number;
    result.demat_screenshot = data.demat_screenshot
      ? data.demat_screenshot
      : result.demat_screenshot;
    result.nominee_name = data.nominee_name
      ? data.nominee_name
      : result.nominee_name;
    result.is_completed_profile = data.is_completed_profile
      ? data.is_completed_profile
      : result.is_completed_profile;
    result.is_completed_kyc = data.is_completed_kyc
      ? data.is_completed_kyc
      : result.is_completed_kyc;
    await result.save();
    res.send({
      message: "user found",
      data: result,
    });
  } catch (err) {
    console.log(err);
    res.send({
      message: err.message,
    });
  }
};

//GET ALL KYC DETAILS
exports.kyc = async (req, res, next) => {
  try {
    let allkyc = [];
    const kycData = await User.find();
  kycData.forEach(async (kyc) => {
   kyc = {
    _id: kyc.id,
    name: kyc.name,
    mobile_number: kyc.mobile_number,
    email_id: kyc.email_id,
    demat_acc_no: kyc.demat_acc_no,
    pan_card_number: kyc.pan_card_number,
    pan_card_link: kyc.pan_card_link,
    account_number: kyc.account_number,
    account_number_link: kyc.account_number_link,
    aadhar_number: kyc.aadhar_number,
    demat_screenshot: kyc.demat_screenshot,
    nominee_name: kyc.nominee_name,
    is_completed_profile: kyc.is_completed_profile,
    is_completed_kyc: kyc.is_completed_kyc,
   }
  allkyc.push(kyc);
})
return res.send({
  data: allkyc
});

  }catch (err) {
    res.send({
      message: err.message,
    })
  }
}

exports.getKYCDetails = async (req, res, next) => {
  try {
    const kycData = await User.findById(req.params.id);
    if (!kycData) {
      return res.send({ error: true, message: "user not found" });
    }
   const kycObj = {
    _id: kycData.id,
    name: kycData.name,
    mobile_number: kycData.mobile_number,
    email_id: kycData.email_id,
    demat_acc_no: kycData.demat_acc_no,
    pan_card_number: kycData.pan_card_number,
    pan_card_link: kycData.pan_card_link,
    account_number: kycData.account_number,
    account_number_link: kycData.account_number_link,
    aadhar_number: kycData.aadhar_number,
    demat_screenshot: kycData.demat_screenshot,
    nominee_name: kycData.nominee_name,
    is_completed_profile: kycData.is_completed_profile,
    is_completed_kyc: kycData.is_completed_kyc,
    is_approved: kycData.is_approved,
   }

   return res.send({
    data: kycObj
  });
  }catch (err) {
    res.send({
      message: err.message,
    })
  }
}


exports.kycStatus = async (req, res, next) => {
  try {
    let id = req.params.id;
    let data = req.body;
    console.log("req body" , data);

    const kycData = await User.findById(id);
    if (!kycData) {
      return res.send({ error: true, message: "user not found" });
    }

    kycData.is_kyc_approved = data.is_kyc_approved ? data.is_kyc_approved : kycData.is_kyc_approved;
    kycData.kyc_feedback = data.kyc_feedback ? data.kyc_feedback : kycData.kyc_feedback;
  
    await kycData.save()
    
   return res.send({
    message: "kyc status updated",
    data: kycData
  });
  }catch (err) {
    res.send({
      message: err.message,
    })
  }
}

exports.completeProfileDetails = async (req, res, next) => {
  try {
    console.log(req.body);
    let data = req.body;

    const result = await User.findOne({
      mobile_number: data.mobile_number,
    });

    if (!result) {
      return res.send({ error: true, message: "user not found" });
    }
    result.gender = data.gender ? data.gender : result.gender;
    result.dob = data.dob ? data.dob : result.dob;
    result.city = data.city ? data.city : result.city;
    result.designation = data.designation
      ? data.designation
      : result.designation;
    result.company_name = data.company_name
      ? data.company_name
      : result.company_name;
    result.income_range = data.income_range
      ? data.income_range
      : result.income_range;
    result.name = data.name ? data.name : result.name;
    result.is_completed_profile = data.is_completed_profile
      ? data.is_completed_profile
      : result.is_completed_profile;

    await result.save();
    res.send({
      message: "user found",
      data: result,
    });
  } catch (err) {
    console.log(err);
    res.send({
      message: err.message,
    });
  }
};

//DELETE
exports.deleteUserById = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.editUserById1 = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const userData = await User.findById(id);
    
    if(!userDate) {
      return res.send({ message: "user not found"});
    }

    userData.name = data.name ? data.name : userData.name;
    userData.email_id = data.email_id ? data.email_id : userData.email_id;
    userData.mobile_number = data.mobile_number ? data.mobile_number : userData.mobile_number;

    //name, email, mobile & password

    await userData.save();
    res.send({
      message: userData
    })
  } catch (err) {
    res.send({
      message: message.err,
    })
  }

}

//Edit admin details 
exports.editUserById = async (req, res, next) => {
  try {
    let data = req.body;
    console.log("edit User", data)
    const userData = await User.findOne({
      mobile_number: data.mobile_number,
    });
    
    if(!userDate) {
      return res.send({ error: true, message: "user not found"});
    }

    userData.name = data.name ? data.name : userData.name;
    userData.email_id = data.email_id ? data.email_id : userData.email_id;
   // userData.mobile_number = data.mobile_number ? data.mobile_number : userData.mobile_number;

    //name, email, mobile & password

    await userData.save();
    res.send({
      message: userData
    })
  } catch (err) {
    res.send({
      message: message.err,
    })
  }

}

exports.editAdminDetails = async (req, res, next) => {
  try {
    console.log(req.body);
    let data = req.body;

    const result = await User.findOne({
      mobile_number: data.mobile_number,
    });
    console.log(result);

    if (!result) {
      return res.send({ error: true, message: "user not found" });
    }
    // if (result.email_id) {
    //   result.email_id = data.email_id ? data.email_id : result.email_id;
    // } else {
    //   result.email_id.value = data.email_id;
    //   console.log('input does not exist');
    // }
    result.email_id = data.email_id ? data.email_id : result.email_id;
    result.name = data.name ? data.name : result.name;
    result.mobile_number = data.mobile_number ? data.mobile_number : result.mobile_number;
   // userData.mobile_number = data.mobile_number ? data.mobile_number : userData.mobile_number;

    // result.demat_acc_no = data.demat_acc_no
    //   ? data.demat_acc_no
    //   : result.demat_acc_no;
    // result.pan_card_number = data.pan_card_number
    //   ? data.pan_card_number
    //   : result.pan_card_link;
 
    await result.save();
    res.send({
      message: "user found",
      data: result,
    });
  } catch (err) {
    console.log(err);
    res.send({
      message: err.message,
    });
  }
};

exports.storeNotification = async (req, res, next) => {
  try{
    let data = req.body;
    // console.log("sotreNotification", data)

    // console.log("user id ", data.userID.id);

    // console.log("message ", data.message);

    for(let i = 0, l = data.userID.length; i < l; i++) {
   
       var obj = data.userID[i];
       var id = obj.id   // user id 
       var message = data.message; // message
      
      console.log(id, message)

      notifyObj = new Notification ({
        id: obj.id,
        message: message
      }); 

      await notifyObj.save()
      console.log(notifyObj);


    

       //var userData = await User.findById(id);
      

      // Since each element is an object (in our example),
      // we can now access the objects properties with `obj.id` and `obj.name`. 
      // We could also use `data.items[i].id`.

  }

  // data.forEach(element => {
  //   Userobj = {
  //     id: element.userID,
  //   }
  //   console.log(Userobj);
  // });

    return res.send({
      data: data
    })

  }catch (err) {
    console.log(err);
    res.send({
      message: err.message,
    });
  }
}

//get all users
exports.getAllNotification = async (req, res, next) => {
  try {
    let result = await Notification.find();
    res.send({
      message: "List of All Notification",
      data: result,
    });
  } catch (err) {
    console.log(err);
    res.send({
      message: err.message,
    });
  }
};