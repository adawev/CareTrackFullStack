import express from "express";
import { getPatients, getSinglePatient, createPatient, updatePatient, deletePatient } from "../controllers/patientController.js";
import { verifyToken, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, getPatients);
router.get("/:id", verifyToken, getSinglePatient);
router.get("/:id/profile", verifyToken, getSinglePatient);
router.post("/", verifyToken, requireRole("admin", "receptionist"), createPatient);
router.put("/:id", verifyToken, requireRole("admin", "clinician"), updatePatient);
router.delete("/:id", verifyToken, requireRole("admin"), deletePatient);

export default router;
