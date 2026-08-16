import type Tag from '../models/tags.model.js';
import TagRepository from '../repositories/tags.repository.js';

export default class TagService {
    static async findAll(): Promise<Tag[]> {
        return await TagRepository.findAll();
    }
}
