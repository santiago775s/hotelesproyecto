import { describe, expect, it } from '@jest/globals';
import { Hotel } from '../../src/dominio/Hotel';
import { CrearHotelUseCase } from '../../src/aplicacion/casosDeUso/crearHotel.use-case';
import { agregarHabitacionSimpleUseCase } from '../../src/aplicacion/casosDeUso/agregarHabitacionSimple.use-case';
import { ObtenerHotelUseCase } from '../../src/aplicacion/casosDeUso/obtenerHotel.use-case';
import { MemoryHotelRepositoryImpl } from '../../src/infraestructura/persistance/hotel.repository.impl';
import { HabitacionSimple } from '../../src/dominio/Habitacion';

describe('Agregar Habitación Simple - Integration', () => {
  it('agrega una habitación simple a un hotel existente', async () => {
    const repo = new MemoryHotelRepositoryImpl();
    const hotel = await new CrearHotelUseCase(repo).execute({
      nombre: 'Hotel Simple Test',
      direccion: 'Av. Bolivia 200',
      estrellas: 3,
    });

    new agregarHabitacionSimpleUseCase().execute(hotel, {
      numeroHabitacion: 101,
      precio: 150,
    });

    expect(hotel.getHabitaciones()).toHaveLength(1);
  });

  it('la habitación simple persiste en el hotel del repositorio', async () => {
    const repo = new MemoryHotelRepositoryImpl();
    const hotel = await new CrearHotelUseCase(repo).execute({
      nombre: 'Hotel Persistencia',
      direccion: 'Calle Norte 10',
      estrellas: 4,
    });

    new agregarHabitacionSimpleUseCase().execute(hotel, {
      numeroHabitacion: 201,
      precio: 200,
    });

    const hotelRecuperado = await new ObtenerHotelUseCase(repo).execute(hotel.getId()!);
    expect(hotelRecuperado.getHabitaciones()).toHaveLength(1);
  });

  it('la habitación simple tiene capacidad de 1', async () => {
    const repo = new MemoryHotelRepositoryImpl();
    const hotel = await new CrearHotelUseCase(repo).execute({
      nombre: 'Hotel Cap Test',
      direccion: 'Calle Sur 5',
      estrellas: 2,
    });

    new agregarHabitacionSimpleUseCase().execute(hotel, {
      numeroHabitacion: 301,
      precio: 80,
    });

    const habitacion = hotel.getHabitaciones()[0];
    expect(habitacion.capacidad).toBe(1);
    expect(habitacion).toBeInstanceOf(HabitacionSimple);
  });

  it('el número y precio de la habitación simple son correctos', async () => {
    const repo = new MemoryHotelRepositoryImpl();
    const hotel = await new CrearHotelUseCase(repo).execute({
      nombre: 'Hotel Datos',
      direccion: 'Av. Este 1',
      estrellas: 3,
    });

    new agregarHabitacionSimpleUseCase().execute(hotel, {
      numeroHabitacion: 401,
      precio: 250,
    });

    const hab = hotel.getHabitaciones()[0];
    expect(hab.numero).toBe(401);
    expect(hab.precioBase).toBe(250);
  });
});
