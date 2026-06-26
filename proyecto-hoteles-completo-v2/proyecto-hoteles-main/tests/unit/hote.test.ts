

import {describe, expect, it} from '@jest/globals';
import { Hotel } from '../../src/dominio/Hotel';


describe('Hotel Entity', () => {
    
    it('returns Hotel instance for correct data', () => {
        expect(new Hotel(
            'hotel-1',
            'Hotel 1',
            'direccion de hotel 1',
            4
        )).toBeInstanceOf(Hotel);
        // test de error
    });
});
