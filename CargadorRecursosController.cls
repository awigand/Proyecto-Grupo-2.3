public with sharing class CargadorRecursosController {
    @AuraEnabled(cacheable= true)
    public static Project__c getHoursOfProject(Id projectId){
        return [
            SELECT Horas_de_Desarrollo__c, Horas_de_Consultoria__c, (
                SELECT id, Recurso__r.Name, Recurso__r.Tipo__c
                FROM Recursos_en_Proyecto__r 
                )
            FROM Project__c 
            WHERE Id = :projectId
        ];
    }
    

    @AuraEnabled 
    public static void saveContactInProject(Id projectId, string contactName){
        Contact aContact = [
            SELECT Id
            FROM Contact
            WHERE Name =: contactName
            LIMIT 1
        ];
        
        system.debug(aContact);
       
    Recurso_en_Proyecto__c aResourceInProject = New Recurso_en_Proyecto__c(
        Project__c=projectId,
        Recurso__c=aContact.Id,
        Name = contactName
    );
    
    insert aResourceInProject;
    

    }
}