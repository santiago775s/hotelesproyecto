import { Client } from "pg";

import { IHotelRepository } from "../../aplicacion/ports/IHotelRepository";
import { Hotel } from "../../dominio/Hotel";
import { DatabaseNotFoundException } from "../exceptions/DatabaseNotFoudException";

export type PgRepositoryConnectionOptions = {
  user: string;
  password: string;
  host: string;
  port: number;
  database: string;
};

export class PgHotelRepositoryImpl implements IHotelRepository {
  private pgClient: Client|undefined = undefined;

  public async closeConection(){
    await this.pgClient?.end()
  }

  constructor(data: PgRepositoryConnectionOptions) {
    this.initRepository(data);
  }

  private async initRepository(connectionData: PgRepositoryConnectionOptions) {
    this.pgClient = await new Client({
      ...connectionData,
    }).connect();
  }

  async crearHotel(hotel: Hotel): Promise<Hotel> {
    if(!this.pgClient) throw new Error('No se pudo conectar a la base de datos')

    await this.pgClient.query(`INSERT INTO hoteles (id, nombre, direccion, estrellas) 
VALUES ($1, $2, $3, $4);`,[hotel.getId(), hotel.nombre, hotel.getDireccion(), hotel.getEstrellas()]);
    return hotel;
  }

  async obtenerHotel(id: string): Promise<Hotel> {
    if(!this.pgClient) throw new Error('No se pudo conectar a la base de datos')
    const result = await this.pgClient.query(
      `SELECT * FROM hoteles 
WHERE id = $1;`,
      [id],
    );
    console.log(result.rows[0]);
    if(result.rows[0]){
        throw new Error('No existe el hotel')
    }

    return this.mapQueryResultToEntity(result.rows[0]);
  }

  async listHoteles(): Promise<Hotel[]> {
    if(!this.pgClient) throw new Error('No se pudo conectar a la base de datos')
    const result = await this.pgClient.query(
      `SELECT * FROM hoteles`
    );
    console.log(result.rows);

    return result.rows.map(el => this.mapQueryResultToEntity(el));
  }

  private mapQueryResultToEntity(data: any) {
    return new Hotel(
      data.id,
      data.nombre,
      data.dirreccion,
      data.estrellas,
    )
  }
}
