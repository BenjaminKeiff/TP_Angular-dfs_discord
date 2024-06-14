import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { UtilisateurService } from './utilisateur.service';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from 'src/auth.guard';
import { Utilisateur } from 'src/utilisateur/utilisateur.schema';

@Controller()
export class UtilisateurController {
  constructor(
    private readonly utilisateurService: UtilisateurService,
    private readonly jwtService: JwtService,
  ) {}
  @Get(':email')
  async findByEmail(@Param('email') email: string): Promise<Utilisateur> {
    return await this.utilisateurService.getByEmail(email);
  }

  @Post('inscription')
  async inscription(@Body() createUtilisateurDto: any) {
    //TODO : vérifier les donnée (regles mot de passe, email unique ...)

    return this.utilisateurService.create(createUtilisateurDto);
  }

  @Post('login')
  async create(@Body() utilisateurDto: any) {
    const utilisateur =
      await this.utilisateurService.getByEmailAndClearPassword(
        utilisateurDto.email,
        utilisateurDto.password,
      );

    const payload = {
      sub: utilisateur.email,
    };

    return await this.jwtService.signAsync(payload);
  }

  @Post('rejoindre-serveur')
  @UseGuards(AuthGuard)
  async rejoindreServeur(
    @Body() serveurArejoindreDto: any,
    @Request() requete,
  ) {
    const email = requete.user.sub;

    return this.utilisateurService.rejoindreServeur(
      email,
      serveurArejoindreDto._id,
    );
  }
}
