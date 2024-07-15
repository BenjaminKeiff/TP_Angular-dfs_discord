import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth.guard';
import { Serveur } from 'src/serveur/serveur.schema';
import { ServeurService } from './serveur.service';

@Controller('serveur')
export class ServeurController {
  constructor(private readonly serveurService: ServeurService) {}

  @Get()
  @UseGuards(AuthGuard)
  findAll(@Request() requete) {
    console.log(requete.user.sub);

    return this.serveurService.findAllPublic();
  }

  @Get('/possede')
  @UseGuards(AuthGuard)
  findAllServerOfUser(@Request() requete) {
    return this.serveurService.findAllServerOfUser(requete.user.sub);
  }

  @Get('/:id')
  findServer(@Param('id') id: string) {
    console.log(id, 'controller');
    return this.serveurService.findServer(id);
  }

  @Post()
  async create(@Body() createServeurDto: any) {
    return this.serveurService.create(createServeurDto);
  }

  @Put('/ajout-salon/:id')
  async addSalonToServer(
    @Param('id') id: string,
    @Body() createSalonDto: any,
  ): Promise<Serveur> {
    return this.serveurService.addSalonToServer(id, createSalonDto);
  }

  @Put('/salon/:id/message')
  async addMessageToSalon(
    @Param('id') id: string,
    @Body() createSalonDto: any,
  ): Promise<Serveur> {
    return this.serveurService.addMessageToSalon(id, createSalonDto);
  }
}
