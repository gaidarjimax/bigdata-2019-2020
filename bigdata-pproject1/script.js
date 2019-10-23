use test

db.employees.drop();
db.customers.drop();
db.accounts.drop();
db.departments.drop();

var fNames          = [ "Zachariah", "Em", "Dre", "Ogdan", "Ardath", "Eustace", "Dominga", "Bart", "Sabby", "Lonnard" ];
var mNames          = [ "Constantine", "Chico", "Obediah", "Cori", "Rawley", "Arlena", "Roarke", "Ninette", "Isador", "Athene" ];
var lNames          = [ "Marcos", "Cisec", "Bernardinelli", "Sommerville", "Skate", "Skipperbottom", "Hullyer", "Jansson", "Mirrlees", "Wellbelove" ];

var adresses        = [ "6 Village Green Junction", "7356 Becker Hill", "65744 Harbort Drive", 
                        "65 5th Way", "60 Texas Plaza", "4 Orin Park", "4836 Stang Drive", 
                        "331 Duke Avenue", "01 Bartillon Alley", "26 Morrow Street" ];

var phoneNumbers    = [ "707-124-8406", "283-636-9342", "933-332-9820", "585-664-1231", 
                        "173-395-4006", "352-932-6648", "803-370-9043", "867-276-4653", 
                        "831-716-2988", "887-248-2081" ];
                                  
var emails          = [ "lmonnery0@imdb.com", "lstearn1@goodreads.com", "rjosuweit2@amazonaws.com",
                        "mhandling3@mozilla.com", "vgoodlet4@nature.com", "mhartfield5@sphinn.com",
                        "sbartholat6@github.io", "lmcguckin7@tiny.cc", "mdrinkhill8@odnoklassniki.ru", "eliddington9@php.net" ];
              
var currencies      = [ "BGN", "RUB", "MGA", "PAB", "CAD", "ILS", "ALL", "IDR", "EUR", "CNY" ];     

var countries       = [ "Bulgaria", "Indonesia", "France", "China", "China", "Kenya", "Afghanistan", "Netherlands", "Indonesia", "Indonesia" ];

var departments = [ {
                        name: "Department 1",
                        positions: [ { id: 0, name: "position 1" },
                                     { id: 1, name: "position 2" },
                                     { id: 2, name: "position 3" } ] 
                    },
	                {
                        name: "Department 2",
                        positions: [ { id: 0, name: "position 1" },
                                     { id: 1, name: "position 2" },
                                     { id: 2, name: "position 3" },
                                     { id: 3, name: "position 4" } ]
                    },
                    {
                        name: "Department 3",
                            positions: [ { id: 0, name: "position 1" },
                                         { id: 1, name: "position 2" },
                                         { id: 2, name: "position 3" },
                                         { id: 3, name: "position 4" },
                                         { id: 4, name: "position 5" } ]
                    },
                    {
                        name: "Department 4",
                        positions: [ { id: 0, name: "position 1" },
                                     { id: 1, name: "position 2" },
                                     { id: 2, name: "position 3" },
                                     { id: 3, name: "position 4" } ]
                    } ];

// This function picks a random value from the collection given
var generateRandom  = function( collection, chance = 100 ){ 
    if( Math.floor( Math.random() * 100 ) > chance )
        return;

    var index = Math.floor( Math.random() * collection.length );
    return collection[index];
}
// This function populates "departments" collection.
var populateDepartments = function(){
    for( i = 0; i < departments.length; ++i ){
        db.departments.insert( departments[ i ] );
    }
}
// This function populates "emplpoyees" collection
var populateEmployees   = function( number ){
    for( i = 0; i < number; ++i ){
        var employee    = { 
            fName       : generateRandom( fNames ),
            mName       : generateRandom( mNames, 50 ),
            lName       : generateRandom( lNames ),
            address     : generateRandom( adresses ),
            phone       : generateRandom( phoneNumbers ),
            email       : generateRandom( emails ),
            salary      : Math.floor( Math.random() * 10000 ),
            experience  : Math.floor( Math.random() * 15 ),
            country     : generateRandom( countries )
        };

        var dep   = departments[ Math.floor( Math.random() * departments.length ) ];

        employee.department = dep.name;
        employee.position   = dep.positions[ Math.floor( Math.random() * dep.positions.length ) ].id;

        db.employees.insert( employee );
    }
}
// This function picks a random boss id
// It will return null if the given id matched the randomly retrieved
// May return 0, "chance" represents the percents of valid ids returned.
var getBossId = function( id, chance = 100 ){
    if( Math.floor( Math.random() * 100 ) > chance )
        return;

    var bosses = db.employees.find();
    var rnd = Math.floor( Math.random() * bosses.length() );
    if( bosses[ rnd ]._id != id )
        return bosses[ rnd ]._id;
}
// This function is postprocessing over the "employees" collection.
// It adds bosses to the employees. Some employees do not get a boss.
var addBosses = function () {
    db.employees.find().forEach( function ( item ){
        db.employees.update( {
            _id: item._id
        }, {
            $set: {
                chief: getBossId( item._id, 60 )
            }
        }, {
            multi: true
        })
    })
}
// This function populates the "accounts" collection.
// It generates the demanded amount of accounts, and returns them
// Implicitly it adds it to the "accounts" collection.
var populateAccounts    = function( number ){
    
    var accounts    = [];

    for( i = 0; i < number; ++i ){
        var account    = { 
            id          : Math.random().toString(36).substring(2, 15),
            ballance    : Math.floor( Math.random() * 1000000 ),
            currencie   : generateRandom( currencies )
        };

        db.accounts.insert( account );
        accounts.push( account );
    }
    return  accounts;
}
// This function returns the Ids of the newly created accounts.
var retrieveAccountIds  = function(){
    var accounts    = populateAccounts(  Math.floor( ( Math.random() + 1 ) * 5 ) );

    var accountIds  = [];

    accounts.forEach( element => {
        accountIds.push( element.id );
    } );

    return accountIds;
}
// This function populates "customers" collection.
var populateCustomers = function( number ){   
    for( i = 0; i < number; ++i ){
        var customer    = { 
            fName       : generateRandom( fNames ),
            mName       : generateRandom( mNames ),
            lName       : generateRandom( lNames ),
            address     : generateRandom( adresses ),
            phone       : generateRandom( phoneNumbers ),
            email       : generateRandom( emails ),
            accounts    : retrieveAccountIds()
        };

        db.customers.insert( customer );
    }
}

populateDepartments();
populateCustomers(10);
populateEmployees(10);
addBosses();

// Business requirements 1
// 1
var listDepartments = function(){
    db.departments.find().forEach( item => {
        print( item.name );
    } );
}
// 2
var listSalaries    = function(){
    db.employees.find().forEach( employee =>{
        print( employee.fName + " " + employee.lName + " - " + employee.salary );
    })
}

// 3
var updateEmails    = function(){
    db.employees.find().forEach( item =>{
        db.employees.update( {
            _id: item._id
        }, {
            $set: {
               email: item.fName.toLowerCase() + "." + item.lName.toLowerCase() + "@bankoftomarow.bg"
            }
        }, {
            multi: true
        })
    } )

    db.employees.find().forEach( employee =>{
        print( employee.fName + " " + employee.lName + " - " + employee.email );
    })
}

// 4
var listExperiencedEmployees    = function(){
    db.employees.find().forEach( employee =>{
        if( employee.experience >= 5 ){
            print( employee.fName + " " + employee.lName );
        }
    })
}

// 5
var checkIfStartsWithS    = function(){
    db.employees.find().forEach( employee =>{
        if( employee.fName.startsWith( "S" ) ){
            print( employee.fName + " " + employee.lName );
        }
    })
}

// 6
var checkIfForeigner    = function(){
    db.employees.find().forEach( employee =>{
        if( employee.country != "Bulgaria" ){
            print( employee.fName + " " + employee.lName );
        }
    })
}

// 7
var checkContainingI    = function(){
    db.employees.find().forEach( employee =>{
        var nameConcat  = employee.fName + employee.mName + employee.lName;
        if( nameConcat.includes( 'I' ) ){
            print( employee.fName + " " + employee.mName + " " + employee.lName );
        }
    })
}

listDepartments();
print( "---------------------------------------------");
listSalaries();
print( "---------------------------------------------");
updateEmails();
print( "---------------------------------------------");
listExperiencedEmployees();
print( "---------------------------------------------");
checkIfStartsWithS();
print( "---------------------------------------------");
checkIfForeigner();
print( "---------------------------------------------");
checkContainingI();