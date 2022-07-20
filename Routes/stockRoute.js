const {
  availableStock,
  soldStock,
  findall,
  editStock,
  deleteById,
  findById,
} = require("../Controller/stockController.js");
const express = require("express");
const { sellStocks } = require("../Controller/sellStocks.js");
const router = express.Router();

const  cloudinary = require("../Utils/cloudinary.js");
const  upload  = require("../Utils/multer");
const Stock = require("../Model/stockModel");

router.get("/available-stocks", availableStock);
router.get("/sold-out-stocks", soldStock);
router.post("/sell-stock", sellStocks);
router.get("/findall", findall)
//router.put("/:id", editStock)
router.delete("/:id", deleteById)
router.get("/:id", findById)


router.post('/create', upload.single("image"), async (req, res) => {
  try{
    console.log(req.body)
    const icon = await cloudinary.uploader.upload(req.file.path)
    console.log(req.file)
    console.log(req.body)
    let nStock = new Stock({
      stock_name: req.body.stock_name,
      stock_icon: icon.secure_url,  //image
      cloudinary_id: icon.cloudinary_id, 
      stock_sp_id: req.body.stock_sp_id,
      available_on: req.body.available_on,
      companyType: req.body.companyType,
      face_value: req.body.face_value,
      price_per_lot: req.body.price_per_lot,  
      share_per_lot: req.body.share_per_lot,
      discription: req.body.discription,
      stock_status: req.body.stock_status,
    })
    let savedShare =  await Stock.create(nStock);

    res.send({
      message: "Stock successfully created",
      data: savedShare,
    });
  }catch (err ){
    res.send({
      message: err.message,
    });
  }
});


router.post('/edit', async (req, res) => {
  try{
    //let id = req.params.id;
    //console.log(id)
     let data = req.body;
     console.log(data);
     console.log(req.body.stock_name);
     //const stockData = await Stock.findById(req.params.id);

    // if (!stockData) {
    //   return res.send({ error: true, message: "Stock not found" });
    // }
   // res.send(stockData);
    // stockData.stock_name = data.stock_name ? data.stock_name : stockData.stock_name;
    // // stockData.stock_location = data.stock_location ? data.stock_location : stockData.stock_location;
    // stockData.stock_status = data.stock_status ? data.stock_status : stockData.stock_status;
    // stockData.face_value = data.face_value ? data.face_value : stockData.face_value;
    // stockData.price_per_lot = data.price_per_lot ? data.price_per_lot : stockData.price_per_lot;
    // stockData.stock_previous_price = data.stock_previous_price ? data.stock_previous_price : stockData.stock_previous_price;
    // stockData.stamp_duty = data.stamp_duty ? data.stamp_duty : stockData.stamp_duty;
    // stockData.transaction_fee = data.transaction_fee ? data.transaction_fee : stockData.transaction_fee;
    // stockData.available_on = data.available_on ? data.available_on : stockData.available_on;
    // stockData.share_per_lot = data.share_per_lot ? data.share_per_lot : stockData.share_per_lot;

    // const icon = await cloudinary.uploader.upload(req.file.path)
    
    // let nStock = new Stock({
    //   stock_name: req.body.stock_name,
    //   stock_icon: icon.secure_url,  //image
    //   cloudinary_id: icon.cloudinary_id, 
    //   stock_sp_id: req.body.stock_sp_id,
    //   available_on: req.body.available_on,
    //   companyType: req.body.companyType,
    //   face_value: req.body.face_value,
    //   price_per_lot: req.body.price_per_lot,  
    //   share_per_lot: req.body.share_per_lot,
    //   discription: req.body.discription,
    //   stock_status: req.body.stock_status,
    // })
    // let savedShare =  await Stock.create(nStock);

    //await stockData.save();

    // res.send({
    //   message: "Stock successfully updated",
    //   data: savedShare,
    // });
  }catch (err ){
    res.send({
      message: err.message,
    });
  }
});


module.exports = router;
