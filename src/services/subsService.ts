import { SubsResponseFromApi, Sub } from '../types';

export const fetchSubs = (): Promise<SubsResponseFromApi> => {
    return fetch('http://localhost:9000/api/Users')
        .then(response => response.json());
};

export const mapFromApiToSubs = (apiResponse: SubsResponseFromApi): Sub[] => {
    return apiResponse.map(subFromApi => {
        const {
            name: nick,
            age: edad,
            email: correo
        } = subFromApi;
        return {
            nick,
            edad,
            correo
        };
    });
};