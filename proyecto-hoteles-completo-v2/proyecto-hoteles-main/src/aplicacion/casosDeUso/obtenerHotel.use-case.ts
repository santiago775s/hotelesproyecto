import { IHotelRepository } from "../ports/IHotelRepository";

export class ObtenerHotelUseCase {
    constructor(private hotelRepository: IHotelRepository){}
    execute(id:string) {
        const hotel = this.hotelRepository.obtenerHotel(id);
        return hotel;
    }
}