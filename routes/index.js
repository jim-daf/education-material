const express=require("express")
const router=express.Router();

const {ensureAuthenticated, ensureEmailVerified}=require("../config/auth")
const {alreadyLoggedIn,checkifAdmin}=require("../config/auth")

// Welcome Page
router.get("/",alreadyLoggedIn,(req,res)=>{
    res.render("dashboard")
    
})
// Not logged in Dashboard Page
router.get("/dashboard",alreadyLoggedIn,(req,res)=>res.render("dashboard"))

// Already logged in Dashboard Page
router.get("/dashboard_loggedIn",ensureEmailVerified,(req,res)=>res.render("dashboard_loggedIn"))

// Admin Panel
router.get("/adminPanel",checkifAdmin,(req,res)=>res.render("adminPanel"))

module.exports=router;