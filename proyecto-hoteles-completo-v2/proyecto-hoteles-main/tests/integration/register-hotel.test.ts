
import {describe, expect, it} from '@jest/globals';
import { Hotel } from '../../src/dominio/Hotel';
import { CrearHotelUseCase } from '../../src/aplicacion/casosDeUso/crearHotel.use-case';
import { MemoryHotelRepositoryImpl } from '../../src/infraestructura/persistance/hotel.repository.impl';


describe('Hotel create use-case', () => {
    it('returns Hotel instance for correct data', () => {
        const hotelRepositoryImpl = new MemoryHotelRepositoryImpl();
        const createHotelUseCase = new CrearHotelUseCase(hotelRepositoryImpl);

        expect(createHotelUseCase.execute({
            nombre: 'Hotel 2',
            direccion: 'direccion de hotel 2',
            estrellas: 3.5
        })).toBeInstanceOf(Hotel);
        // test de error
    });
});