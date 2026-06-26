import { IHotelRepository } from "../../aplicacion/ports/IHotelRepository";
import { Hotel } from "../../dominio/Hotel";
import { DatabaseNotFoundException } from "../exceptions/DatabaseNotFoudException";

export class MemoryHotelRepositoryImpl implements IHotelRepository {
    public readonly hoteles: Hotel[];

    constructor() {
        this.hoteles = [];
    }

    crearHotel(hotel: Hotel): Promise<Hotel> {
        this.hoteles.push(hotel);
        return Promise.resolve(hotel);
    }

    obtenerHotel(id: string): Promise<Hotel> {
        const hotel = this.hoteles.find(el => el.getId() === id );
        if(hotel === undefined)
            throw new DatabaseNotFoundException('Hotel no encontrado')
        return Promise.resolve(hotel);  
    }

    listHoteles(): Promise<Hotel[]> {
        return Promise.resolve(this.hoteles)
    }
}