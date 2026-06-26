import { describe, expect, it } from '@jest/globals';
import { Hotel } from '../../src/dominio/Hotel';
import { CrearHotelUseCase } from '../../src/aplicacion/casosDeUso/crearHotel.use-case';
import { agregarHabitacionDobleUseCase } from '../../src/aplicacion/casosDeUso/agregarHabitacionDoble.use-case';
import { ObtenerHotelUseCase } from '../../src/aplicacion/casosDeUso/obtenerHotel.use-case';
import { MemoryHotelRepositoryImpl } from '../../src/infraestructura/persistance/hotel.repository.impl';
import { HabitacionDoble } from '../../src/dominio/Habitacion';

describe('Agregar Habitación Doble - Integration', () => {
  it('agrega una habitación doble a un hotel existente', async () => {
    const repo = new MemoryHotelRepositoryImpl();
    const hotel = await new CrearHotelUseCase(repo).execute({
      nombre: 'Hotel Doble Test',
      direccion: 'Av. Bolivia 300',
      estrellas: 4,
    });

    new agregarHabitacionDobleUseCase().execute(hotel, {
      numeroHabitacion: 101,
      precio: 300,
    });

    expect(hotel.getHabitaciones()).toHaveLength(1);
  });

  it('la habitación doble persiste en el hotel del repositorio', async () => {
    const repo = new MemoryHotelRepositoryImpl();
    const hotel = await new CrearHotelUseCase(repo).execute({
      nombre: 'Hotel Doble Persistencia',
      direccion: 'Calle Oeste 20',
      estrellas: 5,
    });

    new agregarHabitacionDobleUseCase().execute(hotel, {
      numeroHabitacion: 202,
      precio: 400,
    });

    const hotelRecuperado = await new ObtenerHotelUseCase(repo).execute(hotel.getId()!);
    expect(hotelRecuperado.getHabitaciones()).toHaveLength(1);
  });

  it('la habitación doble tiene capacidad de 2', async () => {
    const repo = new MemoryHotelRepositoryImpl();
    const hotel = await new CrearHotelUseCase(repo).execute({
      nombre: 'Hotel Cap Doble',
      direccion: 'Calle Norte 15',
      estrellas: 3,
    });

    new agregarHabitacionDobleUseCase().execute(hotel, {
      numeroHabitacion: 303,
      precio: 350,
    });

    const habitacion = hotel.getHabitaciones()[0];
    expect(habitacion.capacidad).toBe(2);
    expect(habitacion).toBeInstanceOf(HabitacionDoble);
  });

  it('la habitación doble tiene mayor capacidad que la simple', async () => {
    const repo = new MemoryHotelRepositoryImpl();
    const { agregarHabitacionSimpleUseCase } = await import('../../src/aplicacion/casosDeUso/agregarHabitacionSimple.use-case');
    const hotel = await new CrearHotelUseCase(repo).execute({
      nombre: 'Hotel Comparativo',
      direccion: 'Av. Central 50',
      estrellas: 4,
    });

    new agregarHabitacionSimpleUseCase().execute(hotel, { numeroHabitacion: 101, precio: 100 });
    new agregarHabitacionDobleUseCase().execute(hotel, { numeroHabitacion: 201, precio: 200 });

    const habitaciones = hotel.getHabitaciones();
    const simple = habitaciones.find(h => h.numero === 101)!;
    const doble = habitaciones.find(h => h.numero === 201)!;

    expect(doble.capacidad).toBeGreaterThan(simple.capacidad);
  });
});
