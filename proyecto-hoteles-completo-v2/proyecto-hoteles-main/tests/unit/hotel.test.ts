import { describe, expect, it } from '@jest/globals';
import { Hotel } from '../../src/dominio/Hotel';
import { HabitacionSimple, HabitacionDoble } from '../../src/dominio/Habitacion';
import { Cliente } from '../../src/dominio/Cliente';

describe('Hotel Entity - Unit Tests', () => {

  describe('Constructor e inicialización', () => {
    it('crea una instancia de Hotel con id proporcionado', () => {
      const hotel = new Hotel('hotel-1', 'Hotel Central', 'Av. Principal 123', 4);
      expect(hotel).toBeInstanceOf(Hotel);
    });

    it('genera un id automático cuando se pasa null', () => {
      const hotel = new Hotel(null, 'Hotel Auto', 'Calle Falsa 123', 3);
      expect(hotel.getId()).not.toBeNull();
      expect(typeof hotel.getId()).toBe('string');
    });

    it('retorna el nombre correcto', () => {
      const hotel = new Hotel('h1', 'Hotel Paraíso', 'Calle Luna 1', 5);
      expect(hotel.nombre).toBe('Hotel Paraíso');
    });

    it('retorna la dirección correcta', () => {
      const hotel = new Hotel('h1', 'Hotel Sol', 'Av. Arce 100', 3);
      expect(hotel.getDireccion()).toBe('Av. Arce 100');
    });

    it('retorna las estrellas correctas', () => {
      const hotel = new Hotel('h1', 'Hotel Luna', 'Calle 10', 5);
      expect(hotel.getEstrellas()).toBe(5);
    });

    it('inicializa con lista de habitaciones vacía', () => {
      const hotel = new Hotel('h1', 'Hotel Vacío', 'Sin dirección', 1);
      expect(hotel.getHabitaciones()).toHaveLength(0);
    });
  });

  describe('Gestión de habitaciones', () => {
    it('agrega una habitación simple correctamente', () => {
      const hotel = new Hotel('h1', 'Hotel Test', 'Calle A', 3);
      const habitacion = new HabitacionSimple(101, 100);
      hotel.agregarHabitacion(habitacion);
      expect(hotel.getHabitaciones()).toHaveLength(1);
    });

    it('agrega una habitación doble correctamente', () => {
      const hotel = new Hotel('h1', 'Hotel Test', 'Calle A', 3);
      const habitacion = new HabitacionDoble(201, 200);
      hotel.agregarHabitacion(habitacion);
      expect(hotel.getHabitaciones()).toHaveLength(1);
    });

    it('agrega múltiples habitaciones', () => {
      const hotel = new Hotel('h1', 'Hotel Test', 'Calle A', 3);
      hotel.agregarHabitacion(new HabitacionSimple(101, 100));
      hotel.agregarHabitacion(new HabitacionDoble(201, 200));
      hotel.agregarHabitacion(new HabitacionSimple(102, 150));
      expect(hotel.getHabitaciones()).toHaveLength(3);
    });

    it('lanza error al agregar la misma habitación a dos hoteles distintos', () => {
      const hotel1 = new Hotel('h1', 'Hotel A', 'Dir A', 3);
      const hotel2 = new Hotel('h2', 'Hotel B', 'Dir B', 4);
      const habitacion = new HabitacionSimple(101, 100);
      hotel1.agregarHabitacion(habitacion);
      expect(() => hotel2.agregarHabitacion(habitacion)).toThrow();
    });
  });

  describe('filtrarHabitacionesDisponibles', () => {
    it('retorna habitaciones disponibles para las fechas dadas', () => {
      const hotel = new Hotel('h1', 'Hotel Test', 'Dir', 3);
      hotel.agregarHabitacion(new HabitacionSimple(101, 100));
      hotel.agregarHabitacion(new HabitacionDoble(201, 200));

      const fechaInicio = new Date('2025-01-10');
      const fechaFin = new Date('2025-01-15');
      const disponibles = hotel.filtrarHabitacionesDisponibles(1, fechaInicio, fechaFin);
      expect(disponibles).toHaveLength(2);
    });

    it('filtra por capacidad mínima', () => {
      const hotel = new Hotel('h1', 'Hotel Test', 'Dir', 3);
      hotel.agregarHabitacion(new HabitacionSimple(101, 100)); // capacidad 1
      hotel.agregarHabitacion(new HabitacionDoble(201, 200)); // capacidad 2

      const fechaInicio = new Date('2025-02-01');
      const fechaFin = new Date('2025-02-05');
      const disponibles = hotel.filtrarHabitacionesDisponibles(2, fechaInicio, fechaFin);
      expect(disponibles).toHaveLength(1);
      expect(disponibles[0].numero).toBe(201);
    });

    it('no retorna habitaciones ocupadas en las fechas dadas', () => {
      const hotel = new Hotel('h1', 'Hotel Test', 'Dir', 3);
      const habitacion = new HabitacionSimple(101, 100);
      hotel.agregarHabitacion(habitacion);

      const cliente = new Cliente('Juan', 'Pérez', 'juan@test.com');
      const fechaOcupada = new Date('2025-03-01');
      const fechaFin = new Date('2025-03-05');
      habitacion.reservar(cliente, fechaOcupada, fechaFin);

      const disponibles = hotel.filtrarHabitacionesDisponibles(1, new Date('2025-03-02'), new Date('2025-03-04'));
      expect(disponibles).toHaveLength(0);
    });

    it('retorna arreglo vacío si no hay habitaciones', () => {
      const hotel = new Hotel('h1', 'Hotel Vacío', 'Dir', 3);
      const disponibles = hotel.filtrarHabitacionesDisponibles(1, new Date(), new Date());
      expect(disponibles).toHaveLength(0);
    });
  });

  describe('getId', () => {
    it('retorna el id asignado', () => {
      const hotel = new Hotel('mi-id-unico', 'H', 'D', 1);
      expect(hotel.getId()).toBe('mi-id-unico');
    });
  });
});
