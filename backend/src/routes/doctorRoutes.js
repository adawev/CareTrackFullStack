import express from "express";
import { getDoctors, getSingleDoctor, createDoctor, updateDoctor, deleteDoctor } from "../controllers/doctorController.js";
import { verifyToken, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, getDoctors);
router.get("/:id", verifyToken, getSingleDoctor);
router.post("/", verifyToken, requireRole("admin"), createDoctor);
router.put("/:id", verifyToken, requireRole("admin"), updateDoctor);
router.delete("/:id", verifyToken, requireRole("admin"), deleteDoctor);

export default router;
