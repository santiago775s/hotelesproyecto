import { describe, expect, it } from '@jest/globals';
import request from 'supertest';
import { MemoryHotelRepositoryImpl } from '../../src/infraestructura/persistance/hotel.repository.impl';
import { createApp } from '../../src';

describe('Hotel app-rest e2e', () => {
  const repo = new MemoryHotelRepositoryImpl();
  const app = createApp(repo);

  it('Create hotel or errors /hotel', async () => {
    const res = await request(app).post('/hotel').send({
      nombre: 'UCB - HOTEL 2',
      direccion: 'España',
      estrellas: 3,
    });
    expect(res.status).toBe(200);
  });

  describe('Agregar Habitación Simple (E2E)', () => {
    it('POST /hotel/:id/habitacion-simple retorna 200 y mensaje de éxito', async () => {
      await request(app).post('/hotel').send({
        nombre: 'Hotel Simple E2E',
        direccion: 'Av. Test 1',
        estrellas: 3,
      });

      const hotelId = repo.hoteles[repo.hoteles.length - 1].getId()!;

      const res = await request(app)
        .post(`/hotel/${hotelId}/habitacion-simple`)
        .send({ numeroHabitacion: 101, precio: 150 });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('mensaje');
      expect(res.body.mensaje).toContain('simple');
    });

    it('la habitación simple queda disponible en GET /hotel/:id', async () => {
      await request(app).post('/hotel').send({
        nombre: 'Hotel Consulta Simple',
        direccion: 'Calle B',
        estrellas: 4,
      });

      const hotelId = repo.hoteles[repo.hoteles.length - 1].getId()!;

      await request(app)
        .post(`/hotel/${hotelId}/habitacion-simple`)
        .send({ numeroHabitacion: 201, precio: 200 });

      const resGet = await request(app).get(`/hotel/${hotelId}`);
      expect(resGet.status).toBe(200);
      const habitaciones = resGet.body.habitaciones ?? resGet.body._habitaciones ?? [];
      expect(habitaciones.length).toBeGreaterThanOrEqual(1);
    });

    it('retorna error al agregar habitación simple con ID de hotel inválido', async () => {
      const res = await request(app)
        .post('/hotel/id-invalido/habitacion-simple')
        .send({ numeroHabitacion: 999, precio: 100 });

      expect([404, 406, 500]).toContain(res.status);
    });
  });

  describe('Agregar Habitación Doble (E2E)', () => {
    it('POST /hotel/:id/habitacion-doble retorna 200 y mensaje de éxito', async () => {
      await request(app).post('/hotel').send({
        nombre: 'Hotel Doble E2E',
        direccion: 'Av. Test 2',
        estrellas: 4,
      });

      const hotelId = repo.hoteles[repo.hoteles.length - 1].getId()!;

      const res = await request(app)
        .post(`/hotel/${hotelId}/habitacion-doble`)
        .send({ numeroHabitacion: 301, precio: 350 });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('mensaje');
      expect(res.body.mensaje).toContain('doble');
    });

    it('la habitación doble queda disponible en GET /hotel/:id', async () => {
      await request(app).post('/hotel').send({
        nombre: 'Hotel Consulta Doble',
        direccion: 'Calle C',
        estrellas: 5,
      });

      const hotelId = repo.hoteles[repo.hoteles.length - 1].getId()!;

      await request(app)
        .post(`/hotel/${hotelId}/habitacion-doble`)
        .send({ numeroHabitacion: 401, precio: 450 });

      const resGet = await request(app).get(`/hotel/${hotelId}`);
      expect(resGet.status).toBe(200);
      const habitaciones = resGet.body.habitaciones ?? resGet.body._habitaciones ?? [];
      expect(habitaciones.length).toBeGreaterThanOrEqual(1);
    });

    it('la habitación doble se diferencia de la simple por capacidad en el hotel', async () => {
      await request(app).post('/hotel').send({
        nombre: 'Hotel Mix E2E',
        direccion: 'Av. Comparativa 10',
        estrellas: 3,
      });

      const hotelId = repo.hoteles[repo.hoteles.length - 1].getId()!;

      await request(app)
        .post(`/hotel/${hotelId}/habitacion-simple`)
        .send({ numeroHabitacion: 501, precio: 100 });

      await request(app)
        .post(`/hotel/${hotelId}/habitacion-doble`)
        .send({ numeroHabitacion: 601, precio: 200 });

      const resGet = await request(app).get(`/hotel/${hotelId}`);
      expect(resGet.status).toBe(200);
      const habitaciones = resGet.body.habitaciones ?? resGet.body._habitaciones ?? [];
      expect(habitaciones.length).toBeGreaterThanOrEqual(2);

      const simple = habitaciones.find((h: any) => (h.numero ?? h._numero) === 501);
      const doble = habitaciones.find((h: any) => (h.numero ?? h._numero) === 601);
      if (simple && doble) {
        const capSimple = simple.capacidad ?? simple._capacidad;
        const capDoble = doble.capacidad ?? doble._capacidad;
        expect(capDoble).toBeGreaterThan(capSimple);
      }
    });

    it('retorna error al agregar habitación doble con ID de hotel inválido', async () => {
      const res = await request(app)
        .post('/hotel/id-invalido/habitacion-doble')
        .send({ numeroHabitacion: 999, precio: 300 });

      expect([404, 406, 500]).toContain(res.status);
    });
  });
});
