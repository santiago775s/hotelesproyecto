import express from "express";
import { CrearHotelUseCase } from "../../aplicacion/casosDeUso/crearHotel.use-case";
import { ObtenerHotelUseCase } from "../../aplicacion/casosDeUso/obtenerHotel.use-case";
import { agregarHabitacionSimpleUseCase } from "../../aplicacion/casosDeUso/agregarHabitacionSimple.use-case";
import { agregarHabitacionDobleUseCase } from "../../aplicacion/casosDeUso/agregarHabitacionDoble.use-case";
import {
  ExceptionHandler,
  IHttpResponse,
} from "../middlewares/ExceptionHandler";
import { Hotel } from "../../dominio/Hotel";
import { IdParamvalidator } from "../validations/id-param.validator";
import { IHotelRepository } from "../../aplicacion/ports/IHotelRepository";
import { renderHotelListTemplate } from "../templates/hoteles-list.template";
import { HabitacionesMapper } from "../mappers/habitaciones.mapper";

export function initializeController(
  app: express.Express,
  hotelRepository: IHotelRepository,
) {
  /**
   * @swagger
   * /hotel:
   *   post:
   *     summary: Crear un nuevo hotel
   *     description: Crea un nuevo hotel con los datos proporcionados y lo almacena en memoria
   *     tags:
   *       - Hoteles
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - nombre
   *               - direccion
   *               - estrellas
   *             properties:
   *               nombre:
   *                 type: string
   *                 example: Hotel Grand Palace
   *                 description: Nombre del hotel
   *               direccion:
   *                 type: string
   *                 example: Calle Principal 123, Ciudad
   *                 description: Dirección del hotel
   *               estrellas:
   *                 type: number
   *                 example: 5
   *                 description: Clasificación de estrellas (1-5)
   *     responses:
   *       200:
   *         description: Hotel creado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Hotel'
   *       400:
   *         description: Error en la validación o procesamiento
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  app.post("/hotel", async (req: express.Request, res: express.Response) => {
    const respHotel = await (new CrearHotelUseCase(hotelRepository).execute(
      req.body,
    ));

    // console.log('Estado de los Hoteles:', memoriHotelRepository.hoteles)

    res.status(200).json(respHotel);
  });

  app.get("/hotel", async (req: express.Request, res: express.Response) => {
    // console.log('Estado de los Hoteles:', memoriHotelRepository.hoteles)

    res.send(renderHotelListTemplate(await hotelRepository.listHoteles()));
  });

  app.get("/hotel/list", async (req: express.Request, res: express.Response) => {
    // console.log('Estado de los Hoteles:', memoriHotelRepository.hoteles)

    res
      .json({
        data: (await hotelRepository.listHoteles()).map((hotel) => ({
          id: hotel.getId(),
          nombre: hotel.nombre,
          direccion: hotel.getDireccion(),
          estrellas: hotel.getEstrellas(),
          habitaciones: hotel.getHabitaciones().map(el => HabitacionesMapper.map(el))
        })),    
      })
      .status(200);
  });

  /**
   * @swagger
   * /hotel/{id}:
   *   get:
   *     summary: Obtener hotel por ID
   *     description: Obtiene los detalles de un hotel específico utilizando su ID
   *     tags:
   *       - Hoteles
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID único del hotel
   *         example: uuid-1234-5678
   *     responses:
   *       200:
   *         description: Hotel encontrado
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Hotel'
   *       400:
   *         description: ID inválido o error de validación
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       404:
   *         description: Hotel no encontrado
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  // GET /hotel/{id}
  app.get("/hotel/:id", async (req: express.Request, res: express.Response, next) => {
    const params = req.params as { id: string };
    let respError: IHttpResponse | undefined = undefined;
    let hotelData: Hotel | undefined = undefined;
    try {
      // validacion
      IdParamvalidator.validate(params.id);
      hotelData = (await new ObtenerHotelUseCase(hotelRepository).execute(
        params.id,
      ));
    } catch (err) {
      respError = ExceptionHandler.handle(err as Error);
    } finally {
      if (respError !== undefined) {
        return res.status(respError.status).json({
          message: respError.message,
          error: respError.error,
        });
      } else {
        console.log("Hotel encontrado:", hotelData);
        res.status(200).json(JSON.parse(JSON.stringify(hotelData)));
      }
    }
  });

  /**
   * @swagger
   * /hotel/{id}/habitacion-simple:
   *   post:
   *     summary: Agregar habitación simple a un hotel
   *     description: Agrega una nueva habitación simple a un hotel existente
   *     tags:
   *       - Habitaciones
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID único del hotel
   *         example: uuid-1234-5678
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/HabitacionSimple'
   *     responses:
   *       200:
   *         description: Habitación simple agregada exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 mensaje:
   *                   type: string
   *                   example: Habitación simple agregada exitosamente
   *       400:
   *         description: Error en la validación o procesamiento
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       404:
   *         description: Hotel no encontrado
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  app.post(
    "/hotel/:id/habitacion-simple",
    async (req: express.Request, res: express.Response) => {
      const params = req.params as { id: string };
      const body = req.body as { numeroHabitacion: number; precio: number };
      let respError: IHttpResponse | undefined = undefined;

      try {
        // Validación del ID
        IdParamvalidator.validate(params.id);

        // Obtener el hotel
        const hotel = await new ObtenerHotelUseCase(hotelRepository).execute(
          params.id,
        );

        // Agregar la habitación simple
        new agregarHabitacionSimpleUseCase().execute(hotel, body);

        console.log("Habitación simple agregada al hotel:", params.id);
        res
          .status(200)
          .json({ mensaje: "Habitación simple agregada exitosamente" });
      } catch (err) {
        respError = ExceptionHandler.handle(err as Error);
        return res.status(respError.status).json({
          message: respError.message,
          error: respError.error,
        });
      }
    },
  );

  // POST /hotel/{id}/habitacion-doble
  app.post(
    "/hotel/:id/habitacion-doble",
    async (req: express.Request, res: express.Response) => {
      const params = req.params as { id: string };
      const body = req.body as { numeroHabitacion: number; precio: number };
      let respError: IHttpResponse | undefined = undefined;

      try {
        IdParamvalidator.validate(params.id);

        const hotel = await new ObtenerHotelUseCase(hotelRepository).execute(
          params.id,
        );

        new agregarHabitacionDobleUseCase().execute(hotel, body);

        res
          .status(200)
          .json({ mensaje: "Habitación doble agregada exitosamente" });
      } catch (err) {
        respError = ExceptionHandler.handle(err as Error);
        return res.status(respError.status).json({
          message: respError.message,
          error: respError.error,
        });
      }
    },
  );

  // CRUD
  /*
        C.- create
        U.- Update
        R.- Read
        D.- Delete
    */
}
