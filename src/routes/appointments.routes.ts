/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-shadow */
import { getCustomRepository } from 'typeorm';
import { request, response, Router } from 'express';
import { parseISO } from 'date-fns';
import Appointment from '../models/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';
import CreateAppointmentService from '../services/CreateAppointmentService';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const appointmentsRouter = Router();
appointmentsRouter.use(ensureAuthenticated);

// Rota: Deve apenas receber uma requisição, chmar outro arquivo,
// e enviar uma resposta. (SoC)
appointmentsRouter.get('/', async (request, response) => {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);
    const appointments = await appointmentsRepository.find();
    return response.json(appointments);
});

appointmentsRouter.post('/', async (request, response) => {
    const { provider_id, date } = request.body;
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);

    const parsedDate = parseISO(date);
    const createAppointment = new CreateAppointmentService();
    const appointment = await createAppointment.execute({
        provider_id,
        date: parsedDate,
    });

    return response.json(appointment);
});
export default appointmentsRouter;
