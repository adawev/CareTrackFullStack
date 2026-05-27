import express from "express";
import { getDiseases, getSingleDisease, createDisease, updateDisease, deleteDisease } from "../controllers/diseaseController.js";
import { verifyToken, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, getDiseases);
router.get("/:id", verifyToken, getSingleDisease);
router.post("/", verifyToken, requireRole("admin"), createDisease);
router.put("/:id", verifyToken, requireRole("admin", "clinician"), updateDisease);
router.delete("/:id", verifyToken, requireRole("admin"), deleteDisease);

export default router;
