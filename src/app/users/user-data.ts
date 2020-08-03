import { InMemoryDbService } from 'angular-in-memory-web-api';

import { User } from './user';

export class UserData implements InMemoryDbService {

    createDb() {
        const users: User[] = [
            {
                id: 1,
                userName: 'sakbar',
                position: 'developer',
                description: 'Full Stack',
                rating: 3.2
            },
            {
                id: 2,
                userName: 'sakbar1',
                position: 'engineer',
                description: 'Electrical',
                rating: 5.2
            },
            {
                id: 3,
                userName: 'sakbar3',
                position: 'engineer',
                description: 'Electrical',
                rating: 5.2
            },
            
        ];
        return { users };
    }
}
