import { EntityRepository, Repository } from 'typeorm';
//  Importação de classes do desenvolvedor
import Appointment from '../models/Appointment';

/** *************************************************************** *
 *  Todo repositorio é uma classe responsável por criar, listar,    *
 *  excluir ou alterar um repositório. Retiramos responsabilidades  *
 *  da rota, deixando ela mais enxuta.                              *
 ****************************************************************** */
// DTO = Data Transfer Object: parametros nomeados
@EntityRepository(Appointment)
class AppointmentsRepository extends Repository<Appointment> {
    public async findByDate(date: Date): Promise<Appointment | null> {
        const findAppointment = await this.findOne({
            where: { date },
        });
        return findAppointment || null;
    }
}

export default AppointmentsRepository;
