import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotesModule } from './notes/notes.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/notes_db'), // Replace with your MongoDB connection
    NotesModule,
  ],
})
export class AppModule {}