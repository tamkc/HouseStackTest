import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto, UpdateNoteDto } from './dto/note.dto';

@Controller('notes')
export class NotesController {
    constructor(private readonly notesService: NotesService) { }

    @Post()
    create(@Body() createNoteDto: CreateNoteDto) {
        return this.notesService.create(createNoteDto);
    }

    @Get()
    findAll() {
        return this.notesService.findAll();
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateNoteDto: UpdateNoteDto) {
        return this.notesService.update(id, updateNoteDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.notesService.remove(id);
    }
}