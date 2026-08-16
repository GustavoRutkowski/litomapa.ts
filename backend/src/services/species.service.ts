import type Specie from '../models/species.model.js';
import SpeciesRepository, {
    SpeciesFindAllQueryParams
} from '../repositories/species.repository.js';

export default class SpeciesService {
    static async findAll(params: SpeciesFindAllQueryParams = {}): Promise<Specie[]> {
        return await SpeciesRepository.findAll(params);
    }
}
