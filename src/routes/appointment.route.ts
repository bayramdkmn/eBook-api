import express from 'express';
import AppointmentController from '../controllers/appointment.controller';
import { authenticateToken } from '../middlewares/authenticateToken';

const router = express.Router();

router.post('/', authenticateToken, AppointmentController.createAppointment);
router.get('/', authenticateToken, AppointmentController.getAppointmentsForLibraryBook);
router.patch('/cancel/:appointmentId', authenticateToken, AppointmentController.cancelAppointment);
router.get("/past/:userId", authenticateToken,AppointmentController.getUserPastAppointments);
router.get("/upcoming/:userId",authenticateToken, AppointmentController.getUserUpcomingAppointments);
router.get("/cancelled/:userId", authenticateToken,AppointmentController.getUserCancelledAppointments);

export default router;
