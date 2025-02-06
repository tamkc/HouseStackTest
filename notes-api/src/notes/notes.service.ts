import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Note } from './schemas/note.schema';
import { CreateNoteDto, UpdateNoteDto } from './dto/note.dto';

@Injectable()
export class NotesService {
    constructor(@InjectModel(Note.name) private noteModel: Model<Note>) { }

    async create(createNoteDto: CreateNoteDto): Promise<Note> {
        const newNote = new this.noteModel(createNoteDto);
        return newNote.save();
    }

    async findAll(): Promise<Note[]> {
        return this.noteModel.find().sort({ createdAt: -1 }).exec();
    }

    async update(id: string, updateNoteDto: UpdateNoteDto): Promise<Note> {
        const updatedNote = await this.noteModel.findByIdAndUpdate(id, updateNoteDto, { new: true });
        if (!updatedNote) {
            throw new NotFoundException('Note not found');
        }
        return updatedNote;
    }

    async remove(id: string): Promise<void> {
        const result = await this.noteModel.findByIdAndDelete(id);
        if (!result) {
            throw new NotFoundException('Note not found');
        }
    }
}