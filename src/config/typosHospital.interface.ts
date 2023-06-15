import { User } from '../auth/entities/user.entity';
import { Medico } from '../medicos/entities/medico.entity';
import { Hospital } from '../hospital/entities/hospital.entity';

export type CaseHospital = User | Medico | Hospital;
