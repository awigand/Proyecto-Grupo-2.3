import { LightningElement, api, wire } from 'lwc';
import getHoursOfProject from '@salesforce/apex/CargadorRecursosController.getHoursOfProject';
import saveContactInProject from '@salesforce/apex/CargadorRecursosController.saveContactInProject';
export default class cargadorDeRecursos extends LightningElement {
    @api recordId;
    project = [];
    recurso = {};
    consultor
    consultores = []
    desarrolladores = []
    asignadosConsultores = 0
    asignadosDesarrolladores = 0
    cantidadDeDesarrolladores = 0
    cantidadDeConsultores = 0
    error;
    data=[];
    @wire(getHoursOfProject, {projectId: '$recordId' })
    wiredGetHoursOfProject({ error, data }) {
        if (data) {
            this.project = data;
            this.error = undefined;
            console.log(this.project);
            this.project.Recursos_en_Proyecto__r.forEach(recurso => {
                
                if (recurso.Recurso__r.Tipo__c === 'Consultor/a') {
                    this.asignadosConsultores++
                }else if (recurso.Recurso__r.Tipo__c === 'Desarrollador/a') {
                    console.log('entra')
                    this.asignadosDesarrolladores++
                }
            });
            this.cantidadDeDesarrolladores = 
                Math.ceil(this.project.Horas_de_Desarrollo__c / 168) - this.asignadosDesarrolladores;
            this.cantidadDeConsultores = 
                Math.ceil(this.project.Horas_de_Consultoria__c / 168) - this.asignadosConsultores;


        
        } else if (error) {
            this.error = error;
            this.contacts = undefined;
        }
    }

    
    getConsultor(event){
        this.consultor = event.detail.value;
    }

    saveConsultor(){
        this.project.Recurso_en_proyectos__r.forEach(recurso => {
            if(this.consultor === recurso.Recurso__r.Name){
               
               alert('recurso existente en el proyecto')
            }
        });
        saveContactInProject({ projectId: this.Project.Id, contactName: this.consultor }).then(
            Response => {
                alert('se inserto');
            }
        ).catch(
            error => {
                alert(JSON.stringify(error));
            }
        )
    }

    /*saveConsultor(){
        this.project.Recursos_en_Proyecto__r.Recurso__r.forEach(response => {
            if (Name ===this.consultor){
                alert('El recurso ya está asignado al proyecto, elija otro.');

            };
            saveContactInProject({ projectId: this.project.Id, contactName: this.consultor }).then(
                    Response => {
                        alert('se inserto');
                    }).catch(
                        error => {
    
                            alert(JSON.stringify(error));
                        });
                
                
        }
    }*/
}