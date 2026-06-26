import { describe, expect, it } from '@jest/globals';
import { Hotel } from '../../src/dominio/Hotel';
import { CrearHotelUseCase } from '../../src/aplicacion/casosDeUso/crearHotel.use-case';
import { ObtenerHotelUseCase } from '../../src/aplicacion/casosDeUso/obtenerHotel.use-case';
import { agregarHabitacionSimpleUseCase } from '../../src/aplicacion/casosDeUso/agregarHabitacionSimple.use-case';
import { agregarHabitacionDobleUseCase } from '../../src/aplicacion/casosDeUso/agregarHabitacionDoble.use-case';
import { MemoryHotelRepositoryImpl } from '../../src/infraestructura/persistance/hotel.repository.impl';

describe('Obtener Hotel - Integration', () => {
  it('recupera un hotel existente por su ID', async () => {
    const repo = new MemoryHotelRepositoryImpl();
    const hotel = await new CrearHotelUseCase(repo).execute({
      nombre: 'Hotel Obtener Test',
      direccion: 'Av. Arce 500',
      estrellas: 3,
    });

    const hotelRecuperado = await new ObtenerHotelUseCase(repo).execute(hotel.getId()!);
    expect(hotelRecuperado).toBeInstanceOf(Hotel);
  });

  it('los datos del hotel recuperado son correctos', async () => {
    const repo = new MemoryHotelRepositoryImpl();
    const hotel = await new CrearHotelUseCase(repo).execute({
      nombre: 'Hotel Correcto',
      direccion: 'Calle 6 de Agosto 100',
      estrellas: 5,
    });

    const hotelRecuperado = await new ObtenerHotelUseCase(repo).execute(hotel.getId()!);
    expect(hotelRecuperado.nombre).toBe('Hotel Correcto');
    expect(hotelRecuperado.getDireccion()).toBe('Calle 6 de Agosto 100');
    expect(hotelRecuperado.getEstrellas()).toBe(5);
  });

  it('recupera el hotel con todas sus habitaciones asociadas', async () => {
    const repo = new MemoryHotelRepositoryImpl();
    const hotel = await new CrearHotelUseCase(repo).execute({
      nombre: 'Hotel Con Habitaciones',
      direccion: 'Av. Montes 250',
      estrellas: 4,
    });

    new agregarHabitacionSimpleUseCase().execute(hotel, { numeroHabitacion: 101, precio: 100 });
    new agregarHabitacionDobleUseCase().execute(hotel, { numeroHabitacion: 201, precio: 200 });

    const hotelRecuperado = await new ObtenerHotelUseCase(repo).execute(hotel.getId()!);
    expect(hotelRecuperado.getHabitaciones()).toHaveLength(2);
  });

  it('lanza error al intentar obtener un hotel con ID inexistente', async () => {
    const repo = new MemoryHotelRepositoryImpl();
    let error: unknown;
    try {
      await new ObtenerHotelUseCase(repo).execute('id-inexistente');
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
  });
});
