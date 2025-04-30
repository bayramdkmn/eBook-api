import express from 'express';
import AppointmentController from '../controllers/appointment.controller';
import { authenticateToken } from '../middlewares/authenticateToken';

const router = express.Router();

router.post('/', authenticateToken, AppointmentController.createAppointment);
router.get('/', authenticateToken, AppointmentController.getAppointmentsForLibraryBook);
router.put('/cancel/:appointmentId', AppointmentController.cancelAppointment);

export default router;
