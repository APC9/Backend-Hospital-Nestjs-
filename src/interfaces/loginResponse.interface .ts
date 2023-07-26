import { Menu } from 'src/auth/auth.service';
import { User } from '../auth/entities/user.entity';

export interface LoginResponse {
    user: User;
    token: string;
    menu: Menu[]
}