export interface IdatosCarga{

        eguia         :number;
        ttramite        :string;
        ecodembalaje    :number;
        tembalaje       :string;
        tnaviera        :string;
        tmarcas         :string;
        ttipocontenedor :string;
        epesoneto       :number;
        epesobruto      :number;
        ebultos         :number;
        mercancias      : Array<IdatosMercancia>
}



export interface IdatosMercancia{
        edetalleguia   :number;
        tfactura      :string;
        tmarcas       :string;
        tdescripcion  :string;
        ecantidad     :number;
        epesobruto    :number;
        epesoneto     :number;
        evolumen      :number;
        tembalaje     :string
        ecodembalaje  :number;
}