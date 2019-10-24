
db.vehicles.drop();
db.cargos.drop();

var models      = [ "BMW", "Volkswagen", "Mercedes", "Opel", "Isuzu" ];
var cargoTypes  = [ "cargoType1", "cargoType2", "cargoType3", "cargoType4" ];

var insertVehicle   = function( model ){
    
    if( model == null || model == "" ){
        return;
    }

        
    db.vehicles.insert({
        model       : model,
        storageId   : Math.floor( ( Math.random() * 1000000 ) + 1000000 ),
        cargoType   : cargoTypes[ Math.floor( ( Math.random() * cargoTypes.length ) ) ]
    });
}

var populateVehicles    = function(){
    for( i = 0; i < 5; ++i ){
        insertVehicle( models[ i ] );
    }
}

var updateSeatNumber    = function(){
    db.vehicles.find().forEach( function ( item ){
        db.vehicles.update( {
            _id: item._id
        }, {
            $set: {
                seatNumber: Math.floor( ( Math.random() * 5 ) + 2 )
            }
        }, {
            multi: true
        })
    })
}

var populatePriorityCargo   = function(){
    var priorirtyTypes  = [ "fruits", "vegetables", "meat", "milk", "dairy" ];
    priorirtyTypes.forEach( item => {
        db.priorirtyTypes.insert( { name : item } );
    } )
}

var insertCargo = function( name, quantity, cargoType ){
    if( name == null || name == "" || quantity == null ){
        return;
    }
    
    var compatibleVehs  = db.vehicles.find( { cargoType : cargoType } );
    if( compatibleVehs.length() == 0 ){
        return;
    }

    if( db.priorirtyTypes.find( { name : cargoType } ).length() > 0 )
    {
        db.cargos.insert( {
            name  : name,
            quantity : quantity,
            vehId : compatibleVehs[ Math.floor(  Math.random() * compatibleVehs.length() ) ]._id,
            type : cargoType
        } );
    }
    else
    {
        db.prioriryCargos.insert( {
            name  : name,
            quantity : quantity,
            vehId : compatibleVehs[ Math.floor(  Math.random() * compatibleVehs.length() ) ]._id,
            type : cargoType
        } );
    }
}

var cargoNames  = [ "cargo1", "cargo2", "cargo3" ]

var populateCargos  = function(){
    
    for( i = 0; i < 5; ++i ){
        var cargoName = cargoNames[ Math.floor(  Math.random() * cargoNames.length ) ];
        var cargoType = cargoTypes[ Math.floor(  Math.random() * cargoTypes.length ) ];
        insertCargo( cargoName, Math.floor(  Math.random() * 1000 ), cargoType );
    }
}

var showVehsAndCargos   = function(){
    var vehs    = [];

    db.cargos.find().forEach( item =>{
        vehs.push( { vehId : item.vehId, cargoName : item.name } );
    } )

    vehs.forEach( item =>{
        var vehicle = db.vehicles.find( { _id : item.vehId } )[ 0 ];
        print( vehicle.model + "/" + vehicle.storageId + item.cargoName )
    } )
}
