import { GestionStorageService } from './../../services/gestion-storage.service';
import { HttpClient } from '@angular/common/http';
import { GestionNoticiasLeerService } from './../../services/gestion-noticias-leer.service';
import { RespuestaNoticias, Article } from './../../interfaces/interfaces';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  // Creo e inicializo un array vacío
  listaNoticias: Article[] = [];
  respuesta: Observable<RespuestaNoticias> = {} as Observable<RespuestaNoticias>;

  constructor(private leerFichero: HttpClient, public gestionNoticiasLeer: GestionNoticiasLeerService, public gestionAlmacen: GestionStorageService) {
    
    this.cargarFichero(); 

    // Añadimos al almacenamiento local
   let datosPromesa : Promise <Article[]> = this.gestionAlmacen.getObject("Noticias");
   datosPromesa.then(datos => {
  this.listaNoticias.push(...datos);
  });
    
     
  
   
  }

  // Cuando cambia el check, en función de su valor añade o borra la noticia
  check(eventoRecibido: any, item: Article) {
    let estado: boolean = eventoRecibido.detail.checked;
    if (estado) {
      this.gestionNoticiasLeer.addNoticia(item);
    } else {
      this.gestionNoticiasLeer.borrarNoticia(item);
    }
    
  }

  // Lee el fichero con los artículos y los guarda en el array "listaNoticias"
  private cargarFichero() {
   
    let listaCargar: Article[] = [];
    let respuesta: Observable<RespuestaNoticias> = this.leerFichero.get<RespuestaNoticias>("/assets/datos/articulos.json");

    respuesta.subscribe( resp => {
      console.log("Noticias", resp);
      listaCargar.push(... resp.articles);

      //Añadimos al almacenamiento local 
      this.gestionAlmacen.setObject("Noticias", listaCargar);
    } );
  }

  // Comprueba si una noticia está para leer o no
  seleccionado(item: Article): boolean {
    let indice: number = this.gestionNoticiasLeer.buscar(item);
    if (indice != -1) {
      return true;
    }
    return false; 
  }

  ngOnInit() { 
   
  }
}
